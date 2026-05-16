/**
 * gsc-query — On-demand GSC data for short date ranges (3d / 28d)
 *
 * Returns daily breakdown from Google Search Console.
 * Used by the client dashboard for real-time 3-day and 28-day views.
 *
 * POST body: { seo_project_id: string, range: '3d' | '28d' }
 * Response:  { days: [{ date, clicks, impressions, ctr, position }], totals: {...} }
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
  if (!data.access_token) throw new Error(data.error_description || 'Cannot get access token');
  return data.access_token;
}

interface GscRow { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }
interface GscResponse { rows?: GscRow[]; error?: { message: string } }

async function queryGscDaily(
  accessToken: string,
  propertyUrl: string,
  startDate: string,
  endDate: string,
): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions: ['date'], rowLimit: 500 }),
  });
  const data = await res.json() as GscResponse;
  if (!res.ok) throw new Error(`GSC HTTP ${res.status}: ${data.error?.message || JSON.stringify(data)}`);
  return data.rows || [];
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const VALID_RANGES = ['3d', '28d', '3m', '6m', 'all'] as const;
type Range = typeof VALID_RANGES[number];

const RANGE_DAYS: Record<Range, number> = {
  '3d': 3,
  '28d': 28,
  '3m': 90,
  '6m': 180,
  'all': 480,
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json() as { seo_project_id?: string; range?: string };

    if (!body.seo_project_id) {
      return new Response(JSON.stringify({ error: 'seo_project_id is required' }), { status: 400 });
    }
    if (!body.range || !VALID_RANGES.includes(body.range as Range)) {
      return new Response(JSON.stringify({ error: 'range must be 3d, 28d, 3m, 6m, or all' }), { status: 400 });
    }

    const range = body.range as Range;

    const { data: project, error: projErr } = await supabase
      .from('seo_projects').select('id, gsc_property_id').eq('id', body.seo_project_id).single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }
    if (!project.gsc_property_id) {
      return new Response(JSON.stringify({ error: 'GSC property not configured' }), { status: 400 });
    }

    const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!saJson) {
      return new Response(JSON.stringify({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON not set' }), { status: 500 });
    }

    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const accessToken = await getAccessToken(sa);

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - 3);

    const daysBack = RANGE_DAYS[range];
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack + 1);

    const rows = await queryGscDaily(
      accessToken,
      project.gsc_property_id,
      formatDate(startDate),
      formatDate(endDate),
    );

    const days = rows
      .map(r => ({
        date: r.keys?.[0] || '',
        clicks: Math.round(r.clicks),
        impressions: Math.round(r.impressions),
        ctr: Math.round(r.ctr * 10000) / 10000,
        position: Math.round(r.position * 10) / 10,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totals = {
      clicks: days.reduce((s, d) => s + d.clicks, 0),
      impressions: days.reduce((s, d) => s + d.impressions, 0),
      ctr: days.length > 0 ? days.reduce((s, d) => s + d.ctr, 0) / days.length : 0,
      position: days.length > 0 ? days.reduce((s, d) => s + d.position, 0) / days.length : 0,
    };

    return new Response(JSON.stringify({ days, totals, range, startDate: formatDate(startDate), endDate: formatDate(endDate) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    console.error('gsc-query error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
