/**
 * Sa koje stranice je lead zakazao poziv.
 *
 * Ključ ide u bazu kao `bookings.source` (poklapa se sa rutom stranice, pa je
 * lako uparivo u portalu), a vrednost je ono što čovek pročita u HubSpot
 * notifikaciji i u mejlu.
 *
 * Kalendar je namerno zajednički za sve tri stranice — zauzet termin je zauzet
 * svuda. `source` služi samo da se zna odakle je lead došao.
 */
export const BOOKING_SOURCES = {
  'izrada-sajta-detalji': 'Izrada sajta',
  'promet-sistem': 'Promet Sistem',
  'seo-optimizacija-detalji': 'SEO detalji',
} as const;

export type BookingSource = keyof typeof BOOKING_SOURCES;

export function bookingSourceLabel(source: string): string {
  return (BOOKING_SOURCES as Record<string, string>)[source] ?? source;
}
