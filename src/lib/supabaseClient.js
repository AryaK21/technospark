// Supabase Client Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://stumroankydarevvhrfi.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_ujbuZlTbyz9ubUDRmn6ouw__ZdcKxgx';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseKey);