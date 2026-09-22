// ============================================================================
// SUPABASE EVENTS SERVICE
// ============================================================================
// Manages real CRUD operations directly against the live Supabase PostgreSQL
// table: `public.events`.
//
// Table Schema Reference:
// - id (uuid, default gen_random_uuid())
// - name (character varying NOT NULL)
// - category (character varying)
// - event_date (date)
// - start_time (time without time zone)
// - end_time (time without time zone)
// - venue (character varying NOT NULL)
// ============================================================================

import { supabase } from '../lib/supabaseClient';

/**
 * Normalizes a database row from public.events into the format expected by the UI.
 * Provides backwards-compatible aliases (e.g. title -> name, date -> event_date).
 */
export function normalizeEvent(row) {
  if (!row) return null;

  const startTimeFormatted = row.start_time ? row.start_time.slice(0, 5) : '';
  const endTimeFormatted = row.end_time ? row.end_time.slice(0, 5) : '';

  const timeDisplay = startTimeFormatted
    ? (endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : startTimeFormatted)
    : 'TBD';

  return {
    id: row.id,
    name: row.name || '',
    title: row.name || '', // Compatibility alias
    category: row.category || 'Workshop',
    event_date: row.event_date || '',
    date: row.event_date || '', // Compatibility alias
    start_time: row.start_time || '',
    startTime: startTimeFormatted, // Compatibility alias
    end_time: row.end_time || '',
    endTime: endTimeFormatted, // Compatibility alias
    time: timeDisplay,
    venue: row.venue || '',
    location: row.venue || '', // Compatibility alias
    status: 'upcoming'
  };
}

/**
 * Extracts and strictly sanitizes fields for insertion/update in public.events.
 * Prevents schema cache mismatch errors by only sending columns that exist in PostgreSQL.
 */
export function prepareEventPayload(formData) {
  const name = (formData.name || formData.title || '').trim();
  const category = (formData.category || 'Workshop').trim();
  const event_date = formData.event_date || formData.date || null;
  const venue = (formData.venue || '').trim();

  let start_time = formData.start_time || formData.startTime || null;
  let end_time = formData.end_time || formData.endTime || null;

  // Format HH:MM to HH:MM:00 for Postgres time type if needed
  if (start_time && start_time.length === 5) {
    start_time = `${start_time}:00`;
  }
  if (end_time && end_time.length === 5) {
    end_time = `${end_time}:00`;
  }

  return {
    name,
    category,
    event_date,
    start_time: start_time || null,
    end_time: end_time || null,
    venue
  };
}

/**
 * Fetch all events from Supabase ordered by event_date.
 */
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('[eventsService] Error fetching events from Supabase:', error);
      return { data: [], error };
    }

    const normalized = (data || []).map(normalizeEvent);
    // Sort latest date / time first
    normalized.sort((a, b) => {
      const dateA = a.event_date || a.date || '';
      const dateB = b.event_date || b.date || '';
      if (dateB !== dateA) return dateB.localeCompare(dateA);
      const timeA = a.start_time || a.startTime || '';
      const timeB = b.start_time || b.startTime || '';
      return timeB.localeCompare(timeA);
    });

    return { data: normalized, error: null };
  } catch (err) {
    console.error('[eventsService] Unexpected error fetching events:', err);
    return { data: [], error: err };
  }
}

/**
 * Insert a new event into Supabase.
 */
export async function createEvent(formData) {
  try {
    const payload = prepareEventPayload(formData);
    console.log('[eventsService] Sending payload to Supabase public.events:', payload);

    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select();

    if (error) {
      console.error('[eventsService] Error inserting event into Supabase:', error);
      return { data: null, error };
    }

    console.log('[eventsService] Event successfully inserted into Supabase:', data);
    return { data: normalizeEvent(data[0]), error: null };
  } catch (err) {
    console.error('[eventsService] Unexpected error in createEvent:', err);
    return { data: null, error: err };
  }
}

/**
 * Update an existing event in Supabase by UUID.
 */
export async function updateEvent(id, formData) {
  try {
    const payload = prepareEventPayload(formData);
    console.log('[eventsService] Updating Supabase event id:', id, payload);

    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[eventsService] Error updating event in Supabase:', error);
      return { data: null, error };
    }

    console.log('[eventsService] Event successfully updated in Supabase:', data);
    return { data: normalizeEvent(data[0]), error: null };
  } catch (err) {
    console.error('[eventsService] Unexpected error in updateEvent:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete an event from Supabase by UUID.
 */
export async function deleteEvent(id) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[eventsService] Error deleting event from Supabase:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('[eventsService] Unexpected error in deleteEvent:', err);
    return { error: err };
  }
}

/**
 * Inserts default sample events into Supabase if the table is empty.
 */
export async function seedDemoEvents() {
  try {
    const sampleEvents = [
      {
        name: 'TECHNOVA Hackathon 2026',
        category: 'Hackathon',
        event_date: '2026-10-24',
        start_time: '09:00:00',
        end_time: '21:00:00',
        venue: 'PCCOE Campus Tech Hub, Pune'
      },
      {
        name: 'Practical AI & Neural Networks Workshop',
        category: 'Workshop',
        event_date: '2026-11-12',
        start_time: '14:00:00',
        end_time: '18:00:00',
        venue: 'Computing Lab 3, PCCOE'
      },
      {
        name: 'CYBERSHIELD CTF 2026',
        category: 'Competition',
        event_date: '2026-12-05',
        start_time: '10:00:00',
        end_time: '18:00:00',
        venue: 'Online Platform + Tech Finals'
      }
    ];

    const { data, error } = await supabase
      .from('events')
      .insert(sampleEvents)
      .select();

    if (error) {
      return { data: null, error };
    }

    return { data: (data || []).map(normalizeEvent), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
