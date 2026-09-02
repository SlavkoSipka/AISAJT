import { useEffect, useState, useRef } from 'react';
import {
  Phone,
  ArrowRight,
  ArrowDown,
  Check,
  CheckCircle,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { SEOHelmet } from '../seo/SEOHelmet';
import { ClipPlayer } from '../video/ClipPlayer';
import { trackPhoneClick, trackCTAClick } from '../../utils/analytics';
import { NAP } from '../../lib/site-config';
import { BookingCalendar, formatBookingSlot } from '../booking/BookingCalendar';
import { submitFunnelForm } from '../../utils/hubspot';

// This landing page intentionally uses a different phone number from the
// site-wide NAP — it's a dedicated call-tracking number for Meta ads
// traffic (see the "Dodaj Promet Sistem landing" commit), not a drift bug.
// Not centralized into site-config.ts on purpose.
const PHONE_DISPLAY = '061 203 9768';
const PHONE_TEL = 'tel:+381612039768';
const EMAIL = NAP.email;

/* ─── useCountUp hook ─────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(eased * target);
      if (next !== start) { start = next; setCount(next); }
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return count;
}

/* ─── useInView hook ─────────────────────────────────────────────────── */
function useInView(threshold = 0.25): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── useReveal hook – fade-up on scroll ─────────────────────────────── */
function useReveal(): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null!);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Section label ────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
      <span className="text-cyan-300 text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase">
        {children}
      </span>
    </div>
  );
}

const revealCls = (visible: boolean) =>
  `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;

export function PrometSistemPage() {
  /* Rezervacija je već upisana u Supabase; ovde samo lead u HubSpot. */
  const handleBooked = async ({ firstName, lastName, phone, email, slotAt }: {
    firstName: string; lastName: string; phone: string; email: string; slotAt: string;
  }) => {
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      await submitFunnelForm({ name: fullName, email, phone, termin: formatBookingSlot(slotAt), source: 'promet-sistem' });
      trackCTAClick('Booking Form Submit', 'promet-sistem', 'sr');
    } catch {
      /* Termin je sačuvan i bez HubSpot-a — ne prekidamo korisnika. */
    }
  };

  const [heroVisible, setHeroVisible] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const [statsRef, statsInView] = useInView(0.4);
  const countUpiti = useCountUp(30, 1400, statsInView);

  const [priceRef, priceVisible] = useReveal();
  const [finalRef, finalVisible] = useReveal();

  /* Sekcije preuzete sa /izrada-sajta-detalji (bez portfolija). */
  const [metricsRef, metricsVisible] = useReveal();
  const [teamRef, teamVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  /* Zaseban brojac od onog u hero traci, da se ne dele isti ref. */
  const [metricsStatsRef, metricsStatsInView] = useInView(0.3);
  const c1 = useCountUp(50, 1200, metricsStatsInView);
  const c2 = useCountUp(50, 1200, metricsStatsInView);
  const c3 = useCountUp(100, 1400, metricsStatsInView);
  const c4 = useCountUp(1, 800, metricsStatsInView);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 560);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onPhoneClick = (location: string) => {
    trackPhoneClick(PHONE_DISPLAY, location, 'sr');
  };

  const scrollTo = (id: string, label: string) => {
    trackCTAClick(label, 'promet-sistem', 'sr');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A121C] text-white overflow-x-hidden" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      <SEOHelmet
        title="Promet Sistem — reklame koje dovode klijente | AiSajt"
        description="Pravimo ti reklame na Instagramu i Facebooku i dovodimo klijente direktno na tvoj telefon. Pogledaj video i cene."
        keywords="promet sistem, meta reklame, reklame za firme, marketing agencija, dovođenje klijenata"
        canonicalUrl="https://aisajt.com/promet-sistem"
      />

      {/* ambient glows */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Vidi komentar na /izrada-sajta-detalji: na telefonu ostaje jedan
            blaži krug, jer fixed blur filteri jedu frejmove skrola. */}
        <div className="absolute -top-[380px] left-1/2 -translate-x-1/2 w-[1100px] h-[800px] bg-cyan-500/10 rounded-full blur-[70px] md:blur-[140px]" />
        <div className="hidden md:block absolute top-[40%] -left-52 w-[600px] h-[600px] bg-cyan-600/[0.06] rounded-full blur-[120px]" />
        <div className="hidden md:block absolute top-[70%] -right-52 w-[600px] h-[600px] bg-blue-600/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* top bar */}
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex items-center justify-between">
          <img
            src="/images/aisajt-logo-white-text.png" width={644} height={223}
            alt="AiSajt"
            className="h-8 md:h-9 w-auto object-contain" loading="lazy" />
          <a
            href={PHONE_TEL}
            onClick={() => onPhoneClick('promet-sistem-header')}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/[0.06] text-cyan-300 text-sm font-bold hover:bg-cyan-400/15 hover:border-cyan-300/60 transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" />
            {PHONE_DISPLAY}
          </a>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-8 md:pt-16 pb-16 md:pb-24">
        <div className="max-w-4xl lg:max-w-[61.6rem] mx-auto px-5 md:px-8">
          <div className={`text-center transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-black tracking-tighter leading-[0.95] text-[44px] sm:text-6xl lg:text-7xl">
              PROMET <span className="text-cyan-400">SISTEM</span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/60 font-light">
              Dovodimo ti klijente preko Instagrama i Facebooka
            </p>
          </div>

          {/* video */}
          <div className={`mt-10 transition-all duration-1000 delay-200 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-400/20 bg-black max-w-3xl lg:max-w-[57.6rem] mx-auto">
              {/* Loop se vrti sa našeg domena, pun klip stiže sa Vimea na klik. */}
              <ClipPlayer
                vimeoId="1222709691"
                loopSrc="/videos/promet-sistem-loop.mp4"
                poster="/videos/promet-sistem-poster.webp"
                title="Promet Sistem — kako radi"
                headline="Pusti ceo video"
                subline="Sa zvukom, od početka"
                accentButton="bg-cyan-400/95 text-[#06121C] shadow-[0_0_40px_rgba(34,211,238,0.4)] group-hover:bg-cyan-300"
                accentBadge="bg-black/60 border-cyan-400/20"
              />
            </div>
          </div>

          {/* stat band */}
          <div ref={statsRef} className={`mt-8 max-w-xl mx-auto rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] px-6 py-5 flex items-center gap-5 transition-all duration-1000 delay-300 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-5xl font-black text-cyan-400 tabular-nums leading-none">
              {countUpiti}+
            </span>
            <div>
              <p className="font-bold text-base leading-snug">
                garantovanih leadova — ljudi koji ostave svoje podatke. Svakog meseca.
              </p>
              <p className="text-sm text-white/55 mt-1">
                To ti je bar jedan novi kontakt dnevno, pravo na telefon.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className={`mt-9 flex flex-col sm:flex-row gap-3.5 justify-center transition-all duration-1000 delay-300 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a
              href={PHONE_TEL}
              onClick={() => onPhoneClick('promet-sistem-hero')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cyan-400 text-[#06121C] text-lg font-black hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_40px_rgba(34,211,238,0.35)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)]"
            >
              <Phone className="w-5 h-5" />
              Pozovi: {PHONE_DISPLAY}
            </a>
            <button
              onClick={() => scrollTo('cene', 'Vidi cene')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 text-white/80 text-lg font-semibold hover:border-cyan-400/50 hover:text-white transition-all duration-300"
            >
              Vidi cene
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── ZAKAZIVANJE ────────────────────────────────── */}
      {/* Stoji odmah ispod videa — isti kalendar kao na /izrada-sajta-detalji. */}
      <section id="booking-form" className="relative z-10 py-16 md:py-24 border-t border-white/[0.06] scroll-mt-20">
        <div className="max-w-xl mx-auto px-5 md:px-8">
          <div className="text-center mb-5 md:mb-7">
            <span className="inline-block bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-3">
              Besplatna konsultacija
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Zakaži poziv <span className="text-cyan-400">odmah</span>
            </h2>
            <p className="mt-3 text-white/60 text-sm md:text-base">
              Izaberi termin koji ti odgovara. Poziv je besplatan i bez obaveze.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-sky-600 p-[2px]">
              <div className="absolute inset-0 rounded-2xl bg-[#0D1926]" />
            </div>
            <div className="relative z-10 bg-[#0D1926] p-4 sm:p-6 md:p-8">
              <BookingCalendar language="sr" onBooked={handleBooked} accent="cyan" source="promet-sistem" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CENE ─────────────────────────────────────────────────────── */}
      <section id="cene" ref={priceRef} className={`relative z-10 py-16 md:py-24 border-t border-white/[0.06] ${revealCls(priceVisible)}`}>
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <SectionLabel>Paketi i cene</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Nema tajni. Evo tačno šta plaćaš.
          </h2>

          <div className="mt-12 grid lg:grid-cols-2 gap-6 items-stretch">
            {/* Classic */}
            <div className="relative rounded-3xl border-2 border-cyan-400/60 bg-white/[0.04] p-8 md:p-10 flex flex-col shadow-[0_0_60px_rgba(34,211,238,0.12)]">
              <span className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-cyan-400 text-[#06121C] text-xs font-black tracking-widest uppercase">
                Većina kreće ovde
              </span>
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-cyan-300">Opcija 1</p>
              <h3 className="mt-2 text-2xl md:text-3xl font-black">Promet Sistem Classic</h3>

              <div className="mt-7 space-y-4">
                <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-white/10">
                  <span className="text-white/70">Reklame na startu (Meta budžet)</span>
                  <span className="text-xl font-black text-cyan-400 whitespace-nowrap">100 – 200 €</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-white/10">
                  <span className="text-white/70">Naš rad — plaćaš na kraju meseca</span>
                  <span className="text-xl font-black text-cyan-400 whitespace-nowrap">250 €</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <span className="text-lg font-bold">Ukupno mesečno</span>
                  <span className="text-4xl font-black text-cyan-400 whitespace-nowrap">350 – 450 €</span>
                </div>
              </div>

              <p className="mt-6 text-sm text-white/50 leading-relaxed">
                Kreneš sa 100 do 200 € za reklame — koliko ti odgovara na startu. Nas plaćaš
                tek na kraju meseca, kad vidiš koliko ti je ljudi došlo.
              </p>

              <a
                href={PHONE_TEL}
                onClick={() => onPhoneClick('promet-sistem-pricing-classic')}
                className="mt-8 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-cyan-400 text-[#06121C] font-black text-lg hover:bg-cyan-300 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Pozovi i kreni
              </a>
            </div>

            {/* PRO */}
            <div className="rounded-3xl border border-white/[0.1] bg-white/[0.02] p-8 md:p-10 flex flex-col">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/40">Opcija 2</p>
              <h3 className="mt-2 text-2xl md:text-3xl font-black">
                Promet Sistem <span className="text-cyan-400">PRO</span>
              </h3>

              <div className="mt-7">
                <p className="text-3xl md:text-4xl font-black text-white">
                  od 1.000 do 10.000 €
                </p>
                <p className="text-white/50 mt-1">mesečno, uz dogovor</p>
              </div>

              <ul className="mt-7 space-y-3.5">
                {[
                  'Sve iz Classic paketa',
                  'Profesionalno snimanje kod tebe',
                  'Video reklame, ne samo statične',
                  'Veći budžet i više kampanja odjednom',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/75">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-white/45 leading-relaxed">
                Za klijente koji su neko vreme već sa nama na Classic-u i žele još veći obim.
              </p>

              <a
                href={PHONE_TEL}
                onClick={() => onPhoneClick('promet-sistem-pricing-pro')}
                className="mt-8 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:border-cyan-400/60 hover:text-cyan-300 transition-all duration-300"
              >
                Pitaj za PRO
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* risk reversal */}
          <div className="mt-6 rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] p-7 flex flex-col md:flex-row md:items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <p className="text-white/85 text-lg leading-relaxed">
              <strong className="text-white">Ne rizikuješ ništa.</strong> Kreneš sa 100 do 200 €
              za reklame, dobiješ <strong className="text-white">minimum 30 leadova</strong> — 30
              ljudi koji ostave svoje podatke — a nas plaćaš tek na kraju meseca, kad vidiš rezultat.
            </p>
          </div>
        </div>
      </section>

      {/* ── REZULTATI ────────────────────────────────────────────────── */}
      {/* Preuzeto sa /izrada-sajta-detalji, u cyan paleti i obraćanju na "ti". */}
      <section id="rezultati" ref={metricsRef} className={`relative z-10 py-16 md:py-24 border-t border-white/[0.06] ${revealCls(metricsVisible)}`}>
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <img src="/images/ljudi.webp" width={1200} height={140} alt="" className="h-8 w-auto rounded-full object-cover" loading="lazy" />
            <p className="text-white text-sm md:text-base">
              Pridruži se <strong>50+</strong> zadovoljnih <strong>klijenata</strong> i <strong>preduzeća</strong>.
            </p>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
            50+ uspešnih projekata, priče uspeha.
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-6">
            Jedan dokazan pristup.
          </h3>
          <p className="text-white/55 text-base md:text-lg max-w-3xl mx-auto mb-10">
            Od sajtova i SEO-a do Meta reklama — znamo šta je potrebno da tvoj biznis dobije prave
            upite. Bez nagađanja, bez zastoja.
          </p>

          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl max-w-4xl mx-auto">
            <img src="/images/filmska%207.webp" width={1200} height={800} alt="Rad na projektu — AiSajt tim" className="w-full h-auto object-cover" loading="lazy" />
          </div>

          <div ref={metricsStatsRef} className="relative z-10 -mt-14 md:-mt-16 rounded-2xl bg-[#0D1926]/95 border border-white/10 backdrop-blur-sm px-6 py-6 md:px-8 md:py-7 shadow-xl w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c1}+</p>
                <p className="text-white/50 text-sm mt-0.5">realizovanih projekata</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c2}+</p>
                <p className="text-white/50 text-sm mt-0.5">zadovoljnih klijenata</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c3}%</p>
                <p className="text-white/50 text-sm mt-0.5">posvećenost rezultatu</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c4}</p>
                <p className="text-white/50 text-sm mt-0.5">dokazan sistem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIM ──────────────────────────────────────────────────────── */}
      <section id="tim" ref={teamRef} className={`relative z-10 py-16 md:py-24 border-t border-white/[0.06] ${revealCls(teamVisible)}`}>
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Upoznaj tim <span className="text-cyan-400">iza AiSajt-a.</span>
          </h2>
          <p className="text-white/55 text-base md:text-lg max-w-2xl mx-auto mb-4">
            Ljudi koji su pomogli brojnim firmama da dobiju moderan sajt, bolje pozicije na Google-u
            i više upita sa reklama.
          </p>
          <div className="w-3 h-3 bg-cyan-400 rounded-sm mx-auto mb-12" />

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-0">
              {[
                { name: 'Bogdan Gradjanin', role: 'Suvlasnik, specijalizovani programer', image: '/images/boban Izrada sajta .webp' },
                { name: 'Strahinja Zekanovic', role: 'Suvlasnik, dizajner i poslovanje', image: '/images/Strahinja izrada sajta.webp' },
              ].map((member) => (
                <div key={member.name} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                  <div className="aspect-square bg-white/[0.04] overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                  <div className="p-4 sm:p-5 text-left">
                    <p className="font-bold text-sm sm:text-lg">
                      <span className="text-cyan-400">{member.name.split(' ')[0]}</span>
                      <span className="text-white"> {member.name.split(' ').slice(1).join(' ')}</span>
                    </p>
                    <p className="text-white/50 text-xs sm:text-sm mt-0.5">{member.role}</p>
                  </div>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-xl flex flex-col max-w-[50%] sm:max-w-none mx-auto w-full">
                <div className="aspect-square bg-white/[0.04] overflow-hidden">
                  <img src="/images/Dedza SEO OPTIMIZACIJA.webp" width={800} height={800} alt="Marko Devedzic" className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <div className="p-4 sm:p-5 text-left">
                  <p className="font-bold text-sm sm:text-lg">
                    <span className="text-cyan-400">Marko</span>
                    <span className="text-white"> Devedzic</span>
                  </p>
                  <p className="text-white/50 text-xs sm:text-sm mt-0.5">SEO i održavanje sajtova</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VELIKI CTA ───────────────────────────────────────────────── */}
      <section id="cta-final" ref={ctaRef} className={`relative z-10 py-16 md:py-24 border-t border-white/[0.06] ${revealCls(ctaVisible)}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[500px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-[400px] h-[350px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-8 md:p-10 lg:p-12">
              <div className="flex flex-col justify-center">
                <div className="flex flex-col items-start gap-3 mb-6">
                  <p className="text-white text-sm md:text-base">Pridruži se 50+ uspešnih preduzeća</p>
                  <img src="/images/ljudi.webp" width={1200} height={140} alt="" className="h-8 w-auto rounded-full object-cover" loading="lazy" />
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  <span className="text-cyan-400">Stigao si do ovde — sada </span>
                  <span className="text-white">da ti dovedemo klijente.</span>
                </h2>

                <p className="text-white/55 text-sm leading-snug mb-3 md:leading-relaxed md:text-base md:mb-6 max-w-xl">
                  Treba ti 30 sekundi da se{' '}
                  <button
                    type="button"
                    onClick={() => scrollTo('booking-form', 'CTA final - prijavi se')}
                    className="text-cyan-300 font-bold hover:text-cyan-200 underline underline-offset-2 cursor-pointer"
                  >
                    prijaviš
                  </button>
                  {' '}i da proverimo da li Promet Sistem ima smisla za tvoj posao.
                </p>

                <p className="text-white font-medium text-sm mb-3">Šta ćemo obraditi na besplatnom pozivu:</p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Pregled tvoje trenutne situacije i ciljeva',
                    'Koliko upita realno možeš da očekuješ',
                    'Iskren savet o sledećim koracima',
                    'Bez pritiska, bez nametljive prodaje',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/75 text-sm">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-white/55 text-sm">
                  Kontaktiraćemo te i na pozivu dobijaš <strong className="text-white">konkretan savet i jasne sledeće korake</strong> za tvoj biznis. Bez obaveze — fokus je na tvom rezultatu.
                </p>
              </div>

              <div className="relative flex items-center justify-center w-full max-w-md">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/[0.03] w-full max-h-[280px] md:max-h-[340px] flex items-center justify-center">
                  <img src="/images/filmska.webp" width={900} height={600} alt="Tim AiSajt radi u kancelariji" className="w-full h-full object-contain" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="relative flex justify-center pb-8 md:pb-10">
              <button
                type="button"
                onClick={() => scrollTo('booking-form', 'CTA final - zakazi poziv')}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-cyan-400 text-[#06121C] font-black uppercase text-sm tracking-wide hover:bg-cyan-300 transition-colors shadow-[0_0_48px_rgba(34,211,238,0.45)]"
              >
                Zakaži poziv
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" ref={finalRef} className={`relative z-10 py-20 md:py-28 border-t border-white/[0.06] ${revealCls(finalVisible)}`}>
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <SectionLabel>Sledeći korak</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Hoćeš da krenemo?
          </h2>
          <p className="mt-5 text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
            Pozovi, ispričaj mi u par reči o čemu se bavi tvoj posao, i za par dana ti kažem tačno
            kako krećemo.
          </p>

          <a
            href={PHONE_TEL}
            onClick={() => onPhoneClick('promet-sistem-final')}
            className="mt-10 inline-flex items-center justify-center gap-3.5 px-10 py-5 rounded-full bg-cyan-400 text-[#06121C] text-xl md:text-2xl font-black hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_50px_rgba(34,211,238,0.4)] hover:shadow-[0_0_70px_rgba(34,211,238,0.55)]"
          >
            <Phone className="w-6 h-6" />
            {PHONE_DISPLAY}
          </a>

          <p className="mt-5 text-white/40 text-sm">
            Ne javljamo se? Na terenu smo — pošalji poruku i zovemo te nazad isti dan.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-white/55">
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => trackCTAClick('Email', 'promet-sistem-final', 'sr')}
              className="flex items-center gap-2.5 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              {EMAIL}
            </a>
            <span className="hidden sm:block w-px h-5 bg-white/15" />
            <a href="https://aisajt.com" className="flex items-center gap-2.5 hover:text-cyan-300 transition-colors">
              <span className="font-black">Ai<span className="text-cyan-400">Sajt</span></span>
              <span className="text-sm">— izrada sajtova, SEO i reklame · Beograd</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 md:py-10">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="flex justify-center mb-5">
            <img src="/images/aisajt_providno-removebg-preview.png" width={500} height={180} alt="AiSajt Logo" className="h-8 md:h-10 w-auto opacity-85" loading="lazy" />
          </div>
          <p className="text-white/35 text-xs leading-relaxed mb-6">
            Rezultati zavise od delatnosti, budžeta i tržišta. Garancija od 30 leadova mesečno važi
            uz redovno održavanje kampanje i dogovoreni budžet za reklame. Svaki biznis je drugačiji.
            Nismo povezani ni sa jednom trećom stranom navedenom na sajtu.
          </p>
          <p className="text-white/35 text-xs">
            © {new Date().getFullYear()} AiSajt
            <span className="mx-1.5">•</span>
            <a href="/privacy" className="hover:text-cyan-300 transition-colors">Privacy</a>
            <span className="mx-1.5">•</span>
            <a href="/terms" className="hover:text-cyan-300 transition-colors">Uslovi</a>
            <span className="mx-1.5">•</span>
            <a href="/terms#disclaimer" className="hover:text-cyan-300 transition-colors">Izjava</a>
          </p>
        </div>
      </footer>

      {/* sticky mobile call bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-500 ease-out ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-3 mb-3 rounded-2xl bg-[#0D1926]/95 backdrop-blur-md border border-cyan-400/25 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0 pl-2">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/45">Promet Sistem</p>
            <p className="text-sm font-bold text-white truncate">30+ leadova · od 350 €</p>
          </div>
          <a
            href={PHONE_TEL}
            onClick={() => onPhoneClick('promet-sistem-sticky')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-[#06121C] font-black text-sm whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            Pozovi odmah
          </a>
        </div>
      </div>

      {/* bottom padding so sticky bar never covers content on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
