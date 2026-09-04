/**
 * Meta Pixel — samo za /izrada-sajta-detalji (odredište Instagram kampanja).
 *
 * Zašto slojevi umesto jednog "zakazano" eventa: Meta traži oko 50 konverzija
 * nedeljno po ad setu da ad set izađe iz faze učenja. Zakazanih poziva ima
 * premalo da se to ikad dostigne, pa bi optimizacija samo na njih ostavila
 * kampanju trajno u učenju — skupi i nestabilni lidovi. Zato se šalju tri
 * sloja signala, od čestih ka retkim, i kampanja se optimizuje na onaj sloj
 * koji trenutno ima dovoljno zapreminu:
 *
 *   sloj 1 (često)  ViewContent, VideoProgress  — gledao klip, stigao do forme
 *   sloj 2 (srednje) InitiateCheckout, Contact  — izabrao termin, kliknuo tel.
 *   sloj 3 (retko)   Schedule + Lead            — zakazao poziv
 *
 * Sloj 3 uvek meri stvarni rezultat, bez obzira na to na šta se optimizuje.
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

/** Standardni Meta event (ViewContent, Lead, Schedule…). */
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

/** Stigao do sekcije sa kalendarom — video ponudu, nije još kliknuo. */
export function trackFunnelViewContent(): void {
  pixelTrack('ViewContent', {
    content_name: 'Izrada sajta — funnel',
    content_category: 'funnel',
  });
}

/**
 * Prag odgledanog klipa (25/50/75/95). 50%+ je najkorisniji signal za
 * optimizaciju: dovoljno ga je često da algoritam ima šta da uči, a već
 * odvaja gledaoca od slučajnog prolaznika.
 */
export function trackVideoProgress(clip: string, percent: 25 | 50 | 75 | 95): void {
  pixelTrackCustom('VideoProgress', { clip, percent });
  if (percent === 50) {
    pixelTrackCustom('VideoHalfWatched', { clip });
    emitHalfWatchedStandard(clip, 'percent');
  }
}

/**
 * Pola klipa i kao STANDARDNI event.
 *
 * Custom event Meta mora prvo da primi i obradi da bi se uopšte pojavio u
 * listi za Custom Conversions, a to ume da potraje — do tada se ne može
 * izabrati kao cilj kampanje. `AddToCart` je standardan, pa je u toj listi
 * od prvog dana; u lead-gen kampanjama se uobičajeno koristi baš za ovakvu
 * mikro-konverziju. Custom event ostaje uz njega, za čitljivije izveštaje.
 */
function emitHalfWatchedStandard(clip: string, basis: 'percent' | 'time'): void {
  pixelTrack('AddToCart', {
    content_name: 'Odgledao pola klipa',
    content_category: 'video',
    clip,
    basis,
    value: LEAD_VALUE_EUR / 4,
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
    value: LEAD_VALUE_EUR,
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
 * Procenjena vrednost jednog zakazanog poziva. Nije cena sajta nego
 * očekivani prihod po lidu (prosečan posao × stopa zatvaranja) — po tome
 * Meta uči da traži ljude koji zaista zakazuju. Vlasnik neka ispravi
 * brojku kad bude imao stvarnu stopu zatvaranja.
 */
export const LEAD_VALUE_EUR = 60;

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
export function trackBookingCompleted(slotAt: string): void {
  pixelTrack('Schedule', {
    content_name: 'Zakazan poziv',
    content_category: 'booking',
    slot_at: slotAt,
    value: LEAD_VALUE_EUR,
    currency: 'EUR',
  });
}

/**
 * Vremenski prag gledanja — koristi se tamo gde plejer ne daje procenat
 * (Vimeo iframe na dodirnom uređaju). 60s+ je po značenju blizu „pola klipa"
 * i sme se koristiti kao cilj kampanje isto kao VideoHalfWatched.
 */
export function trackVideoWatchSeconds(clip: string, seconds: 30 | 60 | 120): void {
  pixelTrackCustom('VideoWatchTime', { clip, seconds });
  if (seconds === 60) {
    pixelTrackCustom('VideoHalfWatched', { clip, basis: 'time' });
    emitHalfWatchedStandard(clip, 'time');
  }
}
