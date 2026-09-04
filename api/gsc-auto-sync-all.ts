/**
 * gsc-auto-sync-all — Daily scheduled GSC sync for all active projects
 *
 * Called by GitHub Actions cron once per day.
 * Syncs monthly metrics + daily GSC data for every seo_project
 * that has gsc_auto_update = true and gsc_property_id set.
 *
 * Security: requires X-Cron-Secret header matching CRON_SECRET env var.
 *
 * Required env vars (same as gsc-sync):
 *   CRON_SECRET                  — shared secret with GitHub Actions
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — service account JSON
 *   SUPABASE_URL or VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY on Vercel
 */

import crypto from 'crypto';
import { getSupabaseAdmin } from './_lib/supabase-server.js';
import type { SupabaseClient } from '@supabase/supabase-js';

function base64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createServiceAccountJWT(sa: { client_email: string; private_key: string }): string {
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${payload}.${sig}`;
}

async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createServiceAccountJWT(sa),
    }),
  });
  const data = await res.json() as { access_token?: string; error_description?: string };
  if (!data.access_token) throw new Error(data.error_description || 'Cannot get GSC access token');
  return data.access_token;
}

interface GscRow { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }

async function queryGsc(
  token: string, property: string, startDate: string, endDate: string,
  dimensions: string[] = [], rowLimit = 500,
): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
  });
  const data = await res.json() as { rows?: GscRow[]; error?: { message: string } };
  if (!res.ok) throw new Error(`GSC ${res.status}: ${data.error?.message || 'unknown'}`);
  return data.rows || [];
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmtDate(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

async function syncProject(supabase: SupabaseClient, projectId: string, property: string, token: string): Promise<string> {
  const now = new Date();

  const m = now.getDate() <= 4 ? now.getMonth() - 2 : now.getMonth() - 1;
  const y = now.getFullYear();
  const firstDay = new Date(y, m, 1);
  const lastDay  = new Date(y, m + 1, 0);
  const startMonth = fmtDate(firstDay);
  const endMonth   = fmtDate(lastDay);
  const monthKey   = startMonth;

  const [monthlyRows, kwRows] = await Promise.all([
    queryGsc(token, property, startMonth, endMonth, [], 1),
    queryGsc(token, property, startMonth, endMonth, ['query'], 10),
  ]);

  const gsc = monthlyRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const clicks      = Math.round(gsc.clicks);
  const impressions = Math.round(gsc.impressions);
  const ctr         = Math.round(gsc.ctr * 10000) / 10000;
  const avg_position = gsc.position > 0 ? Math.round(gsc.position * 10) / 10 : null;

  const { data: existing } = await supabase
    .from('seo_metrics')
    .select('id, organic_visits')
    .eq('seo_project_id', projectId)
    .eq('month', monthKey)
    .maybeSingle();

  if (existing) {
    await supabase.from('seo_metrics').update({
      clicks, impressions, ctr, avg_position, is_gsc_synced: true,
      ...(existing.organic_visits === 0 ? { organic_visits: clicks } : {}),
    }).eq('id', existing.id);
  } else {
    await supabase.from('seo_metrics').insert({
      seo_project_id: projectId,
      month: monthKey,
      organic_visits: clicks,
      clicks, impressions, ctr, avg_position,
      new_backlinks: 0, total_backlinks: 0, is_gsc_synced: true,
    });
  }

  const topKeywords = kwRows.map(r => ({
    keyword: r.keys?.[0] || '',
    position: Math.round(r.position * 10) / 10,
  })).filter(k => k.keyword);

  if (topKeywords.length > 0) {
    const { data: existingKws } = await supabase
      .from('seo_keywords')
      .select('id, keyword, current_position')
      .eq('seo_project_id', projectId)
      .eq('source', 'gsc');

    const existingMap = new Map((existingKws || []).map(k => [k.keyword.toLowerCase(), k]));

    for (const tk of topKeywords) {
      const key = tk.keyword.toLowerCase();
      const ex  = existingMap.get(key);
      if (ex) {
        await supabase.from('seo_keywords').update({
          previous_position: ex.current_position,
          current_position: Math.round(tk.position),
        }).eq('id', ex.id);
      } else {
        await supabase.from('seo_keywords').insert({
          seo_project_id: projectId,
          keyword: tk.keyword,
          current_position: Math.round(tk.position),
          previous_position: null,
          source: 'gsc',
        });
      }
    }
  }

  const endDaily   = new Date(now);
  endDaily.setDate(endDaily.getDate() - 3);
  const startDaily = new Date(endDaily);
  startDaily.setDate(startDaily.getDate() - 479);

  const dailyRows = await queryGsc(
    token, property, fmtDate(startDaily), fmtDate(endDaily), ['date'], 500,
  );

  if (dailyRows.length > 0) {
    const rows = dailyRows.map(r => ({
      seo_project_id: projectId,
      date:        r.keys?.[0] || '',
      clicks:      Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      ctr:         Math.round(r.ctr * 10000) / 10000,
      position:    Math.round(r.position * 10) / 10,
    })).filter(r => r.date);

    await supabase.from('seo_gsc_daily').delete().eq('seo_project_id', projectId);
    for (let i = 0; i < rows.length; i += 200) {
      await supabase.from('seo_gsc_daily').insert(rows.slice(i, i + 200) as any);
    }
  }

  return `${property}: ${clicks} klikova, ${impressions} impresija, ${dailyRows.length} dana`;
}

export default async function handler(req: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return new Response(JSON.stringify({ error: 'CRON_SECRET nije podešen' }), { status: 500 });
  }
  if (req.headers.get('x-cron-secret') !== cronSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    return new Response(JSON.stringify({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON nije podešen' }), { status: 500 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const token = await getAccessToken(sa);

    const { data: projects, error } = await supabase
      .from('seo_projects')
      .select('id, gsc_property_id')
      .eq('gsc_auto_update', true)
      .not('gsc_property_id', 'is', null);

    if (error) throw error;
    if (!projects || projects.length === 0) {
      return new Response(JSON.stringify({ message: 'Nema projekata za sinhronizaciju' }), { status: 200 });
    }

    const results: { project_id: string; status: 'ok' | 'error'; detail: string }[] = [];

    for (const project of projects) {
      try {
    const detail = await syncProject(supabase, project.id, project.gsc_property_id!, token);
        results.push({ project_id: project.id, status: 'ok', detail });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown error';
        results.push({ project_id: project.id, status: 'error', detail: msg });
      }
    }

    const ok  = results.filter(r => r.status === 'ok').length;
    const err = results.filter(r => r.status === 'error').length;

    return new Response(JSON.stringify({
      synced_at: new Date().toISOString(),
      total: projects.length,
      ok,
      errors: err,
      results,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
