/**
 * Meta Pixel — samo za /izrada-sajta-detalji (odredište Instagram kampanja).
 *
 * Zašto piramida umesto jednog "zakazano" eventa: Meta traži oko 50 konverzija
 * nedeljno po ad setu da ad set izađe iz faze učenja. Kod poslova ovog reda
 * veličine zakazanih poziva toliko nikad nema, pa bi optimizacija samo na njih
 * ostavila kampanju trajno u učenju — skupi i nestabilni lidovi. Zato svaki
 * korak kroz stranicu nosi svoj event, od najšireg ka najužem, i kampanja se
 * optimizuje na onaj sloj koji trenutno ima dovoljno obima:
 *
 *   VideoStart         pustio klip                      (custom)
 *   AddToWishlist      odgledao 25%
 *   AddToCart          odgledao 50%
 *   CustomizeProduct   odgledao 75%
 *   Search             odgledao do kraja
 *   InitiateCheckout   izabrao termin
 *   Schedule           zakazao poziv                    (+ CAPI)
 *
 * Tačno jedan event po koraku — raniji `VideoProgress`, `VideoHalfWatched` i
 * `VideoWatchTime` slali su se uz standardne i time isti korak brojali dva do
 * tri puta. Standardni su zadržani jer se biraju kao cilj kampanje odmah, dok
 * custom event Meta prvo mora da primi i obradi da bi se uopšte pojavio u
 * listi. `VideoStart` je ostao custom jer nijedan standardni event ne pokriva
 * "pustio klip", pa nema šta da duplira.
 */

import { CONSENT_STORAGE_KEY } from './consent';

const PIXEL_ID = '3600632330101047';

type PixelParams = Record<string, unknown>;

declare global {
  interface Window {
    // `fbq` je već globalno deklarisan u utils/analytics.ts — ovde se
    // dodaje samo zastavica loadera iz root.tsx.
    __aisajtPixelLoaded?: boolean;
  }
}

function isLocalhost(): boolean {
  if (typeof window === 'undefined') return true;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Pali pixel — samo ako je posetilac pristao i nismo na localhostu.
 * Idempotentno je (loader iz root.tsx čuva svoj `__aisajtPixelLoaded`),
 * pa se sme zvati i pri montiranju stranice i posle pristanka.
 */
export function loadPixel(): void {
  if (isLocalhost() || !hasConsent()) return;
  (window as unknown as { __aisajtLoadPixel?: () => void }).__aisajtLoadPixel?.();
}

export function pixelReady(): boolean {
  return !isLocalhost() && hasConsent() && typeof window !== 'undefined' && !!window.fbq;
}

/** Standardni Meta event (AddToCart, InitiateCheckout, Schedule…). */
export function pixelTrack(event: string, params?: PixelParams): void {
  if (!pixelReady()) return;
  window.fbq!('track', event, params);
}

/** Custom event — vidi se u Events Manageru pod tim imenom. */
export function pixelTrackCustom(event: string, params?: PixelParams): void {
  if (!pixelReady()) return;
  window.fbq!('trackCustom', event, params);
}

/**
 * Advanced Matching: hešovani kontakt podaci vidno poboljšavaju spajanje
 * konverzije sa osobom koja je videla reklamu, pa i cenu lida. Meta traži
 * SHA-256 preko normalizovane vrednosti (trim + lowercase); telefon ide
 * u E.164 bez plusa. Pozvati tek kad korisnik sam ostavi podatke.
 */
export async function pixelAdvancedMatch(input: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  if (!pixelReady() || typeof crypto?.subtle === 'undefined') return;

  const sha256 = async (value: string): Promise<string> => {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const norm = (v?: string) => (v ?? '').trim().toLowerCase();
  const data: Record<string, string> = {};

  if (input.email && norm(input.email)) data.em = await sha256(norm(input.email));
  if (input.firstName && norm(input.firstName)) data.fn = await sha256(norm(input.firstName));
  if (input.lastName && norm(input.lastName)) data.ln = await sha256(norm(input.lastName));
  if (input.phone) {
    // 062 155 2156 → 381621552156; već međunarodni brojevi ostaju kakvi jesu.
    let digits = input.phone.replace(/[^\d]/g, '');
    if (digits.startsWith('0')) digits = `381${digits.slice(1)}`;
    if (digits) data.ph = await sha256(digits);
  }

  if (Object.keys(data).length === 0) return;
  window.fbq!('init', PIXEL_ID, data);
}

/* ── Sloj 1: signali namere ─────────────────────────────────────────────── */

/**
 * Piramida gledanosti: svaki prag klipa nosi svoj STANDARDNI Meta event.
 *
 * Zašto standardni, a ne custom: custom event Meta mora prvo da primi i
 * obradi da bi se uopšte pojavio u listi za Custom Conversions, pa se do
 * tada ne može izabrati kao cilj kampanje. Standardni su u toj listi od
 * prvog dana. Imena su Metina fiksna (AddToWishlist/AddToCart/…) i njihovo
 * doslovno značenje ovde ne igra ulogu — algoritam uči iz signala, ne iz
 * imena; `content_name` nosi ljudski čitljiv opis za izveštaje.
 *
 * Svaki naredni prag je uži i vredniji, pa kampanja može da bira sloj koji
 * trenutno ima dovoljno obima:
 *
 *   25%  AddToWishlist      najširi, tek zagrejan
 *   50%  AddToCart          gledalac, ne prolaznik
 *   75%  CustomizeProduct   odgledao skoro sve
 *   95%  Search             odgledao do kraja, najuži
 */
const VIDEO_TIERS = {
  25: { event: 'AddToWishlist', label: 'Odgledao 25% klipa', divisor: 40 },
  50: { event: 'AddToCart', label: 'Odgledao 50% klipa', divisor: 20 },
  75: { event: 'CustomizeProduct', label: 'Odgledao 75% klipa', divisor: 10 },
  95: { event: 'Search', label: 'Odgledao klip do kraja', divisor: 6 },
} as const;

export function trackVideoProgress(clip: string, percent: 25 | 50 | 75 | 95): void {
  const tier = VIDEO_TIERS[percent];
  pixelTrack(tier.event, {
    content_name: tier.label,
    content_category: 'video',
    clip,
    percent,
    /* Što dalje u klipu, to bliže zakazivanju — vrednost raste po pragu. */
    value: Math.round(LEAD_VALUE_EUR / tier.divisor),
    currency: 'EUR',
  });
}

/* ── Sloj 2: mikro-konverzije ───────────────────────────────────────────── */

/** Izabrao termin u kalendaru — započeo zakazivanje, ali još nije poslao. */
export function trackBookingStarted(slotAt: string): void {
  pixelTrack('InitiateCheckout', {
    content_name: 'Zakazivanje poziva',
    content_category: 'booking',
    slot_at: slotAt,
    /* Termin je izabran, ali forma još nije poslata — otprilike polovina
       odavde završi, pa nosi pola vrednosti zakazanog poziva. */
    value: Math.round(LEAD_VALUE_EUR / 2),
    currency: 'EUR',
  });
}

/** Klik na broj telefona — visoka namera, ali bez podataka o osobi. */
export function trackPhoneIntent(location: string): void {
  pixelTrack('Contact', {
    content_name: 'Klik na telefon',
    content_category: location,
  });
}

/* ── Sloj 3: konverzija ─────────────────────────────────────────────────── */

/**
 * Vrednost jednog zakazanog poziva — prosečan posao × stopa zatvaranja, ne
 * cena sajta. Po ovoj brojci Meta procenjuje koliko sme da plati za lida,
 * pa promašena vrednost znači promašenu publiku.
 *
 * Osnova (septembar 2026, prva tri klijenta): poslovi od 4000, 3000 i 900 €
 * daju prosek ~2600 €. Vlasnik računa da otprilike svaki drugi zakazan poziv
 * postane klijent, pa je vrednost lida ~1300 €.
 *
 * Ovo je procena na tri posla — ispraviti čim bude dovoljno zakazivanja da se
 * stopa zatvaranja stvarno izmeri.
 */
export const LEAD_VALUE_EUR = 1300;

/**
 * Zakazivanje uspešno poslato — jedina konverzija koju ovaj modul šalje.
 *
 * Namerno ide samo `Schedule`, bez `Lead`: posle zakazivanja stranica prelazi
 * na /thank-you, gde postojeći trackLeadGeneration() već šalje svoj `Lead`.
 * Kako je to SPA prelaz, `fbq` ostaje u memoriji i taj event stvarno ode —
 * pa bi `Lead` i odavde značio dve konverzije po jednom zakazivanju, uz dve
 * različite vrednosti. `Schedule` se šalje odavde jer je ovo poslednja tačka
 * u kojoj je pixel sigurno na stranici.
 *
 * Za cilj kampanje koristiti `Schedule`, ne `Lead`.
 */
export function trackBookingCompleted(
  slotAt: string,
  person?: { email?: string; phone?: string; firstName?: string; lastName?: string; externalId?: string },
): void {
  const eventId = newEventId();

  pixelTrack('Schedule', {
    content_name: 'Zakazan poziv',
    content_category: 'booking',
    slot_at: slotAt,
    value: LEAD_VALUE_EUR,
    currency: 'EUR',
    eventID: eventId,
  });

  /* Isti event i sa servera, pod istim event_id — Meta ih spaja u jednu
     konverziju, a ona stigne i kad browser event blokira ad blocker. */
  void sendToCapi({
    event_name: 'Schedule',
    event_id: eventId,
    value: LEAD_VALUE_EUR,
    currency: 'EUR',
    ...person,
  });
}

/** Čita Metin cookie (_fbp / _fbc) — najjači signal za uparivanje na CAPI strani. */
function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Isti događaj ide i iz browsera i sa servera; `event_id` je ključ po kom ih
 * Meta spaja u jednu konverziju. Bez njega bi zakazivanje bilo izbrojano dvaput.
 */
function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

/**
 * Šalje isti događaj kroz Conversions API. Greška se namerno guta — merenje
 * ne sme da obori zakazivanje koje je korisnik upravo završio.
 */
async function sendToCapi(payload: Record<string, unknown>): Promise<void> {
  if (isLocalhost()) return;
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        event_source_url: window.location.href,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc'),
      }),
      keepalive: true,
    });
  } catch {
    /* mreža pukla — browser event je već otišao */
  }
}

/**
 * Vremenski prag gledanja — koristi se tamo gde plejer ne daje procenat
 * (Vimeo iframe na dodirnom uređaju). 60s+ je po značenju blizu „pola klipa"
 * i sme se koristiti kao cilj kampanje isto kao VideoHalfWatched.
 */
export function trackVideoWatchSeconds(clip: string, seconds: 30 | 60 | 120): void {
  /* Vreme se preslikava na iste pragove piramide, da mobilni gledaoci ulaze
     u isti sloj kao i oni kojima plejer daje procenat — isti event, isti
     sloj, samo drugi izvor merenja (`basis`). */
  const tierPercent = seconds === 120 ? 75 : seconds === 60 ? 50 : 25;
  const tier = VIDEO_TIERS[tierPercent];
  pixelTrack(tier.event, {
    content_name: tier.label,
    content_category: 'video',
    clip,
    basis: 'time',
    seconds,
    value: Math.round(LEAD_VALUE_EUR / tier.divisor),
    currency: 'EUR',
  });
}
