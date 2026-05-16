import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

function normalizeEnvPart(raw: string | undefined): string {
  if (raw === undefined || raw === null) return '';
  let s = String(raw).trim();
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
    s = s.slice(1, -1).trim();
  return s.trim();
}

/** URL može bez scheme; krajnji / se skida (origin za Supabase klijenta). */
export function normalizeSupabaseHttpUrl(urlPart: string): string {
  let u = urlPart.trim().replace(/\/+$/, '');
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    return new URL(u).origin;
  } catch {
    return '';
  }
}

function resolveUrlAndKey(): { url: string; key: string } {
  const urlRaw = normalizeEnvPart(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const url = normalizeSupabaseHttpUrl(urlRaw);
  const key = normalizeEnvPart(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return { url, key };
}

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
  const { url } = resolveUrlAndKey();
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function getSupabaseEnvDebug(): {
  hostname: string | null;
  jwtRoleClaim: string | undefined;
  urlNonEmpty: boolean;
  keyNonEmpty: boolean;
} {
  const { url, key } = resolveUrlAndKey();
  return {
    hostname: url ? getConfiguredSupabaseHostname() : null,
    jwtRoleClaim: decodeJwtRole(key),
    urlNonEmpty: !!url,
    keyNonEmpty: !!key,
  };
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const { url, key } = resolveUrlAndKey();
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL (ili VITE_SUPABASE_URL) i SUPABASE_SERVICE_ROLE_KEY moraju biti podešeni u Vercel env (server).',
    );
  }
  const role = decodeJwtRole(key);
  if (role === 'anon') {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY na serveru izgleda kao anon javni ključ. Koristi „service_role” secret iz Supabase → Project Settings → API.',
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' },
  });
  return cached;
}
