import { createClient } from '@supabase/supabase-js';

/**
 * Supabase klijent za marketing sajt (odvojen od portala, koji ima svoj
 * tipizirani klijent u src/portal/lib/supabase.ts).
 *
 * Koristi se isključivo za zakazivanje termina, i to samo kroz dve RPC
 * funkcije — `get_available_slots` i `create_booking`. Tabele `bookings`,
 * `booking_blocks` i `booking_settings` su pod RLS-om i anon ključ ih ne vidi,
 * tako da tuđe ime i telefon nikada ne stižu do browsera.
 */
/* Zakazivanje živi u svom Supabase projektu, odvojeno od portala/SEO panela.
   Ako VITE_BOOKING_* nisu podešeni, pada nazad na glavni projekat. */
const supabaseUrl =
  import.meta.env.VITE_BOOKING_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_BOOKING_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const bookingSupabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const isBookingConfigured = Boolean(supabaseUrl && supabaseAnonKey);
