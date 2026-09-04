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
 * Access token NIKAD ne stoji u kodu — čita se iz META_CAPI_ACCESS_TOKEN
 * u Vercel environment variables.
 */

const API_VERSION = 'v21.0';
const PIXEL_ID = '3600632330101047';

/**
 * Meta traži SHA-256 preko normalizovane vrednosti (trim + lowercase).
 *
 * Namerno preko Web Crypto (`crypto.subtle`), a ne `node:crypto`: bez
 * Node-only importa funkcija se vrti i na Node i na Edge runtime-u, pa
 * ne zavisi od toga koji joj Vercel dodeli.
 */
async function hash(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 062 155 2156 → 381621552156 (E.164 bez plusa, kako Meta očekuje). */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `381${digits.slice(1)}`;
  return digits;
}

interface CapiBody {
  event_name: string;
  /** Isti ID koji je browser poslao — bez njega nema deduplikacije. */
  event_id: string;
  event_source_url?: string;
  /** Sekunde, ne milisekunde. Meta odbija događaje starije od 7 dana. */
  event_time?: number;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Stabilan ID iz naše baze (id rezervacije) — diže EMQ ocenu. */
  externalId?: string;
  value?: number;
  currency?: string;
  /** Meta cookies iz browsera — najjači signal za uparivanje. */
  fbp?: string;
  fbc?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'META_CAPI_ACCESS_TOKEN not configured' }),
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as CapiBody;

    if (!body.event_name || !body.event_id) {
      return new Response(
        JSON.stringify({ error: 'Missing event_name or event_id' }),
        { status: 400 },
      );
    }

    /* Sve što identifikuje osobu ide hešovano; fbp/fbc su izuzetak —
       njih Meta traži u čistom obliku, jer su njeni sopstveni identifikatori
       i ne otkrivaju ništa o osobi van Metinog sistema. */
    const userData: Record<string, string[] | string> = {};
    if (body.email) userData.em = [await hash(body.email)];
    if (body.phone) {
      const phone = normalizePhone(body.phone);
      if (phone) userData.ph = [await hash(phone)];
    }
    if (body.firstName) userData.fn = [await hash(body.firstName)];
    if (body.lastName) userData.ln = [await hash(body.lastName)];
    if (body.externalId) userData.external_id = [await hash(body.externalId)];
    if (body.fbp) userData.fbp = body.fbp;
    if (body.fbc) userData.fbc = body.fbc;

    /* IP i user-agent pomažu uparivanje i Meta ih očekuje u čistom obliku.
       Na Vercelu stvarni IP posetioca stiže kroz x-forwarded-for. */
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ua = req.headers.get('user-agent');
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;

    const payload = {
      data: [
        {
          event_name: body.event_name,
          event_time: body.event_time ?? Math.floor(Date.now() / 1000),
          event_id: body.event_id,
          event_source_url: body.event_source_url,
          action_source: 'website',
          user_data: userData,
          custom_data: {
            ...(body.value !== undefined ? { value: body.value } : {}),
            ...(body.currency ? { currency: body.currency } : {}),
          },
        },
      ],
      /* Postavi META_CAPI_TEST_CODE dok testiraš — događaji tada idu u
         Test Events, a ne u produkcijsku statistiku. Ukloni ga posle. */
      ...(process.env.META_CAPI_TEST_CODE
        ? { test_event_code: process.env.META_CAPI_TEST_CODE }
        : {}),
    };

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    const text = await res.text();
    if (!res.ok) {
      /* Odgovor se ne prosleđuje klijentu doslovno — Metine greške ume da
         sadrže deo tokena. Loguje se serverski, klijent dobija samo status. */
      console.error('[meta-capi] Meta odbila događaj:', text);
      return new Response(JSON.stringify({ error: 'Meta API error' }), { status: 502 });
    }

    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    console.error('[meta-capi]', message);
    return new Response(JSON.stringify({ error: 'Serverska greška' }), { status: 500 });
  }
}
