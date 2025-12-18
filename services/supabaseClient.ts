import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// These should be set in your development/production environment
// SUPABASE_URL and SUPABASE_ANON_KEY must be provided for real-time features
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.info(
    "%c FASTgo %c Running in MOCK MODE %c \nConnect Supabase to enable real-time tracking and database persistence.",
    "background: #FF5F00; color: white; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
    "background: #333; color: white; padding: 2px 5px; border-radius: 3px;",
    "color: inherit;"
  );
}