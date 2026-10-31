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
 * Optional SQL snippet to create a sorted chronological view in Supabase SQL editor.
 */
export const EVENTS_TIMELINE_VIEW_SQL = `
-- Run this in your Supabase SQL Editor if you want a dedicated database view:
CREATE OR REPLACE VIEW public.events_timeline AS
SELECT *
FROM public.events
ORDER BY event_date ASC NULLS LAST, start_time ASC NULLS LAST;
`.trim();

/**
 * Checks if a given event date (and optional end/start time) is in the past
 * by comparing against the client's current date and time.
 */
export function isEventPast(dateStr, endTime = null, startTime = null) {
  if (!dateStr) return false;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // If in YYYY-MM-DD format:
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;
  } else {
    // String like 'OCT 24, 2026'
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const pYear = parsed.getFullYear();
      const pMonth = String(parsed.getMonth() + 1).padStart(2, '0');
      const pDay = String(parsed.getDate()).padStart(2, '0');
      const pDateStr = `${pYear}-${pMonth}-${pDay}`;
      if (pDateStr < todayStr) return true;
      if (pDateStr > todayStr) return false;
    }
  }

  // Same day: check end_time or start_time
  const checkTime = endTime || startTime;
  if (checkTime) {
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${mins}:00`;
    const normalizedTime = checkTime.length === 5 ? `${checkTime}:00` : checkTime;
    return currentTimeStr > normalizedTime;
  }

  return false;
}

/**
 * Formats a raw YYYY-MM-DD date into a comic milestone date string (e.g., 'OCT 24, 2026').
 */
export function formatEventDate(dateStr) {
  if (!dateStr) return 'TBD';
  if (/[a-zA-Z]/.test(dateStr)) return dateStr;

  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    if (!isNaN(dateObj.getTime())) {
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${monthNames[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;
    }
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
  }

  return dateStr;
}

/**
 * Robust chronological comparator for event objects.
 */
export function compareEventDates(a, b, ascending = true) {
  const dateA = a.event_date || a.date || '';
  const dateB = b.event_date || b.date || '';

  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;

  let cmp = 0;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateA) && /^\d{4}-\d{2}-\d{2}$/.test(dateB)) {
    cmp = dateA.localeCompare(dateB);
  } else {
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) {
      cmp = timeA - timeB;
    } else {
      cmp = dateA.localeCompare(dateB);
    }
  }

  if (cmp === 0) {
    const timeA = a.start_time || a.startTime || '';
    const timeB = b.start_time || b.startTime || '';
    cmp = timeA.localeCompare(timeB);
  }

  return ascending ? cmp : -cmp;
}

/**
 * Normalizes a database row from public.events into the format expected by the UI.
 * Provides backwards-compatible aliases (e.g. title -> name, date -> event_date).
 * Compares event_date against the current date to set real past/upcoming status.
 */
export function normalizeEvent(row) {
  if (!row) return null;

  const startTimeFormatted = row.start_time ? row.start_time.slice(0, 5) : '';
  const endTimeFormatted = row.end_time ? row.end_time.slice(0, 5) : '';

  const timeDisplay = startTimeFormatted
    ? (endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : startTimeFormatted)
    : 'TBD';

  const desc = row['event_Description'] || row.event_Description || row.description || '';
  const regLink = row['Registration link'] || row.registration_link || row.registrationLink || '';

  const eventDate = row.event_date || row.date || '';
  const displayDate = formatEventDate(eventDate);

  // Dynamically compute status by comparing event_date with current date
  const past = isEventPast(eventDate, row.end_time, row.start_time);
  const status = past ? 'past' : 'upcoming';

  return {
    id: row.id,
    name: row.name || '',
    title: row.name || '', // Compatibility alias
    category: row.category || 'Workshop',
    event_date: eventDate,
    date: eventDate, // Compatibility alias
    displayDate: displayDate, // Formatted milestone tag date
    start_time: row.start_time || '',
    startTime: startTimeFormatted, // Compatibility alias
    end_time: row.end_time || '',
    endTime: endTimeFormatted, // Compatibility alias
    time: timeDisplay,
    venue: row.venue || '',
    location: row.venue || '', // Compatibility alias
    event_Description: desc,
    description: desc, // Compatibility alias
    'Registration link': regLink,
    registration_link: regLink, // Compatibility alias
    registrationLink: regLink, // Compatibility alias
    status: status,
    era: status
  };
}

/**
 * Extracts and strictly sanitizes fields for insertion/update in public.events.
 * Aligned with actual Supabase PostgreSQL public.events schema:
 * - id: uuid
 * - name: character varying NOT NULL
 * - category: character varying NULL
 * - event_date: date NULL
 * - start_time: time without time zone NULL
 * - end_time: time without time zone NULL
 * - venue: character varying NOT NULL
 * - "event_Description": character varying NULL
 * - "Registration link": character varying NULL (OPTIONAL)
 */
export function prepareEventPayload(formData) {
  const name = (formData.name || formData.title || '').trim();
  const category = formData.category ? formData.category.trim() : null;
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

  const event_Description =
    formData['event_Description'] !== undefined
      ? formData['event_Description']
      : (formData.event_Description || formData.description || '');

  const registration_link =
    formData['Registration link'] !== undefined
      ? formData['Registration link']
      : (formData.registration_link || formData.registrationLink || '');

  return {
    name,
    category,
    event_date,
    start_time: start_time || null,
    end_time: end_time || null,
    venue,
    'event_Description': event_Description ? String(event_Description).trim() : null,
    'Registration link': registration_link ? String(registration_link).trim() : null
  };
}

/**
 * Fetch all events from Supabase ordered chronologically by event_date.
 */
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[eventsService] Error fetching events from Supabase:', error);
      return { data: [], error };
    }

    const normalized = (data || []).map(normalizeEvent);
    // Guarantee chronological sorting (ascending from oldest to furthest future)
    normalized.sort((a, b) => compareEventDates(a, b, true));

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
