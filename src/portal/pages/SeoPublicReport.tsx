import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import type { SeoProject, SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoAlert } from '../lib/types';
import { getSeoPlanDisplay } from '../lib/seoPlans';
import '../portal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

// ── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg: '#f8f9fa', card: '#ffffff', border: '#e3e7ee',
  navy: '#1a1f4e', cyan: '#00bcd4', cyanLight: '#e6f7fa', cyanBorder: '#b2e8f0',
  green: '#0faa6e', greenLight: '#e6f8f2',
  amber: '#e8970a', amberLight: '#fef6e4',
  red: '#e53e3e', redLight: '#fff0f0',
  purple: '#6c4fdb',
  text: '#1a2030', text2: '#5a6478', text3: '#9aa3b2',
  teal: '#1D9E75',
};

const colorMap: Record<string, string> = {
  cyan: C.cyan, green: C.green, amber: C.amber, purple: C.purple, red: C.red,
};

// ── Chart ───────────────────────────────────────────────────────────────────
function ReportChart({ data }: { data: SeoMetrics[] }) {
  if (data.length < 2) return <p style={{ fontSize: 12, color: C.text3, textAlign: 'center', padding: 40 }}>Nedovoljno podataka</p>;

  const labels = data.map(d => new Date(d.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'short', year: '2-digit' }));
  return (
    <div style={{ height: 200 }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Organski poseti', data: data.map(d => d.organic_visits),
              borderColor: C.teal, backgroundColor: 'rgba(29,158,117,0.08)', fill: true,
              tension: 0.35, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderColor: C.teal, pointBorderWidth: 2,
            },
            {
              label: 'GSC klikovi', data: data.map(d => d.clicks),
              borderColor: C.navy, backgroundColor: 'rgba(26,31,78,0.05)', fill: true,
              tension: 0.35, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderColor: C.navy, pointBorderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: true, position: 'top', labels: { font: { size: 11 }, boxWidth: 10, padding: 14, usePointStyle: true } },
            tooltip: { backgroundColor: '#1a2030', titleFont: { size: 11 }, bodyFont: { size: 11 }, padding: 8, cornerRadius: 6 },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, color: C.text3 } },
            y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, color: C.text3 }, beginAtZero: true },
          },
        }}
      />
    </div>
  );
}

// ── MetricCard ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, delta, deltaType, accent }: {
  label: string; value: string; delta: string; deltaType: 'up' | 'down' | 'neutral'; accent: string;
}) {
  const bg = deltaType === 'up' ? C.greenLight : deltaType === 'down' ? C.redLight : '#f7f8fa';
  const color = deltaType === 'up' ? C.green : deltaType === 'down' ? C.red : C.text3;
  const arrow = deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '—';
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${accent}`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.text3, marginBottom: 8 }}>{label}</p>
      <p style={{ fontWeight: 800, fontSize: 24, lineHeight: 1, color: C.text }}>{value}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: bg, color }}>
        {arrow} {delta}
      </span>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
export function SeoPublicReport() {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [project, setProject] = useState<SeoProject | null>(null);
  const [metrics, setMetrics] = useState<SeoMetrics[]>([]);
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [tasks, setTasks] = useState<SeoTask[]>([]);
  const [progress, setProgress] = useState<SeoProgress[]>([]);
  const [alerts, setAlerts] = useState<SeoAlert[]>([]);

  useEffect(() => {
    async function load() {
      if (!token) { setNotFound(true); setLoading(false); return; }

      // Token is the project id (can be extended to a secure hash later)
      const { data: proj } = await supabase.from('seo_projects').select('*').eq('id', token).single();
      if (!proj) { setNotFound(true); setLoading(false); return; }
      setProject(proj as SeoProject);

      const [{ data: m }, { data: k }, { data: t }, { data: p }, { data: a }] = await Promise.all([
        supabase.from('seo_metrics').select('*').eq('seo_project_id', token).order('month', { ascending: true }),
        supabase.from('seo_keywords').select('*').eq('seo_project_id', token).order('current_position', { ascending: true }),
        supabase.from('seo_tasks').select('*').eq('seo_project_id', token).order('position', { ascending: true }),
        supabase.from('seo_progress').select('*').eq('seo_project_id', token).order('position', { ascending: true }),
        supabase.from('seo_alerts').select('*').eq('seo_project_id', token).order('created_at', { ascending: false }),
      ]);
      setMetrics((m as SeoMetrics[]) || []);
      setKeywords((k as SeoKeyword[]) || []);
      setTasks((t as SeoTask[]) || []);
      setProgress((p as SeoProgress[]) || []);
      setAlerts((a as SeoAlert[]) || []);
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.cyan }} />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>Izveštaj nije pronađen</p>
          <p style={{ fontSize: 13, color: C.text3 }}>Link je istekao ili nevažeći.</p>
        </div>
      </div>
    );
  }

  const latest = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const prev = metrics.length > 1 ? metrics[metrics.length - 2] : null;

  const visitsDelta = latest && prev && prev.organic_visits > 0
    ? Math.round(((latest.organic_visits - prev.organic_visits) / prev.organic_visits) * 100) : null;
  const posDelta = latest?.avg_position != null && prev?.avg_position != null
    ? +(prev.avg_position - latest.avg_position).toFixed(1) : null;
  const lastUpdate = latest
    ? new Date(latest.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' }) : null;
  const planDisplay = getSeoPlanDisplay(project.package_name, project.package_price);

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 };
  const cardTitle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.text3, marginBottom: 16 };

  // Task config
  const taskCfg: Record<string, { dot: string; bg: string; border: string; tagBg: string; tagColor: string; label: string }> = {
    done:    { dot: C.green,  bg: '#f7f8fa',   border: C.border,     tagBg: C.greenLight, tagColor: C.green, label: 'Gotovo' },
    wip:     { dot: C.cyan,   bg: C.cyanLight, border: C.cyanBorder, tagBg: C.cyanLight, tagColor: C.cyan, label: 'U toku' },
    next:    { dot: C.text3,  bg: '#f7f8fa',   border: C.border,     tagBg: '#f7f8fa', tagColor: C.text3, label: 'Sledeće' },
    planned: { dot: C.text3,  bg: '#f7f8fa',   border: C.border,     tagBg: '#f7f8fa', tagColor: C.text3, label: 'Planirano' },
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>

      {/* Header bar */}
      <div style={{ height: 56, padding: '0 24px', background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/images/aisajt_providno-removebg-preview.png" alt="AiSajt" style={{ height: 26 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>SEO Izveštaj — {project.domain}</p>
            {lastUpdate && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Poslednje ažuriranje: {lastUpdate}</p>}
          </div>
        </div>
        {planDisplay && (
          <div style={{ fontSize: 11, color: '#fff', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 99 }}>
            {planDisplay}
          </div>
        )}
      </div>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <MetricCard label="Organski poseti" accent={C.teal}
            value={latest ? latest.organic_visits.toLocaleString() : '—'}
            delta={visitsDelta != null ? `${visitsDelta > 0 ? '+' : ''}${visitsDelta}% vs prošli mesec` : 'Nema podataka'}
            deltaType={visitsDelta == null ? 'neutral' : visitsDelta > 0 ? 'up' : 'down'} />
          <MetricCard label="Prosečna pozicija" accent={C.green}
            value={latest?.avg_position != null ? latest.avg_position.toFixed(1) : '—'}
            delta={posDelta != null ? (posDelta > 0 ? `poboljšanje za ${posDelta}` : `pad za ${Math.abs(posDelta)}`) : 'Nema podataka'}
            deltaType={posDelta == null ? 'neutral' : posDelta > 0 ? 'up' : 'down'} />
          <MetricCard label="Praćeni keywords" accent={C.purple}
            value={String(keywords.length)}
            delta={`${keywords.filter(k => k.current_position != null && k.current_position <= 10).length} u top 10`}
            deltaType="up" />
          <MetricCard label="Novi backlinks" accent={C.amber}
            value={latest ? `+${latest.new_backlinks}` : '—'}
            delta={latest ? `${latest.total_backlinks} ukupno` : 'Nema podataka'}
            deltaType={latest && latest.new_backlinks > 0 ? 'up' : 'neutral'} />
        </div>

        {/* Chart + Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>
          <div style={card}>
            <p style={cardTitle}>Saobraćaj kroz vreme</p>
            <ReportChart data={metrics} />
          </div>
          <div style={card}>
            <p style={cardTitle}>SEO napredak</p>
            {progress.length > 0 ? progress.map(p => {
              const clr = colorMap[p.color] || C.cyan;
              return (
                <div key={p.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: C.text2 }}>{p.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{p.percentage}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f7f8fa', borderRadius: 99, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${p.percentage}%`, background: clr, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            }) : <p style={{ fontSize: 12, color: C.text3 }}>Nema kategorija napretka</p>}

            {alerts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 8, fontSize: 11, lineHeight: 1.5, marginTop: 14, background: C.amberLight, border: '1px solid #f5d07a', color: '#8a5700' }}>
                ⚠️ {alerts[0].message}
              </div>
            )}
          </div>
        </div>

        {/* Keywords + Tasks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={cardTitle}>Keywords — pozicije na Googlu</p>
              <span style={{ fontSize: 10, color: C.text3 }}>{keywords.length} praćenih</span>
            </div>
            {keywords.length > 0 ? keywords.map(kw => {
              const pos = kw.current_position;
              const prev2 = kw.previous_position;
              const diff = pos != null && prev2 != null ? prev2 - pos : null;
              const posColor = pos == null ? C.text3 : pos <= 10 ? C.green : pos <= 20 ? C.amber : C.red;
              const trend = diff == null ? 'eq' : diff > 0 ? 'up' : diff < 0 ? 'dn' : 'eq';
              const tBg = trend === 'up' ? C.greenLight : trend === 'dn' ? C.redLight : '#f7f8fa';
              const tColor = trend === 'up' ? C.green : trend === 'dn' ? C.red : C.text3;
              const tLabel = trend === 'up' ? `↑ +${diff}` : trend === 'dn' ? `↓ ${Math.abs(diff!)}` : '—';
              return (
                <div key={kw.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ flex: 1, fontSize: 12, color: C.text2 }}>{kw.keyword}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, width: 38, textAlign: 'center', color: posColor }}>
                    {pos != null ? `#${pos}` : '—'}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99, width: 46, textAlign: 'center', background: tBg, color: tColor }}>
                    {tLabel}
                  </span>
                </div>
              );
            }) : <p style={{ fontSize: 12, color: C.text3 }}>Nema praćenih ključnih reči</p>}
          </div>

          <div style={card}>
            <p style={cardTitle}>Šta radimo ovog meseca</p>
            {tasks.length > 0 ? tasks.map(t => {
              const c = taskCfg[t.status] || taskCfg.planned;
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 8, marginBottom: 6, border: `1px solid ${c.border}`, background: c.bg }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: c.dot }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: t.status === 'wip' ? C.navy : C.text }}>{t.title}</p>
                    {t.subtitle && <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>{t.subtitle}</p>}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 9px', borderRadius: 99, background: c.tagBg, color: c.tagColor, flexShrink: 0, border: `1px solid ${c.border}` }}>
                    {c.label}
                  </span>
                </div>
              );
            }) : <p style={{ fontSize: 12, color: C.text3 }}>Nema zadataka za ovaj mesec</p>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
          <p style={{ fontSize: 11, color: C.text3 }}>Ovaj izveštaj je generisan od strane <span style={{ color: C.navy, fontWeight: 600 }}>AiSajt</span> · aisajt.com</p>
        </div>

      </main>
    </div>
  );
}
