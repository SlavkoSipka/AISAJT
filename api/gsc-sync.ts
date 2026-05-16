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

export const config = { maxDuration: 60 };

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
  timeoutMs = 20000,
): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
      signal: ctrl.signal,
    });
    const data = await res.json() as GscResponse;
    if (!res.ok) throw new Error(`GSC HTTP ${res.status} for property "${propertyUrl}": ${data.error?.message || JSON.stringify(data)}`);
    return data.rows || [];
  } finally {
    clearTimeout(timer);
  }
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

async function readJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length > 0) {
    try { return JSON.parse(req.body); } catch { /* fall through */ }
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let phase = 'init';
  const mark = (name: string) => { timings[name] = Date.now() - t0; phase = name; };

  try {
    const body = await readJsonBody(req);
    const seo_project_id = body?.seo_project_id as string | undefined;
    mark('parsed_body');

    if (!seo_project_id) {
      res.status(400).json({ error: 'seo_project_id je obavezno' });
      return;
    }

    const { data: project, error: projErr } = await supabase
      .from('seo_projects').select('*').eq('id', seo_project_id).single();
    mark('fetched_project');

    if (projErr || !project) {
      res.status(404).json({ error: 'Projekat nije pronađen', _timings: timings });
      return;
    }

    if (!project.gsc_property_id) {
      res.status(400).json({ error: 'GSC property nije podešen za ovaj projekat', _timings: timings });
      return;
    }

    const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!saJson) {
      res.status(500).json({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON nije podešen u env vars', _timings: timings });
      return;
    }

    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const accessToken = await getAccessToken(sa);
    mark('got_access_token');

    const now = new Date();
    const m = now.getDate() <= 4 ? now.getMonth() - 2 : now.getMonth() - 1;
    const y = now.getFullYear();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startDate = `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`;
    const endDate = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;
    const monthKey = startDate;

    const [gsc, topKeywords] = await Promise.all([
      fetchGscMetrics(accessToken, project.gsc_property_id, startDate, endDate),
      fetchTopKeywords(accessToken, project.gsc_property_id, startDate, endDate, 10),
    ]);
    mark('gsc_fetched');

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
    mark('fetched_existing_metric');

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
    mark('upserted_metric');

    if (topKeywords.length > 0) {
      const { data: existingKws } = await supabase
        .from('seo_keywords')
        .select('id, keyword, current_position')
        .eq('seo_project_id', seo_project_id)
        .eq('source', 'gsc');

      const existingMap = new Map((existingKws || []).map(k => [k.keyword.toLowerCase(), k]));

      const updates: PromiseLike<unknown>[] = [];
      const inserts: Array<Record<string, unknown>> = [];

      for (const tk of topKeywords) {
        const key = tk.keyword.toLowerCase();
        const existing_kw = existingMap.get(key);
        if (existing_kw) {
          updates.push(
            supabase.from('seo_keywords').update({
              previous_position: existing_kw.current_position,
              current_position: Math.round(tk.position),
            }).eq('id', existing_kw.id) as unknown as PromiseLike<unknown>
          );
        } else {
          inserts.push({
            seo_project_id,
            keyword: tk.keyword,
            current_position: Math.round(tk.position),
            previous_position: null,
            source: 'gsc',
          });
        }
      }

      if (inserts.length > 0) {
        updates.push(supabase.from('seo_keywords').insert(inserts) as unknown as PromiseLike<unknown>);
      }
      await Promise.all(updates);
    }
    mark('keywords_synced');

    console.log('gsc-sync timings:', timings);

    res.status(200).json({
      success: true,
      month: monthKey,
      date_range: `${startDate} → ${endDate}`,
      clicks,
      impressions,
      ctr,
      avg_position,
      keywords_synced: topKeywords.length,
      _timings: timings,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Nepoznata greška';
    console.error('gsc-sync error after phase:', phase, 'timings:', timings, 'msg:', msg);
    res.status(500).json({ error: msg, _failedAt: phase, _timings: timings });
  }
}
