import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Topbar } from '../components/layout/Topbar';
import { useSeoProject } from '../hooks/useSeoProject';
import { supabase } from '../lib/supabase';
import { Loader2, Check, ChevronDown, ChevronUp, ExternalLink, MessageCircle } from 'lucide-react';
import type { SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoAlert, GscDailyPoint } from '../lib/types';
import '../portal.css';

// ── design tokens ───────────────────────────────────────────────────────────
export const C = {
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

export const colorMap: Record<string, string> = {
  cyan: C.cyan, green: C.green, amber: C.amber, purple: C.purple, red: C.red,
};

// ── Animated counter hook ───────────────────────────────────────────────────
export function useCountUp(target: number, duration = 1200, start = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

// ── Multi-line chart (visits + impressions + CTR) ───────────────────────────
export type ChartMetric = 'visits' | 'impressions' | 'ctr';

// ── Scrollable multi-line chart with rise animation ─────────────────────────
const MIN_PX_PER_POINT = 18;   // minimum horizontal spacing
const CHART_H = 260;
const PAD = { top: 18, right: 18, bottom: 34, left: 0 };
const Y_AXIS_W = 44;           // fixed y-axis label area

export function SeoMultiChart({ data, active, rangeKey }: { data: SeoMetrics[]; active: ChartMetric[]; rangeKey: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(500);

  // Measure container width
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setContainerW(e.contentRect.width);
    });
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Drag-to-scroll state
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !scrollRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.active = false;
    setDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
  };

  // Reset hover & scroll to end on data change
  useEffect(() => {
    setHoverIdx(null);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [rangeKey]);

  if (data.length === 0) {
    return (
      <div style={{ height: CHART_H, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text3, fontSize: 12 }}>
        Nema dovoljno podataka za grafikon
      </div>
    );
  }

  const iH = CHART_H - PAD.top - PAD.bottom;
  const singlePoint = data.length === 1;

  // Dynamic width: fill container or stretch for many points
  const naturalW = singlePoint ? containerW : Math.max(containerW, data.length * MIN_PX_PER_POINT);
  const iW = naturalW - PAD.left - PAD.right;

  const lines: { key: ChartMetric; color: string; getValue: (d: SeoMetrics) => number; label: string; format: (v: number) => string }[] = [
    { key: 'visits', color: C.cyan, getValue: d => d.organic_visits, label: 'Posete', format: v => v.toLocaleString() },
    { key: 'impressions', color: C.purple, getValue: d => d.impressions, label: 'Impresije', format: v => v.toLocaleString() },
    { key: 'ctr', color: '#f59e0b', getValue: d => (d.ctr ?? 0) * 100, label: 'CTR', format: v => v.toFixed(2) + '%' },
  ];

  const visibleLines = lines.filter(l => active.includes(l.key));

  // Tooltip position
  const hoveredData = hoverIdx != null ? data[hoverIdx] : null;
  const tooltipX = hoverIdx != null ? PAD.left + (singlePoint ? iW / 2 : (hoverIdx / (data.length - 1)) * iW) : 0;

  // Y-axis values (from first active line)
  const yAxisLabels = visibleLines.length > 0 ? (() => {
    const primary = visibleLines[0];
    const vals = data.map(d => primary.getValue(d));
    const maxV = Math.max(...vals, 1);
    const minV = Math.min(...vals, 0);
    return [0, 0.5, 1].map(t => ({
      y: PAD.top + iH * t,
      val: Math.round(minV + (maxV - minV) * (1 - t)),
    }));
  })() : [];

  // Build path for smooth curves (catmull-rom → cubic bezier approximation)
  function buildSmoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  // X-axis label logic
  const maxLabels = Math.max(6, Math.floor(naturalW / 60));
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <div style={{ display: 'flex', height: CHART_H }}>
      {/* Fixed Y-axis */}
      <svg width={Y_AXIS_W} height={CHART_H} style={{ flexShrink: 0 }}>
        {yAxisLabels.map((lbl, i) => (
          <text key={i} x={Y_AXIS_W - 6} y={lbl.y + 4} textAnchor="end" fontSize="9" fill={C.text3}>
            {lbl.val.toLocaleString()}
          </text>
        ))}
      </svg>

      {/* Scrollable chart area */}
      <div
        ref={scrollRef}
        onMouseLeave={() => { setHoverIdx(null); }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          flex: 1, overflowX: 'auto', overflowY: 'hidden',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'thin',
          scrollbarColor: `${C.border} transparent`,
        }}
      >
        <svg
          key={rangeKey}
          width={naturalW}
          height={CHART_H}
          viewBox={`0 0 ${naturalW} ${CHART_H}`}
          style={{ display: 'block' }}
        >
          <defs>
            {lines.map(l => (
              <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={l.color} stopOpacity="0.10" />
                <stop offset="100%" stopColor={l.color} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = PAD.top + iH * t;
            return <line key={i} x1={0} y1={y} x2={naturalW} y2={y} stroke={C.border} strokeWidth="0.5" strokeDasharray="4,4" />;
          })}

          {/* Lines with rise animation */}
          {lines.map(line => {
            const isActive = active.includes(line.key);
            const vals = data.map(d => line.getValue(d));
            const maxV = Math.max(...vals, 1);
            const minV = Math.min(...vals, 0);
            const range = maxV - minV || 1;

            const pts = data.map((d, i) => ({
              x: singlePoint ? iW / 2 : PAD.left + (i / (data.length - 1)) * iW,
              y: PAD.top + iH - ((line.getValue(d) - minV) / range) * iH,
            }));

            // Flat baseline for animation start
            const flatY = PAD.top + iH;
            const flatPts = pts.map(p => ({ x: p.x, y: flatY }));

            if (singlePoint) {
              return (
                <g key={line.key} style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.4s ease' }}>
                  <circle cx={pts[0].x} cy={pts[0].y} r={5} fill="#fff" stroke={line.color} strokeWidth="2">
                    <animate attributeName="cy" from={flatY.toString()} to={pts[0].y.toString()} dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94" />
                  </circle>
                  <text x={pts[0].x} y={pts[0].y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill={line.color}>
                    {line.format(line.getValue(data[0]))}
                  </text>
                </g>
              );
            }

            const smoothPath = buildSmoothPath(pts);
            const flatPath = buildSmoothPath(flatPts);
            const areaPath = smoothPath + ` L${pts[pts.length - 1].x},${PAD.top + iH} L${pts[0].x},${PAD.top + iH} Z`;
            const flatAreaPath = flatPath + ` L${flatPts[flatPts.length - 1].x},${PAD.top + iH} L${flatPts[0].x},${PAD.top + iH} Z`;

            return (
              <g key={line.key} style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.4s ease' }}>
                <path fill={`url(#grad-${line.key})`}>
                  <animate attributeName="d" from={flatAreaPath} to={areaPath} dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94" />
                </path>
                <path fill="none" stroke={line.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                  <animate attributeName="d" from={flatPath} to={smoothPath} dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94" />
                </path>
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} r={hoverIdx === i ? 5 : 2.5} fill="#fff" stroke={line.color} strokeWidth="1.5"
                    style={{ transition: 'r 0.15s ease' }}>
                    <animate attributeName="cy" from={flatY.toString()} to={p.y.toString()} dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94" />
                  </circle>
                ))}
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = singlePoint ? iW / 2 : PAD.left + (i / (data.length - 1)) * iW;
            if (i % labelStep !== 0 && i !== data.length - 1) return null;
            const dateObj = new Date(d.month + 'T00:00:00');
            const isDaily = d.month.length === 10 && !d.month.endsWith('-01');
            const label = isDaily
              ? dateObj.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' })
              : dateObj.toLocaleDateString('sr-Latn', { month: 'short', year: 'numeric' });
            return <text key={i} x={x} y={PAD.top + iH + 20} textAnchor="middle" fontSize="8" fill={C.text3}>{label}</text>;
          })}

          {/* Hover rects */}
          {!singlePoint && data.map((_, i) => {
            const x = PAD.left + (i / (data.length - 1)) * iW;
            const slotW = iW / (data.length - 1);
            return (
              <rect key={`h-${i}`} x={x - slotW / 2} y={PAD.top} width={slotW} height={iH}
                fill="transparent" onMouseEnter={() => setHoverIdx(i)} />
            );
          })}

          {/* Hover guide line */}
          {hoverIdx != null && (
            <line x1={tooltipX} y1={PAD.top} x2={tooltipX} y2={PAD.top + iH}
              stroke={C.text3} strokeWidth="0.8" strokeDasharray="3,2" opacity="0.4" />
          )}

          {/* Tooltip */}
          {hoverIdx != null && hoveredData && (() => {
            const dateObj = new Date(hoveredData.month + 'T00:00:00');
            const isDailyTip = hoveredData.month.length === 10 && !hoveredData.month.endsWith('-01');
            const month = isDailyTip
              ? dateObj.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })
              : dateObj.toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' });
            const tipW = 130; const tipH = 16 + visibleLines.length * 15;
            const tipX = tooltipX + 12 > naturalW - tipW - 10 ? tooltipX - tipW - 12 : tooltipX + 12;
            const tipY = PAD.top + 4;
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="6" fill="#1a2030" fillOpacity="0.94" />
                <text x={tipX + 10} y={tipY + 13} fontSize="8.5" fontWeight="600" fill="#fff">{month}</text>
                {visibleLines.map((line, li) => (
                  <g key={line.key}>
                    <circle cx={tipX + 12} cy={tipY + 25 + li * 15} r="3.5" fill={line.color} />
                    <text x={tipX + 20} y={tipY + 28 + li * 15} fontSize="8.5" fill="#ccc">
                      {line.label}: <tspan fontWeight="600" fill="#fff">{line.format(line.getValue(hoveredData))}</tspan>
                    </text>
                  </g>
                ))}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

// ── Info tooltip ─────────────────────────────────────────────────────────────
// Rendered via React Portal at document.body so it escapes any stacking context
// (including the fixed sidebar at z-index: 40 and animated parent containers).
function InfoTip({ text }: { text: string }) {
  const [show, setShow]   = useState(false);
  const [pos,  setPos]    = useState({ top: 0, left: 0 });
  const iconRef = useRef<SVGSVGElement>(null);

  const updatePos = useCallback(() => {
    const rect = iconRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top:  rect.top + window.scrollY - 8,   // 8px gap above icon
      left: rect.left + rect.width / 2,       // horizontally centered on icon
    });
  }, []);

  const handleEnter = () => { updatePos(); setShow(true); };
  const handleLeave = () => setShow(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5, cursor: 'help' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <svg
        ref={iconRef}
        viewBox="0 0 16 16" fill="none"
        style={{ width: 13, height: 13, color: C.text3, opacity: show ? 1 : 0.5, transition: 'opacity 0.2s' }}
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 7v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.7" fill="currentColor" />
      </svg>

      {show && createPortal(
        <span style={{
          position: 'absolute',
          top:  pos.top,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          marginTop: -6,
          padding: '7px 11px', borderRadius: 7, fontSize: 11, lineHeight: 1.45,
          color: '#fff', background: '#1a2030', whiteSpace: 'pre-line', width: 220,
          boxShadow: '0 4px 16px rgba(0,0,0,0.22)', zIndex: 9999, pointerEvents: 'none',
          textTransform: 'none', letterSpacing: 'normal', fontWeight: 400,
        }}>
          {text}
        </span>,
        document.body,
      )}
    </span>
  );
}

// ── Metric card with count-up ───────────────────────────────────────────────
export function MetricCard({ label, numericValue, displayValue, delta, deltaType, accent, delay = 0, info }: {
  label: string; numericValue?: number; displayValue?: string; delta: string;
  deltaType: 'up' | 'down' | 'neutral'; accent: string; delay?: number; info?: string;
}) {
  const bg = deltaType === 'up' ? C.greenLight : deltaType === 'down' ? C.redLight : '#f7f8fa';
  const color = deltaType === 'up' ? C.green : deltaType === 'down' ? C.red : C.text3;
  const arrow = deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '—';
  const count = useCountUp(numericValue ?? 0, 1200);

  return (
    <div
      className="portal-animate-in"
      style={{
        animationDelay: `${delay}s`,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 10,
        padding: 16,
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.text3, marginBottom: 8, display: 'flex', alignItems: 'center' }}>{label}{info && <InfoTip text={info} />}</p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, lineHeight: 1.1, color: C.text, letterSpacing: '-0.02em' }}>
        {displayValue ?? count.toLocaleString()}
      </p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: bg, color }}>
        {arrow} {delta}
      </span>
    </div>
  );
}

// ── Keyword row with hover + Google link ────────────────────────────────────
export function KeywordRow({ kw }: { kw: SeoKeyword }) {
  const pos = kw.current_position;
  const prev = kw.previous_position;
  const diff = pos != null && prev != null ? prev - pos : null;

  const posColor = pos == null ? C.text3 : pos <= 10 ? C.green : pos <= 20 ? C.amber : C.red;
  const trend = diff == null ? 'eq' : diff > 0 ? 'up' : diff < 0 ? 'dn' : 'eq';
  const tBg = trend === 'up' ? C.greenLight : trend === 'dn' ? C.redLight : '#f7f8fa';
  const tColor = trend === 'up' ? C.green : trend === 'dn' ? C.red : C.text3;
  const tLabel = trend === 'up' ? `↑ +${diff}` : trend === 'dn' ? `↓ ${Math.abs(diff!)}` : '—';

  const handleClick = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(kw.keyword)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s ease', borderBottom: `1px solid ${C.border}` }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f7f9fc'; e.currentTarget.style.transform = 'translateX(4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <span style={{ flex: 1, fontSize: 12, color: C.text2, display: 'flex', alignItems: 'center', gap: 6 }}>
        {kw.keyword}
        <ExternalLink size={10} style={{ color: C.text3, opacity: 0.5 }} />
      </span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, width: 38, textAlign: 'center', color: posColor }}>
        {pos != null ? `#${pos}` : '—'}
      </span>
      <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99, width: 46, textAlign: 'center', background: tBg, color: tColor }}>
        {tLabel}
      </span>
    </div>
  );
}

// ── Task timeline (project steps style) ─────────────────────────────────────
export function TaskTimeline({ tasks }: { tasks: SeoTask[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusCfg: Record<string, { dotBg: string; lineColor: string; textColor: string; tagBg: string; tagColor: string; tagBorder: string; label: string }> = {
    done:    { dotBg: C.greenLight, lineColor: C.green, textColor: C.text, tagBg: C.greenLight, tagColor: C.green, tagBorder: '#a7e8d3', label: 'Gotovo' },
    wip:     { dotBg: C.cyanLight, lineColor: C.cyan, textColor: C.cyan, tagBg: C.cyanLight, tagColor: C.cyan, tagBorder: C.cyanBorder, label: 'U toku' },
    next:    { dotBg: '#f7f8fa', lineColor: C.border, textColor: C.text3, tagBg: '#f7f8fa', tagColor: C.text3, tagBorder: C.border, label: 'Sledeće' },
    planned: { dotBg: '#f7f8fa', lineColor: C.border, textColor: C.text3, tagBg: '#f7f8fa', tagColor: C.text3, tagBorder: C.border, label: 'Planirano' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tasks.map((task, idx) => {
        const cfg = statusCfg[task.status] || statusCfg.planned;
        const isLast = idx === tasks.length - 1;
        const isExpanded = expandedId === task.id;
        const isActive = task.status === 'wip';

        return (
          <div key={task.id} style={{ position: 'relative', display: 'flex', gap: 12 }}>
            {/* Dot + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 23, height: 23, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2, background: cfg.dotBg,
                }}
              >
                {task.status === 'done' ? (
                  <Check size={12} strokeWidth={2.5} color={C.green} />
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 600, color: cfg.textColor }}>{idx + 1}</span>
                )}
              </div>
              {!isLast && (
                <div style={{ width: 1, flex: 1, minHeight: 16, background: cfg.lineColor }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 12 }}>
              <button
                onClick={() => task.subtitle && setExpandedId(isExpanded ? null : task.id)}
                style={{
                  width: '100%', textAlign: 'left' as const, borderRadius: 8, padding: '6px 8px',
                  marginLeft: -8, marginTop: -2, border: 'none', cursor: task.subtitle ? 'pointer' : 'default',
                  transition: 'all 0.15s', background: isActive ? 'rgba(230,247,250,0.4)' : 'transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f7f8fa'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: cfg.textColor, fontWeight: isActive ? 500 : 400 }}>
                    {task.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                        background: cfg.tagBg, color: cfg.tagColor, border: `1px solid ${cfg.tagBorder}`,
                      }}
                    >
                      {cfg.label}
                    </span>
                    {task.subtitle && (
                      isExpanded
                        ? <ChevronUp size={14} color={C.text3} />
                        : <ChevronDown size={14} color={C.text3} />
                    )}
                  </div>
                </div>
              </button>
              {isExpanded && task.subtitle && (
                <p className="portal-animate-in" style={{ marginTop: 6, paddingLeft: 8, fontSize: 12, color: C.text2, lineHeight: 1.5 }}>
                  {task.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Circular progress ring ──────────────────────────────────────────────────
export function ProgressRing({ item }: { item: SeoProgress }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const size = 90;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? item.percentage / 100 : 0) * circumference;
  const baseColor = colorMap[item.color] || C.cyan;
  const ringColor = item.percentage >= 100 ? C.green : baseColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f2f5" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={ringColor} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.percentage >= 100 ? (
            <Check size={20} strokeWidth={2.5} color={C.green} />
          ) : (
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: ringColor }}>
              {item.percentage}%
            </span>
          )}
        </div>
      </div>
      <span style={{ fontSize: 10, color: C.text2, textAlign: 'center', lineHeight: 1.3, maxWidth: 100 }}>{item.category}</span>
    </div>
  );
}

// ── Chart metric toggle button ──────────────────────────────────────────────
export function ChartToggle({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 500,
        padding: '4px 10px', borderRadius: 99,
        background: active ? `${color}12` : '#f7f8fa',
        border: `1px solid ${active ? color : C.border}`,
        color: active ? color : C.text3,
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? color : C.text3, transition: 'background 0.2s' }} />
      {label}
    </button>
  );
}

// ── Date range tab ──────────────────────────────────────────────────────────
export type DateRange = '3d' | '28d' | '3m' | '6m' | 'all';
export const dateRangeLabels: Record<DateRange, string> = { '3d': '3 dana', '28d': '28 dana', '3m': '3 mes.', '6m': '6 mes.', 'all': 'Sve' };

export function DateRangeTab({ value, active, onClick }: { value: DateRange; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 10, fontWeight: active ? 600 : 400, padding: '3px 10px', borderRadius: 6,
        background: active ? C.navy : 'transparent', color: active ? '#fff' : C.text3,
        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {dateRangeLabels[value]}
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function SeoClientDashboard() {
  const { seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, alerts, loading } = useSeoProject();
  const navigate = useNavigate();
  const [chartMetrics, setChartMetrics] = useState<ChartMetric[]>(['visits', 'impressions', 'ctr']);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [allGscDaily, setAllGscDaily] = useState<GscDailyPoint[]>([]);
  const [gscDailyLoading, setGscDailyLoading] = useState(false);
  const gscLoaded = useRef(false);

  // Fetch ALL admin-approved daily data from DB once, filter client-side by range
  useEffect(() => {
    if (!seoProject || gscLoaded.current) return;
    gscLoaded.current = true;

    let cancelled = false;
    setGscDailyLoading(true);

    (async () => {
      try {
        const { data } = await supabase
          .from('seo_gsc_daily')
          .select('*')
          .eq('seo_project_id', seoProject.id)
          .order('date', { ascending: true });

        if (!cancelled) {
          const days: GscDailyPoint[] = (data || []).map((d: any) => ({
            date: d.date,
            clicks: d.clicks,
            impressions: d.impressions,
            ctr: d.ctr,
            position: d.position,
          }));
          setAllGscDaily(days);
        }
      } catch {
        if (!cancelled) setAllGscDaily([]);
      } finally {
        if (!cancelled) setGscDailyLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [seoProject?.id]);

  // Filter daily data by range: take last N available data points
  const RANGE_POINTS: Record<DateRange, number> = { '3d': 3, '28d': 28, '3m': 90, '6m': 180, 'all': Infinity };
  const gscDaily = dateRange === 'all'
    ? allGscDaily
    : allGscDaily.slice(-RANGE_POINTS[dateRange]);

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
  const lastUpdate = latestMetrics
    ? new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' })
    : null;
  const renewalDate = seoProject.renewal_date
    ? new Date(seoProject.renewal_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const card: React.CSSProperties = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 };
  const cardTitle: React.CSSProperties = { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.text3, marginBottom: 16 };

  const toggleMetric = (m: ChartMetric) => {
    setChartMetrics(prev =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
    );
  };

  const topInTop10 = keywords.filter(k => k.current_position != null && k.current_position <= 10).length;

  // Date range filtering for chart — all ranges use daily GSC data

  // Map daily GSC data to SeoMetrics shape so the chart component works
  const gscDailyAsMetrics: SeoMetrics[] = gscDaily.map(d => ({
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

  // Use daily data when available; fall back to monthly DB data (filtered by range)
  const filteredMetricsHistory = (() => {
    if (dateRange === 'all') return metricsHistory;
    // Map date ranges to number of months for monthly fallback data
    const rangeMonths: Record<string, number> = { '3d': 1, '28d': 1, '3m': 3, '6m': 6 };
    return metricsHistory.slice(-(rangeMonths[dateRange] ?? 1));
  })();
  const chartData = gscDaily.length > 0 ? gscDailyAsMetrics : filteredMetricsHistory;
  const chartLabel = dateRange === 'all'
    ? `poslednjih ${gscDaily.length > 0 ? gscDaily.length + ' dana' : metricsHistory.length + ' meseci'}`
    : `poslednjih ${dateRangeLabels[dateRange]}`;

  // Static deltas for metric cards (always from latestMetrics vs previousMetrics)
  const visitsDelta = latestMetrics && previousMetrics && previousMetrics.organic_visits > 0
    ? Math.round(((latestMetrics.organic_visits - previousMetrics.organic_visits) / previousMetrics.organic_visits) * 100)
    : null;
  const posDelta = latestMetrics?.avg_position != null && previousMetrics?.avg_position != null
    ? +(previousMetrics.avg_position - latestMetrics.avg_position).toFixed(1)
    : null;

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
        </div>
      </div>

      <main style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

        {/* Project info — domain + package */}
        <div style={{ ...card, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="portal-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.cyanLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ExternalLink size={13} style={{ color: C.cyan }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: C.text }}>{seoProject.domain}</p>
              {seoProject.package_name && (
                <p style={{ fontSize: 10, color: C.text3, marginTop: 1 }}>
                  {seoProject.package_name}{seoProject.package_price ? ` — €${seoProject.package_price}/mes` : ''}
                </p>
              )}
            </div>
          </div>
          <a href={`https://${seoProject.domain}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 10, color: C.cyan, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Poseti sajt <ExternalLink size={10} />
          </a>
        </div>

        {/* 4 metrics — static, always show latest month data */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          <MetricCard label="Organski poseti" accent={C.cyan} delay={0.05}
            info="Broj posetilaca koji su došli na vaš sajt preko Google pretrage (ne uključuje plaćene oglase)."
            numericValue={latestMetrics?.organic_visits ?? 0}
            delta={visitsDelta != null ? `${visitsDelta > 0 ? '+' : ''}${visitsDelta}% vs prošli mesec` : 'Nema podataka'}
            deltaType={visitsDelta == null ? 'neutral' : visitsDelta > 0 ? 'up' : 'down'} />
          <MetricCard label="Prosečna pozicija" accent={C.green} delay={0.1}
            info="Prosečno mesto vašeg sajta u Google rezultatima. Niža vrednost = bolje (1 znači prvo mesto)."
            displayValue={latestMetrics?.avg_position != null ? latestMetrics.avg_position.toFixed(1) : '—'}
            delta={posDelta != null ? (posDelta > 0 ? `poboljšanje za ${posDelta}` : `pad za ${Math.abs(posDelta)}`) : 'Nema podataka'}
            deltaType={posDelta == null ? 'neutral' : posDelta > 0 ? 'up' : 'down'} />
          <MetricCard label="Praćeni keywords" accent={C.purple} delay={0.15}
            info="Ključne reči koje pratimo za vaš sajt. Top 10 znači da se sajt pojavljuje na prvoj strani Googla za te reči."
            numericValue={keywords.length}
            delta={`${topInTop10} u top 10`}
            deltaType="up" />
          {seoProject.show_backlinks ? (
            <MetricCard label="Novi backlinks" accent={C.amber} delay={0.2}
              info="Linkovi sa drugih sajtova ka vašem. Više kvalitetnih linkova = veći autoritet sajta u očima Googla."
              displayValue={latestMetrics ? `+${latestMetrics.new_backlinks}` : '—'}
              delta={latestMetrics ? `${latestMetrics.total_backlinks} ukupno` : 'Nema podataka'}
              deltaType={latestMetrics && latestMetrics.new_backlinks > 0 ? 'up' : 'neutral'} />
          ) : (
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
              {/* Blurred card beneath */}
              <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
                <MetricCard label="Novi backlinks" accent={C.amber} delay={0.2}
                  displayValue="+12"
                  delta="38 ukupno"
                  deltaType="up" />
              </div>
              {/* Locked overlay */}
              <div
                onClick={() => navigate('/portal/dashboard/poruke')}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(26,31,78,0.82)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, borderRadius: 10, cursor: 'pointer',
                  backdropFilter: 'blur(1px)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,31,78,0.92)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,31,78,0.82)'; }}
              >
                <svg viewBox="0 0 20 20" fill="none" style={{ width: 20, height: 20 }}>
                  <rect x="4" y="9" width="12" height="9" rx="2" stroke="#00bcd4" strokeWidth="1.5" />
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="#00bcd4" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.2, textAlign: 'center', lineHeight: 1.3, margin: 0 }}>
                  Backlinks praćenje
                </p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textAlign: 'center', margin: 0 }}>
                  Dostupno u višem paketu
                </p>
                <span style={{
                  marginTop: 2, fontSize: 9, fontWeight: 600,
                  background: '#00bcd4', color: '#fff',
                  padding: '3px 10px', borderRadius: 99,
                }}>
                  Nadogradite plan →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chart — full width, dominant */}
        <div style={card} className="portal-animate-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ ...cardTitle, display: 'flex', alignItems: 'center' }}>Pregled performansi — {chartLabel}<InfoTip text="Grafik prikazuje kretanje poseta, impresija i CTR-a sa Google pretrage tokom vremena. Koristite tabove za različite periode." /></p>
            <div style={{ display: 'flex', gap: 6 }}>
              <ChartToggle label="Posete" color={C.cyan} active={chartMetrics.includes('visits')} onClick={() => toggleMetric('visits')} />
              <ChartToggle label="Impresije" color={C.purple} active={chartMetrics.includes('impressions')} onClick={() => toggleMetric('impressions')} />
              <ChartToggle label="CTR" color="#f59e0b" active={chartMetrics.includes('ctr')} onClick={() => toggleMetric('ctr')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 10, background: '#f7f8fa', borderRadius: 8, padding: 2, width: 'fit-content' }}>
            {(['3d', '28d', '3m', '6m', 'all'] as DateRange[])
              .filter(r => {
                // Sakrij opseg ako bi dao isti rezultat kao "Sve" (nema dovoljno istorije)
                if (r === '6m' && allGscDaily.length > 0 && allGscDaily.length < 180) return false;
                if (r === '3m' && allGscDaily.length > 0 && allGscDaily.length < 90) return false;
                return true;
              })
              .map(r => (
                <DateRangeTab key={r} value={r} active={dateRange === r} onClick={() => setDateRange(r)} />
              ))}
          </div>
          {gscDailyLoading ? (
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Loader2 size={16} className="animate-spin" style={{ color: C.cyan }} />
              <span style={{ fontSize: 12, color: C.text3 }}>Učitava se…</span>
            </div>
          ) : (
            <SeoMultiChart data={chartData} active={chartMetrics} rangeKey={dateRange} />
          )}
          {!gscDailyLoading && chartData.length >= 1 && (() => {
            const totalVisits = chartData.reduce((s, m) => s + m.organic_visits, 0);
            const totalImpressions = chartData.reduce((s, m) => s + m.impressions, 0);
            const avgCtr = chartData.length > 0 ? chartData.reduce((s, m) => s + (m.ctr ?? 0), 0) / chartData.length : 0;
            const summaryStyle: React.CSSProperties = { fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 };
            const valStyle = (c: string): React.CSSProperties => ({ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: c });

            return (
              <div style={{ display: 'flex', gap: 28, paddingTop: 14, borderTop: `1px solid ${C.border}`, marginTop: 8, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ ...summaryStyle, display: 'flex', alignItems: 'center' }}>Klikovi<InfoTip text="Ukupan broj klikova na vaš sajt iz Google pretrage za izabrani period." /></p>
                  <p style={valStyle(C.cyan)}>{totalVisits.toLocaleString()}</p>
                </div>
                {totalImpressions > 0 && (
                  <div>
                    <p style={{ ...summaryStyle, display: 'flex', alignItems: 'center' }}>Impresije<InfoTip text="Koliko puta se vaš sajt pojavio u Google rezultatima pretrage (čak i ako niko nije kliknuo)." /></p>
                    <p style={valStyle(C.purple)}>{totalImpressions.toLocaleString()}</p>
                  </div>
                )}
                {avgCtr > 0 && (
                  <div>
                    <p style={{ ...summaryStyle, display: 'flex', alignItems: 'center' }}>CTR (prosek)<InfoTip text="Click-Through Rate — procenat ljudi koji su kliknuli na vaš sajt od svih koji su ga videli u rezultatima. Viši CTR = bolja optimizacija naslova i opisa." /></p>
                    <p style={valStyle('#f59e0b')}>{(avgCtr * 100).toFixed(2)}%</p>
                  </div>
                )}
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

        {/* Keywords + Tasks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Keywords — scrollable */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column' }} className="portal-animate-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ ...cardTitle, display: 'flex', alignItems: 'center' }}>Keywords — pozicije na Googlu<InfoTip text="Ključne reči koje pratimo za vaš sajt i njihove pozicije na Googlu. Zeleno = napredak, crveno = pad. Klik na keyword otvara Google pretragu." /></p>
              <span style={{ fontSize: 10, color: C.text3, flexShrink: 0 }}>{keywords.length} praćenih</span>
            </div>
            <div style={{ flex: 1, maxHeight: 340, overflowY: 'auto', marginRight: -6, paddingRight: 6 }}>
              {keywords.length > 0
                ? keywords.map(kw => <KeywordRow key={kw.id} kw={kw} />)
                : <p style={{ fontSize: 12, color: C.text3 }}>Nema praćenih ključnih reči</p>}
            </div>
          </div>

          {/* Tasks — timeline style */}
          <div style={card} className="portal-animate-in">
            <p style={{ ...cardTitle, display: 'flex', alignItems: 'center' }}>Poslovi za ovaj mesec<InfoTip text="Pregled SEO zadataka za tekući mesec. Zeleno = završeno, plavo = u toku, sivo = planirano." /></p>
            {tasks.length > 0
              ? <TaskTimeline tasks={tasks} />
              : <p style={{ fontSize: 12, color: C.text3 }}>Nema zadataka za ovaj mesec</p>}
          </div>
        </div>

        {/* Progress rings + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={card} className="portal-animate-in">
            <p style={{ ...cardTitle, display: 'flex', alignItems: 'center' }}>Progress optimizacije<InfoTip text="Vizuelni prikaz napretka po kategorijama SEO optimizacije. 100% znači da je ta oblast u potpunosti optimizovana." /></p>
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
              <div style={{ ...card, background: C.amberLight, border: '1px solid #f5d07a' }} className="portal-animate-in">
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
              <div style={card} className="portal-animate-in">
                <p style={{ fontSize: 11, color: C.text3 }}>
                  Paket se obnavlja: <span style={{ color: C.text2, fontWeight: 500 }}>{renewalDate}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA — redirect to messages */}
        <div
          onClick={() => navigate('/portal/dashboard/poruke')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#eceef7,#e6f7fa)', border: `1px solid ${C.cyanBorder}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer', transition: 'all .2s' }}
          className="portal-animate-in"
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
  );
}
