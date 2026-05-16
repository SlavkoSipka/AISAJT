import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/**
 * Vercel Node funkcije često nemaju VITE_* u runtime-u ako nije eksplicitno podešeno;
 * koristi SUPABASE_URL na serveru ili VITE_SUPABASE_URL kao fallback (isto kao u buildu).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL (ili VITE_SUPABASE_URL) i SUPABASE_SERVICE_ROLE_KEY moraju biti podešeni u Vercel env (server).',
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
