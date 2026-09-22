// ============================================================================
// SUPABASE ORGANIZERS SERVICE
// ============================================================================
// Handles CRUD operations for public.organizers and media storage uploads
// to the Supabase Storage bucket: `organizers`.
//
// Table Schema (PostgreSQL):
// - id: bigint GENERATED ALWAYS AS IDENTITY NOT NULL (Primary Key)
// - Name: character varying NOT NULL
// - role: character varying
// - linkedin: text
// - image: text
// ============================================================================

import { supabase } from '../lib/supabaseClient';

export const ORGANIZERS_BUCKET = 'organizers';
const URL_EXPIRATION_SECONDS = 315360000; // 10 years for signed media URLs

/**
 * SQL snippet to enable access if Row Level Security (RLS) blocks public.organizers.
 */
export const ORGANIZERS_POLICY_SQL = `
-- Run this in your Supabase SQL Editor to allow public access on organizers:
ALTER TABLE public.organizers DISABLE ROW LEVEL SECURITY;

-- Storage permissions for 'organizers' bucket:
CREATE POLICY "Allow public upload to organizers" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = '${ORGANIZERS_BUCKET}');
CREATE POLICY "Allow public read from organizers" ON storage.objects FOR SELECT TO public USING (bucket_id = '${ORGANIZERS_BUCKET}');
CREATE POLICY "Allow public delete from organizers" ON storage.objects FOR DELETE TO public USING (bucket_id = '${ORGANIZERS_BUCKET}');
`.trim();

/**
 * Normalizes an organizer row from Supabase public.organizers.
 */
export function normalizeOrganizer(row) {
  if (!row) return null;
  const nameValue = row.Name || row.name || '';
  return {
    id: row.id,
    name: nameValue,
    Name: nameValue,
    role: row.role || '',
    linkedin: row.linkedin || '',
    profile: row.linkedin || '', // compatibility alias
    image: row.image || '/assets/images/akshat.jpg',
    fromSupabase: true
  };
}

/**
 * Uploads an image file directly to the Supabase `organizers` storage bucket.
 * Returns an accessible long-lived signed URL or public CDN URL.
 *
 * @param {File} file - Browser File object from input
 * @returns {Promise<{ storagePath: string|null, url: string|null, error: Object|null, isRlsError?: boolean }>}
 */
export async function uploadOrganizerPhoto(file) {
  try {
    if (!file) {
      return { storagePath: null, url: null, error: new Error('No file selected for upload') };
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${timestamp}_${sanitizedName}`;

    console.log(`[organizersService] Uploading photo to bucket "${ORGANIZERS_BUCKET}": ${filePath}`);

    // Upload to Supabase Storage bucket 'organizers'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(ORGANIZERS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('[organizersService] Upload to storage failed:', uploadError);
      const isRls =
        uploadError.statusCode === '403' ||
        uploadError.status === 403 ||
        (uploadError.message && uploadError.message.toLowerCase().includes('row-level security'));

      return {
        storagePath: null,
        url: null,
        error: uploadError,
        isRlsError: isRls
      };
    }

    // Generate long-lived signed URL (guarantees display whether bucket is public or private)
    let accessibleUrl = '';
    try {
      const { data: signedData } = await supabase.storage
        .from(ORGANIZERS_BUCKET)
        .createSignedUrl(filePath, URL_EXPIRATION_SECONDS);
      if (signedData?.signedUrl) {
        accessibleUrl = signedData.signedUrl;
      }
    } catch (e) {
      console.warn('[organizersService] Signed URL fallback:', e);
    }

    if (!accessibleUrl) {
      const { data: publicUrlData } = supabase.storage
        .from(ORGANIZERS_BUCKET)
        .getPublicUrl(filePath);
      accessibleUrl = publicUrlData?.publicUrl || '';
    }

    console.log('[organizersService] Upload successful! URL:', accessibleUrl);
    return {
      storagePath: uploadData?.path || filePath,
      url: accessibleUrl,
      error: null
    };
  } catch (err) {
    console.error('[organizersService] Unexpected error uploading photo:', err);
    return { storagePath: null, url: null, error: err };
  }
}

/**
 * Fetch all organizers from public.organizers table in Supabase.
 */
export async function getOrganizers() {
  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('[organizersService] Error fetching organizers:', error);
      const isRls =
        error.code === '42501' ||
        (error.message && error.message.toLowerCase().includes('row-level security'));

      return { data: [], error, isRlsError: isRls };
    }

    const normalized = (data || []).map(normalizeOrganizer);
    // Sort highest/latest id first
    normalized.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    return { data: normalized, error: null };
  } catch (err) {
    console.error('[organizersService] Unexpected error getting organizers:', err);
    return { data: [], error: err };
  }
}

/**
 * Create a new organizer row in public.organizers table.
 */
export async function createOrganizer(formData) {
  try {
    // Note: Column is capitalized 'Name' in PostgreSQL table
    const payload = {
      Name: (formData.name || formData.Name || '').trim(),
      role: (formData.role || '').trim(),
      linkedin: (formData.linkedin || formData.profile || '').trim(),
      image: (formData.image || '').trim()
    };

    console.log('[organizersService] Inserting organizer payload:', payload);

    const { data, error } = await supabase
      .from('organizers')
      .insert([payload])
      .select();

    if (error) {
      console.error('[organizersService] Error creating organizer:', error);
      const isRls =
        error.code === '42501' ||
        (error.message && error.message.toLowerCase().includes('row-level security'));

      return { data: null, error, isRlsError: isRls };
    }

    console.log('[organizersService] Created organizer in Supabase:', data);
    return { data: normalizeOrganizer(data[0]), error: null };
  } catch (err) {
    console.error('[organizersService] Unexpected error creating organizer:', err);
    return { data: null, error: err };
  }
}

/**
 * Update an existing organizer in public.organizers table.
 */
export async function updateOrganizer(id, formData) {
  try {
    const payload = {
      Name: (formData.name || formData.Name || '').trim(),
      role: (formData.role || '').trim(),
      linkedin: (formData.linkedin || formData.profile || '').trim(),
      image: (formData.image || '').trim()
    };

    console.log(`[organizersService] Updating organizer id ${id}:`, payload);

    const { data, error } = await supabase
      .from('organizers')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[organizersService] Error updating organizer:', error);
      const isRls =
        error.code === '42501' ||
        (error.message && error.message.toLowerCase().includes('row-level security'));

      return { data: null, error, isRlsError: isRls };
    }

    console.log('[organizersService] Updated organizer:', data);
    return { data: normalizeOrganizer(data[0]), error: null };
  } catch (err) {
    console.error('[organizersService] Unexpected error updating organizer:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete an organizer from public.organizers table.
 */
export async function deleteOrganizer(id, imagePath = null) {
  try {
    const { error } = await supabase
      .from('organizers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[organizersService] Error deleting organizer:', error);
      return { error };
    }

    // If imagePath is stored in bucket, attempt optional cleanup
    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
      try {
        await supabase.storage.from(ORGANIZERS_BUCKET).remove([imagePath]);
      } catch (storageErr) {
        console.warn('[organizersService] Cleanup storage image warning:', storageErr);
      }
    }

    return { error: null };
  } catch (err) {
    console.error('[organizersService] Unexpected error deleting organizer:', err);
    return { error: err };
  }
}
