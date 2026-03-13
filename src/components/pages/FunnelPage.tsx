import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, ExternalLink, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../hooks/useLanguage';
import { SEOHelmet } from '../seo/SEOHelmet';
import { trackCTAClick, trackFormSubmitAttempt, trackFormError, trackPhoneClick } from '../../utils/analytics';
import { submitFunnelForm } from '../../utils/hubspot';

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
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function FunnelPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [videoUnmuted, setVideoUnmuted] = useState(false);

  const VIMEO_MUTED = 'https://player.vimeo.com/video/1171575982?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&controls=0';
  const VIMEO_SOUND = 'https://player.vimeo.com/video/1171575982?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=0&controls=1';

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleUnmute = () => {
    if (iframeRef.current) {
      iframeRef.current.src = VIMEO_SOUND;
    }
    setVideoUnmuted(true);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Start at beginning of 2nd set so user can scroll both directions
    const setWidth = el.scrollWidth / 3;
    el.scrollLeft = setWidth;
  }, []);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    // When near the start of 1st set, jump to equivalent position in 2nd set
    if (el.scrollLeft < setWidth * 0.15) {
      el.scrollLeft += setWidth;
    }
    // When near the end of 3rd set, jump to equivalent position in 2nd set
    else if (el.scrollLeft > setWidth * 2 - setWidth * 0.15) {
      el.scrollLeft -= setWidth;
    }
  };

  /* ── Load Vimeo player.js ─────────────────────────────────────── */
  useEffect(() => {
    if (document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ── Trailing cursor square ────────────────────────────────────── */
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Skip cursor animation on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

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
  }, []);
  /* ─────────────────────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* stats counter */
  const [statsRef, statsInView] = useInView(0.3);
  const c1 = useCountUp(50, 1200, statsInView);
  const c2 = useCountUp(50, 1200, statsInView);
  const c3 = useCountUp(100, 1400, statsInView);
  const c4 = useCountUp(1, 800, statsInView);

  /* section reveal refs */
  const [caseRef, caseVisible] = useReveal();
  const [metricsRef, metricsVisible] = useReveal();
  const [teamRef, teamVisible] = useReveal();
  const [reviewsRef, reviewsVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  /* booking widget */
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetAutoOpened, setWidgetAutoOpened] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [triedSubmit, setTriedSubmit] = useState(false);

  /* sticky bottom bar */
  const [stickyBarVisible, setStickyBarVisible] = useState(false);

  /* scroll arrow – visible near top */
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  /* booking form u viewportu – za skrivanje floating widgeta na mobilnom */
  const [bookingInView, setBookingInView] = useState(false);

  /* reviews expand */
  const [expandedReviewIndex, setExpandedReviewIndex] = useState<number | null>(null);

  /* auto-open widget + sticky bar visibility */
  useEffect(() => {
    const onScroll = () => {
      /* widget auto-open */
      if (!widgetAutoOpened) {
        const scrolled = window.scrollY + window.innerHeight;
        const total = document.documentElement.scrollHeight;
        if (scrolled >= total * 0.72) {
          setWidgetOpen(true);
          setWidgetAutoOpened(true);
        }
      }

      /* sticky bar: show only when hero AND booking-form are both out of view */
      const heroEl = document.querySelector('section.pt-8') as HTMLElement | null;
      const bookingEl = document.getElementById('booking-form');
      const inHero = heroEl ? isElementInViewport(heroEl) : false;
      const inBooking = bookingEl ? isElementInViewport(bookingEl) : false;
      setStickyBarVisible(!inHero && !inBooking && window.scrollY > 60);
      setShowScrollArrow(window.scrollY < 180);
      setBookingInView(inBooking);
    };

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [widgetAutoOpened]);

  /* fixed day labels */
  const dayLabels = language === 'sr'
    ? ['PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const revealClass = (v: boolean) =>
    `transition-all duration-700 ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!formData.name || !formData.phone || !formData.email) return;
    setIsSubmitting(true);
    trackFormSubmitAttempt('funnel_booking', language);

    try {
      const result = await submitFunnelForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(formData.message && { message: formData.message }),
      });

      if (result.success) {
        setSubmitSuccess(true);
        trackCTAClick('Funnel Form Submit', 'funnel_form', language);
        navigate(`/thank-you?name=${encodeURIComponent(formData.name)}&source=funnel_booking&lang=${language}`);
      } else {
        throw new Error(result.message || 'Slanje nije uspelo');
      }
    } catch (error) {
      trackFormError('funnel_booking', language, String(error));
      toast.error(
        language === 'sr'
          ? 'Došlo je do greške. Molimo pokušajte ponovo.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden relative">
      {/* ── Trailing cursor square – hidden on touch devices ─────────── */}
      <div
        ref={trailRef}
        className="hidden md:block fixed top-0 left-0 z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      >
        <div className="w-2 h-2 bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.7)]" />
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

      {/* Scroll arrow – vidljivo samo na vrhu stranice */}
      <div
        className={`hidden md:flex fixed bottom-8 left-10 z-50 flex-col items-start gap-1.5 cursor-pointer transition-all duration-500 ${
          showScrollArrow ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-violet-300 text-xs font-semibold tracking-widest uppercase">
          {language === 'sr' ? 'Zakaži Besplatno' : 'Book Free'}
        </span>
        <div className="flex flex-col items-start gap-0.5 animate-bounce">
          <div className="w-px h-4 bg-gradient-to-b from-violet-400/0 to-violet-400 ml-1.5" />
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
            <path d="M1 1L7 7L13 1" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Violet glow samo na prve 2 sekcije (hero + booking); ispod toga samo tamna pozadina */}
      <div className="fixed top-0 left-0 right-0 h-[95vh] max-h-[1200px] pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% -60%, rgba(139, 92, 246, 0.35), rgba(139, 92, 246, 0.15) 40%, rgba(0, 0, 0, 0) 70%)'
          }}
        ></div>
        <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1600px] h-[1200px] bg-violet-600/25 rounded-full blur-[150px]"></div>
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-pink-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute top-1/4 -left-40 w-[700px] h-[700px] bg-violet-700/12 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-pink-700/12 rounded-full blur-[120px]"></div>
      </div>

      <SEOHelmet
        title={language === 'sr' 
          ? 'Izrada Sajta Beograd | Besplatna Ponuda i Konsultacija | AiSajt'
          : 'Website Development Belgrade | Free Quote & Consultation | AiSajt'
        }
        description={language === 'sr'
          ? 'Besplatna ponuda za izradu sajta u Beogradu. Zakažite konsultaciju bez obaveze. AiSajt.'
          : 'Free quote for your website in Belgrade. Book a consultation, no obligation. AiSajt.'
        }
        keywords={language === 'sr'
          ? 'izrada sajta beograd, besplatna ponuda sajt, izrada web sajta cena, konsultacija izrada sajta, web dizajn beograd'
          : 'website development belgrade, free website quote, web design belgrade, seo belgrade'
        }
        canonicalUrl="https://aisajt.com/funnel"
      />
      <Toaster position="top-center" />

      <main id="main-content" className="relative z-10">
        {/* Fixed Home button in top right corner */}
        <button
          onClick={() => navigate('/')}
          className="fixed top-5 left-4 right-auto md:left-auto md:right-6 z-50 px-4 py-2 md:px-5 md:py-2.5 border border-violet-500/30 bg-gray-950/80 backdrop-blur-md text-violet-300 text-xs md:text-sm font-semibold tracking-wide rounded-full hover:bg-violet-600/20 hover:text-white hover:border-violet-400 transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-[0_0_16px_rgba(139,92,246,0.15)]"
        >
          {language === 'sr' ? 'Početna' : 'Home'}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Hero Section – zbijen na telefonu, raspored kao referenca */}
        <section className="pt-14 pb-6 md:pt-16 md:pb-14 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 w-full">
            <div className="max-w-5xl mx-auto text-center">

              {/* AiSajt Logo – manji margin na telefonu */}
              <div className={`mb-3 md:mb-8 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                <div className="flex justify-center">
                  <img 
                    src="/images/aisajt_providno-removebg-preview.png" 
                    alt="AiSajt Logo" 
                    className="h-8 md:h-10 w-auto opacity-85"
                  />
                </div>
              </div>

              {/* Trust badges – na telefonu: avatari levo, tekst desno (kao referentna slika) */}
              <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex flex-row items-center justify-center gap-2 md:gap-3 flex-wrap mb-3 md:mb-6">
                  <img src="/images/ljudi.webp" alt="" className="h-6 w-auto rounded-full object-cover flex-shrink-0 md:h-8" />
                  <span className="text-gray-400 text-[11px] md:text-sm font-medium text-left md:text-center leading-tight">
                    {language === 'sr' ? (
                      <>Pridruži se preko 50+<br className="md:hidden" /> zadovoljnih klijenata</>
                    ) : (
                      <>Join 50+ satisfied<br className="md:hidden" /> clients</>
                    )}
                  </span>
                </div>
              </div>

              {/* Main Heading – manji razmaci na telefonu */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 md:mb-5">
                  {language === 'sr' ? (
                    <>Kontaktiraj Nas Da Biste Privukli <span className="text-white">Nove</span> <span className="text-violet-300">Klijente Online</span></>
                  ) : (
                    <>Contact Us To Attract <span className="text-white">New</span> <span className="text-violet-300">Clients Online</span></>
                  )}
                </h1>
              </div>

              {/* Subtitle – zbijen */}
              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-sm md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-4 md:mb-8">
                  {language === 'sr' 
                    ? 'Pogledaj šta možeš da dobiješ od sajta koji ima dokazani sistem privlačenja klijenata.'
                    : 'See what you can get from a website with a proven system for attracting clients.'
                  }
                </p>
              </div>

              {/* Video Section – na mobilnom BEZ animacije da play button radi odmah */}
              <div className={`md:transform md:transition-all md:duration-1000 md:delay-700 ${isVisible ? 'md:translate-y-0 md:opacity-100' : 'md:translate-y-10 md:opacity-0'} -mx-4 md:mx-0`}>
                <div className="relative rounded-none md:rounded-xl overflow-hidden shadow-2xl border-y md:border border-violet-500/20 bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-5xl mx-auto">
                  {/* CTA bar */}
                  <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white py-1.5 md:py-2 px-4 md:px-6 text-center">
                    <p className="font-semibold text-xs md:text-sm flex items-center justify-center gap-2">
                      <Play className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {language === 'sr' ? 'Klikni Play Da Naučiš Više' : 'Click Play to Learn More'}
                    </p>
                  </div>

                  {/* Vimeo video */}
                  <div className="aspect-video relative bg-black">

                    {/* Iframe — isti za sve uređaje: autoplay muted u pozadini */}
                    <iframe
                      ref={iframeRef}
                      src={videoUnmuted ? VIMEO_SOUND : VIMEO_MUTED}
                      frameBorder="0"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      allowFullScreen
                      title="Zeka-VSL"
                    />

                    {/* Overlay — dok je muted, klik/tap uključuje zvuk */}
                    {!videoUnmuted && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer group z-10"
                        style={{ touchAction: 'manipulation' }}
                        onClick={handleUnmute}
                      >
                        <div className="text-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center mb-2 md:mb-3 mx-auto group-hover:scale-110 group-hover:bg-violet-500/90 active:scale-90 transition-all duration-300 shadow-lg">
                            <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-0.5" />
                          </div>
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2.5 border border-white/10">
                            <p className="text-white font-bold text-xs md:text-sm mb-0.5">
                              {language === 'sr' ? '▶ Video se pušta' : '▶ Video is Playing'}
                            </p>
                            <p className="text-white/70 text-[10px] md:text-xs">
                              {language === 'sr' ? 'Klikni da uključiš zvuk' : 'Click to unmute'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking-form" className="pt-12 md:pt-16 pb-16 md:pb-24 relative overflow-hidden z-20 scroll-mt-20">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl mx-auto">

              {/* Header */}
              <div className="text-center mb-6">
                <span className="inline-block bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
                  {language === 'sr' ? '🎯 Besplatna konsultacija' : '🎯 Free consultation'}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                  {language === 'sr' ? (
                    <>Zakaži Poziv <span className="text-violet-400">Odmah</span></>
                  ) : (
                    <>Book a Call <span className="text-violet-400">Now</span></>
                  )}
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                  {language === 'sr'
                    ? 'Zakaži 1-na-1 poziv i saznaj kako možemo pomoći. Skroz besplatno.'
                    : 'Book a 1-on-1 call and see how we can help. Completely free.'
                  }
                </p>
              </div>

              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-pink-600 p-[2px]">
                  <div className="absolute inset-0 rounded-2xl bg-gray-900" />
                </div>


                <div className="relative z-10 bg-gray-900 p-7 md:p-9">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {language === 'sr' ? 'Uspešno Poslato!' : 'Successfully Sent!'}
                    </h4>
                    <p className="text-gray-400">
                      {language === 'sr' ? 'Kontaktiraćemo vas uskoro.' : 'We will contact you soon.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        style={{ touchAction: 'manipulation' }}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-800/60 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                          triedSubmit && !formData.name
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700'
                        }`}
                        placeholder={language === 'sr' ? 'Ime i prezime' : 'Full name'}
                      />
                      {triedSubmit && !formData.name && (
                        <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                          <span className="text-red-400">*</span>
                          {language === 'sr' ? 'Ovo polje je obavezno' : 'This field is required'}
                        </p>
                      )}
                    </div>

                    {/* Phone field */}
                    <div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        inputMode="tel"
                        style={{ touchAction: 'manipulation' }}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-800/60 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                          triedSubmit && !formData.phone
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700'
                        }`}
                        placeholder={language === 'sr' ? 'Broj telefona' : 'Phone number'}
                      />
                      {triedSubmit && !formData.phone && (
                        <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                          <span className="text-red-400">*</span>
                          {language === 'sr' ? 'Ovo polje je obavezno' : 'This field is required'}
                        </p>
                      )}
                    </div>

                    {/* Email field - shows after phone is entered */}
                    {(formData.phone || (triedSubmit && !formData.email)) && (
                      <div className="animate-fadeIn">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          inputMode="email"
                          style={{ touchAction: 'manipulation' }}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-800/60 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm ${
                            triedSubmit && !formData.email
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-700'
                          }`}
                          placeholder={language === 'sr' ? 'Email adresa' : 'Email address'}
                        />
                        {triedSubmit && !formData.email && (
                          <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                            <span className="text-red-400">*</span>
                            {language === 'sr' ? 'Ovo polje je obavezno' : 'This field is required'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Budget - radio krugovi, pojavljuje se nakon emaila */}
                    {formData.email && (
                      <div className="animate-fadeIn pt-2">
                        <p className="text-white text-sm mb-4">
                          {language === 'sr' ? 'Koliki je budžet projekta? (opciono)' : 'What is your project budget? (optional)'}
                        </p>
                        <div className="space-y-3">
                          {[
                            { value: '<500', label: '< €500' },
                            { value: '500-1000', label: '€500 – €1,000' },
                            { value: '1000-2500', label: '€1,000 – €2,500' },
                            { value: '2500-5000', label: '€2,500 – €5,000' },
                            { value: '5000+', label: '€5,000+' },
                            { value: 'prefer-not-to-say', label: language === 'sr' ? 'Radije ne bih da kažem' : 'Prefer not to say' },
                          ].map((opt) => {
                            const isChecked = formData.message === opt.value;
                            return (
                              <label
                                key={opt.value}
                                className="flex items-center gap-3 cursor-pointer group"
                              >
                                <span className={`relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isChecked ? 'border-violet-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                                  {isChecked && (
                                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                                  )}
                                </span>
                                <input
                                  type="radio"
                                  name="message"
                                  value={opt.value}
                                  checked={isChecked}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_2px_16px_rgba(139,92,246,0.4)] hover:shadow-[0_4px_24px_rgba(139,92,246,0.6)] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {language === 'sr' ? 'Zakaži Besplatni Poziv' : 'Book Free Call'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Privacy */}
                    <div className="border-t border-gray-800 pt-3 mt-1 space-y-1">
                      <p className="text-center text-gray-400 text-xs font-medium">
                        {language === 'sr' ? 'Kontaktiramo vas u narednih 24h' : 'We contact you within 24h'}
                      </p>
                      <p className="text-center text-gray-600 text-[11px]">
                        {language === 'sr' ? (
                          <>Vaši podaci su zaštićeni · <a href="/privacy" className="underline underline-offset-2 hover:text-gray-400 transition-colors">Politika privatnosti</a></>
                        ) : (
                          <>Your data is protected · <a href="/privacy" className="underline underline-offset-2 hover:text-gray-400 transition-colors">Privacy Policy</a></>
                        )}
                      </p>
                    </div>
                  </form>
                )}
                </div>
              </div>

              {/* Kontakt kartica – direktan poziv */}
              <a
                href="tel:+381621552156"
                onClick={() => trackPhoneClick('+381621552156', 'funnel_booking', language)}
                className="mt-4 flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-800/80 hover:border-violet-500/40 transition-all duration-300 group"
              >
                <img
                  src="/images/Strahinja izrada sajta.webp"
                  alt="Strahinja Zekanovic"
                  className="w-11 h-11 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-violet-500/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-[11px] mb-1 uppercase tracking-wider">
                    {language === 'sr' ? 'Kontaktirajte me odmah pozivom' : 'Contact me directly by call'}
                  </p>
                  <p className="text-white font-bold text-base tracking-wide group-hover:text-violet-300 transition-colors duration-200">
                    Strahinja · 062 155 2156
                  </p>
                </div>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-600 flex items-center justify-center shadow-[0_2px_12px_rgba(139,92,246,0.4)] group-hover:bg-violet-500 group-hover:shadow-[0_4px_18px_rgba(139,92,246,0.6)] transition-all duration-200 overflow-visible">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.2a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* Case Study – svi projekti sa logotipima iz /images/ */}
        <section id="case-study" ref={caseRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(caseVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-violet-500 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {language === 'sr' ? (
                      <>Stvarni rezultati <span className="text-violet-300">od stvarnih klijenata.</span></>
                    ) : (
                      <>Real results <span className="text-violet-300">from real clients.</span></>
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
                const cards = [
                  { id: 'prestige', logo: '/images/logop.png', siteImg: '/images/prestige.png', title: 'Prestige Gradnja', url: 'https://prestigegradnja.rs/', tag: language === 'sr' ? 'Nekretnine, gradnja' : 'Real estate, construction', headline: language === 'sr' ? 'Sajt za nekretnine i apartmane — projekti i kontakt' : 'Site for real estate and apartments — projects and contact', text: language === 'sr' ? 'Moderan izgled i jasna ponuda. Klijent zadovoljan.' : 'Modern look and clear offer. Client satisfied.' },
                  { id: 'rc', logo: '/images/logo.png', siteImg: '/images/borakk.png', title: 'Custom RC Parts', url: 'https://customrc.parts/', tag: language === 'sr' ? 'E-commerce, RC delovi' : 'E-commerce, RC parts', headline: language === 'sr' ? 'Web prodavnica za RC delove — porudžbine i katalog' : 'Online store for RC parts — orders and catalog', text: language === 'sr' ? 'Funkcionalan shop sa kategorijama i plaćanjem. Rast prodaje preko sajta.' : 'Functional shop with categories and payment. Sales growth via site.' },
                  { id: 'kralj', logo: '/images/Beli%20logo2.png', siteImg: '/images/kralj.png', title: 'Kralj Residence', url: 'https://kraljresidence.rs/', tag: language === 'sr' ? 'apartmani i nekretnine' : 'Apartments & real estate', headline: language === 'sr' ? 'Moderan sajt za prodaju stanova - direktna prodaja' : 'Modern site for apartment sales — direct sales', text: language === 'sr' ? 'Responzivan sajt sa jasnom ponudom stanova. Zadovoljan klijent.' : 'Responsive site with clear property offer. Happy client.' },
                  { id: 'bn', logo: '/images/logobn.png', siteImg: '/images/bn.png', title: 'BN Autofolije', url: 'https://bnautofolije.com/', tag: language === 'sr' ? 'Auto folije i detailing' : 'Car wraps & detailing', headline: language === 'sr' ? 'Web sajt za auto folije — više upita i preglednosti' : 'Website for car wraps — more inquiries and visibility', text: language === 'sr' ? 'Profesionalna prezentacija i galerija radova. Više upita.' : 'Professional presentation and portfolio. More inquiries.' },
                  { id: 'poklon', logo: '/images/poklonilogo.png', siteImg: '/images/poklon.png', title: 'Pokloni Portret', url: 'https://pokloniportret.rs/', tag: language === 'sr' ? 'Personalizovani pokloni' : 'Personalized gifts', headline: language === 'sr' ? 'Portreti po narudžbini — galerija i porudžbine' : 'Custom portraits — gallery and orders', text: language === 'sr' ? 'Umetnički brend na webu. Lako naručivanje i pregled radova.' : 'Art brand online. Easy ordering and portfolio view.' },
                  { id: 'komotraks', logo: '/images/komotraks-logotip.png', siteImg: '/images/komotraks.png', title: 'Komotraks', url: 'https://ugradnja-zavesa-komarnika.com/', tag: language === 'sr' ? 'Komarnici' : 'Screens & sliding doors', headline: language === 'sr' ? 'Profesionalan web sajt za komarnike i klizna vrata - jasna ponuda i kontakti' : 'Professional website for screens and sliding doors — clear offer and contacts', text: language === 'sr' ? 'Moderan sajt sa uslugama i flotom. Klijent zadovoljan preglednošću.' : 'Modern site with services and fleet. Client happy with clarity.' },
                  { id: 'loki', logo: '/images/lokilo.png', siteImg: '/images/loki.png', title: 'Loki N-4', url: 'https://lokin4.rs/', tag: language === 'sr' ? 'Betonski elementi' : 'Concrete elements', headline: language === 'sr' ? 'Prepoznatljiv brend na webu — identitet i poruka' : 'Recognizable brand online — identity and message', text: language === 'sr' ? 'Jedinstven vizuelni identitet i jasna komunikacija.' : 'Unique visual identity and clear communication.' },
                  { id: 'bora', logo: '/images/boralogo.jpg', siteImg: '/images/bora.png', title: 'Boracompany', url: 'https://boracompany.ch/', tag: language === 'sr' ? 'CNC obrada' : 'CNC machining', headline: language === 'sr' ? 'Korporativni sajt — profesionalna prezentacija usluga' : 'Corporate site — professional service presentation', text: language === 'sr' ? 'Jasna struktura i poruka brenda. Povećana kredibilitet.' : 'Clear structure and brand message. Increased credibility.' },
                  { id: 'lako', logo: '/images/logolak.png', siteImg: '/images/lako.png', title: 'Lako Sistem', url: 'https://lakosistem.rs/', tag: language === 'sr' ? 'Papirna galanterija' : 'Paper goods', headline: language === 'sr' ? 'Moderan prezentacioni web sajt - preglednost i autoritet. Zadovoljstvo i rezultati.' : 'Modern presentation website — clarity and authority. Satisfaction and results.', text: language === 'sr' ? 'Sajt prilagođen potrebama klijenta. Zadovoljstvo i rezultati.' : 'Site tailored to client needs. Satisfaction and results.' },
                  { id: 'panic', logo: '/images/logoin.png', siteImg: '/images/panic.png', title: 'IN-STAN', url: 'https://in-stan.rs/', tag: language === 'sr' ? 'Stolarija' : 'Joinery', headline: language === 'sr' ? 'Moderan funkcionalan sajt za stolariju sa katalogom' : 'Modern functional website for joinery with catalog', text: language === 'sr' ? 'Profesionalan sajt koji predstavlja brend na internetu.' : 'Professional site that represents the brand online.' },
                  { id: 'jastuci', logo: '/images/logo2.png', siteImg: '/images/jastuci.png', title: 'Vazdušni jastuci', url: 'https://vazdusnijastuci.rs/', tag: language === 'sr' ? 'Auto delovi' : 'Auto parts', headline: language === 'sr' ? 'Sajt za auto delove — katalog i upiti' : 'Site for auto parts — catalog and inquiries', text: language === 'sr' ? 'Pregledan katalog i kontakt forma. Više upita sa sajta.' : 'Clear catalog and contact form. More inquiries from site.' },
                ];

                const cardEl = (card: typeof cards[0]) => (
                  <div
                    key={card.id}
                    className="group rounded-2xl border border-gray-700/60 bg-gray-900/60 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col h-full transition-all duration-300 ease-out hover:border-violet-500/50 hover:shadow-violet-500/10 hover:shadow-2xl hover:-translate-y-1.5"
                  >
                    <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className="w-4 h-4 text-violet-400 fill-violet-400" />
                          ))}
                        </div>
                        <h3 className="text-violet-300 font-bold text-sm md:text-base mb-3 leading-snug">
                          {card.headline}
                        </h3>
                        <div className="aspect-video rounded-lg bg-gray-800 border border-gray-700 mb-4 overflow-hidden relative">
                          <img src={card.siteImg} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                          {card.text}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto flex-shrink-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-24 h-14 md:w-28 md:h-16 rounded-lg border flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5 ${['rc', 'bora', 'lako', 'panic'].includes(card.id) ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700'}`}>
                            <img src={card.logo} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{card.title}</p>
                            <p className="text-gray-500 text-xs">{card.tag}</p>
                          </div>
                        </div>
                        <a
                          href={card.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:bg-violet-600 hover:text-white hover:border-violet-500 hover:scale-105 active:scale-95 flex-shrink-0 opacity-0 group-hover:opacity-100"
                          title={language === 'sr' ? 'Otvori sajt u novom prozoru' : 'Open site in new window'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{language === 'sr' ? 'Poseti sajt' : 'Visit site'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <>
                    {/* Mobilni: beskonačni horizontalni scroll carousel (3x kopije, jump bez vidljivog skoka) */}
                    <div className="md:hidden mt-8 -mx-4">
                      <div
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                        className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                      >
                        {[...cards, ...cards, ...cards].map((card, idx) => (
                          <div key={`${card.id}-${idx}`} className="snap-start flex-shrink-0 w-[80vw]">
                            {cardEl(card)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop: grid */}
                    <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-10">
                      {cards.map((card) => cardEl(card))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Social proof / 50+ projekata – 1:1 layout kao referenca */}
        <section id="success-metrics" ref={metricsRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(metricsVisible)}`}>
            <div className="max-w-4xl mx-auto text-center">
              {/* Slika ljudi + tekst */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                <p className="text-white text-sm md:text-base">
                  {language === 'sr' ? (
                    <>Pridružite se <strong>50+</strong> zadovoljnih <strong>klijenata</strong> i <strong>preduzeća</strong>.</>
                  ) : (
                    <>Join <strong>50+</strong> satisfied <strong>clients</strong> and <strong>businesses</strong>.</>
                  )}
                </p>
              </div>

              {/* Naslovi */}
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {language === 'sr' ? '50+ Uspešnih Projekata, Priče Uspeha.' : '50+ Successful Projects, Success Stories.'}
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-violet-400 mb-6">
                {language === 'sr' ? 'Jedan Dokazan Pristup.' : 'One Proven Approach.'}
              </h3>

              {/* Opis */}
              <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mb-10">
                {language === 'sr'
                  ? 'Od korporativnih sajtova do e-commerce i landing stranica — znamo šta je potrebno da vaš biznis zasija na internetu. Bez nagađanja, bez zastoja.'
                  : 'From corporate sites to e-commerce and landing pages — we know what it takes to make your business shine online. No guesswork, no plateaus.'}
              </p>

              {/* Centralna slika – donji deo prekriva stats ploča */}
              <div className="rounded-xl overflow-hidden border border-gray-700/60 shadow-2xl max-w-4xl mx-auto">
                <img src="/images/filmska%207.jpg" alt={language === 'sr' ? 'Rad na projektu — AiSajt tim' : 'Project work — AiSajt team'} className="w-full h-auto object-cover" />
              </div>

              {/* Statistike – preklapa dno slike, vizuelno spojeno */}
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

              {/* Ikona na dnu */}
              <div className="mt-10 flex justify-center">
                <div className="w-10 h-10 flex items-center justify-center text-violet-500">
                  <div className="w-6 h-6 border-2 border-violet-500 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team – 1:1 kopija, 3 člana */}
        <section id="meet-the-team" ref={teamRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(teamVisible)}`}>
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                {language === 'sr' ? 'Upoznajte tim ' : 'Meet the Team '}
                <span className="text-violet-400">{language === 'sr' ? 'iza AiSajt-a.' : 'Behind AiSajt.'}</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-4">
                {language === 'sr'
                  ? 'Upoznajte ljude koji su pomogli brojnim kompanijama da dobiju moderan sajt i jaču online prisutnost.'
                  : "Get to know the specialists who've helped many companies get a modern site and stronger online presence."}
              </p>
              <div className="w-3 h-3 bg-violet-500 rounded-sm mx-auto mb-12" />

              {/* Mobile: Bogdan + Strahinja u gornjem redu, Marko dole u sredini */}
              {/* Desktop (sm+): 3 kartice u redu */}
              <div className="max-w-4xl mx-auto">
                {/* Gornji red – Bogdan i Strahinja */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-0">
                  {[
                    { name: 'Bogdan Gradjanin', role: language === 'sr' ? 'Suvlasnik, specijalizovani programer' : 'Co-owner & Specialized Developer', image: '/images/boban Izrada sajta .webp' },
                    { name: 'Strahinja Zekanovic', role: language === 'sr' ? 'Suvlasnik, dizajner i poslovanje' : 'Co-owner, Designer & Operations', image: '/images/Strahinja izrada sajta.webp' },
                  ].map((member) => (
                    <div key={member.name} className="rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col">
                      <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
                        {'image' in member && member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          member.name.split(' ').map((n) => n[0]).join('')
                        )}
                      </div>
                      <div className="p-4 sm:p-5">
                        <p className="font-bold text-sm sm:text-lg">
                          {(() => {
                            const parts = member.name.split(' ');
                            const ime = parts[0];
                            const prezime = parts.slice(1).join(' ');
                            return (
                              <>
                                <span className="text-violet-400">{ime}</span>
                                {prezime && <span className="text-white"> {prezime}</span>}
                              </>
                            );
                          })()}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{member.role}</p>
                      </div>
                    </div>
                  ))}

                  {/* Marko – isti izgled kao Bogdan i Strahinja */}
                  <div className="col-span-2 sm:col-span-1 rounded-2xl border border-gray-600/60 bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-xl flex flex-col max-w-[50%] sm:max-w-none mx-auto w-full">
                    <div className="aspect-square bg-gray-700/80 flex items-center justify-center text-4xl font-bold text-gray-500 overflow-hidden">
                      <img src="/images/Dedza SEO OPTIMIZACIJA.webp" alt="Marko Devedzic" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="font-bold text-sm sm:text-lg">
                        <span className="text-violet-400">Marko</span>
                        <span className="text-white"> Devedzic</span>
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                        {language === 'sr' ? 'SEO i održavanje sajtova' : 'SEO & Website Maintenance'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span>{language === 'sr' ? 'Odlično' : 'Excellent'}</span>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-green-500 fill-green-500" />
                  ))}
                  <span className="text-gray-500">{language === 'sr' ? '50+ uspešnih projekata' : '50+ successful projects'}</span>
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white font-bold uppercase text-sm tracking-wide rounded-lg transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1),0_0_48px_rgba(139,92,246,0.65)] touch-manipulation cursor-pointer"
                >
                  {language === 'sr' ? 'Zakazi poziv' : 'Book a call'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews / Recenzije */}
        <section id="reviews" ref={reviewsRef as React.RefObject<HTMLElement>} className="py-10 md:py-24 relative overflow-hidden z-10 bg-black">
          <div className={`container mx-auto px-4 relative z-10 ${revealClass(reviewsVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2 md:mb-3">
                  {language === 'sr' ? 'Odlično' : 'Excellent'}
                </h2>
                <div className="flex justify-center gap-0.5 mb-1.5 md:mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 md:w-8 md:h-8 text-green-500 fill-green-500" />
                  ))}
                </div>
                <p className="text-white/90 text-xs md:text-base">
                  {language === 'sr' ? (
                    <>Ocenjeno <strong>4.8 / 5</strong> na osnovu recenzija na{' '}
                      <span className="inline-flex items-center gap-1">
                        Trustpilot
                        <Star className="w-3.5 h-3.5 text-green-500 fill-green-500 inline" />
                      </span>
                    </>
                  ) : (
                    <>Rated <strong>4.8 / 5</strong> based on reviews on{' '}
                      <span className="inline-flex items-center gap-1">
                        Trustpilot
                        <Star className="w-3.5 h-3.5 text-green-500 fill-green-500 inline" />
                      </span>
                    </>
                  )}
                </p>
                <p className="text-gray-400 text-xs md:text-sm mt-2 md:mt-4 text-left max-w-4xl mx-auto">
                  {language === 'sr' ? 'Prikazujemo naše 4 i 5 zvezdica recenzije.' : 'Showing our 4 & 5 star reviews.'}
                </p>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 auto-rows-fr"
                style={{ gridAutoRows: 'minmax(160px, auto)' }}
              >
                {(language === 'sr' ? [
                  { name: 'Marko P.', date: 'pre 3 nedelje', title: 'Nisam očekivao ovako brze rezultate', body: 'Kontaktirao sam ih jer Google jednostavno nije prikazivao moj sajt. Bogdan mi je isti dan odgovorio i objasnio tačno šta je problem. Posle mesec dana rada vidim prve rezultate, upiti počinju da stižu organskim putem. Preporučujem svakome ko se muči sa vidljivošću.' },
                  { name: 'Nebojša M.', date: 'pre 14 meseci', title: 'Objasne sve bez besmislica', body: 'Bavim se nekretninama i dugo sam odlagao SEO jer nisam znao odakle da počnem. Momci su mi sve objasnili bez žargona i bez pritiska. Posle drugog meseca pojavio sam se na prvoj strani za par ključnih reči koje su mi važne. Šalju mesečne izveštaje i uvek su dostupni kada imam pitanje. Definitivno nastavljamo saradnju.' },
                  { name: 'Nikola K.', date: 'pre 2 meseca', title: 'Novi sajt', body: 'Imao sam zastareo sajt koji je odbijao klijente, spor, ružan na telefonu, ni Google ga nije prikazivao. Bogdan mi je napravio potpuno novu verziju, moderan izgled, brzo učitavanje. Odmah sam primetio razliku, a i klijenti su počeli da komentarišu kako sajt dobro izgleda.' },
                  { name: 'Jelena M.', date: 'pre 4 meseca', title: 'Ima me na Googleu napokon', body: 'Pre nego što smo počeli saradnju, sajt mi se gotovo nije ni pojavljivao. Posle nekih dva meseca primetila sam prve promene, a sad redovno stižu i upiti od novih klijenata. Hvala Bogdanu i timu na strpljenju i stručnosti.' },
                  { name: 'Stefan D.', date: 'pre 7 meseci', title: 'Više organskih upita nego ikad', body: 'Angažovao sam ih najpre za izradu sajta, ali kada su mi pokazali plan SEO održavanja, odlučio sam da produžimo saradnju. Uvek brzo odgovore na poruke i pažljivo prođu kroz svaku stavku izveštaja. Za pet meseci organski saobraćaj nam je utrostručen, nisam ni slutio da je to moguće ovako brzo. Svakome ko ozbiljno gleda na rast, ovo je pravo rešenje.' },
                  { name: 'Ivana S.', date: 'pre 5 meseci', title: 'Sajt gotov na vreme bez stresa', body: 'Tražila sam nekog da napravi sajt za moj salon lepote. Sve je urađeno profesionalno, dogovorili smo rok i rok je ispoštovan. Nema onih klasičnih "još malo, još malo" situacija. Sajt lepo izgleda i na telefonu, što mi je bilo jako važno. Zadovoljna sam.' },
                  { name: 'Miloš R.', date: 'pre 11 meseci', rating: 4, title: 'Rezultati dobri odgovor ponekad kasni', body: 'Bavim se stolarijom i trebao mi je SEO da me ljudi nađu kad traže nameštaj po meri. Pozicije su se vidno poboljšale već posle prvog meseca, za ključne reči u mojoj branši smo skočili na prvu stranicu. Jedino što bih napomenuo je da sam ponekad malo duže čekao na odgovor, ali kada odgovore, sve je jasno i precizno. Momci su stvarno dobri u poslu, preporučujem.' },
                ] : [
                  { name: 'Mark P.', date: '3 weeks ago', title: 'Results faster than I expected', body: 'I reached out because Google simply wasn\'t showing my site. Bogdan replied the same day and explained exactly what the problem was. After a month I started seeing results, inquiries are now coming through organically. Highly recommended.' },
                  { name: 'Nebojsa M.', date: '14 months ago', title: 'They explain everything no nonsense', body: 'I work in real estate and kept putting off SEO because I didn\'t know where to start. The guys explained everything without jargon or pressure. After the second month I appeared on the first page for a few key terms that matter to me. They send monthly reports and are always available when I have questions. We will definitely continue.' },
                  { name: 'Nick K.', date: '2 months ago', title: 'New site', body: 'My old site was outdated and was pushing clients away, slow, ugly on mobile, not showing up on Google. Bogdan built me a completely new version, modern design, fast loading. I noticed the difference right away, and clients started commenting on how good the site looks.' },
                  { name: 'Helen M.', date: '4 months ago', title: 'We\'re on Google now finally', body: 'Before we started working together, my site barely appeared anywhere. After about two months I noticed the first changes, and now new client inquiries come in regularly. Thanks to Bogdan and the team for their patience and expertise.' },
                  { name: 'Steve D.', date: '7 months ago', title: 'More organic leads than ever', body: 'I originally hired them just to build a website, but when they showed me the SEO maintenance plan, I decided to continue the collaboration. They always reply quickly and go through every item in the report. In five months our organic traffic tripled, I didn\'t think that was possible this fast. For anyone serious about growth, this is the right solution.' },
                  { name: 'Ivy S.', date: '5 months ago', title: 'Site done on time no stress', body: 'I needed someone to build a website for my beauty salon. Everything was done professionally, we agreed on a deadline and the deadline was met. None of the usual "just a bit more" delays. The site looks great on mobile too, which was really important to me. Very satisfied.' },
                  { name: 'Milos R.', date: '11 months ago', rating: 4, title: 'Good results replies can be slow', body: 'I run a carpentry workshop and needed SEO so people could find me when searching for custom furniture. Rankings improved noticeably after the first month, for key terms in my niche we jumped to the first page. The only thing I\'d mention is that replies sometimes took a bit longer, but when they did respond everything was clear and precise. The guys are genuinely good at what they do, I recommend them.' },
                ]).map((review, i) => {
                  const isExpanded = expandedReviewIndex === i;
                  const isBigCard = [1, 4].includes(i);
                  const is4Star = review.rating === 4;
                  const mobileOrderClass = is4Star ? 'order-4 md:order-none' : ['order-1', 'order-2', 'order-3', 'order-5', 'order-6', 'order-7'][i] + ' md:order-none';
                  const stars = (rating: number) => [1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 md:w-4 md:h-4 ${s <= rating ? 'text-green-500 fill-green-500' : 'text-gray-300 fill-gray-300'}`} />
                  ));
                  return (
                    <div
                      key={i}
                      className={`relative rounded-lg md:rounded-xl border border-gray-200 bg-white shadow-md md:shadow-lg p-3.5 md:p-5 flex flex-col text-left ${
                        isBigCard ? 'md:row-span-2' : ''
                      } ${isExpanded ? 'z-50' : 'z-0'} ${mobileOrderClass}`}
                    >
                      <div className="flex gap-0.5 mb-1.5 md:mb-3">
                        {stars(review.rating ?? 5)}
                      </div>
                      <p className="text-gray-500 text-[11px] md:text-xs mb-1 md:mb-2">
                        {review.name}, {review.date}
                      </p>
                      <h3 className="font-bold text-gray-900 text-xs md:text-base mb-1 md:mb-2 leading-tight">
                        {review.title}
                      </h3>
                      <p className={`text-gray-600 text-xs md:text-sm leading-relaxed flex-1 ${!isBigCard ? 'line-clamp-2 md:line-clamp-3' : ''}`}>
                        {review.body}
                      </p>
                      {!isBigCard && (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpandedReviewIndex(isExpanded ? null : i)}
                            className="text-violet-500 hover:text-violet-600 text-xs md:text-sm font-medium mt-1.5 md:mt-2 self-start cursor-pointer hover:underline underline-offset-2"
                          >
                            {language === 'sr' ? 'Pročitaj više' : 'Read more'}
                          </button>
                          {isExpanded && (
                            <div className="absolute left-0 top-0 w-full rounded-lg md:rounded-xl border border-violet-300 bg-white shadow-2xl p-3.5 md:p-5 flex flex-col">
                              <div className="flex gap-0.5 mb-1.5 md:mb-3">
                                {stars(review.rating ?? 5)}
                              </div>
                              <p className="text-gray-500 text-[11px] md:text-xs mb-1 md:mb-2">
                                {review.name}, {review.date}
                              </p>
                              <h3 className="font-bold text-gray-900 text-xs md:text-base mb-1 md:mb-2 leading-tight">
                                {review.title}
                              </h3>
                              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-2 md:mb-3">
                                {review.body}
                              </p>
                              <button
                                type="button"
                                onClick={() => setExpandedReviewIndex(null)}
                                className="text-violet-500 hover:text-violet-600 text-xs md:text-sm font-medium self-start cursor-pointer hover:underline underline-offset-2"
                              >
                                {language === 'sr' ? 'Pročitaj manje' : 'Read less'}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Završna CTA sekcija – 1:1 dizajn, violetno svetlo */}
        <section id="cta-final" ref={ctaRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-black relative z-10 -mt-1">
          <div className={`container mx-auto px-4 ${revealClass(ctaVisible)}`}>
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl bg-gray-900/95 border border-gray-700/50 overflow-visible">
                {/* Svetlo u našim bojama – top-left i top-right */}
                <div className="absolute -top-40 -left-40 w-[500px] h-[400px] bg-violet-600/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[400px] h-[350px] bg-violet-500/15 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 p-8 md:p-10 lg:p-12">
                  {/* Leva kolona – tekst */}
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-start gap-3 mb-6">
                      <p className="text-white text-sm md:text-base">
                        {language === 'sr' ? 'Pridružite se 50+ uspešnih preduzeća' : 'Join 50+ successful businesses'}
                      </p>
                      <img src="/images/ljudi.webp" alt="" className="h-8 w-auto rounded-full object-cover" />
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      <span className="text-violet-400">
                        {language === 'sr' ? 'Stigli ste do ovde ' : "You've made it this far "}
                      </span>
                      <span className="text-white">
                        {language === 'sr' ? '— i to nije slučajno.' : "— and that's no accident."}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-snug mb-3 md:leading-relaxed md:text-base md:mb-4 max-w-xl">
                      {language === 'sr'
                        ? 'Vlasnici biznisa koji ozbiljno razmišljaju o rastu ne čekaju da se stvari same poslažu. Oni traže pravi sistem, prave ljude i pravu strategiju, i kada to pronadju, kreću brzo.'
                        : "Business owners who are serious about growth don't wait for things to fall into place. They look for the right system, the right people and the right strategy — and when they find it, they move fast."
                      }
                    </p>
                    <p className="text-gray-300 text-sm md:text-base mb-5 max-w-xl">
                      {language === 'sr'
                        ? 'Ako ste u toj fazi — ambiciozni, spremni da privučete skuplje klijente i izgradite nešto što zaista radi, onda je ovaj poziv za vas.'
                        : "If you're at that stage — ambitious, ready to attract higher-paying clients and build something that actually works — this call is for you."
                      }
                    </p>
                    <p className="text-white font-medium text-sm mb-3">
                      {language === 'sr' ? 'Za 30 minuta zajedno prolazimo kroz:' : "In 30 minutes we'll go through:"}
                    </p>
                    <ul className="space-y-2.5 mb-6">
                      {[
                        language === 'sr' ? 'Vašu trenutnu situaciju i ciljeve — gde ste sada i gde želite da budete' : 'Your current situation & goals — where you are now and where you want to be',
                        language === 'sr' ? 'Brze pobede i skrivene prilike — šta možete da primenite odmah, bez čekanja' : 'Quick wins & hidden opportunities — what you can implement right away',
                        language === 'sr' ? 'Iskren savet o sledećim koracima — konkretan, prilagođen vašem biznisu, bez generičkih saveta' : 'Honest advice on next steps — specific, tailored to your business, no generic tips',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                          <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-200 text-sm md:text-base font-semibold mb-2">
                      {language === 'sr' ? 'Nećete dobiti prodajnu ponudu. Dobićete jasnoću.' : "You won't get a sales pitch. You'll get clarity."}
                    </p>
                    <p className="text-gray-400 text-sm max-w-xl mb-3">
                      {language === 'sr' ? (
                        <>Na kraju poziva znaćete tačno šta vas koči, šta je sledeći korak i da li smo pravi partner za tu fazu vašeg rasta. <strong className="text-white">Bez obaveze</strong> — ali sa konkretnim odgovorima koje možete da primenite odmah, bez obzira na to kako se odlučite.</>
                      ) : (
                        <>By the end of the call you'll know exactly what's holding you back, what's next, and whether we're the right partner for this stage of your growth. <strong className="text-white">No obligation</strong> — but with concrete answers you can act on immediately, no matter what you decide.</>
                      )}
                    </p>
                    <p className="text-violet-300 text-sm font-semibold">
                      {language === 'sr' ? 'Prijava traje 30 sekundi. Ostatak je na nama.' : 'Signing up takes 30 seconds. The rest is on us.'}
                    </p>
                  </div>


                  {/* Desna kolona – samo glavna slika, centrirana */}
                  <div className="relative flex items-center justify-center w-full max-w-md">
                    <div className="rounded-2xl overflow-hidden border border-gray-700/60 shadow-2xl bg-gray-800/50 w-full max-h-[280px] md:max-h-[340px] flex items-center justify-center">
                      <img src="/images/filmska.jpg" alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                {/* Dugme centrirano ispod sadržaja */}
                <div className="relative flex flex-col items-center gap-2 pb-8 md:pb-10 px-4">
                  <button
                    type="button"
                    onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 font-bold uppercase text-sm tracking-wide rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.08),0_0_48px_rgba(255,255,255,0.55)] touch-manipulation cursor-pointer"
                  >
                    {language === 'sr' ? 'Zakazi poziv' : 'Book a call'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-gray-500 text-xs">
                    {language === 'sr' ? 'Kontaktiramo vas u roku od 24h' : 'We contact you within 24h'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mini footer – disclaimer i linkovi */}
        <footer className="bg-black border-t border-gray-800 py-8 md:py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-5">
                <img
                  src="/images/aisajt_providno-removebg-preview.png"
                  alt="AiSajt Logo"
                  className="h-8 md:h-10 w-auto opacity-85"
                />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                {language === 'sr' ? (
                  'Rezultati zavise od vrste projekta i saradnje. Prikazani projekti su stvarni radovi naših klijenata. Svaki biznis je drugačiji — uspeh na webu zavisi od vaših ciljeva, potreba i angažmana. Nismo povezani ni sa jednom trećom stranom navedenom na sajtu.'
                ) : (
                  'Results depend on project type and collaboration. Projects shown are real work for our clients. Every business is different — online success depends on your goals, needs, and commitment. We are not affiliated with any third parties mentioned on this site.'
                )}
              </p>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} AiSajt
                <span className="mx-1.5">•</span>
                <a href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</a>
                <span className="mx-1.5">•</span>
                <a href="/terms" className="hover:text-violet-400 transition-colors">{language === 'sr' ? 'Uslovi' : 'Terms'}</a>
                <span className="mx-1.5">•</span>
                <a href="/terms#disclaimer" className="hover:text-violet-400 transition-colors">{language === 'sr' ? 'Izjava' : 'Disclaimer'}</a>
              </p>
            </div>
          </div>
        </footer>

        {/* ── Sticky Bottom Bar ────────────────────────────────────────── */}
        <div
          className={`fixed bottom-5 left-0 right-0 z-40 hidden md:flex justify-center px-4 transition-all duration-500 ease-out ${
            stickyBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
          }`}
        >
          <div className="inline-flex items-center gap-3 md:gap-5 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl border border-violet-500/25 bg-black/55 backdrop-blur-xl shadow-[0_4px_32px_rgba(139,92,246,0.18)]">
            <p className="text-gray-300 text-xs md:text-sm leading-snug whitespace-nowrap">
              {language === 'sr' ? (
                <>Nauči kako da dobiješ nove klijente sa <span className="text-violet-400 font-semibold">AiSajt sistemom.</span></>
              ) : (
                <>Get new clients with the <span className="text-violet-400 font-semibold">AiSajt system.</span></>
              )}
            </p>
            <button
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_16px_rgba(139,92,246,0.45)] hover:shadow-[0_0_24px_rgba(139,92,246,0.65)] whitespace-nowrap"
            >
              {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────────────────── */}

        {/* ── Floating Book-a-Call Widget – sakriven na mobilnom kada je forma u viewportu ─ */}
        <div className={`fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 transition-opacity duration-300 ${
          bookingInView ? 'hidden md:flex' : 'flex'
        }`}>

          {/* Popup card */}
          {widgetOpen && (
          <div
            className="transition-all duration-300 ease-out origin-bottom-right opacity-100 scale-100 translate-y-0 pointer-events-auto"
          >
            <div className="w-80 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="/images/Strahinja izrada sajta.webp"
                      alt="Strahinja Zekanovic"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">AiSajt Tim</p>
                  <p className="text-gray-400 text-xs">Strahinja Zekanović · Co-founder</p>
                </div>
                <button
                  onClick={() => setWidgetOpen(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors mt-0.5 flex-shrink-0"
                  aria-label="Zatvori"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Title */}
              <div className="px-4 pb-3 border-b border-white/8">
                <p className="text-white font-bold text-sm">
                  {language === 'sr' ? 'AiSajt Strategijski Poziv' : 'AiSajt Strategy Call'}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {language === 'sr' ? 'Zakaži besplatni 1-1 poziv sa timom.' : 'Book your free 1-1 call with the team.'}
                </p>
              </div>

              {/* Urgency */}
              <div className="mx-4 mt-3 px-3 py-2 bg-white/5 rounded-lg flex items-center justify-between">
                <p className="text-gray-300 text-xs font-medium">
                  {language === 'sr' ? 'Malo slobodnih termina.' : 'Only few slots left.'}
                </p>
                <span className="text-violet-400 font-bold text-xs tabular-nums">⚡ {language === 'sr' ? 'Ograničeno' : 'Limited'}</span>
              </div>

              {/* Day picker */}
              <div className="px-4 pt-3 pb-1">
                <div className="flex gap-1.5">
                  {dayLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`flex-1 flex flex-col items-center py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedDay === i
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/50 hover:text-white'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wide leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="px-4 py-4">
                <button
                  onClick={() => {
                    setWidgetOpen(false);
                    setTimeout(() => {
                      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-violet-500/30"
                >
                  {language === 'sr' ? 'Zakaži Poziv' : 'Book a Call'}
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Toggle bubble */}
          <button
            onClick={() => setWidgetOpen(v => !v)}
            className="relative w-14 h-14 rounded-full shadow-2xl border-2 border-violet-500 hover:border-violet-400 transition-all hover:scale-105 active:scale-95 bg-violet-700 flex items-center justify-center"
            aria-label="Zakaži poziv"
          >
            <img
              src="/images/aisajt_providno-removebg-preview.png"
              alt="AiSajt"
              className="w-9 h-9 object-contain"
            />
            {/* Green dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-950" />
          </button>
        </div>
        {/* ─────────────────────────────────────────────────────────────── */}

      </main>
    </div>
  );
}
