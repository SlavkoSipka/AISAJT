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
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

interface GscRow { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }
interface GscResponse { rows?: GscRow[]; error?: { message: string } }

async function queryGsc(
  accessToken: string,
  propertyUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = [],
  rowLimit = 10,
): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
  });
  const data = await res.json() as GscResponse;
  if (!res.ok) throw new Error(`GSC HTTP ${res.status} for property "${propertyUrl}": ${data.error?.message || JSON.stringify(data)}`);
  return data.rows || [];
}

async function fetchGscMetrics(
  accessToken: string, propertyUrl: string, startDate: string, endDate: string,
): Promise<GscRow> {
  const rows = await queryGsc(accessToken, propertyUrl, startDate, endDate, [], 1);
  return rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

async function fetchTopKeywords(
  accessToken: string, propertyUrl: string, startDate: string, endDate: string, limit = 10,
): Promise<{ keyword: string; position: number }[]> {
  const rows = await queryGsc(accessToken, propertyUrl, startDate, endDate, ['query'], limit);
  return rows.map(r => ({
    keyword: r.keys?.[0] || '',
    position: Math.round(r.position * 10) / 10,
  }));
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { seo_project_id } = await req.json() as { seo_project_id?: string };

    if (!seo_project_id) {
      return new Response(JSON.stringify({ error: 'seo_project_id je obavezno' }), { status: 400 });
    }

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

    const now = new Date();
    const m = now.getDate() <= 4 ? now.getMonth() - 2 : now.getMonth() - 1;
    const y = now.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startDate = `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`;
    const endDate = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;
    const monthKey = startDate;

    const gsc = await fetchGscMetrics(accessToken, project.gsc_property_id, startDate, endDate);
    const topKeywords = await fetchTopKeywords(accessToken, project.gsc_property_id, startDate, endDate, 10);

    const clicks = Math.round(gsc.clicks);
    const impressions = Math.round(gsc.impressions);
    const ctr = Math.round(gsc.ctr * 10000) / 10000;
    const avg_position = gsc.position > 0 ? Math.round(gsc.position * 10) / 10 : null;

    const { data: existing } = await supabase
      .from('seo_metrics')
      .select('id, new_backlinks, total_backlinks, organic_visits')
      .eq('seo_project_id', seo_project_id)
      .eq('month', monthKey)
      .maybeSingle();

    if (existing) {
      await supabase.from('seo_metrics').update({
        clicks,
        impressions,
        ctr,
        avg_position,
        is_gsc_synced: true,
        ...(existing.organic_visits === 0 ? { organic_visits: clicks } : {}),
      }).eq('id', existing.id);
    } else {
      await supabase.from('seo_metrics').insert({
        seo_project_id,
        month: monthKey,
        organic_visits: clicks,
        clicks,
        impressions,
        ctr,
        avg_position,
        new_backlinks: 0,
        total_backlinks: 0,
        is_gsc_synced: true,
      });
    }

    if (topKeywords.length > 0) {
      const { data: existingKws } = await supabase
        .from('seo_keywords')
        .select('id, keyword, current_position')
        .eq('seo_project_id', seo_project_id)
        .eq('source', 'gsc');

      const existingMap = new Map((existingKws || []).map(k => [k.keyword.toLowerCase(), k]));

      for (const tk of topKeywords) {
        const key = tk.keyword.toLowerCase();
        const existing_kw = existingMap.get(key);

        if (existing_kw) {
          await supabase.from('seo_keywords').update({
            previous_position: existing_kw.current_position,
            current_position: Math.round(tk.position),
          }).eq('id', existing_kw.id);
          existingMap.delete(key);
        } else {
          await supabase.from('seo_keywords').insert({
            seo_project_id,
            keyword: tk.keyword,
            current_position: Math.round(tk.position),
            previous_position: null,
            source: 'gsc',
          });
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      month: monthKey,
      date_range: `${startDate} → ${endDate}`,
      clicks,
      impressions,
      ctr,
      avg_position,
      keywords_synced: topKeywords.length,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Nepoznata greška';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
