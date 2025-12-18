import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Note: These environment variables should be set in your project dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Only initialize if keys are present to prevent "supabaseUrl is required" error
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("FASTgo: Supabase credentials missing. App running in 'Mock Mode'. To enable live features, please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.");
}