// Supabase Client Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cmubkkgjdssbkqgtsjgs.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_1V9K9DEkykxOibP8Qav1CQ_dgISRKsl';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseKey);
