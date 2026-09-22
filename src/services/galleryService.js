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
 * @returns {Promise<{ data: Object|null, error: Object|null, isRlsError?: boolean }>}
 */
export async function uploadMediaToGallery(file) {
  try {
    if (!file) {
      return { data: null, error: new Error('No file selected for upload') };
    }

    // Determine media type
    const isVideo = file.type.startsWith('video');
    const mediaType = isVideo ? 'video' : 'image';

    // Sanitize unique file name
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${timestamp}_${sanitizedName}`;

    console.log(`[galleryService] Uploading to bucket "${GALLERY_BUCKET}": ${filePath}`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
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
      title: cleanFileNameToTitle(file.name),
      name: file.name,
      mediaType,
      url: accessibleUrl,
      thumbnail: accessibleUrl,
      associatedEvent: 'Gallery Upload',
      fileSize: formatFileSize(file.size),
      dimensions: isVideo ? '1080p Video' : 'Original Resolution',
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

      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(file.name);

      return {
        id: file.id || file.name,
        storagePath: file.name,
        title: cleanFileNameToTitle(file.name),
        name: file.name,
        mediaType: isVideo ? 'video' : 'image',
        url: finalUrl,
        thumbnail: finalUrl,
        associatedEvent: 'Supabase Storage',
        fileSize: formatFileSize(file.metadata?.size),
        dimensions: isVideo ? 'Video Clip' : 'Photo',
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
