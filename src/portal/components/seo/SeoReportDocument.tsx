import {
  Document, Page, Text, View, Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoProject } from '../../lib/types';

// ── Exported types ────────────────────────────────────────────────────────────
export interface ReportOptions {
  showTraffic:         boolean;
  showKeywords:        boolean;
  showBacklinks:       boolean;
  showProgress:        boolean;
  showTasks:           boolean;
  showRecommendations: boolean;
  introText:           string;
  recommendations:     string;
  reportPeriod:        string; // 'YYYY-MM'
}

export interface ReportData {
  seoProject:      SeoProject;
  metricsHistory:  SeoMetrics[];
  latestMetrics:   SeoMetrics | null;
  previousMetrics: SeoMetrics | null;
  keywords:        SeoKeyword[];
  tasks:           SeoTask[];
  progress:        SeoProgress[];
  logoUrl:         string;
}

// ── Colors ────────────────────────────────────────────────────────────────────
const NAVY   = '#1a1f4e';
const CYAN   = '#00bcd4';
const GREEN  = '#0faa6e';
const RED    = '#e53e3e';
const AMBER  = '#e8970a';
const GRAY   = '#f7f8fa';
const BORDER = '#e3e7ee';
const TEXT   = '#1a2030';
const TEXT2  = '#5a6478';
const TEXT3  = '#9aa3b2';
const WHITE  = '#ffffff';

const COLORMAP: Record<string, string> = {
  cyan: CYAN, green: GREEN, amber: AMBER, red: RED, purple: '#6c4fdb',
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  coverPage:   { backgroundColor: NAVY, flexDirection: 'column' },
  contentPage: { backgroundColor: WHITE },

  pageHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    backgroundColor: WHITE,
  },
  pageHeaderLeft:   { flexDirection: 'row', alignItems: 'center' },
  pageHeaderBrand:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY, letterSpacing: 0.8 },
  pageHeaderDomain: { fontSize: 8, fontFamily: 'Helvetica', color: TEXT2, marginLeft: 6 },
  pageHeaderRight:  { fontSize: 7, fontFamily: 'Helvetica', color: TEXT3 },

  content: { paddingHorizontal: 36, paddingTop: 22, paddingBottom: 40 },

  section:       { marginBottom: 24 },
  sectionHeader: { marginBottom: 10 },
  sectionTitle:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY },
  sectionRule:   { height: 2, backgroundColor: CYAN, width: 30, marginTop: 4 },

  // KPI
  kpiRow:   { flexDirection: 'row', marginBottom: 18 },
  kpiCard:  {
    flex: 1, padding: 14, marginRight: 8,
    borderRadius: 6, borderWidth: 1, borderColor: BORDER, backgroundColor: GRAY,
  },
  kpiCardLast: { marginRight: 0 },
  kpiAccent:   { height: 3, borderRadius: 2, marginBottom: 10, width: 22 },
  kpiLabel:    { fontSize: 7, fontFamily: 'Helvetica', color: TEXT3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  kpiValue:    { fontSize: 20, fontFamily: 'Helvetica-Bold', color: NAVY },
  kpiDelta:    { fontSize: 8, fontFamily: 'Helvetica', color: TEXT2, marginTop: 5 },

  // Table
  tableWrap:       { borderWidth: 1, borderColor: BORDER, borderRadius: 6, overflow: 'hidden' },
  tableHead:       { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 8, paddingHorizontal: 12 },
  tableHeadCell:   { fontSize: 7, fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.4 },
  tableRow:        { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  tableRowAlt:     { backgroundColor: GRAY },
  tableCell:       { fontSize: 9, fontFamily: 'Helvetica', color: TEXT },
  tableCellBold:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEXT },
  tableCellRight:  { fontSize: 9, fontFamily: 'Helvetica', color: TEXT, textAlign: 'right' },
  tableCellCenter: { fontSize: 9, fontFamily: 'Helvetica', color: TEXT, textAlign: 'center' },

  // Task
  taskRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  taskDot:    { width: 7, height: 7, borderRadius: 3, marginRight: 10 },
  taskTitle:  { fontSize: 9, fontFamily: 'Helvetica', color: TEXT, flex: 1 },
  taskBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },

  // Progress
  progRow:    { marginBottom: 12 },
  progHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  progLabel:  { fontSize: 9, fontFamily: 'Helvetica', color: TEXT },
  progPct:    { fontSize: 9, fontFamily: 'Helvetica-Bold', color: TEXT2 },
  progTrack:  { height: 9, backgroundColor: BORDER, borderRadius: 5 },
  progFill:   { height: 9, borderRadius: 5 },

  // Recommendations
  recsBox:  { backgroundColor: GRAY, borderRadius: 6, padding: 16, borderWidth: 1, borderColor: BORDER },
  recsText: { fontSize: 10, fontFamily: 'Helvetica', color: TEXT2, lineHeight: 1.65 },

  // Footer
  footer:     { position: 'absolute', bottom: 14, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 7, fontFamily: 'Helvetica', color: TEXT3 },
  footerLine: { position: 'absolute', bottom: 26, left: 36, right: 36, height: 0.5, backgroundColor: BORDER },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : String(n);
}
function fmtFull(n: number) { return n.toLocaleString('sr-Latn'); }
function fmtMonth(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'long', year: 'numeric' });
}
function fmtMonthShort(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('sr-Latn', { month: 'short' }).replace('.', '');
}
function deltaPct(curr: number, prev: number) {
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

// ── Bar chart (View-based — no SVG to avoid v4 blank-render bug) ──────────────
// Always renders MIN_COLS slots so a single data point doesn't fill the whole width
function BarChart({ data }: { data: SeoMetrics[] }) {
  const last = data.slice(-8);
  if (!last.length) return null;

  const CHART_H = 110;
  const MIN_COLS = 8; // chart always shows 8 column-widths minimum
  const ghostCount = Math.max(0, MIN_COLS - last.length); // empty columns appended after data
  const maxVal = Math.max(...last.map(d => d.organic_visits), 1);

  return (
    <View>
      {/* Bars row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: CHART_H, borderBottomWidth: 1, borderBottomColor: BORDER }}>
        {last.map((d, i) => {
          const pct = maxVal > 0 ? d.organic_visits / maxVal : 0;
          const barH = Math.max(pct * CHART_H, 3);
          const isLast = i === last.length - 1;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 3 }}>
              <Text style={{ fontSize: 6, fontFamily: 'Helvetica', color: isLast ? CYAN : TEXT3, marginBottom: 3, textAlign: 'center' }}>
                {d.organic_visits > 0 ? fmt(d.organic_visits) : ''}
              </Text>
              <View style={{
                width: '60%', height: barH,
                backgroundColor: isLast ? CYAN : 'rgba(0,188,212,0.4)',
                borderRadius: 2,
              }} />
            </View>
          );
        })}
        {/* Ghost columns — keep bar width proportional when few data points */}
        {Array.from({ length: ghostCount }).map((_, i) => (
          <View key={`g${i}`} style={{ flex: 1 }} />
        ))}
      </View>
      {/* Month labels */}
      <View style={{ flexDirection: 'row', marginTop: 5 }}>
        {last.map((d, i) => (
          <Text key={i} style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica', color: TEXT3, textAlign: 'center' }}>
            {fmtMonthShort(d.month)}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Page header ───────────────────────────────────────────────────────────────
function ContentHeader({ domain, period }: { domain: string; period: string }) {
  return (
    <View style={S.pageHeader}>
      <View style={S.pageHeaderLeft}>
        <Text style={S.pageHeaderBrand}>AISAJT</Text>
        <Text style={S.pageHeaderDomain}>· {domain}</Text>
      </View>
      <Text style={S.pageHeaderRight}>SEO izveštaj · {period}</Text>
    </View>
  );
}

// ── Page footer ───────────────────────────────────────────────────────────────
function ContentFooter({ generatedDate }: { generatedDate: string }) {
  return (
    <>
      <View style={S.footerLine} />
      <View style={S.footer}>
        <Text style={S.footerText}>aisajt.com</Text>
        <Text style={S.footerText}>Generisano: {generatedDate}</Text>
      </View>
    </>
  );
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={S.sectionHeader}>
      <Text style={S.sectionTitle}>{title}</Text>
      <View style={S.sectionRule} />
      {subtitle && (
        <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: TEXT3, marginTop: 5 }}>{subtitle}</Text>
      )}
    </View>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, accent, last }: {
  label: string; value: string; delta?: string; accent: string; last?: boolean;
}) {
  return (
    <View style={[S.kpiCard, last ? S.kpiCardLast : {}]}>
      <View style={[S.kpiAccent, { backgroundColor: accent }]} />
      <Text style={S.kpiLabel}>{label}</Text>
      <Text style={S.kpiValue}>{value}</Text>
      {delta ? <Text style={S.kpiDelta}>{delta}</Text> : null}
    </View>
  );
}

// ── Task status config ────────────────────────────────────────────────────────
const TASK_CFG: Record<string, { dot: string; bg: string; color: string; label: string }> = {
  done:    { dot: GREEN, bg: '#e6f8f2', color: GREEN,  label: 'Završeno'  },
  wip:     { dot: CYAN,  bg: '#e6f7fa', color: CYAN,   label: 'U toku'    },
  next:    { dot: AMBER, bg: '#fef3e2', color: AMBER,  label: 'Sledeće'   },
  planned: { dot: TEXT3, bg: GRAY,      color: TEXT3,  label: 'Planirano' },
};

// ── Highlight box (summary callout) ──────────────────────────────────────────
function HighlightBox({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: NAVY, borderRadius: 8, padding: 16, marginBottom: 18 }}>
      {items.map((item, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < items.length - 1 ? 0.5 : 0, borderRightColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: item.color || CYAN, marginBottom: 4 }}>{item.value}</Text>
          <Text style={{ fontSize: 7, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
export function SeoReportDocument({ data, options }: { data: ReportData; options: ReportOptions }) {
  const { seoProject, metricsHistory, latestMetrics, previousMetrics, keywords, tasks, progress, logoUrl } = data;

  const periodMetrics = options.reportPeriod
    ? metricsHistory.find(m => m.month.startsWith(options.reportPeriod)) ?? latestMetrics
    : latestMetrics;

  const generatedDate = new Date().toLocaleDateString('sr-Latn', { day: 'numeric', month: 'long', year: 'numeric' });
  const periodLabel = periodMetrics ? fmtMonth(periodMetrics.month) : '—';

  const visitsDelta = periodMetrics && previousMetrics && previousMetrics.organic_visits > 0
    ? deltaPct(periodMetrics.organic_visits, previousMetrics.organic_visits) : null;

  const posDelta = periodMetrics?.avg_position != null && previousMetrics?.avg_position != null
    ? Math.round((previousMetrics.avg_position - periodMetrics.avg_position) * 10) / 10 : null;

  const topInTop10 = keywords.filter(k => k.current_position != null && k.current_position <= 10).length;
  const topInTop3  = keywords.filter(k => k.current_position != null && k.current_position <= 3).length;

  const doneTasks    = tasks.filter(t => t.status === 'done').length;
  const wipTasks     = tasks.filter(t => t.status === 'wip').length;
  const plannedTasks = tasks.filter(t => t.status === 'planned' || t.status === 'next').length;

  return (
    <Document author="AiSajt" title={`SEO izveštaj — ${seoProject.domain}`} subject="SEO izveštaj">

      {/* ══════════════════════════════════════════════ STRANICA 1 — NASLOVNA */}
      <Page size="A4" style={S.coverPage}>

        {/* Cyan top bar */}
        <View style={{ height: 5, backgroundColor: CYAN }} />

        {/* Logo */}
        <View style={{ paddingHorizontal: 40, paddingTop: 36, paddingBottom: 0, alignItems: 'flex-start' }}>
          <Image src={logoUrl} style={{ width: 88, height: 'auto' }} />
        </View>

        {/* Center */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 50 }}>
          {/* Divider row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)', paddingHorizontal: 16, letterSpacing: 2.5, textTransform: 'uppercase' }}>
              SEO IZVEŠTAJ
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </View>

          {/* Domain */}
          <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: WHITE, marginBottom: 12, letterSpacing: -0.5, textAlign: 'center' }}>
            {seoProject.domain}
          </Text>

          {/* Period pill */}
          <View style={{ backgroundColor: CYAN, paddingHorizontal: 20, paddingVertical: 7, borderRadius: 99, marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.3 }}>
              {periodLabel}
            </Text>
          </View>

          {seoProject.package_name ? (
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>
              Paket: {seoProject.package_name}{seoProject.package_price ? `  ·  €${seoProject.package_price}/mes.` : ''}
            </Text>
          ) : <View style={{ marginBottom: 36 }} />}

          {/* Cover stats row */}
          {periodMetrics && (
            <View style={{ flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: CYAN }}>{fmtFull(periodMetrics.organic_visits)}</Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Organske posete</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: GREEN }}>
                  {periodMetrics.avg_position != null ? `#${periodMetrics.avg_position.toFixed(1)}` : '—'}
                </Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Prosečna pozicija</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 0.5, borderLeftColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: WHITE }}>{keywords.length}</Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Praćenih ključnih reči</Text>
              </View>
            </View>
          )}
        </View>

        {/* Bottom strip */}
        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', paddingVertical: 20, paddingHorizontal: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 }}>
            POVERLJIVO · SAMO ZA KLIJENTA
          </Text>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.35)' }}>
            Generisano: {generatedDate}
          </Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════ STRANICA 2 — PREGLED + SAOBRAĆAJ */}
      <Page size="A4" style={S.contentPage}>
        <ContentHeader domain={seoProject.domain} period={periodLabel} />

        <View style={S.content}>

          {/* Intro text */}
          {options.introText.trim() ? (
            <View style={{ marginBottom: 20, padding: 14, backgroundColor: '#f0f8ff', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: CYAN }}>
              <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica', color: TEXT2, lineHeight: 1.65 }}>
                {options.introText}
              </Text>
            </View>
          ) : null}

          {/* ── Rezultati u brojevima ──────────────────────────────────── */}
          <View style={S.section}>
            <SectionTitle title="Rezultati u brojevima" subtitle={`Period: ${periodLabel}`} />

            {/* Highlight row */}
            {periodMetrics && (
              <HighlightBox items={[
                { label: 'Organske posete', value: fmtFull(periodMetrics.organic_visits), color: CYAN },
                { label: 'Prosečna pozicija', value: periodMetrics.avg_position != null ? `#${periodMetrics.avg_position.toFixed(1)}` : '—', color: GREEN },
                { label: 'U Top 10', value: String(topInTop10), color: WHITE },
                { label: 'CTR', value: periodMetrics.ctr > 0 ? `${(periodMetrics.ctr * 100).toFixed(1)}%` : '—', color: AMBER },
              ]} />
            )}

            {/* KPI cards */}
            <View style={S.kpiRow}>
              <KpiCard
                label="Organske posete"
                value={periodMetrics ? fmtFull(periodMetrics.organic_visits) : '—'}
                delta={visitsDelta != null ? `${visitsDelta > 0 ? '+' : ''}${visitsDelta}% u odnosu na prethodni mesec` : undefined}
                accent={CYAN}
              />
              <KpiCard
                label="Prosečna pozicija"
                value={periodMetrics?.avg_position != null ? periodMetrics.avg_position.toFixed(1) : '—'}
                delta={posDelta != null ? (posDelta > 0 ? `Napredak od ${posDelta} mesta` : `Pad od ${Math.abs(posDelta)} mesta`) : undefined}
                accent={GREEN}
              />
              <KpiCard
                label="Ključne reči (ukupno)"
                value={String(keywords.length)}
                delta={`${topInTop10} u Top 10  ·  ${topInTop3} u Top 3`}
                accent="#6c4fdb"
              />
              <KpiCard
                label={seoProject.show_backlinks ? 'Novi backlinkovi' : 'GSC klikovi'}
                value={seoProject.show_backlinks
                  ? (periodMetrics ? `+${periodMetrics.new_backlinks}` : '—')
                  : (periodMetrics ? fmtFull(periodMetrics.clicks) : '—')}
                delta={seoProject.show_backlinks && periodMetrics
                  ? `${fmtFull(periodMetrics.total_backlinks)} ukupno`
                  : periodMetrics ? `${fmtFull(periodMetrics.impressions)} impresija` : undefined}
                accent={AMBER}
                last
              />
            </View>
          </View>

          {/* ── Organski saobraćaj ─────────────────────────────────────── */}
          {options.showTraffic && metricsHistory.length > 0 && (
            <View style={S.section}>
              <SectionTitle title="Organski saobraćaj po mesecima" subtitle="Broj organskih poseta — poslednji dostupni podaci" />

              <BarChart data={metricsHistory} />

              {/* Monthly table */}
              <View style={[S.tableWrap, { marginTop: 16 }]}>
                <View style={S.tableHead}>
                  <Text style={[S.tableHeadCell, { flex: 2 }]}>Mesec</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'right' }]}>Posete</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'right' }]}>Klikovi</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'right' }]}>Impresije</Text>
                  <Text style={[S.tableHeadCell, { flex: 1, textAlign: 'right' }]}>Poz.</Text>
                  <Text style={[S.tableHeadCell, { flex: 1, textAlign: 'right' }]}>CTR</Text>
                </View>
                {[...metricsHistory].reverse().slice(0, 8).map((m, i) => (
                  <View key={m.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
                    <Text style={[S.tableCellBold, { flex: 2 }]}>{fmtMonth(m.month)}</Text>
                    <Text style={[S.tableCellRight, { flex: 1.5, color: CYAN, fontFamily: 'Helvetica-Bold' }]}>{fmtFull(m.organic_visits)}</Text>
                    <Text style={[S.tableCellRight, { flex: 1.5 }]}>{m.clicks > 0 ? fmtFull(m.clicks) : '—'}</Text>
                    <Text style={[S.tableCellRight, { flex: 1.5 }]}>{m.impressions > 0 ? fmtFull(m.impressions) : '—'}</Text>
                    <Text style={[S.tableCellRight, { flex: 1, color: GREEN }]}>{m.avg_position != null ? m.avg_position.toFixed(1) : '—'}</Text>
                    <Text style={[S.tableCellRight, { flex: 1 }]}>{m.ctr > 0 ? (m.ctr * 100).toFixed(1) + '%' : '—'}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <ContentFooter generatedDate={generatedDate} />
      </Page>

      {/* ════════════════════════════════ STRANICA 3 — KLJUČNE REČI + NAPREDAK */}
      <Page size="A4" style={S.contentPage}>
        <ContentHeader domain={seoProject.domain} period={periodLabel} />

        <View style={S.content}>

          {/* ── Pozicije ključnih reči ─────────────────────────────────── */}
          {options.showKeywords && keywords.length > 0 && (
            <View style={S.section}>
              <SectionTitle
                title="Pozicije ključnih reči"
                subtitle={`Praćeno ${keywords.length} ključnih reči · ${topInTop10} u Top 10 · ${topInTop3} u Top 3`}
              />
              <View style={S.tableWrap}>
                <View style={S.tableHead}>
                  <Text style={[S.tableHeadCell, { flex: 4 }]}>Ključna reč</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'center' }]}>Preth. poz.</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'center' }]}>Trenutna</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'center' }]}>Promena</Text>
                  <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
                </View>
                {keywords.slice(0, 20).map((kw, i) => {
                  const diff = kw.current_position != null && kw.previous_position != null
                    ? kw.previous_position - kw.current_position : null;
                  const posColor = kw.current_position == null ? TEXT3
                    : kw.current_position <= 3  ? GREEN
                    : kw.current_position <= 10 ? CYAN
                    : kw.current_position <= 20 ? AMBER : RED;
                  const statusLabel = kw.current_position == null ? '—'
                    : kw.current_position <= 3  ? 'Top 3'
                    : kw.current_position <= 10 ? 'Top 10'
                    : kw.current_position <= 20 ? 'Top 20' : 'Izvan 20';
                  return (
                    <View key={kw.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
                      <Text style={[S.tableCellBold, { flex: 4 }]}>{kw.keyword}</Text>
                      <Text style={[S.tableCellCenter, { flex: 1.5, color: TEXT3 }]}>
                        {kw.previous_position != null ? `#${kw.previous_position}` : '—'}
                      </Text>
                      <Text style={[S.tableCellCenter, { flex: 1.5, color: posColor, fontFamily: 'Helvetica-Bold' }]}>
                        {kw.current_position != null ? `#${kw.current_position}` : '—'}
                      </Text>
                      <Text style={[S.tableCellCenter, { flex: 1.5, color: diff == null ? TEXT3 : diff > 0 ? GREEN : diff < 0 ? RED : TEXT3 }]}>
                        {diff == null ? '—' : diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '='}
                      </Text>
                      <Text style={[S.tableCellCenter, { flex: 1.5, color: posColor }]}>{statusLabel}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Napredak optimizacije ──────────────────────────────────── */}
          {options.showProgress && progress.length > 0 && (
            <View style={S.section}>
              <SectionTitle title="Napredak optimizacije" subtitle="Stanje radova po oblastima" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {progress.map((p, i) => {
                  const color = COLORMAP[p.color] || CYAN;
                  return (
                    <View key={p.id} style={[S.progRow, { width: '50%', paddingRight: i % 2 === 0 ? 14 : 0 }]}>
                      <View style={S.progHeader}>
                        <Text style={S.progLabel}>{p.category}</Text>
                        <Text style={[S.progPct, { color }]}>{p.percentage}%</Text>
                      </View>
                      <View style={S.progTrack}>
                        <View style={[S.progFill, { width: `${p.percentage}%`, backgroundColor: color }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Aktivnosti ────────────────────────────────────────────── */}
          {options.showTasks && tasks.length > 0 && (
            <View style={S.section}>
              <SectionTitle
                title="Aktivnosti"
                subtitle={`${doneTasks} završeno · ${wipTasks} u toku · ${plannedTasks} planirano`}
              />
              {tasks.map((t, idx) => {
                const cfg = TASK_CFG[t.status] || TASK_CFG.planned;
                return (
                  <View key={t.id} style={[S.taskRow, idx === tasks.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                    <View style={[S.taskDot, { backgroundColor: cfg.dot }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={S.taskTitle}>{t.title}</Text>
                      {t.subtitle ? (
                        <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: TEXT3, marginTop: 1 }}>{t.subtitle}</Text>
                      ) : null}
                    </View>
                    <View style={[S.taskBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: cfg.color }}>{cfg.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <ContentFooter generatedDate={generatedDate} />
      </Page>

      {/* ═══════════════════════════════ STRANICA 4 — BACKLINKOVI + PREPORUKE */}
      {(options.showBacklinks || options.showRecommendations) && (
        <Page size="A4" style={S.contentPage}>
          <ContentHeader domain={seoProject.domain} period={periodLabel} />

          <View style={S.content}>

            {/* ── Backlinkovi ─────────────────────────────────────────── */}
            {options.showBacklinks && seoProject.show_backlinks && periodMetrics && (
              <View style={S.section}>
                <SectionTitle title="Backlinkovi" subtitle="Pozadinski linkovi koji pokazuju autoritet sajta" />
                <View style={S.kpiRow}>
                  <KpiCard label="Novi backlinkovi" value={`+${periodMetrics.new_backlinks}`} accent={AMBER} />
                  <KpiCard label="Ukupno backlinkova" value={fmtFull(periodMetrics.total_backlinks)} accent={CYAN} last />
                </View>
                {metricsHistory.length > 1 && (
                  <View style={S.tableWrap}>
                    <View style={S.tableHead}>
                      <Text style={[S.tableHeadCell, { flex: 2 }]}>Mesec</Text>
                      <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'right' }]}>Novi</Text>
                      <Text style={[S.tableHeadCell, { flex: 1.5, textAlign: 'right' }]}>Ukupno</Text>
                    </View>
                    {[...metricsHistory].reverse().slice(0, 8).map((m, i) => (
                      <View key={m.id} style={[S.tableRow, i % 2 === 1 ? S.tableRowAlt : {}]}>
                        <Text style={[S.tableCellBold, { flex: 2 }]}>{fmtMonth(m.month)}</Text>
                        <Text style={[S.tableCellRight, { flex: 1.5, color: GREEN }]}>+{m.new_backlinks}</Text>
                        <Text style={[S.tableCellRight, { flex: 1.5 }]}>{fmtFull(m.total_backlinks)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* ── Preporuke ────────────────────────────────────────────── */}
            {options.showRecommendations && options.recommendations.trim() && (
              <View style={S.section}>
                <SectionTitle title="Preporuke i komentari" subtitle="Naše napomene i smernice za naredni period" />
                <View style={S.recsBox}>
                  {options.recommendations.split('\n').filter(l => l.trim()).map((line, i) => (
                    <View key={i} style={{ flexDirection: 'row', marginBottom: i < options.recommendations.split('\n').filter(l => l.trim()).length - 1 ? 9 : 0 }}>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: CYAN, marginRight: 7, marginTop: 1 }}>·</Text>
                      <Text style={[S.recsText, { fontSize: 9, flex: 1 }]}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Summary stats na kraju stranice */}
            <View style={{ flexDirection: 'row', marginTop: 16, padding: 16, backgroundColor: GRAY, borderRadius: 8, borderWidth: 1, borderColor: BORDER }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rezime perioda</Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: TEXT2, lineHeight: 1.6 }}>
                  {periodMetrics
                    ? `Domen: ${seoProject.domain}\nPosete: ${fmtFull(periodMetrics.organic_visits)} · Pozicija: ${periodMetrics.avg_position?.toFixed(1) ?? '—'} · Keywords u Top 10: ${topInTop10}`
                    : `Domen: ${seoProject.domain}`}
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: BORDER, marginHorizontal: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kontakt</Text>
                <Text style={{ fontSize: 8, fontFamily: 'Helvetica', color: TEXT2, lineHeight: 1.6 }}>
                  {'AiSajt tim\naisajt.com'}
                </Text>
              </View>
            </View>

            {/* Closing note */}
            <View style={{ marginTop: 16, paddingTop: 14, borderTopWidth: 0.5, borderTopColor: BORDER }}>
              <Text style={{ fontSize: 7.5, fontFamily: 'Helvetica', color: TEXT3, textAlign: 'center', lineHeight: 1.65 }}>
                {'Ovaj izveštaj je generisan automatski putem AiSajt platforme.\nZa pitanja i komentare kontaktirajte vas AiSajt tim na aisajt.com'}
              </Text>
            </View>
          </View>

          <ContentFooter generatedDate={generatedDate} />
        </Page>
      )}
    </Document>
  );
}
