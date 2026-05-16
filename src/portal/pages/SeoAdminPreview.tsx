import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeoProject } from '../hooks/useSeoProject';
import { Loader2, ArrowLeft, RefreshCw, Save, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Trash2, Plus, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { SeoMetrics, GscDailyPoint, GscQueryResponse } from '../lib/types';
import { getSeoPlanDisplay } from '../lib/seoPlans';
import {
  C, SeoMultiChart, MetricCard, KeywordRow, TaskTimeline,
  ProgressRing, ChartToggle, DateRangeTab,
} from './SeoClientDashboard';
import type { ChartMetric, DateRange } from './SeoClientDashboard';
import '../portal.css';

const dateRangeLabels: Record<DateRange, string> = { '3d': '3 dana', '28d': '28 dana', '3m': '3 mes.', '6m': '6 mes.', 'all': 'Sve' };

const toastOk = (msg: string) => toast.success(msg, {
  style: { fontSize: 13, borderRadius: 8, background: '#1a2030', color: '#fff', padding: '10px 16px' },
  iconTheme: { primary: '#00bcd4', secondary: '#fff' },
  duration: 2000,
});
const toastErr = (msg: string) => toast.error(msg, {
  style: { fontSize: 13, borderRadius: 8, background: '#1a2030', color: '#fff', padding: '10px 16px' },
  duration: 3000,
});

// ── Main admin preview page ─────────────────────────────────────────────────
export function SeoAdminPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, alerts, loading } = useSeoProject(id);

  // Chart state (same as client)
  const [chartMetrics, setChartMetrics] = useState<ChartMetric[]>(['visits', 'impressions', 'ctr']);
  const [dateRange, setDateRange] = useState<DateRange>('all');

  // Draft data for editing (all days, not filtered by range)
  const [allDraft, setAllDraft] = useState<GscDailyPoint[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // New day form
  const [newDay, setNewDay] = useState({ date: '', clicks: 0, impressions: 0, ctr: 0, position: 0 });

  // Load existing seo_gsc_daily from DB
  useEffect(() => {
    if (!id) return;
    setLoadingDaily(true);
    supabase
      .from('seo_gsc_daily')
      .select('*')
      .eq('seo_project_id', id)
      .order('date', { ascending: true })
      .then(({ data }) => {
        const days: GscDailyPoint[] = (data || []).map((d: any) => ({
          date: d.date,
          clicks: d.clicks,
          impressions: d.impressions,
          ctr: d.ctr,
          position: d.position,
        }));
        setAllDraft(days);
        setLoadingDaily(false);
      });
  }, [id]);

  // Filter draft by selected date range
  const filteredDraft = (() => {
    if (dateRange === 'all') return allDraft;
    const rangeDays: Record<string, number> = { '3d': 3, '28d': 28, '3m': 90, '6m': 180 };
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (rangeDays[dateRange] || 28));
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return allDraft.filter(d => d.date >= cutoffStr);
  })();

  // Map filtered draft to SeoMetrics shape for the chart
  const chartData: SeoMetrics[] = filteredDraft.map(d => ({
    id: '', seo_project_id: '', created_at: '',
    month: d.date,
    organic_visits: d.clicks,
    clicks: d.clicks,
    impressions: d.impressions,
    ctr: d.ctr,
    avg_position: d.position,
    new_backlinks: 0, total_backlinks: 0,
    is_gsc_synced: true,
  }));

  // Sync from GSC — incremental (only fetches missing days); chunked for first-time pulls
  const handleSyncGsc = async () => {
    if (!seoProject) return;
    setSyncing(true);
    try {
      const pad = (n: number) => String(n).padStart(2, '0');
      const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      // GSC ima ~3 dana kašnjenja
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 3);
      const endStr = fmt(endDate);

      // Određivanje startDate: dan posle poslednjeg postojećeg, ili 480 dana unazad ako je prazno
      let startStr: string;
      if (allDraft.length > 0) {
        const lastDate = allDraft[allDraft.length - 1].date;
        const next = new Date(lastDate + 'T00:00:00');
        next.setDate(next.getDate() + 1);
        startStr = fmt(next);
      } else {
        const start = new Date(endDate);
        start.setDate(start.getDate() - 479);
        startStr = fmt(start);
      }

      if (startStr > endStr) {
        toastOk('Već je sve sinhronizovano');
        setSyncing(false);
        return;
      }

      // Razdvajanje u chunk-ove od ~90 dana (svaki chunk staje u par sekundi)
      const CHUNK_DAYS = 90;
      const chunks: Array<{ startDate: string; endDate: string }> = [];
      let cursor = new Date(startStr + 'T00:00:00');
      const finalEnd = new Date(endStr + 'T00:00:00');
      while (cursor <= finalEnd) {
        const chunkEnd = new Date(cursor);
        chunkEnd.setDate(chunkEnd.getDate() + CHUNK_DAYS - 1);
        if (chunkEnd > finalEnd) chunkEnd.setTime(finalEnd.getTime());
        chunks.push({ startDate: fmt(cursor), endDate: fmt(chunkEnd) });
        cursor = new Date(chunkEnd);
        cursor.setDate(cursor.getDate() + 1);
      }

      // Paralelni pozivi — svaki je nezavisan, traje 2-5s
      const results = await Promise.all(
        chunks.map(c =>
          fetch('/api/gsc-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seo_project_id: seoProject.id, ...c }),
          }).then(async r => {
            if (!r.ok) throw new Error(`GSC ${r.status}`);
            return (await r.json()) as GscQueryResponse;
          })
        )
      );

      const newDays = results.flatMap(r => r.days || []);

      setAllDraft(prev => {
        const map = new Map(prev.map(d => [d.date, d]));
        newDays.forEach(d => map.set(d.date, d));
        return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
      });
      setHasChanges(true);
      toastOk(`Povučeno ${newDays.length} dana iz GSC`);
    } catch {
      toastErr('Greška pri sinhronizaciji sa GSC');
    }
    setSyncing(false);
  };

  // Save all draft data to DB
  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      // Delete existing, then insert all (cleanest for bulk override)
      await supabase.from('seo_gsc_daily').delete().eq('seo_project_id', id);

      if (allDraft.length > 0) {
        const rows = allDraft.map(d => ({
          seo_project_id: id!,
          date: d.date,
          clicks: d.clicks,
          impressions: d.impressions,
          ctr: d.ctr,
          position: d.position,
        }));
        // Insert in batches of 200
        for (let i = 0; i < rows.length; i += 200) {
          const { error } = await supabase.from('seo_gsc_daily').insert(rows.slice(i, i + 200) as any);
          if (error) throw error;
        }
      }
      setHasChanges(false);
      toastOk('Podaci sačuvani — klijent sada vidi ažurirano');
    } catch {
      toastErr('Greška pri čuvanju podataka');
    }
    setSaving(false);
  };

  // Edit a single day value
  const handleEditDay = (date: string, field: keyof GscDailyPoint, value: number) => {
    setAllDraft(prev => prev.map(d =>
      d.date === date ? { ...d, [field]: value } : d
    ));
    setHasChanges(true);
  };

  // Delete a day
  const handleDeleteDay = (date: string) => {
    setAllDraft(prev => prev.filter(d => d.date !== date));
    setHasChanges(true);
  };

  // Add a new day
  const handleAddDay = () => {
    if (!newDay.date) return;
    if (allDraft.some(d => d.date === newDay.date)) {
      toastErr('Taj datum već postoji');
      return;
    }
    setAllDraft(prev => [...prev, { ...newDay }].sort((a, b) => a.date.localeCompare(b.date)));
    setNewDay({ date: '', clicks: 0, impressions: 0, ctr: 0, position: 0 });
    setHasChanges(true);
  };

  const toggleMetric = (m: ChartMetric) => {
    setChartMetrics(prev =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
    );
  };

  if (loading || loadingDaily) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.cyan }} />
      </div>
    );
  }

  if (!seoProject) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: C.text3, fontSize: 14 }}>Projekat nije pronađen.</p>
        <button onClick={() => navigate(`/portal/admin/seo`)} style={{ marginTop: 12, color: C.cyan, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Nazad na SEO projekte
        </button>
      </div>
    );
  }

  // Same deltas as client
  const lastUpdate = latestMetrics
    ? new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' })
    : null;
  const renewalDate = seoProject.renewal_date
    ? new Date(seoProject.renewal_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const card: React.CSSProperties = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 };
  const cardTitle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.text3, marginBottom: 16 };

  const topInTop10 = keywords.filter(k => k.current_position != null && k.current_position <= 10).length;

  const visitsDelta = latestMetrics && previousMetrics && previousMetrics.organic_visits > 0
    ? Math.round(((latestMetrics.organic_visits - previousMetrics.organic_visits) / previousMetrics.organic_visits) * 100)
    : null;
  const posDelta = latestMetrics?.avg_position != null && previousMetrics?.avg_position != null
    ? +(previousMetrics.avg_position - latestMetrics.avg_position).toFixed(1)
    : null;
  const planDisplay = getSeoPlanDisplay(seoProject.package_name, seoProject.package_price);

  const hasDailyData = filteredDraft.length > 0;
  const filteredMetricsHistory = (() => {
    if (dateRange === 'all') return metricsHistory;
    const rangeDays: Record<string, number> = { '3d': 3, '28d': 28, '3m': 90, '6m': 180 };
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (rangeDays[dateRange] || 28));
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return metricsHistory.filter(m => m.month >= cutoffStr);
  })();
  const chartLabel = dateRange === 'all'
    ? `poslednjih ${filteredDraft.length > 0 ? filteredDraft.length + ' dana' : metricsHistory.length + ' meseci'}`
    : `poslednjih ${dateRangeLabels[dateRange]}`;

  // Fallback chart data: use monthly metrics (filtered) if no daily data
  const effectiveChartData = hasDailyData ? chartData : filteredMetricsHistory;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '4px 6px', fontSize: 11, border: `1px solid ${C.border}`,
    borderRadius: 4, background: '#fff', outline: 'none', textAlign: 'right',
  };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <Toaster position="top-center" />

      {/* ── Admin Toolbar ── */}
      <div style={{
        height: 48, padding: '0 20px', background: '#1a1f4e', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(`/portal/admin/seo/${id}`)}
            style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <ArrowLeft size={14} /> Nazad
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>
              Klijent pregled — {seoProject.domain}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleSyncGsc} disabled={syncing || !seoProject.gsc_property_id}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', fontSize: 11,
              fontWeight: 500, borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer',
              opacity: syncing || !seoProject.gsc_property_id ? 0.4 : 1,
            }}>
            {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Povuci iz GSC
          </button>
          <button onClick={handleSave} disabled={saving || !hasChanges}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 11,
              fontWeight: 600, borderRadius: 6, border: 'none',
              background: hasChanges ? C.cyan : 'rgba(255,255,255,0.1)',
              color: hasChanges ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer',
              opacity: saving ? 0.5 : 1,
            }}>
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Sačuvaj
          </button>
        </div>
      </div>

      {/* ── Client Dashboard Preview (exact replica) ── */}
      <div style={{ border: `2px dashed ${C.cyanBorder}`, margin: 8, borderRadius: 12, position: 'relative' }}>
        {/* Preview badge */}
        <div style={{
          position: 'absolute', top: -10, left: 20, background: C.cyan,
          color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 10px',
          borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 1,
        }}>
          Preview — ovo vidi klijent
        </div>

        {/* Same topbar as client */}
        <div style={{ height: 54, padding: '0 24px', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderRadius: '10px 10px 0 0' }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.text }}>SEO Dashboard</h1>
            {lastUpdate && <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>Poslednje ažuriranje: {lastUpdate}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: C.green, background: C.greenLight, border: '1px solid #a7e8d3', padding: '4px 10px', borderRadius: 99 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} className="animate-pulse" />
              Aktivan
            </div>
          </div>
        </div>

        <main style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Project info */}
          <div style={{ ...card, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: C.cyanLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ExternalLink size={13} style={{ color: C.cyan }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: C.text }}>{seoProject.domain}</p>
                {planDisplay && (
                  <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>
                    {planDisplay}
                  </p>
                )}
              </div>
            </div>
            <span style={{ fontSize: 10, color: C.text3 }}>Poseti sajt →</span>
          </div>

          {/* 4 metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            <MetricCard label="Organski poseti" accent={C.cyan} delay={0}
              numericValue={latestMetrics?.organic_visits ?? 0}
              delta={visitsDelta != null ? `${visitsDelta > 0 ? '+' : ''}${visitsDelta}% vs prošli mesec` : 'Nema podataka'}
              deltaType={visitsDelta == null ? 'neutral' : visitsDelta > 0 ? 'up' : 'down'} />
            <MetricCard label="Prosečna pozicija" accent={C.green} delay={0}
              displayValue={latestMetrics?.avg_position != null ? latestMetrics.avg_position.toFixed(1) : '—'}
              delta={posDelta != null ? (posDelta > 0 ? `poboljšanje za ${posDelta}` : `pad za ${Math.abs(posDelta)}`) : 'Nema podataka'}
              deltaType={posDelta == null ? 'neutral' : posDelta > 0 ? 'up' : 'down'} />
            <MetricCard label="Praćeni keywords" accent={C.purple} delay={0}
              numericValue={keywords.length}
              delta={`${topInTop10} u top 10`}
              deltaType="up" />
            <MetricCard label="Novi backlinks" accent={C.amber} delay={0}
              displayValue={latestMetrics ? `+${latestMetrics.new_backlinks}` : '—'}
              delta={latestMetrics ? `${latestMetrics.total_backlinks} ukupno` : 'Nema podataka'}
              deltaType={latestMetrics && latestMetrics.new_backlinks > 0 ? 'up' : 'neutral'} />
          </div>

          {/* Chart */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
              <p style={cardTitle}>Pregled performansi — {chartLabel}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <ChartToggle label="Posete" color={C.cyan} active={chartMetrics.includes('visits')} onClick={() => toggleMetric('visits')} />
                <ChartToggle label="Impresije" color={C.purple} active={chartMetrics.includes('impressions')} onClick={() => toggleMetric('impressions')} />
                <ChartToggle label="CTR" color="#f59e0b" active={chartMetrics.includes('ctr')} onClick={() => toggleMetric('ctr')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 10, background: '#f7f8fa', borderRadius: 8, padding: 2, width: 'fit-content' }}>
              {(['3d', '28d', '3m', '6m', 'all'] as DateRange[]).map(r => (
                <DateRangeTab key={r} value={r} active={dateRange === r} onClick={() => setDateRange(r)} />
              ))}
            </div>
            {effectiveChartData.length === 0 ? (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 12, color: C.text3 }}>Nema podataka za grafikon</p>
                <p style={{ fontSize: 11, color: C.text3 }}>Kliknite "Povuci iz GSC" da sinhronizujete podatke</p>
              </div>
            ) : (
              <SeoMultiChart data={effectiveChartData} active={chartMetrics} rangeKey={dateRange} />
            )}
            {/* Chart summary */}
            {effectiveChartData.length >= 1 && (() => {
              const totalVisits = effectiveChartData.reduce((s, m) => s + m.organic_visits, 0);
              const totalImpressions = effectiveChartData.reduce((s, m) => s + m.impressions, 0);
              const avgCtr = effectiveChartData.length > 0 ? effectiveChartData.reduce((s, m) => s + (m.ctr ?? 0), 0) / effectiveChartData.length : 0;
              const summaryStyle: React.CSSProperties = { fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 };
              const valStyle = (c: string): React.CSSProperties => ({ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: c });
              return (
                <div style={{ display: 'flex', gap: 28, paddingTop: 14, borderTop: `1px solid ${C.border}`, marginTop: 8, flexWrap: 'wrap' }}>
                  <div>
                    <p style={summaryStyle}>Klikovi</p>
                    <p style={valStyle(C.cyan)}>{totalVisits.toLocaleString()}</p>
                  </div>
                  {totalImpressions > 0 && <div><p style={summaryStyle}>Impresije</p><p style={valStyle(C.purple)}>{totalImpressions.toLocaleString()}</p></div>}
                  {avgCtr > 0 && <div><p style={summaryStyle}>CTR (prosek)</p><p style={valStyle('#f59e0b')}>{(avgCtr * 100).toFixed(2)}%</p></div>}
                  <div>
                    <p style={summaryStyle}>Period</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: C.text2, marginTop: 2 }}>
                      {dateRangeLabels[dateRange]}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── Data Editor Toggle ── */}
          <button
            onClick={() => setShowEditor(!showEditor)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', padding: '10px 16px', fontSize: 12, fontWeight: 600,
              background: showEditor ? '#1a1f4e' : C.card, color: showEditor ? '#fff' : C.text2,
              border: `1px solid ${showEditor ? '#1a1f4e' : C.border}`, borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {showEditor ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showEditor ? 'Sakrij editor podataka' : `Prikaži editor podataka (${allDraft.length} dana)`}
          </button>

          {/* ── Data Editor ── */}
          {showEditor && (
            <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
              {/* Editor header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: '#f7f8fa', borderBottom: `1px solid ${C.border}`,
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>
                  Dnevni podaci — {dateRangeLabels[dateRange]} ({filteredDraft.length} dana)
                </p>
                <span style={{ fontSize: 10, color: C.text3 }}>
                  Ukupno u bazi: {allDraft.length} dana
                </span>
              </div>

              {/* Table */}
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: '#fafbfc', position: 'sticky', top: 0, zIndex: 1 }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: C.text3, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}>Datum</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: C.text3, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}>Klikovi</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: C.text3, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}>Impresije</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: C.text3, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}>CTR (%)</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: C.text3, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${C.border}` }}>Pozicija</th>
                      <th style={{ padding: '8px 12px', width: 36, borderBottom: `1px solid ${C.border}` }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDraft.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: 20, textAlign: 'center', color: C.text3, fontSize: 12 }}>
                          Nema podataka. Kliknite "Povuci iz GSC" ili dodajte ručno.
                        </td>
                      </tr>
                    )}
                    {filteredDraft.map(d => (
                      <tr key={d.date} style={{ borderBottom: `1px solid ${C.border}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                        <td style={{ padding: '6px 12px', fontWeight: 500, color: C.text2 }}>
                          {new Date(d.date + 'T00:00:00').toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <input type="number" defaultValue={d.clicks} key={`${d.date}-c-${d.clicks}`}
                            onBlur={e => handleEditDay(d.date, 'clicks', Number(e.target.value) || 0)}
                            style={inputStyle} />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <input type="number" defaultValue={d.impressions} key={`${d.date}-i-${d.impressions}`}
                            onBlur={e => handleEditDay(d.date, 'impressions', Number(e.target.value) || 0)}
                            style={inputStyle} />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <input type="number" step="0.01" defaultValue={+(d.ctr * 100).toFixed(2)} key={`${d.date}-ctr-${d.ctr}`}
                            onBlur={e => handleEditDay(d.date, 'ctr', (Number(e.target.value) || 0) / 100)}
                            style={inputStyle} />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <input type="number" step="0.1" defaultValue={+d.position.toFixed(1)} key={`${d.date}-p-${d.position}`}
                            onBlur={e => handleEditDay(d.date, 'position', Number(e.target.value) || 0)}
                            style={inputStyle} />
                        </td>
                        <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                          <button onClick={() => handleDeleteDay(d.date)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.text3, padding: 2 }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.red; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.text3; }}>
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add new day */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                background: '#f7f8fa', borderTop: `1px solid ${C.border}`,
              }}>
                <input type="date" value={newDay.date} onChange={e => setNewDay(p => ({ ...p, date: e.target.value }))}
                  style={{ ...inputStyle, textAlign: 'left', width: 130 }} />
                <input type="number" placeholder="Klikovi" value={newDay.clicks || ''} onChange={e => setNewDay(p => ({ ...p, clicks: Number(e.target.value) || 0 }))}
                  style={{ ...inputStyle, width: 80 }} />
                <input type="number" placeholder="Impresije" value={newDay.impressions || ''} onChange={e => setNewDay(p => ({ ...p, impressions: Number(e.target.value) || 0 }))}
                  style={{ ...inputStyle, width: 80 }} />
                <input type="number" step="0.01" placeholder="CTR %" value={newDay.ctr || ''} onChange={e => setNewDay(p => ({ ...p, ctr: (Number(e.target.value) || 0) / 100 }))}
                  style={{ ...inputStyle, width: 70 }} />
                <input type="number" step="0.1" placeholder="Poz." value={newDay.position || ''} onChange={e => setNewDay(p => ({ ...p, position: Number(e.target.value) || 0 }))}
                  style={{ ...inputStyle, width: 60 }} />
                <button onClick={handleAddDay}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 3, padding: '5px 10px', fontSize: 10,
                    fontWeight: 600, borderRadius: 4, border: 'none', background: C.cyan, color: '#fff', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>
                  <Plus size={11} /> Dodaj
                </button>
              </div>
            </div>
          )}

          {/* Keywords + Tasks (read-only preview) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={cardTitle}>Keywords — pozicije na Googlu</p>
                <span style={{ fontSize: 10, color: C.text3, flexShrink: 0 }}>{keywords.length} praćenih</span>
              </div>
              <div style={{ flex: 1, maxHeight: 340, overflowY: 'auto', marginRight: -6, paddingRight: 6 }}>
                {keywords.length > 0
                  ? keywords.map(kw => <KeywordRow key={kw.id} kw={kw} />)
                  : <p style={{ fontSize: 12, color: C.text3 }}>Nema praćenih ključnih reči</p>}
              </div>
            </div>

            <div style={card}>
              <p style={cardTitle}>Poslovi za ovaj mesec</p>
              {tasks.length > 0
                ? <TaskTimeline tasks={tasks} />
                : <p style={{ fontSize: 12, color: C.text3 }}>Nema zadataka za ovaj mesec</p>}
            </div>
          </div>

          {/* Progress + Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={card}>
              <p style={cardTitle}>Progress optimizacije</p>
              {progress.length > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: '10px 0' }}>
                  {progress.map(p => <ProgressRing key={p.id} item={p} />)}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: C.text3 }}>Nema kategorija napretka</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {alerts.length > 0 && (
                <div style={{ ...card, background: C.amberLight, border: '1px solid #f5d07a' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, lineHeight: 1.5, color: '#8a5700' }}>
                    <svg viewBox="0 0 14 14" fill="none" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }}>
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M7 4.5v2.8M7 9.2v.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    {alerts[0].message}
                  </div>
                </div>
              )}
              {renewalDate && (
                <div style={card}>
                  <p style={{ fontSize: 11, color: C.text3 }}>
                    Paket se obnavlja: <span style={{ color: C.text2, fontWeight: 500 }}>{renewalDate}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA (disabled preview) */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#eceef7,#e6f7fa)', border: `1px solid ${C.cyanBorder}`, borderRadius: 10, padding: '14px 18px', opacity: 0.6 }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,188,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={16} style={{ color: C.cyan }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: C.navy }}>Imate ključne reči ili sugestije za nas?</p>
              <p style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Pošaljite nam poruku — odgovorićemo u najkraćem roku</p>
            </div>
            <span style={{ fontSize: 16, color: C.cyan }}>→</span>
          </div>
        </main>
      </div>

      {/* Unsaved changes warning */}
      {hasChanges && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, background: '#1a1f4e', color: '#fff',
          padding: '10px 18px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)', fontSize: 12, zIndex: 100,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
          Imate nesačuvane promene
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '4px 12px', borderRadius: 5, border: 'none', background: C.cyan, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Čuva se…' : 'Sačuvaj'}
          </button>
        </div>
      )}
    </div>
  );
}
