import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check karein ke Supabase credentials properly configured hain ya nahi
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'yahan_apni_supabase_project_url_dalein' &&
  !supabaseKey.includes('yahan_apni_supabase')
);

// Fallback client taake agar keys na bhi hon toh app crash na ho
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);