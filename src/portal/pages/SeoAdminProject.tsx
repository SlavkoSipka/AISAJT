import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSeoProject } from '../hooks/useSeoProject';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, ArrowLeft, Plus, Trash2, RefreshCw, CheckCircle2, AlertTriangle, Link2, Pencil, X, Save, FileDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoAlert, SeoTaskStatus } from '../lib/types';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../portal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

const TASK_STATUSES: { value: SeoTaskStatus; label: string; color: string }[] = [
  { value: 'done',    label: 'Gotovo',    color: '#0faa6e' },
  { value: 'wip',     label: 'U toku',    color: '#00bcd4' },
  { value: 'next',    label: 'Sledeće',   color: '#9aa3b2' },
  { value: 'planned', label: 'Planirano', color: '#9aa3b2' },
];

const PROGRESS_COLORS = ['cyan', 'green', 'amber', 'purple', 'red'];
const COLOR_HEX: Record<string, string> = { cyan: '#00bcd4', green: '#0faa6e', amber: '#e8970a', purple: '#6c4fdb', red: '#e53e3e' };

// ── Hero Traffic Chart ──────────────────────────────────────────────────────
function TrafficChart({ data }: { data: SeoMetrics[] }) {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center text-[12px] text-[#9aa3b2]" style={{ height: 220 }}>
        Potrebna su bar 2 meseca podataka za grafikon
      </div>
    );
  }

  const labels = data.map(d =>
    new Date(d.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'short', year: '2-digit' })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Organski poseti',
        data: data.map(d => d.organic_visits),
        borderColor: '#1D9E75',
        backgroundColor: 'rgba(29,158,117,0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1D9E75',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'GSC klikovi',
        data: data.map(d => d.clicks),
        borderColor: '#1a1f4e',
        backgroundColor: 'rgba(26,31,78,0.06)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1a1f4e',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: true, position: 'top' as const, labels: { font: { size: 11, family: 'DM Sans' }, boxWidth: 12, padding: 16, usePointStyle: true } },
      tooltip: {
        backgroundColor: '#1a2030',
        titleFont: { size: 12, family: 'DM Sans' },
        bodyFont: { size: 11, family: 'DM Sans' },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10, family: 'DM Sans' }, color: '#9aa3b2' } },
      y: { grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, ticks: { font: { size: 10, family: 'DM Sans' }, color: '#9aa3b2' }, beginAtZero: true },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// ── Metric delta badge ──────────────────────────────────────────────────────
function DeltaBadge({ current, previous, suffix = '', invertColor = false }: { current: number; previous: number; suffix?: string; invertColor?: boolean }) {
  if (previous === 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const isPositive = invertColor ? pct < 0 : pct > 0;
  const bg = pct === 0 ? '#f7f8fa' : isPositive ? '#e6f8f2' : '#fff0f0';
  const color = pct === 0 ? '#9aa3b2' : isPositive ? '#0faa6e' : '#e53e3e';
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ml-1.5" style={{ background: bg, color }}>
      {pct > 0 ? '+' : ''}{pct}%{suffix}
    </span>
  );
}

// ── Keyword trend indicator ─────────────────────────────────────────────────
function KeywordTrend({ current, previous }: { current: number | null; previous: number | null }) {
  if (current == null || previous == null) {
    return <span className="text-[11px] text-[#9aa3b2]" title="Nema prethodnih podataka">—</span>;
  }
  const diff = previous - current; // positive = improvement (lower position = better)
  if (diff === 0) {
    return <span className="text-[11px] text-[#9aa3b2]" title={`Prošli mesec: ${previous}, Ovaj mesec: ${current}`}><Minus size={12} className="inline" /></span>;
  }
  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#0faa6e]" title={`Prošli mesec: ${previous}, Ovaj mesec: ${current}`}>
        <TrendingUp size={12} /> +{diff}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#e53e3e]" title={`Prošli mesec: ${previous}, Ovaj mesec: ${current}`}>
      <TrendingDown size={12} /> {diff}
    </span>
  );
}

const toastOk = (msg: string) => toast.success(msg, {
  style: { fontSize: 13, borderRadius: 8, background: '#1a2030', color: '#fff', padding: '10px 16px' },
  iconTheme: { primary: '#00bcd4', secondary: '#fff' },
  duration: 2000,
});
const toastErr = (msg: string) => toast.error(msg, {
  style: { fontSize: 13, borderRadius: 8, background: '#1a2030', color: '#fff', padding: '10px 16px' },
  duration: 3000,
});

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="portal-card mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9aa3b2]">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Inline text input ────────────────────────────────────────────────────────
function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-[11px] font-medium text-[#5a6478] mb-1">{label}</label>}
      <input className="portal-input" {...props} />
    </div>
  );
}

export function SeoAdminProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const { seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, alerts, loading, refetch } = useSeoProject(id);

  const [saving, setSaving] = useState<string | null>(null);
  const [gscSyncing, setGscSyncing] = useState(false);
  const [gscMsg, setGscMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  // ── PDF Export ──────────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (!reportRef.current || !seoProject) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#f8f9fa' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFillColor(26, 31, 78);
      pdf.rect(0, 0, pageW, 32, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text('AiSajt — SEO Izveštaj', 14, 14);
      pdf.setFontSize(10);
      pdf.text(seoProject.domain, 14, 21);
      const now = new Date();
      pdf.text(`Generisano: ${now.toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 28);
      if (latestMetrics) {
        const period = new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' });
        pdf.text(`Period: ${period}`, pageW - 14, 28, { align: 'right' });
      }

      // Content
      const imgW = pageW - 20;
      const imgH = (canvas.height / canvas.width) * imgW;
      let yOffset = 38;
      const maxContentH = pageH - 20;

      if (imgH + yOffset > maxContentH) {
        // Multi-page
        let remainingH = canvas.height;
        let srcY = 0;
        while (remainingH > 0) {
          const sliceH = Math.min(remainingH, (maxContentH - yOffset) / imgW * canvas.width);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceH;
          const ctx = sliceCanvas.getContext('2d');
          ctx?.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          const sliceImg = sliceCanvas.toDataURL('image/png');
          const sliceImgH = (sliceH / canvas.width) * imgW;
          pdf.addImage(sliceImg, 'PNG', 10, yOffset, imgW, sliceImgH);
          remainingH -= sliceH;
          srcY += sliceH;
          if (remainingH > 0) { pdf.addPage(); yOffset = 10; }
        }
      } else {
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgW, imgH);
      }

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`aisajt.com — Stranica ${i}/${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
      }

      const monthStr = latestMetrics
        ? new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: '2-digit', year: 'numeric' }).replace('/', '-')
        : now.toISOString().substring(0, 7);
      pdf.save(`AiSajt-SEO-${seoProject.domain}-${monthStr}.pdf`);
      toastOk('PDF izveštaj generisan');
    } catch {
      toastErr('Greška pri generisanju PDF-a');
    }
    setExporting(false);
  };

  // ── Metrics form state (supports both add & edit) ─────────────────────────
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [metricsForm, setMetricsForm] = useState<Partial<SeoMetrics>>({});

  const loadMetricForEdit = (m: SeoMetrics) => {
    setEditingMetricId(m.id);
    setMetricsForm({
      month: m.month,
      organic_visits: m.organic_visits,
      clicks: m.clicks,
      impressions: m.impressions,
      avg_position: m.avg_position ?? undefined,
      new_backlinks: m.new_backlinks,
      total_backlinks: m.total_backlinks,
    });
  };

  const clearMetricForm = () => {
    setEditingMetricId(null);
    setMetricsForm({});
  };

  // ── Other form state ──────────────────────────────────────────────────────
  const [newKeyword, setNewKeyword] = useState('');
  const [newKeywordPos, setNewKeywordPos] = useState('');
  const [newTask, setNewTask] = useState<{ title: string; subtitle: string; status: SeoTaskStatus }>({ title: '', subtitle: '', status: 'next' });
  const [newProgress, setNewProgress] = useState<{ category: string; percentage: number; color: string }>({ category: '', percentage: 0, color: 'cyan' });
  const [newAlert, setNewAlert] = useState('');

  // ── GSC project settings ────────────────────────────────────────────────────
  const handleGscUpdate = async (field: string, value: string | boolean) => {
    if (!id) return;
    await supabase.from('seo_projects').update({ [field]: value }).eq('id', id);
    await refetch();
  };

  const handleGscSync = async () => {
    if (!id) return;
    setGscSyncing(true);
    setGscMsg(null);
    try {
      const res = await fetch('/.netlify/functions/gsc-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo_project_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setGscMsg({ type: 'ok', text: `Sinhronizovano: ${data.clicks?.toLocaleString()} klikova, pozicija ${data.avg_position}` });
        toastOk('GSC podaci sinhronizovani');
        await refetch();
      } else {
        setGscMsg({ type: 'err', text: data.error || 'Greška pri sinhronizaciji' });
        toastErr('Greška pri GSC sinhronizaciji');
      }
    } catch {
      setGscMsg({ type: 'err', text: 'Mrežna greška' });
      toastErr('Mrežna greška');
    }
    setGscSyncing(false);
  };

  // ── Metrics ─────────────────────────────────────────────────────────────────
  // ── Metrics ─────────────────────────────────────────────────────────────────
  const handleSaveMetrics = async () => {
    if (!id || !metricsForm.month) return;
    setSaving('metrics');
    const payload = {
      seo_project_id: id,
      month: metricsForm.month,
      organic_visits: Number(metricsForm.organic_visits) || 0,
      clicks: Number(metricsForm.clicks) || 0,
      impressions: Number(metricsForm.impressions) || 0,
      avg_position: metricsForm.avg_position ? Number(metricsForm.avg_position) : null,
      new_backlinks: Number(metricsForm.new_backlinks) || 0,
      total_backlinks: Number(metricsForm.total_backlinks) || 0,
      is_gsc_synced: false,
    };
    if (editingMetricId) {
      await supabase.from('seo_metrics').update(payload).eq('id', editingMetricId);
      toastOk('Metrike ažurirane');
    } else {
      await supabase.from('seo_metrics').upsert(payload, { onConflict: 'seo_project_id,month' });
      toastOk('Mesec dodat');
    }
    clearMetricForm();
    await refetch();
    setSaving(null);
  };

  const handleDeleteMetrics = async (mId: string) => {
    await supabase.from('seo_metrics').delete().eq('id', mId);
    if (editingMetricId === mId) clearMetricForm();
    toastOk('Mesec obrisan');
    await refetch();
  };

  // ── Keywords ─────────────────────────────────────────────────────────────────
  const handleAddKeyword = async () => {
    if (!id || !newKeyword.trim()) return;
    setSaving('keywords');
    const pos = newKeywordPos.trim() ? Number(newKeywordPos) : null;
    await supabase.from('seo_keywords').insert({ seo_project_id: id, keyword: newKeyword.trim(), current_position: pos, previous_position: null });
    setNewKeyword('');
    setNewKeywordPos('');
    toastOk('Keyword dodat');
    await refetch();
    setSaving(null);
  };

  const handleUpdateKeyword = useCallback(async (kwId: string, field: string, val: string) => {
    const num = val === '' ? null : Number(val);
    await supabase.from('seo_keywords').update({ [field]: num }).eq('id', kwId);
    toastOk('Pozicija sačuvana');
    await refetch();
  }, [refetch]);

  const handleDeleteKeyword = async (kwId: string) => {
    await supabase.from('seo_keywords').delete().eq('id', kwId);
    toastOk('Keyword obrisan');
    await refetch();
  };

  // ── Tasks ────────────────────────────────────────────────────────────────────
  const handleAddTask = async () => {
    if (!id || !newTask.title.trim()) return;
    setSaving('tasks');
    const maxPos = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) : 0;
    await supabase.from('seo_tasks').insert({ seo_project_id: id, title: newTask.title.trim(), subtitle: newTask.subtitle.trim() || null, status: newTask.status, position: maxPos + 1 });
    setNewTask({ title: '', subtitle: '', status: 'next' });
    toastOk('Zadatak dodat');
    await refetch();
    setSaving(null);
  };

  const handleUpdateTask = async (taskId: string, field: string, val: string) => {
    await supabase.from('seo_tasks').update({ [field]: val }).eq('id', taskId);
    toastOk('Zadatak ažuriran');
    await refetch();
  };

  const handleDeleteTask = async (taskId: string) => {
    await supabase.from('seo_tasks').delete().eq('id', taskId);
    toastOk('Zadatak obrisan');
    await refetch();
  };

  // ── Progress bars ──────────────────────────────────────────────────────────
  const handleAddProgress = async () => {
    if (!id || !newProgress.category.trim()) return;
    setSaving('progress');
    const maxPos = progress.length > 0 ? Math.max(...progress.map(p => p.position)) : 0;
    await supabase.from('seo_progress').insert({ seo_project_id: id, category: newProgress.category.trim(), percentage: Math.min(100, Math.max(0, newProgress.percentage)), color: newProgress.color, position: maxPos + 1 });
    setNewProgress({ category: '', percentage: 0, color: 'cyan' });
    toastOk('Kategorija dodata');
    await refetch();
    setSaving(null);
  };

  const handleUpdateProgress = async (pId: string, field: string, val: string | number) => {
    await supabase.from('seo_progress').update({ [field]: val }).eq('id', pId);
    toastOk('Napredak ažuriran');
    await refetch();
  };

  const handleDeleteProgress = async (pId: string) => {
    await supabase.from('seo_progress').delete().eq('id', pId);
    toastOk('Kategorija obrisana');
    await refetch();
  };

  // ── Alerts ───────────────────────────────────────────────────────────────────
  const handleAddAlert = async () => {
    if (!id || !newAlert.trim()) return;
    await supabase.from('seo_alerts').insert({ seo_project_id: id, message: newAlert.trim() });
    setNewAlert('');
    toastOk('Upozorenje dodato');
    await refetch();
  };

  const handleDeleteAlert = async (aId: string) => {
    await supabase.from('seo_alerts').delete().eq('id', aId);
    toastOk('Upozorenje obrisano');
    await refetch();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
    </div>
  );

  if (!seoProject) return (
    <>
      <Topbar title="SEO projekat" />
      <main className="px-6 py-5"><p className="text-[#9aa3b2]">Projekat nije pronađen.</p></main>
    </>
  );

  return (
    <>
      <Toaster position="top-center" />
      <Topbar title={seoProject.domain} />

      <main className="px-6 py-5 portal-scrollbar">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/portal/admin/seo')}
                className="flex items-center gap-1.5 text-[13px] text-[#5a6478] hover:text-[#1a2030] transition-colors">
                <ArrowLeft size={15} /> SEO projekti
              </button>
              <span className="text-[#e3e7ee]">/</span>
              <span className="text-[13px] font-medium text-[#1a2030]">{seoProject.domain}</span>
            </div>
            <button onClick={handleExportPDF} disabled={exporting}
              className="portal-btn portal-btn-secondary text-[12px] py-2 px-3 disabled:opacity-40 flex items-center gap-1.5">
              {exporting ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
              Izvezi izveštaj
            </button>
          </div>

          {/* ── Hero Traffic Chart ──────────────────────────────── */}
          <div ref={reportRef}>
          <Section title="Saobraćaj kroz vreme" action={
            latestMetrics ? (
              <span className="text-[10px] text-[#9aa3b2]">
                Poslednje ažuriranje: {new Date(latestMetrics.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' })}
              </span>
            ) : null
          }>
            <TrafficChart data={metricsHistory} />
            {/* Summary metrics below chart */}
            {latestMetrics && (
              <div className="flex items-center gap-6 pt-3 mt-3 border-t border-[#f0f2f5]">
                <div>
                  <p className="text-[9px] text-[#9aa3b2] uppercase tracking-wide">Poseti</p>
                  <p className="text-[16px] font-bold text-[#1D9E75]">
                    {(latestMetrics.organic_visits ?? 0).toLocaleString()}
                    {previousMetrics && (previousMetrics.organic_visits ?? 0) > 0 && <DeltaBadge current={latestMetrics.organic_visits ?? 0} previous={previousMetrics.organic_visits ?? 0} />}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#9aa3b2] uppercase tracking-wide">Klikovi</p>
                  <p className="text-[16px] font-bold text-[#1a1f4e]">
                    {(latestMetrics.clicks ?? 0).toLocaleString()}
                    {previousMetrics && (previousMetrics.clicks ?? 0) > 0 && <DeltaBadge current={latestMetrics.clicks ?? 0} previous={previousMetrics.clicks ?? 0} />}
                  </p>
                </div>
                {latestMetrics.avg_position != null && (
                  <div>
                    <p className="text-[9px] text-[#9aa3b2] uppercase tracking-wide">Avg. pozicija</p>
                    <p className="text-[16px] font-bold text-[#0faa6e]">
                      {latestMetrics.avg_position.toFixed(1)}
                      {previousMetrics?.avg_position != null && <DeltaBadge current={latestMetrics.avg_position} previous={previousMetrics.avg_position} invertColor />}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[9px] text-[#9aa3b2] uppercase tracking-wide">Backlinks</p>
                  <p className="text-[16px] font-bold text-[#1a2030]">
                    {latestMetrics.total_backlinks ?? 0}
                    {previousMetrics && (previousMetrics.total_backlinks ?? 0) > 0 && <DeltaBadge current={latestMetrics.total_backlinks ?? 0} previous={previousMetrics.total_backlinks ?? 0} />}
                  </p>
                </div>
              </div>
            )}
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ══ LEFT COLUMN ══════════════════════════════════════════════ */}
            <div>

              {/* ── GSC Connection ────────────────────────────────────── */}
              <Section title="Google Search Console" action={
                <div className="flex items-center gap-1.5">
                  <Link2 size={12} className="text-[#9aa3b2]" />
                  <span className="text-[10px] text-[#9aa3b2]">API konekcija</span>
                </div>
              }>
                <div className="space-y-3">
                  <Input label="GSC Property URL"
                    placeholder="sc-domain:primer.rs  ili  https://primer.rs/"
                    defaultValue={seoProject.gsc_property_id || ''}
                    onBlur={e => handleGscUpdate('gsc_property_id', e.target.value.trim() || '')} />

                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#e3e7ee] bg-[#f7f8fa]">
                    <div>
                      <p className="text-[12px] font-medium text-[#1a2030]">Automatsko ažuriranje</p>
                      <p className="text-[11px] text-[#9aa3b2] mt-0.5">GSC povlači podatke za prethodni mesec</p>
                    </div>
                    <button
                      onClick={() => handleGscUpdate('gsc_auto_update', !seoProject.gsc_auto_update)}
                      className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${seoProject.gsc_auto_update ? 'bg-[#00bcd4]' : 'bg-[#e3e7ee]'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${seoProject.gsc_auto_update ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>

                  <button onClick={handleGscSync} disabled={gscSyncing || !seoProject.gsc_property_id}
                    className="portal-btn portal-btn-secondary w-full text-[12px] disabled:opacity-40">
                    {gscSyncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    Povuci podatke iz GSC
                  </button>

                  {gscMsg && (
                    <div className={`flex items-center gap-2 p-2.5 rounded-lg text-[12px] ${gscMsg.type === 'ok' ? 'bg-[#e6f8f2] text-[#0faa6e]' : 'bg-[#fff0f0] text-[#e53e3e]'}`}>
                      {gscMsg.type === 'ok' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                      {gscMsg.text}
                    </div>
                  )}

                  <p className="text-[10px] text-[#9aa3b2] leading-relaxed">
                    Za konekciju GSC API-a: u Supabase dodajte env var <code className="bg-[#e3e7ee] px-1 rounded">GOOGLE_SERVICE_ACCOUNT_JSON</code> sa sadržajem vašeg Service Account JSON fajla. Servis account email mora imati pristup GSC propertyju.
                  </p>
                </div>
              </Section>

              {/* ── Monthly metrics ───────────────────────────────────── */}
              <Section title="Mesečne metrike" action={
                saving === 'metrics' ? <Loader2 size={13} className="text-[#00bcd4] animate-spin" /> : null
              }>

                {/* Existing metrics table */}
                {metricsHistory.length > 0 && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-[#e3e7ee]">
                          {['Mesec','Poseti','Klikovi','Avg. poz.','Novi BL','Ukup. BL',''].map(h => (
                            <th key={h} className={`py-2 text-[#9aa3b2] font-medium ${h === '' ? 'w-14' : 'text-left'} ${h !== 'Mesec' && h !== '' ? 'text-right' : ''}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...metricsHistory].reverse().map(m => {
                          const isEditing = editingMetricId === m.id;
                          return (
                            <tr key={m.id}
                              className={`border-b border-[#f7f8fa] last:border-none group transition-colors cursor-pointer ${isEditing ? 'bg-[#e6f7fa]' : 'hover:bg-[#f7f8fa]'}`}
                              onClick={() => { if (!isEditing) loadMetricForEdit(m); }}>
                              <td className="py-2 text-[#1a2030]">
                                <div className="flex items-center gap-1.5">
                                  {new Date(m.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'short', year: 'numeric' })}
                                  {m.is_gsc_synced && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#e6f7fa] text-[#00bcd4] font-medium">GSC</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 text-right font-semibold text-[#00bcd4]">{m.organic_visits.toLocaleString()}</td>
                              <td className="py-2 text-right text-[#5a6478]">{m.clicks > 0 ? m.clicks.toLocaleString() : '—'}</td>
                              <td className="py-2 text-right text-[#0faa6e]">{m.avg_position != null ? m.avg_position.toFixed(1) : '—'}</td>
                              <td className="py-2 text-right text-[#1a2030]">+{m.new_backlinks}</td>
                              <td className="py-2 text-right text-[#1a2030]">{m.total_backlinks}</td>
                              <td className="py-2 text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <button onClick={(e) => { e.stopPropagation(); loadMetricForEdit(m); }}
                                    className="text-[#e3e7ee] hover:text-[#00bcd4] opacity-0 group-hover:opacity-100 transition-all">
                                    <Pencil size={12} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteMetrics(m.id); }}
                                    className="text-[#e3e7ee] hover:text-[#FF4D4D] opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add / Edit month form */}
                <div className={`border rounded-lg p-3 space-y-2 transition-colors ${editingMetricId ? 'border-[#00bcd4] bg-[#e6f7fa]/30' : 'border-[#e3e7ee] bg-[#f7f8fa]'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-[#5a6478]">
                      {editingMetricId ? '✏️ Izmeni mesec' : '➕ Dodaj novi mesec'}
                    </p>
                    {editingMetricId && (
                      <button onClick={clearMetricForm} className="text-[11px] text-[#9aa3b2] hover:text-[#1a2030] flex items-center gap-1 transition-colors">
                        <X size={12} /> Otkaži
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Mesec" type="month"
                      value={metricsForm.month ? metricsForm.month.substring(0, 7) : ''}
                      onChange={e => setMetricsForm(p => ({ ...p, month: e.target.value + '-01' }))}
                      disabled={!!editingMetricId} />
                    <Input label="Organski poseti" type="number" min="0" placeholder="1240"
                      value={metricsForm.organic_visits ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, organic_visits: +e.target.value }))} />
                    <Input label="GSC klikovi" type="number" min="0" placeholder="980"
                      value={metricsForm.clicks ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, clicks: +e.target.value }))} />
                    <Input label="Impresije" type="number" min="0" placeholder="12400"
                      value={metricsForm.impressions ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, impressions: +e.target.value }))} />
                    <Input label="Prosečna pozicija" type="number" min="0" step="0.1" placeholder="14.2"
                      value={metricsForm.avg_position ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, avg_position: +e.target.value }))} />
                    <Input label="Novi backlinks" type="number" min="0" placeholder="5"
                      value={metricsForm.new_backlinks ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, new_backlinks: +e.target.value }))} />
                    <Input label="Ukupno backlinks" type="number" min="0" placeholder="38"
                      value={metricsForm.total_backlinks ?? ''}
                      onChange={e => setMetricsForm(p => ({ ...p, total_backlinks: +e.target.value }))} />
                  </div>
                  <button onClick={handleSaveMetrics} disabled={!metricsForm.month || saving === 'metrics'}
                    className="portal-btn portal-btn-primary w-full text-[12px] disabled:opacity-40 flex items-center justify-center gap-2">
                    {saving === 'metrics' ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {editingMetricId ? 'Sačuvaj izmene' : 'Dodaj mesec'}
                  </button>
                </div>
              </Section>

              {/* ── Keywords ─────────────────────────────────────────── */}
              <Section title="Keywords — pozicije" action={
                saving === 'keywords' ? <Loader2 size={13} className="text-[#00bcd4] animate-spin" /> :
                <span className="text-[10px] text-[#9aa3b2]">{keywords.length} praćenih</span>
              }>
                {keywords.length > 0 && (
                  <div className="mb-4">
                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_52px_52px_36px_28px] gap-2 px-3 mb-1.5">
                      <span className="text-[10px] text-[#9aa3b2] uppercase tracking-wide">Ključna reč</span>
                      <span className="text-[10px] text-[#9aa3b2] text-center uppercase tracking-wide">Preth.</span>
                      <span className="text-[10px] text-[#9aa3b2] text-center uppercase tracking-wide">Tren.</span>
                      <span className="text-[10px] text-[#9aa3b2] text-center uppercase tracking-wide">Trend</span>
                      <span />
                    </div>
                    <div className="space-y-1.5">
                      {keywords.map(kw => (
                        <div key={kw.id}
                          className="grid grid-cols-[1fr_52px_52px_36px_28px] gap-2 items-center rounded-lg border border-[#e3e7ee] bg-white px-3 py-2 group hover:border-[#cdd3de] transition-all">
                          <span className="text-[13px] text-[#1a2030] truncate">{kw.keyword}</span>
                          <input type="number" min="0" max="999"
                            className="bg-transparent text-[13px] text-[#9aa3b2] text-center w-full outline-none focus:text-[#00bcd4]"
                            placeholder="—"
                            defaultValue={kw.previous_position ?? ''}
                            key={`prev-${kw.id}-${kw.previous_position}`}
                            onBlur={e => {
                              const newVal = e.target.value;
                              const oldVal = kw.previous_position != null ? String(kw.previous_position) : '';
                              if (newVal !== oldVal) handleUpdateKeyword(kw.id, 'previous_position', newVal);
                            }} />
                          <input type="number" min="0" max="999"
                            className="bg-transparent text-[13px] text-[#1a2030] font-medium text-center w-full outline-none focus:text-[#00bcd4]"
                            placeholder="—"
                            defaultValue={kw.current_position ?? ''}
                            key={`curr-${kw.id}-${kw.current_position}`}
                            onBlur={e => {
                              const newVal = e.target.value;
                              const oldVal = kw.current_position != null ? String(kw.current_position) : '';
                              if (newVal !== oldVal) handleUpdateKeyword(kw.id, 'current_position', newVal);
                            }} />
                          <div className="flex justify-center">
                            <KeywordTrend current={kw.current_position} previous={kw.previous_position} />
                          </div>
                          <button onClick={() => handleDeleteKeyword(kw.id)}
                            className="p-1 rounded-md text-[#9aa3b2] hover:text-[#e53e3e] hover:bg-[#e53e3e]/5 opacity-0 group-hover:opacity-100 transition-all flex justify-center">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border border-dashed border-[#e3e7ee] rounded-lg p-3">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[11px] text-[#9aa3b2] mb-1 block">Keyword</label>
                      <input type="text" className="portal-input text-[13px]" placeholder="Dodaj keyword..."
                        value={newKeyword}
                        onChange={e => setNewKeyword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} />
                    </div>
                    <div className="w-16">
                      <label className="text-[11px] text-[#9aa3b2] mb-1 block">Pozicija</label>
                      <input type="number" min="1" max="999" className="portal-input text-[13px] text-center" placeholder="—"
                        value={newKeywordPos}
                        onChange={e => setNewKeywordPos(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} />
                    </div>
                    <button onClick={handleAddKeyword}
                      disabled={!newKeyword.trim()}
                      className="portal-btn portal-btn-primary text-[12px] py-2 px-3 disabled:opacity-40 shrink-0">
                      <Plus size={14} /> Dodaj
                    </button>
                  </div>
                </div>
              </Section>
            </div>

            {/* ══ RIGHT COLUMN ═════════════════════════════════════════════ */}
            <div>

              {/* ── SEO Progress ──────────────────────────────────────── */}
              <Section title="SEO napredak — progress bars" action={
                saving === 'progress' ? <Loader2 size={13} className="text-[#00bcd4] animate-spin" /> : null
              }>
                {progress.length > 0 && (
                  <div className="space-y-2.5 mb-4">
                    {progress.map(p => {
                      const color = COLOR_HEX[p.color] || '#00bcd4';
                      return (
                        <div key={p.id}
                          className="rounded-lg border border-[#e3e7ee] bg-white px-3 py-2.5 group transition-all hover:border-[#cdd3de]">
                          <div className="flex items-center gap-3">
                            {/* Color dot */}
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                            {/* Inline editable name */}
                            <input type="text"
                              className="bg-transparent text-[13px] text-[#1a2030] font-medium flex-1 min-w-0 outline-none focus:text-[#00bcd4] transition-colors"
                              defaultValue={p.category}
                              key={`cat-${p.id}-${p.category}`}
                              onBlur={e => {
                                if (e.target.value !== p.category) handleUpdateProgress(p.id, 'category', e.target.value);
                              }} />
                            {/* Percentage */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <input type="number" min="0" max="100"
                                className="bg-transparent text-[13px] text-[#1a2030] font-medium w-9 text-right outline-none focus:text-[#00bcd4]"
                                defaultValue={p.percentage}
                                key={`pct-${p.id}-${p.percentage}`}
                                onBlur={e => {
                                  const newVal = Math.min(100, Math.max(0, +e.target.value));
                                  if (newVal !== p.percentage) handleUpdateProgress(p.id, 'percentage', newVal);
                                }} />
                              <span className="text-[11px] text-[#9aa3b2]">%</span>
                            </div>
                            {/* Color selector */}
                            <select className="bg-transparent text-[11px] text-[#9aa3b2] outline-none cursor-pointer shrink-0"
                              defaultValue={p.color}
                              key={`col-${p.id}-${p.color}`}
                              onChange={e => handleUpdateProgress(p.id, 'color', e.target.value)}>
                              {PROGRESS_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {/* Delete */}
                            <button onClick={() => handleDeleteProgress(p.id)}
                              className="p-1 rounded-md text-[#9aa3b2] hover:text-[#e53e3e] hover:bg-[#e53e3e]/5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                              <Trash2 size={13} />
                            </button>
                          </div>
                          {/* Bar */}
                          <div className="h-1.5 rounded-full bg-[#f0f2f5] overflow-hidden mt-2">
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${p.percentage}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Add new */}
                <div className="border border-dashed border-[#e3e7ee] rounded-lg p-3 space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-[11px] text-[#9aa3b2] mb-1 block">Kategorija</label>
                      <input className="portal-input text-[13px]" placeholder="On-page optimizacija"
                        value={newProgress.category}
                        onChange={e => setNewProgress(p => ({ ...p, category: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleAddProgress()} />
                    </div>
                    <div className="w-16">
                      <label className="text-[11px] text-[#9aa3b2] mb-1 block">%</label>
                      <input className="portal-input text-[13px] text-center" type="number" min="0" max="100" placeholder="78"
                        value={newProgress.percentage || ''}
                        onChange={e => setNewProgress(p => ({ ...p, percentage: +e.target.value }))} />
                    </div>
                    <div className="w-20">
                      <label className="text-[11px] text-[#9aa3b2] mb-1 block">Boja</label>
                      <select className="portal-input text-[13px]"
                        value={newProgress.color}
                        onChange={e => setNewProgress(p => ({ ...p, color: e.target.value }))}>
                        {PROGRESS_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <button onClick={handleAddProgress}
                      disabled={!newProgress.category.trim()}
                      className="portal-btn portal-btn-primary text-[12px] py-2 px-3 disabled:opacity-40 shrink-0">
                      <Plus size={14} /> Dodaj
                    </button>
                  </div>
                </div>
              </Section>

              {/* ── Tasks ────────────────────────────────────────────── */}
              <Section title="Zadaci ovog meseca" action={
                saving === 'tasks' ? <Loader2 size={13} className="text-[#00bcd4] animate-spin" /> :
                <span className="text-[10px] text-[#9aa3b2]">{tasks.length} zadataka</span>
              }>
                <div className="space-y-2">
                  {tasks.map(t => {
                    const sc = TASK_STATUSES.find(s => s.value === t.status);
                    const isActive = t.status === 'wip';
                    return (
                      <div key={t.id}
                        className={`rounded-lg border px-3 py-2.5 transition-all group ${
                          isActive ? 'border-[#00bcd4]/20 bg-[#e6f7fa]/30' : 'border-[#e3e7ee] bg-white'
                        }`}>
                        <div className="flex items-start gap-3">
                          {/* Status dot */}
                          <div className="w-2 h-2 rounded-full mt-[7px] shrink-0" style={{ background: sc?.color || '#9aa3b2' }} />
                          {/* Editable fields */}
                          <div className="flex-1 min-w-0">
                            <input type="text"
                              className="bg-transparent text-[13px] text-[#1a2030] font-medium w-full outline-none focus:text-[#00bcd4] transition-colors"
                              defaultValue={t.title}
                              key={`ttl-${t.id}-${t.title}`}
                              onBlur={e => {
                                if (e.target.value !== t.title) handleUpdateTask(t.id, 'title', e.target.value);
                              }} />
                            <input type="text"
                              className="bg-transparent text-[12px] text-[#5a6478] w-full outline-none mt-0.5"
                              defaultValue={t.subtitle || ''}
                              key={`sub-${t.id}-${t.subtitle}`}
                              placeholder="Podnaslov / rok..."
                              onBlur={e => {
                                if (e.target.value !== (t.subtitle || '')) handleUpdateTask(t.id, 'subtitle', e.target.value);
                              }} />
                          </div>
                          {/* Status buttons */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {TASK_STATUSES.map(s => {
                              const isCurrentStatus = t.status === s.value;
                              const btnColor = s.value === 'done' ? 'text-[#0faa6e] bg-[#e6f8f2]'
                                : s.value === 'wip' ? 'text-[#00bcd4] bg-[#e6f7fa]'
                                : 'text-[#9aa3b2] bg-[#f7f8fa]';
                              return (
                                <button key={s.value}
                                  title={s.label}
                                  onClick={() => { if (!isCurrentStatus) handleUpdateTask(t.id, 'status', s.value); }}
                                  className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                                    isCurrentStatus ? btnColor : 'text-[#9aa3b2] hover:text-[#5a6478] hover:bg-[#f7f8fa]'
                                  }`}>
                                  {s.label.substring(0, 3)}
                                </button>
                              );
                            })}
                            <button onClick={() => handleDeleteTask(t.id)}
                              className="p-1 rounded-md text-[#9aa3b2] hover:text-[#e53e3e] hover:bg-[#e53e3e]/5 opacity-0 group-hover:opacity-100 transition-all ml-0.5">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add task */}
                <div className="mt-3 border border-dashed border-[#e3e7ee] rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="text" className="portal-input text-[13px]" style={{ flex: 1, width: 'auto' }} placeholder="Naziv zadatka..."
                      value={newTask.title}
                      onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddTask()} />
                    <select className="portal-input text-[13px]" style={{ width: '7rem', flex: 'none' }}
                      value={newTask.status}
                      onChange={e => setNewTask(p => ({ ...p, status: e.target.value as SeoTaskStatus }))}>
                      {TASK_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" className="portal-input text-[12px]" style={{ flex: 1, width: 'auto' }} placeholder="Podnaslov / rok... (opciono)"
                      value={newTask.subtitle}
                      onChange={e => setNewTask(p => ({ ...p, subtitle: e.target.value }))} />
                    <button onClick={handleAddTask}
                      disabled={!newTask.title.trim()}
                      className="portal-btn portal-btn-primary text-[12px] py-2 px-3 disabled:opacity-40"
                      style={{ flex: 'none' }}>
                      <Plus size={14} /> Dodaj
                    </button>
                  </div>
                </div>
              </Section>

              {/* ── Alerts ───────────────────────────────────────────── */}
              <Section title="Upozorenja za klijenta">
                {alerts.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {alerts.map(a => (
                      <div key={a.id} className="flex items-start gap-2.5 group p-2.5 rounded-lg border"
                        style={{ background: '#fef6e4', borderColor: '#f5d07a' }}>
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-[#e8970a]" />
                        <span className="flex-1 text-[12px] text-[#8a5700] leading-relaxed">{a.message}</span>
                        <button onClick={() => handleDeleteAlert(a.id)}
                          className="p-1 rounded-md text-[#e8970a]/40 hover:text-[#e53e3e] opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border border-dashed border-[#e3e7ee] rounded-lg p-3">
                  <div className="flex gap-2">
                    <input type="text" className="portal-input flex-1 text-[13px]" placeholder="Novo upozorenje za klijenta..."
                      value={newAlert}
                      onChange={e => setNewAlert(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddAlert()} />
                    <button onClick={handleAddAlert}
                      disabled={!newAlert.trim()}
                      className="portal-btn portal-btn-primary text-[12px] py-2 px-3 disabled:opacity-40 shrink-0">
                      <Plus size={14} /> Dodaj
                    </button>
                  </div>
                </div>
              </Section>

            </div>
          </div>
          </div>{/* close reportRef */}
        </main>
    </>
  );
}
