import { useEffect, useState, useRef } from 'react';
import {
  Phone,
  ArrowRight,
  ArrowDown,
  Check,
  Play,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { SEOHelmet } from '../seo/SEOHelmet';
import { trackPhoneClick, trackCTAClick } from '../../utils/analytics';
import { NAP } from '../../lib/site-config';

// This landing page intentionally uses a different phone number from the
// site-wide NAP — it's a dedicated call-tracking number for Meta ads
// traffic (see the "Dodaj Promet Sistem landing" commit), not a drift bug.
// Not centralized into site-config.ts on purpose.
const PHONE_DISPLAY = '061 203 9768';
const PHONE_TEL = 'tel:+381612039768';
const EMAIL = NAP.email;

// Kad snimiš video, nalepi ovde link (Vimeo ili YouTube embed URL) — npr.
// 'https://player.vimeo.com/video/XXXXXXX' ili 'https://www.youtube.com/embed/XXXXXXX'
const PROMET_VIDEO_URL = '';

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
  const [heroVisible, setHeroVisible] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const [statsRef, statsInView] = useInView(0.4);
  const countUpiti = useCountUp(17, 1400, statsInView);

  const [priceRef, priceVisible] = useReveal();
  const [finalRef, finalVisible] = useReveal();

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
        <div className="absolute -top-[380px] left-1/2 -translate-x-1/2 w-[1100px] h-[800px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -left-52 w-[600px] h-[600px] bg-cyan-600/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-[70%] -right-52 w-[600px] h-[600px] bg-blue-600/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* top bar */}
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex items-center justify-between">
          <img
            src="/images/aisajt-logo-white-text.png"
            alt="AiSajt"
            className="h-8 md:h-9 w-auto object-contain"
          />
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
        <div className="max-w-4xl mx-auto px-5 md:px-8">
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-400/20 bg-black max-w-3xl mx-auto">
              <div className="aspect-video relative bg-gradient-to-br from-[#0D1926] to-black">
                {PROMET_VIDEO_URL ? (
                  <iframe
                    src={PROMET_VIDEO_URL}
                    frameBorder="0"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    title="Promet Sistem — kako radi"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-cyan-400/90 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                        <Play className="w-7 h-7 text-[#06121C] ml-1" />
                      </div>
                      <p className="mt-4 text-white/50 text-sm">Video dolazi uskoro</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* stat band */}
          <div ref={statsRef} className={`mt-8 max-w-xl mx-auto rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] px-6 py-5 flex items-center gap-5 transition-all duration-1000 delay-300 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="text-5xl font-black text-cyan-400 tabular-nums leading-none">
              {countUpiti}+
            </span>
            <div>
              <p className="font-bold text-base leading-snug">
                garantovanih poziva od zainteresovanih kupaca. Svakog meseca.
              </p>
              <p className="text-sm text-white/55 mt-1">
                To ti je bar jedan upit dnevno, pravo na telefon.
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
                  <span className="text-xl font-black text-cyan-400 whitespace-nowrap">200 €</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-white/10">
                  <span className="text-white/70">Naš rad — plaćaš na kraju meseca</span>
                  <span className="text-xl font-black text-cyan-400 whitespace-nowrap">250 €</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <span className="text-lg font-bold">Ukupno mesečno</span>
                  <span className="text-4xl font-black text-cyan-400 whitespace-nowrap">450 €</span>
                </div>
              </div>

              <p className="mt-6 text-sm text-white/50 leading-relaxed">
                Prvo ideš samo sa 200 € za reklame. Nas plaćaš tek na kraju meseca, kad vidiš
                koliko ti je ljudi došlo.
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
              <strong className="text-white">Ne rizikuješ ništa.</strong> Kreneš sa 200 € za
              reklame, dobiješ minimum 17 garantovanih poziva, a nas plaćaš tek na kraju meseca —
              kad vidiš rezultat.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINALNI CTA ──────────────────────────────────────────────── */}
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

      {/* sticky mobile call bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-500 ease-out ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-3 mb-3 rounded-2xl bg-[#0D1926]/95 backdrop-blur-md border border-cyan-400/25 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0 pl-2">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/45">Promet Sistem</p>
            <p className="text-sm font-bold text-white truncate">17+ poziva · 450 €</p>
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
