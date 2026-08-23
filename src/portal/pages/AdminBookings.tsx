import { useState, useEffect, useCallback, useMemo } from 'react';
import { bookingSupabase } from '../../lib/supabaseClient';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, Calendar, Phone, Mail, Ban, Trash2, Save, RefreshCw } from 'lucide-react';
import '../portal.css';

/**
 * Termini žive u zasebnom Supabase projektu (VITE_BOOKING_*), ne u onom koji
 * koristi ostatak portala — zato ovde ide booking klijent, a ne `../lib/supabase`.
 * Netipiziran je, pa se koristi direktno.
 */
const db = bookingSupabase as unknown as {
  from: (table: string) => any;
};

interface Booking {
  id: string;
  slot_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  note: string | null;
  status: 'confirmed' | 'cancelled' | 'done';
  source: string | null;
  created_at: string;
}

interface BookingBlock {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
}

interface Settings {
  weekday_start: number;
  weekday_end: number;
  start_hour: number;
  end_hour: number;
  slot_minutes: number;
  lead_time_hours: number;
  days_ahead: number;
  timezone: string;
}

const TZ = 'Europe/Belgrade';
const DAYS = ['', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

function fmt(iso: string) {
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

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocks, setBlocks] = useState<BookingBlock[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'cancelled'>('upcoming');
  const [newBlock, setNewBlock] = useState({ date: '', from: '09:00', to: '17:00', reason: '' });

  const fetchAll = useCallback(async () => {
    if (!bookingSupabase) { setLoading(false); return; }
    setLoading(true);
    const [{ data: b }, { data: bl }, { data: st }] = await Promise.all([
      db.from('bookings').select('*').order('slot_at', { ascending: true }),
      db.from('booking_blocks').select('*').order('starts_at', { ascending: true }),
      db.from('booking_settings').select('*').eq('id', 1).single(),
    ]);
    setBookings((b as Booking[]) || []);
    setBlocks((bl as BookingBlock[]) || []);
    if (st) setSettings(st as Settings);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const visible = useMemo(() => {
    const now = Date.now();
    if (filter === 'cancelled') return bookings.filter(b => b.status === 'cancelled');
    if (filter === 'upcoming') {
      return bookings.filter(b => b.status !== 'cancelled' && new Date(b.slot_at).getTime() >= now);
    }
    return bookings;
  }, [bookings, filter]);

  const setStatus = async (id: string, status: Booking['status']) => {
    await db.from('bookings').update({ status }).eq('id', id);
    fetchAll();
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await db
      .from('booking_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    setSavedMsg(error ? 'Greška pri čuvanju.' : 'Sačuvano.');
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const addBlock = async () => {
    if (!newBlock.date) return;
    const starts = new Date(`${newBlock.date}T${newBlock.from}:00`);
    const ends = new Date(`${newBlock.date}T${newBlock.to}:00`);
    if (ends <= starts) return;
    await db.from('booking_blocks').insert({
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      reason: newBlock.reason || null,
    });
    setNewBlock({ date: '', from: '09:00', to: '17:00', reason: '' });
    fetchAll();
  };

  const removeBlock = async (id: string) => {
    await db.from('booking_blocks').delete().eq('id', id);
    fetchAll();
  };

  if (loading) {
    return (
      <div className="portal-page">
        <Topbar title="Termini" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  const num = (v: string) => Math.max(0, parseInt(v || '0', 10));

  return (
    <div className="portal-page">
      <Topbar title="Termini" />

      <div className="p-4 md:p-6 space-y-6 max-w-5xl">

        {/* ── Rezervacije ───────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              Rezervacije
            </h2>
            <div className="flex items-center gap-2">
              {(['upcoming', 'all', 'cancelled'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    filter === f ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'upcoming' ? 'Predstojeći' : f === 'all' ? 'Svi' : 'Otkazani'}
                </button>
              ))}
              <button onClick={fetchAll} className="p-2 rounded-full hover:bg-gray-100" title="Osveži">
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-500 text-sm">Nema termina za prikaz.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map(b => (
                <li key={b.id} className="px-4 md:px-6 py-4 flex flex-wrap items-center gap-3">
                  <div className="min-w-[150px]">
                    <p className="font-semibold text-gray-900 text-sm">{fmt(b.slot_at)}</p>
                    <p className="text-xs text-gray-500">
                      {b.status === 'confirmed' ? 'Potvrđen' : b.status === 'done' ? 'Obavljen' : 'Otkazan'}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-medium text-gray-900 text-sm">{b.first_name} {b.last_name}</p>
                    <p className="text-xs text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 hover:text-violet-600">
                        <Phone className="w-3 h-3" />{b.phone}
                      </a>
                      {b.email && (
                        <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1 hover:text-violet-600">
                          <Mail className="w-3 h-3" />{b.email}
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status !== 'done' && (
                      <button
                        onClick={() => setStatus(b.id, 'done')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Obavljen
                      </button>
                    )}
                    {b.status !== 'cancelled' ? (
                      <button
                        onClick={() => setStatus(b.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Otkaži
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(b.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Vrati
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Radno vreme ───────────────────────────────────────── */}
        {settings && (
          <section className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
            <h2 className="font-bold text-gray-900 mb-4">Radno vreme</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Od dana</span>
                <select
                  value={settings.weekday_start}
                  onChange={e => setSettings({ ...settings, weekday_start: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{DAYS[d]}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Do dana</span>
                <select
                  value={settings.weekday_end}
                  onChange={e => setSettings({ ...settings, weekday_end: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{DAYS[d]}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Trajanje termina</span>
                <select
                  value={settings.slot_minutes}
                  onChange={e => setSettings({ ...settings, slot_minutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                >
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Prvi termin (sat)</span>
                <input
                  type="number" min={0} max={23}
                  value={settings.start_hour}
                  onChange={e => setSettings({ ...settings, start_hour: num(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Kraj (sat, 24 = ponoć)</span>
                <input
                  type="number" min={1} max={24}
                  value={settings.end_hour}
                  onChange={e => setSettings({ ...settings, end_hour: num(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Najranije za (h)</span>
                <input
                  type="number" min={0} max={72}
                  value={settings.lead_time_hours}
                  onChange={e => setSettings({ ...settings, lead_time_hours: num(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600 mb-1">Prikaži dana unapred</span>
                <input
                  type="number" min={1} max={90}
                  value={settings.days_ahead}
                  onChange={e => setSettings({ ...settings, days_ahead: num(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                />
              </label>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sačuvaj
              </button>
              {savedMsg && <span className="text-sm text-gray-600">{savedMsg}</span>}
            </div>
          </section>
        )}

        {/* ── Blokirani periodi ─────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Ban className="w-4 h-4 text-violet-600" />
            Blokirani periodi
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Odmor, zauzet dan ili pauza — ti termini se ne prikazuju na sajtu.
          </p>

          <div className="flex flex-wrap items-end gap-3 mb-5">
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">Datum</span>
              <input
                type="date"
                value={newBlock.date}
                onChange={e => setNewBlock({ ...newBlock, date: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">Od</span>
              <input
                type="time"
                value={newBlock.from}
                onChange={e => setNewBlock({ ...newBlock, from: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1">Do</span>
              <input
                type="time"
                value={newBlock.to}
                onChange={e => setNewBlock({ ...newBlock, to: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </label>
            <label className="text-sm flex-1 min-w-[140px]">
              <span className="block text-gray-600 mb-1">Razlog (opciono)</span>
              <input
                type="text"
                value={newBlock.reason}
                onChange={e => setNewBlock({ ...newBlock, reason: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </label>
            <button
              onClick={addBlock}
              className="px-5 py-2.5 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800"
            >
              Blokiraj
            </button>
          </div>

          {blocks.length === 0 ? (
            <p className="text-sm text-gray-500">Nema blokiranih perioda.</p>
          ) : (
            <ul className="divide-y divide-gray-100 border-t border-gray-100">
              {blocks.map(bl => (
                <li key={bl.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-900">{fmt(bl.starts_at)} — {fmt(bl.ends_at)}</p>
                    {bl.reason && <p className="text-xs text-gray-500">{bl.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeBlock(bl.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-red-600"
                    title="Ukloni"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
