import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, Clock } from 'lucide-react';
import { bookingSupabase } from '../../lib/supabaseClient';
import type { Language } from '../../types/language';

interface Slot {
  slot_at: string;
  is_free: boolean;
}

interface BookingCalendarProps {
  language: Language;
  /** Pozvano posle uspešne rezervacije — koristi se za HubSpot lead + redirect. */
  onBooked: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    slotAt: string;
  }) => void | Promise<void>;
  /** Klik na dan u plutajućem widgetu — bira prvi sledeći takav dan.
      `nonce` se menja pri svakom kliku da bi i isti dan ponovo okinuo efekat. */
  preselectWeekday?: { isoDow: number; nonce: number } | null;
  /** Boja se poklapa sa stranicom na kojoj kalendar stoji. */
  accent?: 'pink' | 'cyan';
}

/* Tailwind ne ume da izvede klase u runtime-u, pa idu kao pune vrednosti. */
const ACCENTS = {
  pink: {
    spinner: 'border-pink-500',
    dayActive: 'bg-pink-600 border-pink-500 text-white',
    dayHover: 'md:hover:border-pink-500/50',
    banner: 'bg-pink-500/10 border-pink-500/30',
    bannerIcon: 'text-pink-400',
    bannerTime: 'text-pink-300',
    ring: 'focus:ring-pink-500',
    submit: 'bg-pink-600 md:hover:bg-pink-500 active:bg-pink-700 shadow-[0_2px_16px_rgba(236,72,153,0.4)]',
    slotHover: 'md:hover:bg-pink-600 md:hover:border-pink-500 active:bg-pink-700',
  },
  cyan: {
    spinner: 'border-cyan-400',
    dayActive: 'bg-cyan-500 border-cyan-400 text-white',
    dayHover: 'md:hover:border-cyan-400/50',
    banner: 'bg-cyan-500/10 border-cyan-400/30',
    bannerIcon: 'text-cyan-400',
    bannerTime: 'text-cyan-300',
    ring: 'focus:ring-cyan-400',
    submit: 'bg-cyan-500 md:hover:bg-cyan-400 active:bg-cyan-600 shadow-[0_2px_16px_rgba(34,211,238,0.4)]',
    slotHover: 'md:hover:bg-cyan-500 md:hover:border-cyan-400 active:bg-cyan-600',
  },
} as const;

const TZ = 'Europe/Belgrade';

const DAY_SHORT_SR = ['NED', 'PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB'];
const DAY_SHORT_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_SR = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Datum u beogradskoj zoni kao 'YYYY-MM-DD', nezavisno od zone posetioca. */
function belgradeDayKey(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Termin ispisan za čoveka, u beogradskoj zoni — ide u mejl i u HubSpot. */
export function formatBookingSlot(iso: string): string {
  return new Intl.DateTimeFormat('sr-Latn', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

function belgradeTime(iso: string): string {
  return new Intl.DateTimeFormat('sr-RS', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

export function BookingCalendar({ language, onBooked, preselectWeekday, accent = 'pink' }: BookingCalendarProps) {
  const c = ACCENTS[accent];
  const sr = language === 'sr';

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'slot' | 'details' | 'done'>('slot');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });

  const daysRowRef = useRef<HTMLDivElement>(null);

  /* ── Učitavanje slobodnih termina ─────────────────────────────────────── */
  const loadSlots = async () => {
    if (!bookingSupabase) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await bookingSupabase.rpc('get_available_slots');
    if (error || !data) {
      setLoadError(true);
    } else {
      setLoadError(false);
      setSlots(data as Slot[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Grupisanje po danima ─────────────────────────────────────────────── */
  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = belgradeDayKey(s.slot_at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return [...map.entries()]
      .map(([key, daySlots]) => ({
        key,
        slots: daySlots,
        freeCount: daySlots.filter((s) => s.is_free).length,
      }))
      .filter((d) => d.freeCount > 0);
  }, [slots]);

  /* Prvi dan sa slobodnim terminom je podrazumevano izabran. */
  useEffect(() => {
    if (!selectedDay && days.length > 0) setSelectedDay(days[0].key);
  }, [days, selectedDay]);

  /* Widget je poslao dan u nedelji — skoči na prvi sledeći takav datum. */
  useEffect(() => {
    if (!preselectWeekday || days.length === 0) return;
    const isoDowOf = (key: string) => {
      const [y, m, d] = key.split('-').map(Number);
      const js = new Date(y, m - 1, d).getDay();
      return js === 0 ? 7 : js;
    };
    const match = days.find((d) => isoDowOf(d.key) === preselectWeekday.isoDow);
    if (match) {
      setSelectedDay(match.key);
      setStep('slot');
      setSelectedSlot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectWeekday?.nonce, days]);

  const activeDay = days.find((d) => d.key === selectedDay) ?? null;

  const dayLabel = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const names = sr ? DAY_SHORT_SR : DAY_SHORT_EN;
    const months = sr ? MONTH_SR : MONTH_EN;
    return { dow: names[date.getDay()], day: d, month: months[m - 1] };
  };

  const handlePickSlot = (slotAt: string) => {
    setSelectedSlot(slotAt);
    setStep('details');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) return;
    if (!selectedSlot || !bookingSupabase) return;

    setSubmitting(true);
    setFormError(null);

    const { error } = await bookingSupabase.rpc('create_booking', {
      p_slot_at: selectedSlot,
      p_first_name: form.firstName,
      p_last_name: form.lastName,
      p_phone: form.phone,
      p_email: form.email || null,
    });

    if (error) {
      const taken = /zauzet|unique/i.test(error.message);
      setFormError(
        taken
          ? sr
            ? 'Neko je upravo zauzeo ovaj termin. Izaberite drugi.'
            : 'That slot was just taken. Please pick another one.'
          : sr
            ? 'Došlo je do greške. Pokušajte ponovo ili nas pozovite.'
            : 'Something went wrong. Please try again or call us.'
      );
      setSubmitting(false);
      if (taken) {
        await loadSlots();
        setStep('slot');
        setSelectedSlot(null);
      }
      return;
    }

    setStep('done');
    setSubmitting(false);
    await onBooked({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      slotAt: selectedSlot,
    });
  };

  /* ── Stanja bez kalendara ─────────────────────────────────────────────── */
  if (loadError) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-5 text-center">
        <p className="text-gray-300 text-sm mb-1">
          {sr ? 'Kalendar trenutno nije dostupan.' : 'The calendar is unavailable right now.'}
        </p>
        <p className="text-gray-500 text-xs">
          {sr ? 'Pozovite nas i dogovaramo termin odmah.' : 'Call us and we will arrange a time.'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className={`w-7 h-7 border-2 ${c.spinner} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">
          {sr ? 'Termin je rezervisan!' : 'Your slot is booked!'}
        </h3>
        {selectedSlot && (
          <p className={`${c.bannerTime} font-semibold text-sm mb-1.5`}>
            {(() => {
              const l = dayLabel(belgradeDayKey(selectedSlot));
              return `${l.dow} ${l.day}. ${l.month} · ${belgradeTime(selectedSlot)}`;
            })()}
          </p>
        )}
        <p className="text-gray-400 text-sm">
          {sr ? 'Zovemo vas u zakazano vreme.' : 'We will call you at the scheduled time.'}
        </p>
      </div>
    );
  }

  /* ── Korak 2: podaci ──────────────────────────────────────────────────── */
  if (step === 'details' && selectedSlot) {
    const l = dayLabel(belgradeDayKey(selectedSlot));
    const inputClass = (invalid: boolean) =>
      `w-full px-3.5 py-3 rounded-lg bg-gray-800/60 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition-all ${
        invalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'
      }`;

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <button
          type="button"
          onClick={() => { setStep('slot'); setFormError(null); }}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {sr ? 'Promeni termin' : 'Change slot'}
        </button>

        <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg border ${c.banner}`}>
          <Calendar className={`w-4 h-4 ${c.bannerIcon} flex-shrink-0`} />
          <p className="text-white text-sm font-semibold">
            {l.dow} {l.day}. {l.month}
            <span className={c.bannerTime}> · {belgradeTime(selectedSlot)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder={sr ? 'Ime' : 'First name'}
            className={inputClass(triedSubmit && !form.firstName.trim())}
          />
          <input
            type="text"
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder={sr ? 'Prezime' : 'Last name'}
            className={inputClass(triedSubmit && !form.lastName.trim())}
          />
        </div>

        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder={sr ? 'Broj telefona' : 'Phone number'}
          className={inputClass(triedSubmit && !form.phone.trim())}
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={sr ? 'Email (opciono)' : 'Email (optional)'}
          className={inputClass(false)}
        />

        {triedSubmit && (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) && (
          <p className="text-red-400 text-xs">
            {sr ? 'Ime, prezime i telefon su obavezni.' : 'First name, last name and phone are required.'}
          </p>
        )}
        {formError && <p className="text-red-400 text-xs">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3.5 px-5 rounded-xl text-white font-semibold text-sm md:text-base transition-colors flex items-center justify-center gap-2 touch-manipulation disabled:opacity-70 ${c.submit}`}
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {sr ? 'Potvrdi termin' : 'Confirm booking'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-gray-500 text-[11px]">
          {sr ? (
            <>Vaši podaci su zaštićeni · <a href="/privacy" className="underline underline-offset-2 hover:text-gray-400">Politika privatnosti</a></>
          ) : (
            <>Your data is protected · <a href="/privacy" className="underline underline-offset-2 hover:text-gray-400">Privacy Policy</a></>
          )}
        </p>
      </form>
    );
  }

  /* ── Korak 1: izbor termina ───────────────────────────────────────────── */
  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-5 text-center">
        <p className="text-gray-300 text-sm mb-1">
          {sr ? 'Trenutno nema slobodnih termina.' : 'No free slots at the moment.'}
        </p>
        <p className="text-gray-500 text-xs">
          {sr ? 'Pozovite nas i naći ćemo vreme.' : 'Call us and we will find a time.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Dani — horizontalni scroll na telefonu */}
      <div
        ref={daysRowRef}
        className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {days.map((d) => {
          const l = dayLabel(d.key);
          const active = d.key === selectedDay;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDay(d.key)}
              className={`snap-start flex-shrink-0 w-[62px] py-2 rounded-xl border text-center transition-colors touch-manipulation ${
                active
                  ? c.dayActive
                  : `bg-white/5 border-white/10 text-gray-400 ${c.dayHover} md:hover:text-white`
              }`}
            >
              <span className="block text-[9px] font-bold uppercase tracking-wide leading-none mb-1">
                {l.dow}
              </span>
              <span className="block text-lg font-bold leading-none">{l.day}</span>
              <span className="block text-[9px] leading-none mt-1 opacity-80">{l.month}</span>
            </button>
          );
        })}
      </div>

      {/* Termini */}
      <div className="mt-3.5">
        <p className="flex items-center gap-1.5 text-gray-400 text-[11px] uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5" />
          {sr ? 'Izaberite vreme' : 'Pick a time'}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 md:max-h-[210px] md:overflow-y-auto md:pr-0.5">
          {activeDay?.slots.map((s) => (
            <button
              key={s.slot_at}
              type="button"
              disabled={!s.is_free}
              onClick={() => handlePickSlot(s.slot_at)}
              className={`py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-colors touch-manipulation ${
                s.is_free
                  ? `bg-white/5 border-white/10 text-gray-200 md:hover:text-white ${c.slotHover}`
                  : 'bg-transparent border-white/5 text-gray-600 line-through cursor-not-allowed'
              }`}
            >
              {belgradeTime(s.slot_at)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
