// ============================================================================
// SUPABASE GALLERY STORAGE SERVICE
// ============================================================================
// Handles direct media uploads, fetching, and deletions from the Supabase
// Storage bucket: `gallery`.
//
// Automatically supports both Public and Private buckets by generating
// long-lived signed URLs with fallback to public CDN URLs.
// ============================================================================

import { supabase } from '../lib/supabaseClient';

export const GALLERY_BUCKET = 'gallery';
const URL_EXPIRATION_SECONDS = 315360000; // 10 years for signed media URLs

/**
 * Generates the SQL policy snippet needed if Row Level Security blocks uploads.
 */
export const STORAGE_POLICY_SQL = `
-- Run this in your Supabase SQL Editor if uploads return RLS policy error:
CREATE POLICY "Allow public uploads to gallery"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = '${GALLERY_BUCKET}');

CREATE POLICY "Allow public read from gallery"
ON storage.objects FOR SELECT TO public
USING (bucket_id = '${GALLERY_BUCKET}');

CREATE POLICY "Allow public delete from gallery"
ON storage.objects FOR DELETE TO public
USING (bucket_id = '${GALLERY_BUCKET}');
`.trim();

/**
 * Formats byte size into human readable string (e.g. "2.4 MB").
 */
export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '1.5 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Cleans a file name for display as title.
 */
export function cleanFileNameToTitle(fileName) {
  if (!fileName) return 'Gallery Media';
  return fileName
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/^[0-9]+[_-]/, '') // remove timestamp prefix if any
    .replace(/[-_]/g, ' ')
    .trim();
}

/**
 * Obtains an accessible URL for a storage file (tries signed URL first for
 * private buckets, falls back to public CDN URL).
 */
export async function getFileAccessibleUrl(filePath) {
  try {
    const { data: signedData, error: signError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .createSignedUrl(filePath, URL_EXPIRATION_SECONDS);

    if (!signError && signedData?.signedUrl) {
      return signedData.signedUrl;
    }
  } catch (err) {
    console.warn('[galleryService] Signed URL creation fallback:', err);
  }

  const { data: publicUrlData } = supabase.storage
    .from(GALLERY_BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl || '';
}

/**
 * Uploads a file directly to the Supabase storage bucket `gallery`.
 *
 * @param {File} file - Browser File object from input / dropzone
 * @param {string|null} customTitle - Optional custom title/name for the media item
 * @returns {Promise<{ data: Object|null, error: Object|null, isRlsError?: boolean }>}
 */
export async function uploadMediaToGallery(file, customTitle = null) {
  try {
    if (!file) {
      return { data: null, error: new Error('No file selected for upload') };
    }

    // Determine media type (supports mp4, mov, heic, webm, jpg, png, etc.)
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const isVideo = (file.type && file.type.startsWith('video')) || ['mp4', 'mov', 'webm', 'ogg', 'mkv'].includes(ext);
    const isHeic = ['heic', 'heif'].includes(ext);
    const mediaType = isVideo ? 'video' : 'image';

    // Format display title and sanitized storage filename
    const displayTitle = customTitle && customTitle.trim()
      ? customTitle.trim()
      : cleanFileNameToTitle(file.name);

    // Keep extension and sanitize filename for cloud storage
    const sanitizedBase = displayTitle
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9._ -]/g, '_')
      .trim();
    const cleanFileName = `${sanitizedBase}.${ext}`;

    const timestamp = Date.now();
    const filePath = `${timestamp}_${cleanFileName.replace(/\s+/g, '_')}`;

    console.log(`[galleryService] Uploading to bucket "${GALLERY_BUCKET}": ${filePath}`);

    // Upload to Supabase Storage with appropriate content type
    let contentType = file.type;
    if (!contentType || contentType === 'application/octet-stream') {
      if (ext === 'heic') contentType = 'image/heic';
      else if (ext === 'mov') contentType = 'video/quicktime';
      else if (ext === 'mp4') contentType = 'video/mp4';
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType || undefined
      });

    if (uploadError) {
      console.error('[galleryService] Supabase Storage upload error:', uploadError);
      const isRls =
        uploadError.statusCode === '403' ||
        uploadError.status === 403 ||
        (uploadError.message && uploadError.message.toLowerCase().includes('row-level security'));

      return {
        data: null,
        error: uploadError,
        isRlsError: isRls
      };
    }

    // Retrieve accessible URL (signed for private bucket, public as fallback)
    const accessibleUrl = await getFileAccessibleUrl(filePath);

    const newMediaItem = {
      id: uploadData?.path || filePath,
      storagePath: uploadData?.path || filePath,
      title: displayTitle,
      name: cleanFileName,
      mediaType,
      isHeic,
      url: accessibleUrl,
      thumbnail: accessibleUrl,
      associatedEvent: 'Gallery Archive',
      fileSize: formatFileSize(file.size),
      dimensions: isVideo ? '1080p Video' : (isHeic ? 'HEIC Photo' : 'Original Resolution'),
      uploadDate: new Date().toISOString().split('T')[0],
      fromSupabase: true
    };

    console.log('[galleryService] Upload successful! Accessible URL:', accessibleUrl);
    return { data: newMediaItem, error: null };
  } catch (err) {
    console.error('[galleryService] Unexpected error during upload:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetches all media files stored in the Supabase `gallery` bucket.
 * Generates signed URLs in batch so private bucket images display immediately.
 *
 * @returns {Promise<{ data: Array, error: Object|null }>}
 */
export async function fetchGalleryFromStorage() {
  try {
    const { data: fileList, error: listError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      console.warn('[galleryService] Error fetching storage list:', listError);
      return { data: [], error: listError };
    }

    const validFiles = (fileList || []).filter(
      (file) => file.name && !file.name.startsWith('.')
    );

    if (validFiles.length === 0) {
      return { data: [], error: null };
    }

    // Batch create signed URLs for all files (compatible with private and public buckets)
    const fileNames = validFiles.map((f) => f.name);
    const { data: signedResults, error: signedError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .createSignedUrls(fileNames, URL_EXPIRATION_SECONDS);

    const signedUrlMap = new Map();
    if (signedResults && !signedError) {
      signedResults.forEach((item) => {
        if (item.signedUrl) {
          signedUrlMap.set(item.path, item.signedUrl);
        }
      });
    }

    const items = validFiles.map((file) => {
      // Use signed URL if available, otherwise fallback to public URL
      const signedUrl = signedUrlMap.get(file.name);
      let finalUrl = signedUrl;

      if (!finalUrl) {
        const { data: publicUrlData } = supabase.storage
          .from(GALLERY_BUCKET)
          .getPublicUrl(file.name);
        finalUrl = publicUrlData?.publicUrl || '';
      }

      const isVideo = /\.(mp4|webm|ogg|mov|mkv)$/i.test(file.name);
      const isHeic = /\.(heic|heif)$/i.test(file.name);

      return {
        id: file.id || file.name,
        storagePath: file.name,
        title: cleanFileNameToTitle(file.name),
        name: file.name,
        mediaType: isVideo ? 'video' : 'image',
        isHeic,
        url: finalUrl,
        thumbnail: finalUrl,
        associatedEvent: 'Supabase Storage',
        fileSize: formatFileSize(file.metadata?.size),
        dimensions: isVideo ? 'Video Clip (MP4/MOV)' : (isHeic ? 'HEIC Photo' : 'Photo'),
        uploadDate: file.created_at
          ? file.created_at.split('T')[0]
          : new Date().toISOString().split('T')[0],
        rawCreatedAt: file.created_at || file.metadata?.lastModified || null,
        fromSupabase: true
      };
    });

    // Ensure latest uploads are always at the top / index 0
    items.sort((a, b) => {
      // 1. Check timestamp prefix in storage filename (e.g. 1790017664957_file.png)
      const matchA = a.storagePath?.match(/^(\d{10,13})/);
      const matchB = b.storagePath?.match(/^(\d{10,13})/);
      const timeA = matchA ? parseInt(matchA[1], 10) : 0;
      const timeB = matchB ? parseInt(matchB[1], 10) : 0;
      if (timeA && timeB && timeA !== timeB) {
        return timeB - timeA;
      }

      // 2. Fall back to rawCreatedAt or uploadDate timestamp
      const dateA = a.rawCreatedAt ? new Date(a.rawCreatedAt).getTime() : 0;
      const dateB = b.rawCreatedAt ? new Date(b.rawCreatedAt).getTime() : 0;
      return dateB - dateA;
    });

    console.log(`[galleryService] Loaded ${items.length} items from bucket "${GALLERY_BUCKET}"`);
    return { data: items, error: null };
  } catch (err) {
    console.warn('[galleryService] Unexpected error listing storage:', err);
    return { data: [], error: err };
  }
}

/**
 * Deletes a file from the Supabase `gallery` bucket.
 *
 * @param {string} storagePath - The relative path or file name inside bucket
 * @returns {Promise<{ error: Object|null }>}
 */
export async function deleteGalleryMediaFromStorage(storagePath) {
  try {
    if (!storagePath) return { error: null };
    const { error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error('[galleryService] Error deleting storage item:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('[galleryService] Unexpected error deleting file:', err);
    return { error: err };
  }
}

/**
 * Extracts a Google Drive file ID from standard shareable links:
 * - https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 * - Direct ID string
 */
export function extractGoogleDriveFileId(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile) return matchFile[1];
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) return matchD[1];
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Creates a normalized gallery media object for a Google Drive asset.
 */
export function createDriveMediaItem({
  url,
  title = '',
  mediaType = null,
  associatedEvent = 'Archive',
  fileId = null
}) {
  const extractedId = fileId || extractGoogleDriveFileId(url);
  const id = extractedId
    ? `gdrive_${extractedId}`
    : `gdrive_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Auto-detect media type from url or title if not explicitly provided
  let detectedType = mediaType;
  if (!detectedType) {
    const isVideoExt = /\.(mp4|mov|webm|ogg|mkv)/i.test(url) || /\.(mp4|mov|webm|ogg|mkv)/i.test(title);
    detectedType = isVideoExt ? 'video' : 'image';
  }

  const isVideo = detectedType === 'video';

  // High-performance direct image CDN & video streaming URLs
  const directImageUrl = extractedId ? `https://lh3.googleusercontent.com/d/${extractedId}` : url;
  const videoStreamUrl = extractedId ? `https://drive.google.com/file/d/${extractedId}/preview` : url;
  const finalMediaUrl = isVideo ? videoStreamUrl : directImageUrl;

  const displayTitle = (title && title.trim())
    ? title.trim()
    : (extractedId ? `Drive Asset (${extractedId.slice(0, 6)})` : 'Google Drive Media');

  return {
    id,
    storagePath: null,
    title: displayTitle,
    name: displayTitle,
    mediaType: detectedType,
    url: finalMediaUrl,
    thumbnail: directImageUrl,
    associatedEvent: associatedEvent || 'Archive',
    fileSize: 'Drive Cloud Asset',
    dimensions: isVideo ? 'Drive Video Stream' : 'Drive High-Res',
    uploadDate: new Date().toISOString().split('T')[0],
    fromDrive: true,
    driveFileId: extractedId
  };
}
