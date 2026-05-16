/**
 * gsc-query — On-demand GSC data for arbitrary date ranges
 *
 * POST body: { seo_project_id: string, range?: '3d'|'28d'|'3m'|'6m'|'all', startDate?: string, endDate?: string }
 *   - If startDate/endDate provided, they override `range`.
 *   - Dates are YYYY-MM-DD.
 * Response:  { days: [{ date, clicks, impressions, ctr, position }], totals: {...} }
 */

export const config = { maxDuration: 60 };

import crypto from 'crypto';
import { getSupabaseAdmin } from './supabase-server';
import { sendJson } from './send-json';

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
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();
    const body = await readJsonBody(req) as { seo_project_id?: string; range?: string; startDate?: string; endDate?: string };

    body.seo_project_id = typeof body.seo_project_id === 'string' ? body.seo_project_id.trim() : body.seo_project_id;
    if (!body.seo_project_id) {
      sendJson(res, 400, { error: 'seo_project_id is required' });
      return;
    }

    const hasExplicitDates = !!(body.startDate && body.endDate);
    const ISO = /^\d{4}-\d{2}-\d{2}$/;

    if (hasExplicitDates) {
      if (!ISO.test(body.startDate!) || !ISO.test(body.endDate!)) {
        sendJson(res, 400, { error: 'startDate/endDate must be YYYY-MM-DD' });
        return;
      }
    } else if (!body.range || !VALID_RANGES.includes(body.range as Range)) {
      sendJson(res, 400, { error: 'range must be 3d, 28d, 3m, 6m, or all (or provide startDate+endDate)' });
      return;
    }

    const { data: project, error: projErr } = await supabase
      .from('seo_projects').select('id, gsc_property_id').eq('id', body.seo_project_id).single();

    if (projErr || !project) {
      sendJson(res, 404, {
        error: 'Project not found',
        _hint: 'Vercel server env mora pokazati na isti Supabase projekat (SUPABASE_URL ili VITE_SUPABASE_URL).',
        _supabase: projErr
          ? { message: projErr.message, code: projErr.code, details: projErr.details }
          : null,
      });
      return;
    }
    if (!project.gsc_property_id) {
      sendJson(res, 400, { error: 'GSC property not configured' });
      return;
    }

    const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!saJson) {
      sendJson(res, 500, { error: 'GOOGLE_SERVICE_ACCOUNT_JSON not set' });
      return;
    }

    const sa = JSON.parse(saJson) as { client_email: string; private_key: string };
    const accessToken = await getAccessToken(sa);

    let startStr: string;
    let endStr: string;

    if (hasExplicitDates) {
      startStr = body.startDate!;
      endStr = body.endDate!;
    } else {
      const range = body.range as Range;
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() - 3);
      const daysBack = RANGE_DAYS[range];
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - daysBack + 1);
      startStr = formatDate(startDate);
      endStr = formatDate(endDate);
    }

    const rows = await queryGscDaily(accessToken, project.gsc_property_id, startStr, endStr);

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

    sendJson(res, 200, { days, totals, range: body.range || 'custom', startDate: startStr, endDate: endStr });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    console.error('gsc-query error:', msg);
    sendJson(res, 500, { error: msg });
  }
}
