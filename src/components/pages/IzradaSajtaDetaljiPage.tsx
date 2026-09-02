import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, ExternalLink, Star, ChevronDown } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../hooks/useLanguage';
import { SEOHelmet } from '../seo/SEOHelmet';
import { portfolioProjects } from '../../data/portfolioProjects';
import { BookingCalendar, formatBookingSlot } from '../booking/BookingCalendar';
import { ClipPlayer } from '../video/ClipPlayer';
import { usePointerFine } from '../../hooks/usePointerFine';
import { trackCTAClick, trackFormSubmitAttempt, trackFormError, trackPhoneClick } from '../../utils/analytics';
import { submitFunnelForm } from '../../utils/hubspot';
import { NAP } from '../../lib/site-config';

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

function useReveal(): [React.RefObject<HTMLElement>, boolean] {
  const ref = useRef<HTMLElement>(null!);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function IzradaSajtaDetaljiPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  /* Portfolio na desktopu: prvo 6 kartica, pa po 3 na klik. */
  const [visibleCards, setVisibleCards] = useState(6);

  const carouselRef = useRef<HTMLDivElement>(null);

  /* Case-study carousel — beskonačan scroll (3 kopije seta) */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    el.scrollLeft = setWidth;
  }, []);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    if (el.scrollLeft < setWidth * 0.15) {
      el.scrollLeft += setWidth;
    } else if (el.scrollLeft > setWidth * 2 - setWidth * 0.15) {
      el.scrollLeft -= setWidth;
    }
  };

  /* Vimeo SDK više ne učitavamo ovde — ClipPlayer ga povlači sam, tek kad
     player uđe u vidno polje. */

  const [statsRef, statsInView] = useInView(0.3);
  const c1 = useCountUp(50, 1200, statsInView);
  const c2 = useCountUp(50, 1200, statsInView);
  const c3 = useCountUp(100, 1400, statsInView);
  const c4 = useCountUp(1, 800, statsInView);

  const [caseRef, caseVisible] = useReveal();
  const [metricsRef, metricsVisible] = useReveal();
  const [teamRef, teamVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  /* ── Trailing cursor square ─────────────────────────────────── */
  /* Samo za miš. Na telefonu kvadratić nema šta da prati, a rAF petlja bi se
     svejedno vrtela na svakom frejmu i otimala budžet dodiru i videu. */
  const finePointer = usePointerFine();
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (trailRef.current) trailRef.current.style.opacity = '1';
    };
    const onLeave = () => {
      if (trailRef.current) trailRef.current.style.opacity = '0';
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.07);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.07);
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [finePointer]);
  /* ──────────────────────────────────────────────────────────── */

  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetAutoOpened, setWidgetAutoOpened] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  /* Dan izabran u plutajućem widgetu — prosleđuje se kalendaru. */
  const [preselectWeekday, setPreselectWeekday] = useState<{ isoDow: number; nonce: number } | null>(null);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  /* booking forma u viewportu — da plutajući widget ne prekriva formu na mobilnom */
  const [bookingInView, setBookingInView] = useState(false);

  useEffect(() => {
    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    /* Merenja se rade najviše jednom po frejmu. Bez ovoga svaki scroll event
       (na mobilnom ih ume biti i preko 100/s) povuče querySelector i dva
       getBoundingClientRect-a, forsira layout i vidi se kao trzanje. */
    let raf = 0;

    const measure = () => {
      raf = 0;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;

      /* bubble se pojavljuje na 40% skrola */
      if (!bubbleVisible && scrolled >= total * 0.4) {
        setBubbleVisible(true);
      }

      if (!widgetAutoOpened && scrolled >= total * 0.72) {
        setWidgetOpen(true);
        setWidgetAutoOpened(true);
      }

      const heroEl = document.querySelector('section.pt-14') as HTMLElement | null;
      const bookingEl = document.getElementById('booking-form');
      const inHero = heroEl ? isElementInViewport(heroEl) : false;
      const inBooking = bookingEl ? isElementInViewport(bookingEl) : false;
      /* sticky bar: samo kada su i hero i booking forma van ekrana */
      setStickyBarVisible(!inHero && !inBooking && window.scrollY > 60);
      setBookingInView(inBooking);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [widgetAutoOpened, bubbleVisible]);

  const dayLabels = language === 'sr'
    ? ['PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const revealClass = (v: boolean) =>
    `transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  /* Nekada je vodilo na /funnel; sada je forma na ovoj istoj stranici. */
  const goToBooking = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    /* Dolazak sa hash-om (#booking-form iz kontakt dugmadi, #case-study iz
       Portfolio dugmeta) mora da sleti na tu sekciju, a ne na vrh. */
    const targetId = window.location.hash.replace('#', '');
    if (targetId) {
      let attempt = 0;
      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempt++ < 10) {
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    } else {
      window.scrollTo(0, 0);
    }
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  /* Termin je već upisan u Supabase; ovde samo šaljemo lead u HubSpot i
     vodimo korisnika na thank-you stranicu. */
  const handleBooked = async ({ firstName, lastName, phone, email, slotAt }: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    slotAt: string;
  }) => {
    const fullName = `${firstName} ${lastName}`.trim();
    trackFormSubmitAttempt('funnel_booking', language);
    try {
      await submitFunnelForm({ name: fullName, email, phone, termin: formatBookingSlot(slotAt), source: 'izrada-sajta-detalji' });
      trackCTAClick('Booking Form Submit', 'izrada_sajta_detalji_form', language);
    } catch (error) {
      /* Rezervacija je sačuvana i bez HubSpot-a — ne prekidamo korisnika. */
      trackFormError('funnel_booking', language, String(error));
    }
    setTimeout(() => {
      navigate(`/thank-you?name=${encodeURIComponent(fullName)}&source=funnel_booking&lang=${language}`);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden relative">
      {/* ── Trailing cursor square (samo miš) ──────────────────── */}
      {finePointer && (
        <div
          ref={trailRef}
          className="fixed top-0 left-0 z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
          style={{ willChange: 'transform' }}
        >
          <div className="w-2 h-2 bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
        </div>
      )}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-[95vh] max-h-[1200px] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% -60%, rgba(236, 72, 153, 0.35), rgba(236, 72, 153, 0.15) 40%, rgba(0, 0, 0, 0) 70%)'
          }}
        />
        {/* Četiri fixed kruga sa blur-om preko 120px su na telefonu skup filter
            koji se prekoračuje na svakom frejmu skrola. Radijalni gradijent
            iznad nosi isti sjaj bez filtera, pa mobilni dobija samo jedan
            (blaži) krug, a desktop ostaje nepromenjen. */}
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1600px] h-[1200px] bg-pink-600/25 rounded-full blur-[70px] md:blur-[150px]" />
        <div className="hidden md:block absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-pink-600/15 rounded-full blur-[130px]" />
        <div className="hidden md:block absolute top-1/4 -left-40 w-[700px] h-[700px] bg-pink-700/12 rounded-full blur-[120px]" />
        <div className="hidden md:block absolute top-1/3 -right-40 w-[700px] h-[700px] bg-pink-700/12 rounded-full blur-[120px]" />
      </div>

      <SEOHelmet
        title={language === 'sr'
          ? 'AiSajt Tim i Proces Rada | Šta ti donosi dobar sajt? | AiSajt'
          : 'AiSajt Team and How We Work | What a Good Site Brings You | AiSajt'
        }
        description={language === 'sr'
          ? 'Upoznaj AiSajt tim i naš proces rada. Pogledaj kako dobar sajt donosi nove klijente i jaču online prisutnost. Video i detalji od AiSajt tima.'
          : 'Meet the AiSajt team and how we work. See how a good site brings new clients and stronger online presence. Video and details from AiSajt.'
        }
        keywords={language === 'sr'
          ? 'aisajt tim, proces izrade sajta, dobar sajt, web sajt'
          : 'aisajt team, website development process, good website'
        }
        canonicalUrl="https://aisajt.com/izrada-sajta-detalji"
      />

      <Toaster position="top-center" />

      <main id="main-content" className="relative z-10">
        <div className="fixed top-5 left-4 right-4 md:left-auto md:right-6 z-50 flex items-center justify-between md:justify-end gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 md:px-5 md:py-2.5 border border-pink-500/30 bg-gray-950/80 backdrop-blur-md text-pink-300 text-xs md:text-sm font-semibold tracking-wide rounded-full hover:bg-pink-600/20 hover:text-white hover:border-pink-400 transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_0_16px_rgba(236,72,153,0.15)]"
          >
            {language === 'sr' ? 'Početna' : 'Home'}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={goToBooking}
            className="hidden md:flex px-4 py-2 md:px-5 md:py-2.5 border border-pink-500/30 bg-gray-950/80 backdrop-blur-md text-pink-300 text-xs md:text-sm font-semibold tracking-wide rounded-full hover:bg-pink-600/20 hover:text-white hover:border-pink-400 transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_0_16px_rgba(236,72,153,0.15)]"
          >
            {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero – naslov: Izrada Sajta Beograd, Srbija – Šta ti donosi dobar sajt? */}
        <section className="pt-14 pb-6 md:pt-16 md:pb-14 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="max-w-4xl lg:max-w-[57.6rem] mx-auto text-center">
              <div className={`mb-3 md:mb-8 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                <div className="flex justify-center">
                  <img
                    src="/images/aisajt_providno-removebg-preview.png" width={500} height={180}
                    alt="AiSajt Logo"
                    className="h-8 md:h-10 w-auto opacity-85" loading="lazy" />
                </div>
              </div>

              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-row items-center justify-center gap-2 md:gap-3 flex-wrap mb-3 md:mb-6">
                  <img src="/images/ljudi.webp" width={1200} height={140} alt="" className="h-6 w-auto rounded-full object-cover flex-shrink-0 md:h-8" loading="lazy" />
                  <span className="text-gray-400 text-[11px] md:text-sm font-medium text-left md:text-center leading-tight">
                    {language === 'sr' ? (
                      <>Pridruži se preko 50+<br className="md:hidden" /> zadovoljnih klijenata</>
                    ) : (
                      <>Join 50+ satisfied<br className="md:hidden" /> clients</>
                    )}
                  </span>
                </div>
              </div>

              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 md:mb-5">
                  {language === 'sr' ? (
                    <>
                      AiSajt Tim i Proces Rada
                      <span className="block mt-1 md:mt-2 text-pink-300">Sta Ti Donosi Dobar Websajt?</span>
                    </>
                  ) : (
                    <>
                      AiSajt Team and How We Work
                      <span className="block mt-1 md:mt-2 text-pink-300">What Does A Good Website Bring You?</span>
                    </>
                  )}
                </h1>
              </div>

              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-4 md:mb-8">
                  {language === 'sr'
                    ? 'Pogledaj šta možeš da dobiješ od sajta koji ima dokazani sistem privlačenja klijenata.'
                    : 'See what you can get from a website with a proven system for attracting clients.'
                  }
                </p>
              </div>

              <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-2xl border border-pink-500/20 bg-gradient-to-br from-gray-900 to-gray-800 max-w-3xl lg:max-w-[57.6rem] mx-auto">
                  <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-1.5 md:py-2 px-4 md:px-6 text-center">
                    <p className="font-semibold text-xs md:text-sm flex items-center justify-center gap-2">
                      <Play className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {language === 'sr' ? 'Klikni Play Da Naučiš Više' : 'Click Play to Learn More'}
                    </p>
                  </div>
                  {/* Loop se vrti sa našeg domena, pun klip stiže sa Vimea na klik. */}
                  <ClipPlayer
                    vimeoId="1222709692"
                    fullSrcMobile="/videos/izrada-sajta-full.mp4"
                    loopSrc="/videos/izrada-sajta-loop.mp4"
                    poster="/videos/izrada-sajta-poster.webp"
                    title="AiSajt — izrada sajta, ceo razgovor"
                    headline={language === 'sr' ? 'Pusti ceo video' : 'Play full video'}
                    subline={
                      language === 'sr' ? 'Sa zvukom, od početka' : 'With sound, from the start'
                    }
                    accentButton="bg-pink-600/90 text-white group-hover:bg-pink-500"
                    accentBadge="bg-black/60 border-white/10"
                  />
                </div>
              </div>
              <div className={`mt-6 flex justify-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <button
                  type="button"
                  onClick={goToBooking}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold uppercase text-sm tracking-wide rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1),0_0_48px_rgba(236,72,153,0.65)]"
                >
                  {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section — forma preneta sa /funnel, u pink temi */}
        <section id="booking-form" className="pt-8 md:pt-16 pb-10 md:pb-24 relative overflow-hidden z-20 scroll-mt-20">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-pink-600/20 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl mx-auto">

              {/* Header */}
              <div className="text-center mb-4 md:mb-6">
                <span className="inline-block bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] md:text-xs font-semibold tracking-widest uppercase px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-3 md:mb-4">
                  {language === 'sr' ? '🎯 Besplatna konsultacija' : '🎯 Free consultation'}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2 md:mb-3">
                  {language === 'sr' ? (
                    <>Zakaži Poziv <span className="text-pink-400">Odmah</span></>
                  ) : (
                    <>Book a Call <span className="text-pink-400">Now</span></>
                  )}
                </h2>
                <p className="text-gray-400 text-xs md:text-base max-w-md mx-auto">
                  {language === 'sr'
                    ? 'Izaberi termin koji ti odgovara. Poziv je besplatan i bez obaveze.'
                    : 'Book a 1-on-1 call and see how we can help. Completely free.'
                  }
                </p>
              </div>

              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 p-[2px]">
                  <div className="absolute inset-0 rounded-2xl bg-gray-900" />
                </div>

                <div className="relative z-10 bg-gray-900 p-4 sm:p-6 md:p-8">
                  <BookingCalendar language={language} onBooked={handleBooked} preselectWeekday={preselectWeekday} source="izrada-sajta-detalji" />
                </div>
              </div>

              {/* Kontakt kartica – direktan poziv */}
              <a
                href={`tel:${NAP.phone.tel}`}
                onClick={() => trackPhoneClick(NAP.phone.tel, 'izrada_sajta_detalji_booking', language)}
                className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4 px-4 py-3 md:px-5 md:py-4 rounded-xl border border-gray-800 bg-gray-900/60 md:hover:bg-gray-800/80 md:hover:border-pink-500/40 transition-colors duration-300 group touch-manipulation active:bg-gray-800/90"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <img
                  src="/images/Strahinja izrada sajta.webp" width={800} height={800}
                  alt="Strahinja Zekanovic"
                  className="w-11 h-11 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-pink-500/30" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-[11px] mb-1 uppercase tracking-wider">
                    {language === 'sr' ? 'Kontaktirajte me odmah pozivom' : 'Contact me directly by call'}
                  </p>
                  <p className="text-white font-bold text-base tracking-wide group-hover:text-pink-300 transition-colors duration-200">
                    Strahinja · {NAP.phone.local}
                  </p>
                </div>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-pink-600 flex items-center justify-center shadow-[0_2px_12px_rgba(236,72,153,0.4)] group-hover:bg-pink-500 group-hover:shadow-[0_4px_18px_rgba(236,72,153,0.6)] transition-all duration-200 overflow-visible">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.2a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* Portfolio — jedino mesto na sajtu; kartice otvaraju /portfolio/:slug case study */}
        <section id="case-study" ref={caseRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(caseVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {language === 'sr' ? (
                      <>Stvarni rezultati <span className="text-pink-300">od stvarnih klijenata.</span></>
                    ) : (
                      <>Real results <span className="text-pink-300">from real clients.</span></>
                    )}
                  </h2>
                  <p className="text-gray-400 mt-3 text-base md:text-lg max-w-2xl">
                    {language === 'sr'
                      ? 'Pogledaj kako su naši klijenti dobili moderan sajt, više poseta i jasnu online prisutnost.'
                      : 'See how our clients got a modern site, more traffic, and a clear online presence.'
                    }
                  </p>
                </div>
              </div>

              {/* Kartice – na mobilnom horizontalni scroll carousel, na desktopu grid */}
              {(() => {
                /* Logotipi postoje samo za deo klijenata — kartica se lepo
                   prikazuje i bez njega. */
                const logos: Record<string, string> = {
                  'prestige-gradnja': '/images/logop.png',
                  'custom-rc-parts': '/images/logo.png',
                  'kralj-residence': '/images/Beli logo2.webp',
                  'bn-autofolije': '/images/logobn.webp',
                  'komotraks': '/images/komotraks-logotip.png',
                  'bora-company': '/images/boralogo.webp',
                  'in-stan': '/images/logoin.png',
                };
                const lightLogo = new Set(['custom-rc-parts', 'bora-company', 'in-stan']);

                type Card = {
                  key: string;
                  to?: string;
                  href?: string;
                  logo?: string;
                  lightLogo?: boolean;
                  siteImg: string;
                  title: string;
                  tag: string;
                  headline: string;
                  text: string;
                };

                /* Case studies — svaki otvara svoju /portfolio/:slug stranicu */
                const cards: Card[] = portfolioProjects.map((p) => ({
                  key: p.slug,
                  to: `/portfolio/${p.slug}`,
                  logo: logos[p.slug],
                  lightLogo: lightLogo.has(p.slug),
                  siteImg: p.image,
                  title: p.title,
                  tag: p.clientIndustry[language],
                  headline: p.description[language],
                  text: p.tags[language].join(' · '),
                }));

                /* Klijenti bez zasebne case-study stranice — vode na živi sajt */
                const externalOnly: Card[] = [
                  { key: 'poklon', href: 'https://pokloniportret.rs/', logo: '/images/poklonilogo.webp', siteImg: '/images/poklon.webp', title: 'Pokloni Portret', tag: language === 'sr' ? 'Personalizovani pokloni' : 'Personalized gifts', headline: language === 'sr' ? 'Portreti po narudžbini — galerija i porudžbine' : 'Custom portraits — gallery and orders', text: language === 'sr' ? 'Umetnički brend na webu. Lako naručivanje i pregled radova.' : 'Art brand online. Easy ordering and portfolio view.' },
                  { key: 'loki', href: 'https://lokin4.rs/', logo: '/images/lokilo.png', siteImg: '/images/loki.webp', title: 'Loki N-4', tag: language === 'sr' ? 'Betonski elementi' : 'Concrete elements', headline: language === 'sr' ? 'Prepoznatljiv brend na webu — identitet i poruka' : 'Recognizable brand online — identity and message', text: language === 'sr' ? 'Jedinstven vizuelni identitet i jasna komunikacija.' : 'Unique visual identity and clear communication.' },
                  { key: 'lako', href: 'https://lakosistem.rs/', logo: '/images/logolak.webp', lightLogo: true, siteImg: '/images/lako.webp', title: 'Lako Sistem', tag: language === 'sr' ? 'Papirna galanterija' : 'Paper goods', headline: language === 'sr' ? 'Moderan prezentacioni web sajt — preglednost i autoritet' : 'Modern presentation website — clarity and authority', text: language === 'sr' ? 'Sajt prilagođen potrebama klijenta. Zadovoljstvo i rezultati.' : 'Site tailored to client needs. Satisfaction and results.' },
                  { key: 'jastuci', href: 'https://vazdusnijastuci.rs/', logo: '/images/logo2.png', siteImg: '/images/jastuci.webp', title: 'Vazdušni jastuci', tag: language === 'sr' ? 'Auto delovi' : 'Auto parts', headline: language === 'sr' ? 'Sajt za auto delove — katalog i upiti' : 'Site for auto parts — catalog and inquiries', text: language === 'sr' ? 'Pregledan katalog i kontakt forma. Više upita sa sajta.' : 'Clear catalog and contact form. More inquiries from site.' },
                ];

                const allCards = [...cards, ...externalOnly];

                const cardInner = (card: Card) => (
                  <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex gap-0.5 mb-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 text-pink-400 fill-pink-400" />
                        ))}
                      </div>
                      <h3 className="text-pink-300 font-bold text-sm md:text-base mb-3 leading-snug">
                        {card.headline}
                      </h3>
                      {card.logo ? (
                        <div className={`aspect-video rounded-lg border mb-4 overflow-hidden relative flex items-center justify-center p-6 md:p-8 ${card.lightLogo ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'}`}>
                          <img src={card.logo} alt={`${card.title} logo`} className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg bg-gray-800 border border-gray-700 mb-4 overflow-hidden relative">
                          <img src={card.siteImg} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
                        </div>
                      )}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {card.text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-auto flex-shrink-0">
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{card.title}</p>
                        <p className="text-gray-500 text-xs truncate">{card.tag}</p>
                      </div>
                      <span className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-pink-600/20 border border-pink-500/30 text-pink-300 text-xs font-semibold whitespace-nowrap transition-colors duration-200 md:group-hover:bg-pink-600 md:group-hover:text-white md:group-hover:border-pink-500 flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>
                          {card.to
                            ? (language === 'sr' ? 'Pogledaj projekat' : 'View project')
                            : (language === 'sr' ? 'Poseti sajt' : 'Visit site')}
                        </span>
                      </span>
                    </div>
                  </div>
                );

                const cardClass = "group rounded-2xl border border-gray-700/60 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col h-full transition-colors duration-300 ease-out md:hover:border-pink-500/50 md:hover:shadow-pink-500/10 md:hover:shadow-2xl";

                const cardEl = (card: Card, keySuffix = '') =>
                  card.to ? (
                    <Link key={card.key + keySuffix} to={card.to} className={cardClass}>
                      {cardInner(card)}
                    </Link>
                  ) : (
                    <a key={card.key + keySuffix} href={card.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                      {cardInner(card)}
                    </a>
                  );

                return (
                  <>
                    {/* Mobile: swipe carousel */}
                    <div className="md:hidden mt-8 -mx-4">
                      <div
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                        className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' } as React.CSSProperties}
                      >
                        {[...allCards, ...allCards, ...allCards].map((card, idx) => (
                          <div key={`${card.key}-${idx}`} className="snap-start flex-shrink-0 w-[82vw]">
                            {cardEl(card, `-${idx}`)}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center mt-3">
                        <span className="text-gray-600 text-[11px] tracking-wider uppercase">
                          {language === 'sr' ? '← Prevuci za još →' : '← Swipe for more →'}
                        </span>
                      </div>
                    </div>

                    {/* Desktop: grid sa "Učitaj još" — prvo 6, pa po 3 */}
                    <div className="hidden md:block">
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-10">
                        {allCards.slice(0, visibleCards).map((card) => cardEl(card))}
                      </div>
                      {visibleCards < allCards.length && (
                        <div className="flex flex-col items-center gap-2 mt-8">
                          <button
                            type="button"
                            onClick={() => setVisibleCards((n) => n + 3)}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-pink-500 text-pink-300 font-bold text-sm uppercase tracking-wide hover:bg-pink-600 hover:text-white transition-colors"
                          >
                            {language === 'sr' ? 'Učitaj još' : 'Load more'}
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <span className="text-gray-500 text-xs">
                            {visibleCards} / {allCards.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Success metrics */}
        <section id="success-metrics" ref={metricsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(metricsVisible)}`}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <img src="/images/ljudi.webp" width={1200} height={140} alt="" className="h-8 w-auto rounded-full object-cover" loading="lazy" />
                <p className="text-white text-sm md:text-base">
                  {language === 'sr' ? (
                    <>Pridružite se <strong>50+</strong> zadovoljnih <strong>klijenata</strong> i <strong>preduzeća</strong>.</>
                  ) : (
                    <>Join <strong>50+</strong> satisfied <strong>clients</strong> and <strong>businesses</strong>.</>
                  )}
                </p>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {language === 'sr' ? '50+ Uspešnih Projekata, Priče Uspeha.' : '50+ Successful Projects, Success Stories.'}
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-pink-400 mb-6">
                {language === 'sr' ? 'Jedan Dokazan Pristup.' : 'One Proven Approach.'}
              </h3>
              <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-10">
                {language === 'sr'
                  ? 'Od korporativnih sajtova do e-commerce i landing stranica — znamo šta je potrebno da vaš biznis zasija na internetu. Bez nagađanja, bez zastoja.'
                  : 'From corporate sites to e-commerce and landing pages — we know what it takes to make your business shine online. No guesswork, no plateaus.'}
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-700/60 shadow-2xl max-w-4xl mx-auto">
                <img src="/images/filmska%207.webp" width={1200} height={800} alt={language === 'sr' ? 'Rad na projektu — AiSajt tim' : 'Project work — AiSajt team'} className="w-full h-auto object-cover" loading="lazy" />
              </div>
              <div ref={statsRef} className="relative z-10 -mt-14 md:-mt-16 rounded-2xl bg-gray-900/95 border border-gray-700/60 backdrop-blur-sm px-6 py-6 md:px-8 md:py-7 shadow-xl w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c1}+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'realizovanih projekata' : 'projects delivered'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c2}+</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'zadovoljnih klijenata' : 'satisfied clients'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c3}%</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'posvećenost rezultatu' : 'commitment to results'}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{c4}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{language === 'sr' ? 'dokazan sistem' : 'proven system'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                <div className="w-10 h-10 flex items-center justify-center text-pink-500">
                  <div className="w-6 h-6 border-2 border-pink-500 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section id="meet-the-team" ref={teamRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(teamVisible)}`}>
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                {language === 'sr' ? 'Upoznajte tim ' : 'Meet the Team '}
                <span className="text-pink-400">{language === 'sr' ? 'iza AiSajt-a.' : 'Behind AiSajt.'}</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
                {language === 'sr'
                  ? 'Upoznajte ljude koji su pomogli brojnim kompanijama da dobiju moderan sajt i jaču online prisutnost.'
                  : "Get to know the specialists who've helped many companies get a modern site and stronger online presence."}
              </p>
              <div className="w-3 h-3 bg-pink-500 rounded-sm mx-auto mb-12" />
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-0">
                  {[
                    { name: 'Bogdan Gradjanin', role: language === 'sr' ? 'Suvlasnik, specijalizovani programer' : 'Co-owner & Specialized Developer', image: '/images/boban Izrada sajta .webp' },
                    { name: 'Strahinja Zekanovic', role: language === 'sr' ? 'Suvlasnik, dizajner i poslovanje' : 'Co-owner, Designer & Operations', image: '/images/Strahinja izrada sajta.webp' },
                  ].map((member) => (
                    <div key={member.name} className="rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                      <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" loading="lazy" />
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="font-bold text-sm sm:text-lg">
                          <span className="text-pink-400">{member.name.split(' ')[0]}</span>
                          <span className="text-white"> {member.name.split(' ').slice(1).join(' ')}</span>
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col max-w-[50%] sm:max-w-none mx-auto w-full">
                    <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
                      <img src="/images/Dedza SEO OPTIMIZACIJA.webp" width={800} height={800} alt="Marko Devedzic" className="w-full h-full object-cover object-top" loading="lazy" />
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="font-bold text-sm sm:text-lg">
                        <span className="text-pink-400">Marko</span>
                        <span className="text-white"> Devedzic</span>
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                        {language === 'sr' ? 'SEO i održavanje sajtova' : 'SEO & Website Maintenance'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section id="cta-final" ref={ctaRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-black relative z-10 -mt-1">
          <div className={`container mx-auto px-4 ${revealClass(ctaVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl bg-gray-900/95 border border-gray-700/50 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[500px] h-[400px] bg-pink-600/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-8 md:p-10 lg:p-12">
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-start gap-3 mb-6">
                      <p className="text-white text-sm md:text-base">
                        {language === 'sr' ? 'Pridružite se 50+ uspešnih preduzeća' : 'Join 50+ successful businesses'}
                      </p>
                      <img src="/images/ljudi.webp" width={1200} height={140} alt="" className="h-8 w-auto rounded-full object-cover" loading="lazy" />
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      <span className="text-pink-400">
                        {language === 'sr' ? 'Stigli ste do ovde — sada ' : "You've made it this far — now "}
                      </span>
                      <span className="text-white">
                        {language === 'sr' ? 'skalirajmo vaš biznis.' : "let's scale your business."}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-snug mb-3 md:leading-relaxed md:text-base md:mb-6 max-w-xl">
                      {language === 'sr' ? (
                        <>Potrebno je 30 sekundi da se{' '}
                          <button type="button" onClick={goToBooking} className="text-pink-300 font-bold hover:text-pink-200 underline underline-offset-2 cursor-pointer">
                            prijavite
                          </button>
                          {' '}i proverimo da li AiSajt može da vam pomogne da brže rastete — sa jasnoćom i rezultatima.</>
                      ) : (
                        <>Take 30 seconds to{' '}
                          <button type="button" onClick={goToBooking} className="text-pink-300 font-bold hover:text-pink-200 underline underline-offset-2 cursor-pointer">
                            apply now
                          </button>
                          {' '}and let's see if AiSajt is the right fit to help you scale faster—with clarity and results.</>
                      )}
                    </p>
                    <p className="text-white font-medium text-sm mb-3">
                      {language === 'sr' ? 'Šta ćemo obraditi na besplatnom pozivu:' : "Here's what we'll cover on your free discovery call:"}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {[
                        language === 'sr' ? 'Pregled vaše trenutne situacije i ciljeva' : 'Review your current situation + goals',
                        language === 'sr' ? 'Brze pobede i skrivene prilike' : 'Spot quick wins and hidden gaps',
                        language === 'sr' ? 'Iskren savet o sledećim koracima' : 'Share honest advice on next steps',
                        language === 'sr' ? 'Bez pritiska, bez nametljive prodaje' : 'No pressure, no hard pitch',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-400 text-sm">
                      {language === 'sr' ? (
                        <>Kontaktiraćemo vas i na pozivu ćete dobiti <strong className="text-white">konkretan savet i jasne sledeće korake</strong> za vaš biznis. Bez obaveze — fokus je na vašem uspehu.</>
                      ) : (
                        <>We'll contact you and on the call you'll get <strong className="text-white">concrete advice and clear next steps</strong> for your business. No obligation — the focus is on your success.</>
                      )}
                    </p>
                  </div>
                  <div className="relative flex items-center justify-center w-full max-w-md">
                    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-800/50 w-full max-h-[280px] md:max-h-[340px] flex items-center justify-center">
                      <img src="/images/filmska.webp" width={900} height={600} alt={language === 'sr' ? 'Tim AiSajt radi u kancelariji' : 'The AiSajt team at work in the office'} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                  </div>
                </div>
                <div className="relative flex justify-center pb-8 md:pb-10">
                  <button
                    type="button"
                    onClick={goToBooking}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold uppercase text-sm tracking-wide rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.08),0_0_48px_rgba(255,255,255,0.55)]"
                  >
                    {language === 'sr' ? 'Zakaži poziv' : 'Book a call'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-black border-t border-gray-800 py-8 md:py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-5">
                <img src="/images/aisajt_providno-removebg-preview.png" width={500} height={180} alt="AiSajt Logo" className="h-8 md:h-10 w-auto opacity-85" loading="lazy" />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                {language === 'sr'
                  ? 'Rezultati zavise od vrste projekta i saradnje. Prikazani projekti su stvarni radovi naših klijenata. Svaki biznis je drugačiji — uspeh na webu zavisi od vaših ciljeva, potreba i angažmana. Nismo povezani ni sa jednom trećom stranom navedenom na sajtu.'
                  : 'Results depend on project type and collaboration. Projects shown are real work for our clients. Every business is different — online success depends on your goals, needs, and commitment. We are not affiliated with any third parties mentioned on this site.'}
              </p>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} AiSajt
                <span className="mx-1.5">•</span>
                <a href="/privacy" className="hover:text-pink-400 transition-colors">Privacy</a>
                <span className="mx-1.5">•</span>
                <a href="/terms" className="hover:text-pink-400 transition-colors">{language === 'sr' ? 'Uslovi' : 'Terms'}</a>
                <span className="mx-1.5">•</span>
                <a href="/terms#disclaimer" className="hover:text-pink-400 transition-colors">{language === 'sr' ? 'Izjava' : 'Disclaimer'}</a>
              </p>
            </div>
          </div>
        </footer>

        {/* Sticky bottom bar → booking forma */}
        <div
          className={`fixed bottom-5 left-0 right-0 z-40 hidden md:flex justify-center px-4 transition-all duration-500 ease-out ${
            stickyBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-3 md:gap-5 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl border border-pink-500/25 bg-black/55 backdrop-blur-xl shadow-[0_4px_32px_rgba(236,72,153,0.18)]">
            <p className="text-gray-300 text-xs md:text-sm leading-snug whitespace-nowrap">
              {language === 'sr' ? (
                <>Nauči kako da dobiješ nove klijente sa <span className="text-pink-400 font-semibold">AiSajt sistemom.</span></>
              ) : (
                <>Get new clients with the <span className="text-pink-400 font-semibold">AiSajt system.</span></>
              )}
            </p>
            <button
              onClick={goToBooking}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_16px_rgba(236,72,153,0.45)] hover:shadow-[0_0_24px_rgba(236,72,153,0.65)] whitespace-nowrap"
            >
              {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Floating widget → booking forma (sakriven na mobilnom dok je forma u kadru)

            Kontejner mora da bude pointer-events-none: on se razvlaci po
            zatvorenom w-80 panelu unutra, pa je na telefonu 320x387px i pokriva
            skoro celu donju polovinu ekrana. Sa pointer-events:auto je gutao
            tapove namenjene sadrzaju ispod — hero video player upada tacno u tu
            zonu. Interaktivni su samo panel (kad je otvoren) i dugme ispod. */}
        <div className={`fixed bottom-6 right-5 z-50 flex-col items-end gap-3 pointer-events-none ${bookingInView ? 'hidden md:flex' : 'flex'}`}>
          <div
            className={`transition-all duration-300 ease-out origin-bottom-right ${
              widgetOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="w-80 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="/images/Strahinja izrada sajta.webp" width={800} height={800} alt="Strahinja Zekanovic" className="w-full h-full object-cover object-top" loading="lazy" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">AiSajt Tim</p>
                  <p className="text-gray-400 text-xs">Strahinja Zekanović · Co-founder</p>
                </div>
                <button onClick={() => setWidgetOpen(false)} className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0" aria-label="Zatvori">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 pb-3 border-b border-white/8">
                <p className="text-white font-bold text-sm">{language === 'sr' ? 'AiSajt Strategijski Poziv' : 'AiSajt Strategy Call'}</p>
                <p className="text-gray-400 text-xs mt-0.5">{language === 'sr' ? 'Zakaži besplatni 1-1 poziv sa timom.' : 'Book your free 1-1 call with the team.'}</p>
              </div>
              <div className="mx-4 mt-3 px-3 py-2 bg-white/5 rounded-lg flex items-center justify-between">
                <p className="text-gray-300 text-xs font-medium">{language === 'sr' ? 'Malo slobodnih termina.' : 'Only few slots left.'}</p>
                <span className="text-pink-400 font-bold text-xs tabular-nums">⚡ {language === 'sr' ? 'Ograničeno' : 'Limited'}</span>
              </div>
              <div className="px-4 pt-3 pb-1">
                <div className="flex gap-1.5">
                  {dayLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedDay(i);
                        /* dayLabels ide PON…SUB, pa je ISO dan i + 1 */
                        setPreselectWeekday({ isoDow: i + 1, nonce: Date.now() });
                        setWidgetOpen(false);
                        setTimeout(goToBooking, 150);
                      }}
                      className={`flex-1 flex flex-col items-center py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedDay === i ? 'bg-pink-600 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-pink-500/50 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wide leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-4 py-4">
                <button
                  onClick={goToBooking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-pink-500/30"
                >
                  {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setWidgetOpen(v => !v)}
            className={`relative w-14 h-14 rounded-full shadow-2xl border-2 border-pink-500 hover:border-pink-400 active:scale-95 bg-pink-700 flex items-center justify-center transition-all duration-500 ease-out ${
              bubbleVisible
                ? 'opacity-100 scale-100 translate-y-0 hover:scale-105 pointer-events-auto'
                : 'opacity-0 scale-50 translate-y-4 pointer-events-none'
            }`}
            aria-label="Zakaži poziv"
          >
            <img src="/images/aisajt_providno-removebg-preview.png" width={500} height={180} alt="AiSajt" className="w-9 h-9 object-contain" loading="lazy" />
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-950" />
          </button>
        </div>
      </main>
    </div>
  );
}
