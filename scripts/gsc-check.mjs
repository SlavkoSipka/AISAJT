#!/usr/bin/env node
/**
 * gsc-check — Lokalna provera GSC podataka po opsegu (3m / 6m / all)
 *
 * Čita GOOGLE_SERVICE_ACCOUNT_JSON iz .env.local, autentifikuje se kao
 * service account, i upita Google Search Console API direktno — isto
 * kao produkcijska `gsc-query` netlify funkcija.
 *
 * Upotreba:
 *   node scripts/gsc-check.mjs                          # listaj projekte
 *   node scripts/gsc-check.mjs --project <seo_project_id>
 *   node scripts/gsc-check.mjs --property sc-domain:aisajt.com
 *   node scripts/gsc-check.mjs --property https://aisajt.com/ --days
 *
 * Opcije:
 *   --days   štampa i dnevnu razradu (date,clicks,impressions,ctr,pos)
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── Load .env.local ─────────────────────────────────────────────────────────
function loadEnv(path) {
  const raw = readFileSync(path, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[m[1]] = val;
  }
  return env;
}

const env = loadEnv(resolve(ROOT, '.env.local'));
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SA_JSON      = env.GOOGLE_SERVICE_ACCOUNT_JSON;

if (!SA_JSON) { console.error('❌ GOOGLE_SERVICE_ACCOUNT_JSON nedostaje u .env.local'); process.exit(1); }

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const next = args[i + 1];
  return (!next || next.startsWith('--')) ? true : next;
}
const projectId = flag('project');
const propertyArg = flag('property');
const showDays = !!flag('days');

// ── JWT / access token ──────────────────────────────────────────────────────
function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function createJwt(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  }));
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, 'base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${header}.${payload}.${sig}`;
}
async function getAccessToken(sa) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createJwt(sa),
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(data.error_description || 'Neuspešan token');
  return data.access_token;
}

// ── GSC query ───────────────────────────────────────────────────────────────
async function queryGsc(token, property, startDate, endDate, dimensions = [], rowLimit = 500) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`GSC ${res.status}: ${data.error?.message || 'greška'}`);
  return data.rows || [];
}

// ── Date helpers ────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

// ── Supabase helper (optional — za listanje projekata ili --project) ────────
async function supaFetch(path) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase env vars nedostaju');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  const sa = JSON.parse(SA_JSON);

  // 1. Resolve property
  let property = propertyArg;

  if (!property && projectId) {
    const rows = await supaFetch(`seo_projects?id=eq.${projectId}&select=id,domain,gsc_property_id`);
    if (!rows[0]) { console.error('❌ Projekat nije pronađen'); process.exit(1); }
    property = rows[0].gsc_property_id;
    console.log(`📁 ${rows[0].domain} → ${property}\n`);
  }

  if (!property) {
    const rows = await supaFetch(`seo_projects?select=id,domain,gsc_property_id,gsc_auto_update&order=domain.asc`);
    if (rows.length === 0) { console.log('Nema projekata.'); return; }
    console.log('\nSEO projekti:\n');
    for (const r of rows) {
      const flagIcon = r.gsc_property_id ? '✓' : '✗';
      console.log(`  ${flagIcon}  ${r.id}   ${r.domain.padEnd(30)}  ${r.gsc_property_id || '(bez GSC)'}`);
    }
    console.log('\nUpotreba:\n  node scripts/gsc-check.mjs --project <id>');
    console.log('  node scripts/gsc-check.mjs --property "<property>"\n');
    return;
  }

  // 2. Auth
  const token = await getAccessToken(sa);

  // 3. Ranges — end = pre 3 dana (GSC lag ~3 dana)
  const end = daysAgo(3);
  const endStr = fmt(end);

  const ranges = [
    { key: '3d',  days: 3   },
    { key: '28d', days: 28  },
    { key: '3m',  days: 90  },
    { key: '6m',  days: 180 },
    { key: 'all', days: 480 },
  ];

  console.log(`🔍 Property: ${property}`);
  console.log(`📅 Krajnji datum: ${endStr} (GSC lag ~3 dana)\n`);

  // 4. Sumarni pregled
  const rangeTotals = [];
  for (const r of ranges) {
    const start = new Date(end); start.setDate(start.getDate() - r.days + 1);
    const rows = await queryGsc(token, property, fmt(start), endStr, [], 1);
    const row = rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    rangeTotals.push({
      key: r.key,
      startDate: fmt(start),
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: row.ctr,
      position: row.position,
    });
  }

  // 5. Tabela
  const hdr = ['Opseg', 'Od', 'Klikovi', 'Impresije', 'CTR', 'Pozicija'];
  const rows = rangeTotals.map(r => [
    r.key,
    r.startDate,
    r.clicks.toLocaleString('sr-Latn'),
    r.impressions.toLocaleString('sr-Latn'),
    `${(r.ctr * 100).toFixed(2)}%`,
    r.position > 0 ? r.position.toFixed(1) : '—',
  ]);
  const widths = hdr.map((h, i) => Math.max(h.length, ...rows.map(r => r[i].length)));
  const line = (cols) => cols.map((c, i) => c.padEnd(widths[i])).join('  ');
  console.log(line(hdr));
  console.log(widths.map(w => '─'.repeat(w)).join('  '));
  for (const r of rows) console.log(line(r));

  // 6. Upozorenje kad su opsezi identični
  const same = (a, b) => a.clicks === b.clicks && a.impressions === b.impressions;
  const r3m = rangeTotals.find(x => x.key === '3m');
  const r6m = rangeTotals.find(x => x.key === '6m');
  const rAl = rangeTotals.find(x => x.key === 'all');

  console.log('');
  if (same(r6m, rAl)) {
    console.log('⚠  6 meseci i "Sve" daju isti rezultat — sajt ima < 180 dana GSC istorije.');
    console.log('   UI bi trebalo da sakrije "6 mes." dugme.');
  }
  if (same(r3m, rAl)) {
    console.log('⚠  3 meseca i "Sve" daju isti rezultat — sajt ima < 90 dana GSC istorije.');
  }
  if (!same(r3m, rAl) && !same(r6m, rAl)) {
    console.log('✓  Opsezi su različiti — sve tabove treba prikazati.');
  }

  // 7. Dnevna razrada opciono
  if (showDays) {
    console.log('\n── Poslednjih 30 dana ──');
    const start = new Date(end); start.setDate(start.getDate() - 29);
    const daily = await queryGsc(token, property, fmt(start), endStr, ['date'], 500);
    for (const d of daily.sort((a, b) => a.keys[0].localeCompare(b.keys[0]))) {
      console.log(
        `  ${d.keys[0]}  clicks=${String(Math.round(d.clicks)).padStart(4)}  ` +
        `impr=${String(Math.round(d.impressions)).padStart(5)}  ` +
        `ctr=${(d.ctr*100).toFixed(2).padStart(5)}%  ` +
        `pos=${d.position.toFixed(1).padStart(5)}`
      );
    }
  }
})().catch(err => { console.error('❌', err.message); process.exit(1); });
