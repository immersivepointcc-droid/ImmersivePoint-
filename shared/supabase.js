/**
 * ImmersivePoint — Supabase Client
 *
 * Initialises a single Supabase client for the entire app.
 * Reads configuration from window.__ENV (set by a build step or inline script)
 * and falls back to placeholder values so the app can run without a backend.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

/* ---------- Configuration ---------------------------------- */

const PLACEHOLDER_URL = 'https://your-project.supabase.co';
const PLACEHOLDER_KEY = 'your-anon-key-here';

const env = (typeof window !== 'undefined' && window.__ENV) || {};

const supabaseUrl  = env.SUPABASE_URL     || PLACEHOLDER_URL;
const supabaseKey  = env.SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

/* ---------- Client ----------------------------------------- */

let supabase = null;

if (isConfigured()) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Returns `true` when real Supabase credentials are present — i.e. neither
 * the URL nor the key is still set to the placeholder value.
 */
export function isConfigured() {
  return (
    supabaseUrl  !== PLACEHOLDER_URL &&
    supabaseKey  !== PLACEHOLDER_KEY &&
    supabaseUrl.startsWith('https://') &&
    supabaseKey.length > 20
  );
}

export { supabase };
export default supabase;
