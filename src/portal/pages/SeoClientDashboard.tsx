import { Topbar } from '../components/layout/Topbar';
import { useSeoProject } from '../hooks/useSeoProject';
import { Loader2 } from 'lucide-react';
import type { SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoAlert } from '../lib/types';
import '../portal.css';

// ── design tokens (mirrors seo-panel-light.html) ────────────────────────────
const C = {
  bg:           '#f0f2f5',
  card:         '#ffffff',
  border:       '#e3e7ee',
  navy:         '#1a1f4e',
  cyan:         '#00bcd4',
  cyanLight:    '#e6f7fa',
  cyanBorder:   '#b2e8f0',
  green:        '#0faa6e',
  greenLight:   '#e6f8f2',
  amber:        '#e8970a',
  amberLight:   '#fef6e4',
  red:          '#e53e3e',
  redLight:     '#fff0f0',
  purple:       '#6c4fdb',
  purpleLight:  '#f0ecfd',
  text:         '#1a2030',
  text2:        '#5a6478',
  text3:        '#9aa3b2',
};

const colorMap: Record<string, string> = {
  cyan: C.cyan, green: C.green, amber: C.amber, purple: C.purple, red: C.red,
};

// ── SVG line chart ──────────────────────────────────────────────────────────
function SeoLineChart({ data }: { data: SeoMetrics[] }) {
  if (data.length < 2) {
    return (
      <div style={{ height: 155, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text3, fontSize: 12 }}>
        Nema dovoljno podataka za grafikon
      </div>
    );
  }

  const W = 500; const H = 155;
  const PAD = { top: 10, right: 10, bottom: 28, left: 40 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const vals = data.map(d => d.organic_visits);
  const maxV = Math.max(...vals, 1);
  const minV = Math.min(...vals);
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * iW,
    y: PAD.top + iH - ((d.organic_visits - minV) / range) * iH,
    label: new Date(d.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'short' }),
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `M${pts[0].x},${pts[0].y}` +
    pts.slice(1).map(p => ` L${p.x},${p.y}`).join('') +
    ` L${pts[pts.length - 1].x},${PAD.top + iH} L${pts[0].x},${PAD.top + iH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 155 }}>
      <defs>
        <linearGradient id="seoCG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.15" />
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => {
        const y = PAD.top + iH * t;
        const val = Math.round(minV + range * (1 - t));
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + iW} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
            <text x={PAD.left - 5} y={y + 4} textAnchor="end" fontSize="9" fill={C.text3}>{val.toLocaleString()}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#seoCG)" />
      <polyline points={polyline} fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={C.cyan} strokeWidth="2" />
          <text x={p.x} y={PAD.top + iH + 16} textAnchor="middle" fontSize="9" fill={C.text3}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, delta, deltaType, accent }: {
  label: string; value: string; delta: string;
  deltaType: 'up' | 'down' | 'neutral'; accent: string;
}) {
  const bg = deltaType === 'up' ? C.greenLight : deltaType === 'down' ? C.redLight : '#f7f8fa';
  const color = deltaType === 'up' ? C.green : deltaType === 'down' ? C.red : C.text3;
  const arrow = deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '—';
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `3px solid ${accent}`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.text3, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, lineHeight: 1, color: C.text }}>{value}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: bg, color }}>
        {arrow} {delta}
      </span>
    </div>
  );
}

// ── Keyword row ─────────────────────────────────────────────────────────────
function KeywordRow({ kw }: { kw: SeoKeyword }) {
  const pos = kw.current_position;
  const prev = kw.previous_position;
  const diff = pos != null && prev != null ? prev - pos : null;

  const posColor = pos == null ? C.text3 : pos <= 10 ? C.green : pos <= 20 ? C.amber : C.red;
  const trend = diff == null ? 'eq' : diff > 0 ? 'up' : diff < 0 ? 'dn' : 'eq';
  const tBg = trend === 'up' ? C.greenLight : trend === 'dn' ? C.redLight : '#f7f8fa';
  const tColor = trend === 'up' ? C.green : trend === 'dn' ? C.red : C.text3;
  const tLabel = trend === 'up' ? `↑ +${diff}` : trend === 'dn' ? `↓ ${Math.abs(diff!)}` : '—';

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}
      className="last:border-none">
      <span style={{ flex: 1, fontSize: 12, color: C.text2 }}>{kw.keyword}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, width: 38, textAlign: 'center', color: posColor }}>
        {pos != null ? `#${pos}` : '—'}
      </span>
      <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99, width: 46, textAlign: 'center', background: tBg, color: tColor }}>
        {tLabel}
      </span>
    </div>
  );
}

// ── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({ task }: { task: SeoTask }) {
  const cfg: Record<string, { dot: string; bg: string; border: string; tagBg: string; tagColor: string; label: string }> = {
    done:    { dot: C.green,  bg: '#f7f8fa',   border: C.border,      tagBg: C.greenLight,  tagColor: C.green,  label: 'Gotovo'    },
    wip:     { dot: C.cyan,   bg: C.cyanLight,  border: C.cyanBorder,  tagBg: C.cyanLight,   tagColor: C.cyan,   label: 'U toku'    },
    next:    { dot: C.text3,  bg: '#f7f8fa',   border: C.border,      tagBg: '#f7f8fa',     tagColor: C.text3,  label: 'Sledeće'   },
    planned: { dot: C.text3,  bg: '#f7f8fa',   border: C.border,      tagBg: '#f7f8fa',     tagColor: C.text3,  label: 'Planirano' },
  };
  const c = cfg[task.status] || cfg.planned;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 11px', borderRadius: 8, marginBottom: 6, border: `1px solid ${c.border}`, background: c.bg }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: c.dot }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: task.status === 'wip' ? C.navy : C.text }}>{task.title}</p>
        {task.subtitle && <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>{task.subtitle}</p>}
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 9px', borderRadius: 99, background: c.tagBg, color: c.tagColor, flexShrink: 0, border: `1px solid ${c.border}` }}>
        {c.label}
      </span>
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function SeoProgressBar({ item }: { item: SeoProgress }) {
  const color = colorMap[item.color] || C.cyan;
  return (
    <div style={{ marginBottom: 11 }} className="last:mb-0">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.text2 }}>{item.category}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{item.percentage}%</span>
      </div>
      <div style={{ height: 6, background: '#f7f8fa', borderRadius: 99, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <div style={{ height: '100%', borderRadius: 99, width: `${item.percentage}%`, background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function SeoClientDashboard() {
  const { seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, alerts, loading } = useSeoProject();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.cyan }} />
      </div>
    );
  }

  if (!seoProject) {
    return (
      <>
        <Topbar title="SEO Panel" />
        <main style={{ background: C.bg, minHeight: 'calc(100vh - 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: C.text, fontSize: 14, marginBottom: 6 }}>Nemate aktivan SEO projekat</p>
            <p style={{ color: C.text3, fontSize: 13 }}>Kontaktirajte AiSajt tim za više informacija.</p>
          </div>
        </main>
      </>
    );
  }

  // Deltas
  const visitsDelta = latestMetrics && previousMetrics && previousMetrics.organic_visits > 0
    ? Math.round(((latestMetrics.organic_visits - previousMetrics.organic_visits) / previousMetrics.organic_visits) * 100)
    : null;
  const posDelta = latestMetrics?.avg_position != null && previousMetrics?.avg_position != null
    ? +(previousMetrics.avg_position - latestMetrics.avg_position).toFixed(1)
    : null;
  const firstM = metricsHistory.length > 0 ? metricsHistory[0] : null;
  const growth6m = firstM && latestMetrics && firstM.organic_visits > 0
    ? Math.round(((latestMetrics.organic_visits - firstM.organic_visits) / firstM.organic_visits) * 100)
    : null;
  const lastUpdate = latestMetrics
    ? new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' })
    : null;
  const renewalDate = seoProject.renewal_date
    ? new Date(seoProject.renewal_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const card = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 };
  const cardTitle = { fontSize: 10, fontWeight: 600 as const, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: C.text3, marginBottom: 16 };

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>

        {/* Topbar */}
        <div style={{ height: 54, padding: '0 24px', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.text }}>SEO Dashboard</h1>
            {lastUpdate && <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>Poslednje ažuriranje: {lastUpdate}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: C.green, background: C.greenLight, border: `1px solid #a7e8d3`, padding: '4px 10px', borderRadius: 99 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green }} className="animate-pulse" />
              Aktivan
            </div>
            {seoProject.package_name && (
              <div style={{ fontSize: 11, color: C.navy, background: '#eceef7', border: '1px solid #c5cbe8', padding: '4px 10px', borderRadius: 99 }}>
                {seoProject.package_name}{seoProject.package_price ? ` — €${seoProject.package_price}/mes` : ''}
              </div>
            )}
          </div>
        </div>

        <main style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

          {/* 4 metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Organski poseti" accent={C.cyan}
              value={latestMetrics ? latestMetrics.organic_visits.toLocaleString() : '—'}
              delta={visitsDelta != null ? `${visitsDelta > 0 ? '+' : ''}${visitsDelta}% vs prošli mesec` : 'Nema podataka'}
              deltaType={visitsDelta == null ? 'neutral' : visitsDelta > 0 ? 'up' : 'down'} />
            <MetricCard label="Prosečna pozicija" accent={C.green}
              value={latestMetrics?.avg_position != null ? latestMetrics.avg_position.toFixed(1) : '—'}
              delta={posDelta != null ? (posDelta > 0 ? `poboljšanje za ${posDelta}` : `pad za ${Math.abs(posDelta)}`) : 'Nema podataka'}
              deltaType={posDelta == null ? 'neutral' : posDelta > 0 ? 'up' : 'down'} />
            <MetricCard label="Praćeni keywords" accent={C.purple}
              value={String(keywords.length)}
              delta={`${keywords.filter(k => k.current_position != null && k.current_position <= 10).length} u top 10`}
              deltaType="up" />
            <MetricCard label="Novi backlinks" accent={C.amber}
              value={latestMetrics ? `+${latestMetrics.new_backlinks}` : '—'}
              delta={latestMetrics ? `${latestMetrics.total_backlinks} ukupno` : 'Nema podataka'}
              deltaType={latestMetrics && latestMetrics.new_backlinks > 0 ? 'up' : 'neutral'} />
          </div>

          {/* Chart + Progress */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }} className="grid-cols-1 lg:grid-cols-5">
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={cardTitle}>Organski poseti — poslednjih {metricsHistory.length} meseci</p>
              </div>
              <SeoLineChart data={metricsHistory} />
              {metricsHistory.length >= 2 && (
                <div style={{ display: 'flex', gap: 24, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <p style={{ fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Ovaj mesec</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: C.cyan }}>{latestMetrics?.organic_visits.toLocaleString() || '—'}</p>
                  </div>
                  {growth6m != null && (
                    <div>
                      <p style={{ fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Rast ({metricsHistory.length} mes.)</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: C.green }}>{growth6m > 0 ? '+' : ''}{growth6m}%</p>
                    </div>
                  )}
                  {latestMetrics?.impressions != null && latestMetrics.impressions > 0 && (
                    <div>
                      <p style={{ fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Impresije</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: C.text2 }}>{latestMetrics.impressions.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={card}>
              <p style={cardTitle}>SEO napredak</p>
              {progress.length > 0
                ? progress.map(p => <SeoProgressBar key={p.id} item={p} />)
                : <p style={{ fontSize: 12, color: C.text3 }}>Nema kategorija napretka</p>}
              {alerts.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 12px', borderRadius: 8, fontSize: 11, lineHeight: 1.5, marginTop: 14, background: C.amberLight, border: '1px solid #f5d07a', color: '#8a5700' }}>
                  <svg viewBox="0 0 14 14" fill="none" style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }}>
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M7 4.5v2.8M7 9.2v.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {alerts[0].message}
                </div>
              )}
              {renewalDate && (
                <p style={{ fontSize: 10, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, color: C.text3 }}>
                  Paket se obnavlja: <span style={{ color: C.text2 }}>{renewalDate}</span>
                </p>
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
              {keywords.length > 0
                ? keywords.map(kw => <KeywordRow key={kw.id} kw={kw} />)
                : <p style={{ fontSize: 12, color: C.text3 }}>Nema praćenih ključnih reči</p>}
            </div>

            <div style={card}>
              <p style={cardTitle}>Šta radimo ovog meseca</p>
              {tasks.length > 0
                ? tasks.map(t => <TaskRow key={t.id} task={t} />)
                : <p style={{ fontSize: 12, color: C.text3 }}>Nema zadataka za ovaj mesec</p>}
            </div>
          </div>

          {/* AI bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#eceef7,#e6f7fa)', border: `1px solid ${C.cyanBorder}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer', transition: 'opacity .2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `rgba(0,188,212,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16, color: C.cyan }}>
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5.5 9s.7 2 2.5 2 2.5-2 2.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="5.5" cy="6.5" r=".8" fill="currentColor" />
                <circle cx="10.5" cy="6.5" r=".8" fill="currentColor" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: C.navy }}>Imate pitanje o svom SEO napretku?</p>
              <p style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Pitajte AiSajt tim — odgovorićemo vam u najkraćem roku</p>
            </div>
            <span style={{ fontSize: 16, color: C.cyan }}>→</span>
          </div>

        </main>
    </div>
  );
}
