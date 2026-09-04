/**
 * Meta Conversions API — server-side blizanac browser pixela.
 *
 * Zašto uopšte: browser event ne stigne kod svakog posetioca. Ad blokeri,
 * ITP na Safariju i iOS ograničenja pojedu osetan deo saobraćaja, pa Meta ne
 * vidi deo konverzija koje su se stvarno desile. Server šalje isti event
 * nezavisno od browsera, pa se ta rupa zatvara.
 *
 * DEDUPLIKACIJA: browser i server šalju isti `event_id` za istu konverziju.
 * Meta po tom ključu spaja dva dolaska u jednu konverziju — bez toga bi
 * svako zakazivanje bilo izbrojano dvaput. `event_name` mora da se poklopi
 * isto (oba šalju 'Schedule').
 *
 * POTPIS HANDLERA: (req, res), Node stil — isti kao gsc-query.ts. Nije stvar
 * ukusa: funkcije ovog projekta pisane u Web stilu (Request → Response) na
 * produkciji vise dok zahtev ne istekne, umesto da odgovore. Vidi
 * send-notification.ts i create-*.ts, koje imaju isti problem.
 *
 * Access token NIKAD ne stoji u kodu — čita se iz META_CAPI_ACCESS_TOKEN
 * u Vercel environment variables.
 */

import crypto from 'crypto';
import { readJsonBody } from './_lib/read-json-body.js';

const API_VERSION = 'v21.0';
const PIXEL_ID = '3600632330101047';

/** Meta traži SHA-256 preko normalizovane vrednosti (trim + lowercase). */
function hash(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/** 062 155 2156 → 381621552156 (E.164 bez plusa, kako Meta očekuje). */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `381${digits.slice(1)}`;
  return digits;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v : undefined;
}

export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'META_CAPI_ACCESS_TOKEN not configured' });
    return;
  }

  try {
    const body = await readJsonBody(req);

    const eventName = str(body.event_name);
    const eventId = str(body.event_id);
    if (!eventName || !eventId) {
      res.status(400).json({ error: 'Missing event_name or event_id' });
      return;
    }

    /* Sve što identifikuje osobu ide hešovano; fbp/fbc su izuzetak —
       njih Meta traži u čistom obliku, jer su njeni sopstveni identifikatori
       i ne otkrivaju ništa o osobi van Metinog sistema. */
    const userData: Record<string, string[] | string> = {};
    const email = str(body.email);
    const phoneRaw = str(body.phone);
    const firstName = str(body.firstName);
    const lastName = str(body.lastName);
    const externalId = str(body.externalId);

    if (email) userData.em = [hash(email)];
    if (phoneRaw) {
      const phone = normalizePhone(phoneRaw);
      if (phone) userData.ph = [hash(phone)];
    }
    if (firstName) userData.fn = [hash(firstName)];
    if (lastName) userData.ln = [hash(lastName)];
    if (externalId) userData.external_id = [hash(externalId)];

    const fbp = str(body.fbp);
    const fbc = str(body.fbc);
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    /* IP i user-agent pomažu uparivanje i Meta ih očekuje u čistom obliku.
       Na Vercelu stvarni IP posetioca stiže kroz x-forwarded-for. */
    const fwd = req.headers?.['x-forwarded-for'];
    const ip = Array.isArray(fwd) ? fwd[0] : String(fwd ?? '').split(',')[0]?.trim();
    const ua = req.headers?.['user-agent'];
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = String(ua);

    const customData: Record<string, unknown> = {};
    if (typeof body.value === 'number') customData.value = body.value;
    if (str(body.currency)) customData.currency = body.currency;

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: typeof body.event_time === 'number'
            ? body.event_time
            : Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: str(body.event_source_url),
          action_source: 'website',
          user_data: userData,
          custom_data: customData,
        },
      ],
      /* Postavi META_CAPI_TEST_CODE dok testiraš — događaji tada idu u
         Test Events, a ne u produkcijsku statistiku. Ukloni ga posle. */
      ...(process.env.META_CAPI_TEST_CODE
        ? { test_event_code: process.env.META_CAPI_TEST_CODE }
        : {}),
    };

    const metaRes = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    const text = await metaRes.text();
    if (!metaRes.ok) {
      /* Odgovor se ne prosleđuje klijentu doslovno — Metine greške ume da
         sadrže deo tokena. Loguje se serverski, klijent dobija samo status. */
      console.error('[meta-capi] Meta odbila događaj:', text);
      res.status(502).json({ error: 'Meta API error' });
      return;
    }

    res.status(200).json(JSON.parse(text));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    console.error('[meta-capi]', message);
    res.status(500).json({ error: 'Serverska greška' });
  }
}
