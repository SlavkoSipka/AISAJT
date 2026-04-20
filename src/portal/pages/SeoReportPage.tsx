import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeft, Download, Eye, EyeOff, FileText } from 'lucide-react';
import { useSeoProject } from '../hooks/useSeoProject';
import { SeoReportDocument } from '../components/seo/SeoReportDocument';
import type { ReportOptions, ReportData } from '../components/seo/SeoReportDocument';
import '../portal.css';

const TOGGLE_LABELS: { key: keyof ReportOptions; label: string }[] = [
  { key: 'showTraffic',         label: 'Saobraćaj i KPI' },
  { key: 'showKeywords',        label: 'Ključne reči' },
  { key: 'showProgress',        label: 'Napredak po kategorijama' },
  { key: 'showTasks',           label: 'Aktivnosti' },
  { key: 'showBacklinks',       label: 'Backlinkovi' },
  { key: 'showRecommendations', label: 'Preporuke' },
];

export function SeoReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    seoProject, metricsHistory, latestMetrics, previousMetrics,
    keywords, tasks, progress, loading,
  } = useSeoProject(id);

  // ── Report options ──────────────────────────────────────────────────────────
  const [options, setOptions] = useState<ReportOptions>({
    showTraffic:         true,
    showKeywords:        true,
    showBacklinks:       true,
    showProgress:        true,
    showTasks:           true,
    showRecommendations: true,
    introText:           'Dragi klijente, u prilogu se nalaze rezultati SEO optimizacije za izabrani period. Nastavite sa odličnim rezultatima!',
    recommendations:     '',
    reportPeriod:        '',
  });

  // Set default period once metrics load
  useEffect(() => {
    if (latestMetrics && !options.reportPeriod) {
      setOptions(prev => ({ ...prev, reportPeriod: latestMetrics.month }));
    }
  }, [latestMetrics]);

  const toggle = (key: keyof ReportOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setStr = (key: keyof ReportOptions, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // ── Report data ─────────────────────────────────────────────────────────────
  const logoUrl = `${window.location.origin}/images/aisajt_providno-removebg-preview.png`;

  const reportData = useMemo<ReportData | null>(() => {
    if (!seoProject) return null;

    const selectedMetrics = options.reportPeriod
      ? metricsHistory.find(m => m.month === options.reportPeriod) ?? latestMetrics
      : latestMetrics;

    const selectedIdx = metricsHistory.findIndex(m => m.month === options.reportPeriod);
    const prevMetrics = selectedIdx > 0 ? metricsHistory[selectedIdx - 1] : previousMetrics;

    return {
      seoProject,
      metricsHistory,
      latestMetrics: selectedMetrics,
      previousMetrics: prevMetrics,
      keywords,
      tasks,
      progress,
      logoUrl,
    };
  }, [seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, options.reportPeriod]);

  // ── Derived filename ────────────────────────────────────────────────────────
  const filename = seoProject
    ? `AiSajt-SEO-${seoProject.domain}-${options.reportPeriod || 'izvestaj'}.pdf`
    : 'AiSajt-SEO-izvestaj.pdf';

  if (loading) {
    return (
      <div className="portal-root flex items-center justify-center min-h-screen" style={{ background: '#f0f2f7' }}>
        <div className="w-7 h-7 border-2 border-[#00bcd4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seoProject || !reportData) {
    return (
      <div className="portal-root flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#f0f2f7' }}>
        <p className="text-[#5a6478]">SEO projekat nije pronađen.</p>
        <button className="portal-btn-secondary" onClick={() => navigate(-1)}>Nazad</button>
      </div>
    );
  }

  return (
    <div className="portal-root flex flex-col" style={{ minHeight: '100vh', background: '#f0f2f7' }}>
      {/* ── Top bar ── */}
      <div style={{
        background: '#1a1f4e', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(`/portal/admin/seo/${id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
          >
            <ArrowLeft size={15} />
            Nazad
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} style={{ color: '#00bcd4' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Generator izveštaja</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>· {seoProject.domain}</span>
          </div>
        </div>

        <PDFDownloadLink
          document={<SeoReportDocument data={reportData} options={options} />}
          fileName={filename}
          style={{ textDecoration: 'none' }}
        >
          {({ loading: pdfLoading }) => (
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: pdfLoading ? 'rgba(0,188,212,0.5)' : '#00bcd4',
                border: 'none', color: '#fff', borderRadius: 6,
                padding: '7px 16px', cursor: pdfLoading ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'background 0.2s',
              }}
              disabled={pdfLoading}
            >
              <Download size={15} />
              {pdfLoading ? 'Priprema...' : 'Preuzmi PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 53px)' }}>

        {/* ── Left: options panel ── */}
        <div style={{
          width: 280, minWidth: 280, background: '#fff',
          borderRight: '1px solid #e3e7ee',
          overflowY: 'auto', padding: '20px 16px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>

          {/* Period selector */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6478', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Period izveštaja
            </label>
            <select
              value={options.reportPeriod}
              onChange={e => setStr('reportPeriod', e.target.value)}
              className="portal-input"
              style={{ fontSize: 13 }}
            >
              {metricsHistory.length === 0 && (
                <option value="">Nema dostupnih podataka</option>
              )}
              {[...metricsHistory].reverse().map(m => (
                <option key={m.id} value={m.month}>
                  {new Date(m.month + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>

          {/* Section toggles */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6478', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Sekcije
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TOGGLE_LABELS.map(({ key, label }) => {
                const isOn = options[key] as boolean;
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', borderRadius: 7, border: '1px solid',
                      borderColor: isOn ? '#00bcd4' : '#e3e7ee',
                      background: isOn ? 'rgba(0,188,212,0.06)' : '#f7f8fa',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 13, color: isOn ? '#1a1f4e' : '#9aa3b2', fontWeight: isOn ? 500 : 400 }}>{label}</span>
                    {isOn
                      ? <Eye size={14} style={{ color: '#00bcd4' }} />
                      : <EyeOff size={14} style={{ color: '#c0c6d4' }} />
                    }
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, background: '#e3e7ee' }} />

          {/* Intro text */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6478', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Uvodni tekst
            </label>
            <textarea
              value={options.introText}
              onChange={e => setStr('introText', e.target.value)}
              rows={4}
              placeholder="Napišite uvodni tekst za klijenta..."
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 7,
                border: '1px solid #e3e7ee', fontSize: 12,
                color: '#1a2030', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#00bcd4'}
              onBlur={e => e.target.style.borderColor = '#e3e7ee'}
            />
          </div>

          {/* Recommendations */}
          {options.showRecommendations && (
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5a6478', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Preporuke
              </label>
              <textarea
                value={options.recommendations}
                onChange={e => setStr('recommendations', e.target.value)}
                rows={5}
                placeholder="Unesite preporuke za klijenta (svaka linija = nova preporuka)..."
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 7,
                  border: '1px solid #e3e7ee', fontSize: 12,
                  color: '#1a2030', resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#00bcd4'}
                onBlur={e => e.target.style.borderColor = '#e3e7ee'}
              />
              <p style={{ fontSize: 10, color: '#9aa3b2', marginTop: 4 }}>
                Svaki red biće prikazan kao posebna stavka.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: live PDF preview ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <PDFViewer
            style={{ flex: 1, width: '100%', border: 'none' }}
            showToolbar={false}
          >
            <SeoReportDocument data={reportData} options={options} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
