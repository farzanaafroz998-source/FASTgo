import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Note: These should be set in your environment
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Only initialize if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("FASTgo: Supabase credentials missing. App running in 'Mock Mode'.");
}