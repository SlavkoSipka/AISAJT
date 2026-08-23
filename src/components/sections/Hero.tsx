import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import { Phone, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Language } from '../../types/language';
import { navigateToDetaljiSection } from '../../utils/navigation';
import { NAP } from '../../lib/site-config';
import { trackPhoneClick, trackCTAClick } from '../../utils/analytics';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HeroProps {
  language: Language;
}

export function Hero({ language }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // GSAP intro timeline — sadržaj je vidljiv u HTML-u (SSR/SEO safe),
  // animacija samo dodaje ulazak pri mount-u.
  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('[data-hero="badge"]', { y: 24, opacity: 0, duration: 0.6 })
          .from(
            '[data-hero="word"]',
            { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.09 },
            '-=0.3'
          )
          .from('[data-hero="desc"]', { y: 28, opacity: 0, duration: 0.7 }, '-=0.45')
          .from('[data-hero="cta"]', { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
          .from('[data-hero="trust"]', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
          .from(
            '[data-hero="visual"]',
            { x: 60, opacity: 0, scale: 0.94, duration: 1 },
            '-=0.8'
          )
          .from(
            '[data-hero="float"]',
            { y: 30, opacity: 0, duration: 0.7, stagger: 0.12 },
            '-=0.5'
          )
          .from('[data-hero="letter"]', { x: -60, opacity: 0, duration: 1.2 }, 0.2)
          /* Mobilna kartica ulazi odozdo — bez pomeraja po X, jer bi je na
             uskom ekranu izgurao izvan kadra. */
          .from('[data-hero="visual-m"]', { y: 40, opacity: 0, scale: 0.96, duration: 0.9 }, '-=0.9');

        // Blago lebdenje mockup kartice — beskonačno
        gsap.to('[data-hero="visual"]', {
          y: -12,
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.6,
        });
      });

      return () => mm.revert();
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Brend ide prvo u H1 — homepage je "brand powerhouse", cilja ime firme,
  // ne golu komercijalnu frazu koju sada vlasuju /izrada-sajta i
  // /seo-optimizacija-cena pillar stranice. "AiSajt," ostaje van gradijenta
  // (jasno, ozbiljno ime brenda), gradijent akcenat i dalje pada na isti
  // deo teksta kao pre ("Izradu Sajta" / "Development Agency").
  const h1Words = language === 'sr'
    ? ['AiSajt,', 'Agencija', 'za', 'Izradu', 'Sajta']
    : ['AiSajt,', 'Website', 'Development', 'Agency'];
  const gradientFrom = language === 'sr' ? 3 : 1;

  return (
    <header
      ref={heroRef}
      className="text-gray-900 relative overflow-hidden pt-24 md:pt-40 pb-14 md:pb-28 md:min-h-[92vh] flex items-center"
    >
      {/* Background: soft radials + dot grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50/50"></div>
      <div className="absolute inset-0 lg-dot-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-400/25 to-indigo-500/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-gradient-to-br from-indigo-400/20 to-sky-500/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-indigo-500/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Giant Background Letter "A" */}
      <div className="absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden" data-hero="letter">
        <div
          className="text-[300px] sm:text-[320px] md:text-[340px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 select-none opacity-[0.10] md:opacity-[0.12]"
          aria-hidden="true"
        >
          A
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20 desktop-vertical-nav-offset" data-hero-parallax>
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center max-w-7xl mx-auto">

          {/* Left Side — Content */}
          <div className="space-y-5 md:space-y-8">
            {/* Badge */}
            <div data-hero="badge">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-indigo-200/70 shadow-sm text-sm font-semibold text-gray-800">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {language === 'sr'
                  ? 'Agencija iz Beograda · 50+ projekata'
                  : 'Belgrade agency · 50+ projects'}
              </span>
            </div>

            {/* Main Heading — Brand Focused H1 (tekst nepromenjen, SEO).
                Reči nose zaseban span zbog animacije, ali razmak između njih
                mora biti pravi tekstualni čvor — CSS margina se ne čita kao
                razmak, pa bi H1 za pretraživače bio jedna spojena reč. */}
            <h1 className="text-[2.7rem] sm:text-5xl md:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.02] md:leading-[1.05] tracking-[-0.03em] md:tracking-tight">
              {h1Words.map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && ' '}
                  <span className="inline-block overflow-hidden align-bottom pb-1">
                    <span
                      data-hero="word"
                      className={`inline-block ${i >= gradientFrom ? 'lg-grad-text' : ''}`}
                    >
                      {word}
                    </span>
                  </span>
                </Fragment>
              ))}
            </h1>

            {/* Description — SEO tekst nepromenjen */}
            <div data-hero="desc">
              <p className="text-[15px] md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {language === 'sr'
                  ? 'AiSajt je agencija iz Beograda koja pravi web sajtove i vodi SEO optimizaciju za firme širom Srbije. Preko 50 realizovanih projekata, transparentne cene i tim dostupan za razgovor u roku od 24h.'
                  : 'AiSajt is an agency from Belgrade that builds websites and runs SEO optimization for businesses across Serbia. Over 50 completed projects, transparent pricing and a team available within 24h.'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <div data-hero="cta">
                <Link
                  to="/izrada-sajta-detalji"
                  onClick={() => trackCTAClick('Besplatne Konsultacije', 'hero', language)}
                  className="lg-btn-primary group w-full sm:w-auto px-8 py-4 text-white font-bold rounded-full flex items-center justify-center gap-2.5"
                >
                  {language === 'sr' ? 'Pogledaj Ponudu' : 'See Our Offer'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
              <div data-hero="cta">
                <a
                  href={`tel:${NAP.phone.tel}`}
                  onClick={() => trackPhoneClick(NAP.phone.tel, 'hero', language)}
                  className="lg-btn-call group w-full sm:w-auto px-7 py-4 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-full flex items-center justify-center gap-2.5"
                >
                  <span className="lg-phone-ring inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500">
                    <Phone className="w-4 h-4 text-white" />
                  </span>
                  {NAP.phone.local}
                </a>
              </div>
            </div>

            {/* ── Vizual za telefon ──────────────────────────────────────
                Na desktopu desnu stranu nosi mockup kompozicija (dole,
                hidden lg:block). Na telefonu je ranije nije bilo ničega, pa je
                hero bio samo tekst na beloj pozadini. Ovo je njena mobilna
                verzija: nakrivljena kartica browsera sa stvarnim klijentskim
                sajtom, plus dva lebdeća čipa. Čisto vizuelno — nijedan SEO
                tekst se ne dira. */}
            <div className="lg:hidden relative pt-2 pb-6">
              <div className="relative mx-auto w-full max-w-[330px]">
                {/* Zadnja kartica — daje dubinu snopu */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-4 rotate-[7deg] rounded-[26px] bg-gradient-to-br from-indigo-500/30 via-indigo-500/20 to-sky-500/25"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-[3.5deg] rounded-[26px] bg-white/70 ring-1 ring-gray-900/5"
                />

                {/* Glavna kartica — prozor browsera */}
                <div
                  data-hero="visual-m"
                  className="relative -rotate-[2deg] rounded-[26px] bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/90">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 h-4 flex-1 rounded-full bg-gray-200/90" />
                  </div>
                  <img
                    src="/images/prestige.webp"
                    width={1200}
                    height={800}
                    alt={language === 'sr'
                      ? 'Primer sajta koji je izradio AiSajt — Prestige Gradnja'
                      : 'Example of a website built by AiSajt — Prestige Gradnja'}
                    loading="eager"
                    decoding="async"
                    className="w-full aspect-[16/11] object-cover object-top"
                  />
                </div>

                {/* Čip sa ocenom */}
                <div
                  data-hero="float"
                  className="absolute -top-3 -right-1 rotate-[4deg] bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-3.5 py-2 rounded-full shadow-lg font-bold text-[11px] whitespace-nowrap"
                >
                  ★ {language === 'sr' ? '50+ zadovoljnih klijenata' : '50+ happy clients'}
                </div>

                {/* Čip sa telefonom — klikabilan */}
                <a
                  data-hero="float"
                  href={`tel:${NAP.phone.tel}`}
                  onClick={() => trackPhoneClick(NAP.phone.tel, 'hero_card_mobile', language)}
                  className="absolute -bottom-4 -left-1 -rotate-[3deg] bg-white/95 backdrop-blur rounded-2xl shadow-xl ring-1 ring-gray-200/80 px-3.5 py-2.5 flex items-center gap-2.5"
                >
                  <span className="lg-phone-ring inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                      {language === 'sr' ? 'Pozovite nas' : 'Call us'}
                    </span>
                    <span className="block font-bold text-gray-900 text-[13px]">{NAP.phone.local}</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Trust indicators */}
            <ul className="hidden md:flex flex-wrap gap-2 md:gap-x-6 md:gap-y-2 text-[13px] md:text-sm text-gray-600 font-medium">
              {(language === 'sr'
                ? ['Odgovor u roku od 24h', 'Sajt gotov za 7-14 dana', 'Bez skrivenih troškova']
                : ['Reply within 24h', 'Website in 7-14 days', 'No hidden costs']
              ).map((item) => (
                <li key={item} data-hero="trust" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-slate-100 shadow-sm md:px-0 md:py-0 md:rounded-none md:bg-transparent md:border-0 md:shadow-none">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Portfolio quick link — mobile visible */}
            <div data-hero="trust">
              <button
                onClick={() => navigateToDetaljiSection('case-study', navigate, location.pathname)}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                {language === 'sr' ? 'Pogledajte naše radove' : 'See our work'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side — Mockup composition (desktop) */}
          <div className="relative hidden lg:block">
            <div data-hero="visual" className="relative">
              {/* Prozor browsera sa stvarnim klijentskim sajtom — ista ideja
                  kao mobilna verzija gore, samo krupnije. Pokazuje rad umesto
                  logotipa, pa hero odmah dokazuje o čemu priča. */}
              <div className="relative w-full max-w-lg mx-auto">
                {/* Slojevi iza — daju dubinu snopu */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-4 translate-y-5 rotate-[6deg] rounded-[28px] bg-gradient-to-br from-indigo-500/25 via-sky-500/15 to-indigo-600/20"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-2 translate-y-2.5 rotate-[3deg] rounded-[28px] bg-white/70 ring-1 ring-gray-900/5"
                />

                <div className="relative -rotate-[1.5deg] rounded-[28px] bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/90">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 h-5 flex-1 rounded-full bg-gray-200/90" />
                  </div>
                  <img
                    src="/images/prestige.webp" width={1200} height={800}
                    alt="Primer web sajta koji je AiSajt napravio za klijenta Prestige Gradnja"
                    loading="eager"
                    {...{ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>}
                    decoding="async"
                    className="w-full aspect-[16/11] object-cover object-top"
                  />
                </div>
              </div>

              {/* Floating logo card */}
              <div data-hero="float" className="absolute -bottom-12 -right-8 w-44 h-44 bg-gradient-to-br from-slate-100 to-indigo-100 rounded-3xl shadow-2xl rotate-6 hover:rotate-3 transition-transform duration-700">
                <div className="absolute inset-4 bg-white rounded-2xl flex items-center justify-center">
                  <img
                    src="/images/aisajt close up.png" width={304} height={304}
                    alt="AI websajt izrada - Logo"
                    loading="lazy"
                    decoding="async"
                    className="w-[88px] h-[88px] object-contain"
                  />
                </div>
              </div>

              {/* Floating contact card — klikabilan telefon */}
              <a
                data-hero="float"
                href={`tel:${NAP.phone.tel}`}
                onClick={() => trackPhoneClick(NAP.phone.tel, 'hero_card', language)}
                className="absolute top-8 -left-14 w-60 bg-white/95 backdrop-blur rounded-2xl shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-500 p-5 ring-1 ring-gray-200/70 block"
              >
                <div className="flex items-center gap-3">
                  <span className="lg-phone-ring inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      {language === 'sr' ? 'Pozovite nas' : 'Call us'}
                    </span>
                    <span className="block font-bold text-gray-900">{NAP.phone.display}</span>
                  </span>
                </div>
              </a>

              {/* Floating rating tag */}
              <div data-hero="float" className="absolute -top-8 right-16 bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm">
                ★ {language === 'sr' ? '50+ zadovoljnih klijenata' : '50+ happy clients'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gradient transition to next section */}
      <div className="absolute -bottom-10 left-0 right-0 h-24 z-[5] bg-gradient-to-b from-transparent to-slate-50/40 pointer-events-none"></div>
    </header>
  );
}
