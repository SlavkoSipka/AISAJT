/**
 * gsc-sync — Google Search Console sync
 *
 * Fetches last full month's data from GSC for a given seo_project_id and
 * upserts into seo_metrics. Preserves manually-entered backlink counts.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — full contents of the service account JSON file
 *   VITE_SUPABASE_URL            — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY    — Supabase service role key
 *
 * Setup:
 *   1. Create a Google Cloud Service Account with Search Console Read-only access.
 *   2. Download the JSON key file.
 *   3. Add the service account email as a "Restricted" user in Google Search Console
 *      for the property you want to track.
 *   4. Paste the entire JSON file content as the GOOGLE_SERVICE_ACCOUNT_JSON env var.
 */

import type { Context } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── JWT creation for Google Service Account ──────────────────────────────────
function base64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createServiceAccountJWT(sa: { client_email: string; private_key: string }, scope: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(sa.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return `${header}.${payload}.${signature}`;
}

async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const jwt = createServiceAccountJWT(sa, 'https://www.googleapis.com/auth/webmasters.readonly');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json() as { access_token?: string; error_description?: string };
  if (!data.access_token) throw new Error(data.error_description || 'Nije moguće dobiti access token');
  return data.access_token;
}

// ── GSC query ────────────────────────────────────────────────────────────────
interface GscRow { clicks: number; impressions: number; ctr: number; position: number }
interface GscResponse { rows?: GscRow[]; error?: { message: string } }

async function fetchGscMetrics(
  accessToken: string,
  propertyUrl: string,
  startDate: string,
  endDate: string,
): Promise<GscRow> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions: [] }),
  });
  const data = await res.json() as GscResponse;
  if (!res.ok) throw new Error(data.error?.message || `GSC HTTP ${res.status}`);
  const row = data.rows?.[0];
  return row || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { seo_project_id } = await req.json() as { seo_project_id?: string };

    if (!seo_project_id) {
      return new Response(JSON.stringify({ error: 'seo_project_id je obavezno' }), { status: 400 });
    }

    // Load project
    const { data: project, error: projErr } = await supabase
      .from('seo_projects').select('*').eq('id', seo_project_id).single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: 'Projekat nije pronađen' }), { status: 404 });
    }

    if (!project.gsc_property_id) {
      return new Response(JSON.stringify({ error: 'GSC property nije podešen za ovaj projekat' }), { status: 400 });
    }

    const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!saJson) {
      return new Response(JSON.stringify({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON nije podešen u env vars' }), { status: 500 });
    }

    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const accessToken = await getAccessToken(sa);

    // Last full calendar month
    const now = new Date();
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startDate = firstOfLastMonth.toISOString().split('T')[0];
    const endDate = lastOfLastMonth.toISOString().split('T')[0];
    const monthKey = startDate; // YYYY-MM-01

    const gsc = await fetchGscMetrics(accessToken, project.gsc_property_id, startDate, endDate);

    const clicks = Math.round(gsc.clicks);
    const impressions = Math.round(gsc.impressions);
    const avg_position = gsc.position > 0 ? Math.round(gsc.position * 10) / 10 : null;

    // Check if a row already exists for this month
    const { data: existing } = await supabase
      .from('seo_metrics')
      .select('id, new_backlinks, total_backlinks, organic_visits')
      .eq('seo_project_id', seo_project_id)
      .eq('month', monthKey)
      .maybeSingle();

    if (existing) {
      // Update only GSC fields — preserve manually-entered backlinks and organic_visits
      // (admin can override organic_visits manually; GSC gives us clicks/impressions separately)
      await supabase.from('seo_metrics').update({
        clicks,
        impressions,
        avg_position,
        is_gsc_synced: true,
        // Update organic_visits only if it was 0 (not manually set yet)
        ...(existing.organic_visits === 0 ? { organic_visits: clicks } : {}),
      }).eq('id', existing.id);
    } else {
      // Insert new row
      await supabase.from('seo_metrics').insert({
        seo_project_id,
        month: monthKey,
        organic_visits: clicks,
        clicks,
        impressions,
        avg_position,
        new_backlinks: 0,
        total_backlinks: 0,
        is_gsc_synced: true,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      month: monthKey,
      clicks,
      impressions,
      avg_position,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Nepoznata greška';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
