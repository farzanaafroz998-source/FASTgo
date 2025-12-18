import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Supabase Client Initialization
 * Requirements: SUPABASE_URL and SUPABASE_ANON_KEY in process.env
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only attempt to create the client if both keys are present.
// This prevents the SDK from throwing errors in environments where Supabase is optional.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Log status on load for developer visibility.
if (!supabase) {
  const styles = [
    'background: #FF5F00',
    'color: white',
    'padding: 4px 8px',
    'border-radius: 4px',
    'font-weight: bold'
  ].join(';');

  console.info(
    `%cFASTgo%c Application running in Mock Mode. Real-time features and DB persistence are disabled.`,
    styles,
    'color: #666; font-style: italic; margin-left: 8px;'
  );
} else {
  console.info("%cFASTgo%c Connected to Supabase Cloud.", "color: #FF5F00; font-weight: bold;", "color: green;");
}