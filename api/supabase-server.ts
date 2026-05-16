import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

function decodeJwtRole(jwtSecret: string): string | undefined {
  const parts = jwtSecret.trim().split('.');
  if (parts.length !== 3 || !parts[1]) return undefined;
  const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (b64.length % 4)) % 4;
  const padded = b64 + '='.repeat(pad);
  try {
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as { role?: string };
    return typeof payload.role === 'string' ? payload.role : undefined;
  } catch {
    return undefined;
  }
}

export function getConfiguredSupabaseHostname(): string | null {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function getSupabaseEnvDebug(): { hostname: string | null; jwtRoleClaim: string | undefined } {
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return { hostname: getConfiguredSupabaseHostname(), jwtRoleClaim: decodeJwtRole(key) };
}

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
  const role = decodeJwtRole(key);
  if (role === 'anon') {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY na serveru izgleda kao anon javni ključ. Koristi „service_role” secret iz Supabase → Project Settings → API. Sa anon ključem RLS blokira bez user sesije pa često dobijaš 0 redova (kao da projekat ne postoji).',
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
