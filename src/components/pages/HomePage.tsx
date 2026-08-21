import { useEffect, useLayoutEffect } from 'react';
import { Clock, MessageSquare, CheckCircle, ArrowRight, Brain, Cpu, MapPin, Phone } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { Hero } from '../sections/Hero';
import { YouTubeVideo } from '../video/YouTubeVideo';
import { FAQ } from '../sections/FAQ';
import { PortfolioCarousel } from '../sections/PortfolioCarousel';
import { SEOHelmet } from '../seo/SEOHelmet';
import { StickyCallBar } from '../ui/StickyCallBar';
import { rafThrottle } from '../../utils/performance';
import { NAP } from '../../lib/site-config';
import { Link, useNavigate } from 'react-router-dom';
import { trackCTAClick, trackPhoneClick, trackScrollDepth, trackTimeOnPage } from '../../utils/analytics';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function HomePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  // 📊 Track Scroll Depth (25%, 50%, 75%, 90%)
  useEffect(() => {
    const scrollDepthTracked = {
      '25': false,
      '50': false,
      '75': false,
      '90': false
    };

    const handleScrollDepth = rafThrottle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 25 && !scrollDepthTracked['25']) {
        scrollDepthTracked['25'] = true;
        trackScrollDepth(25, window.location.pathname, language);
      }
      if (scrollPercent >= 50 && !scrollDepthTracked['50']) {
        scrollDepthTracked['50'] = true;
        trackScrollDepth(50, window.location.pathname, language);
      }
      if (scrollPercent >= 75 && !scrollDepthTracked['75']) {
        scrollDepthTracked['75'] = true;
        trackScrollDepth(75, window.location.pathname, language);
      }
      if (scrollPercent >= 90 && !scrollDepthTracked['90']) {
        scrollDepthTracked['90'] = true;
        trackScrollDepth(90, window.location.pathname, language);
      }
    });

    window.addEventListener('scroll', handleScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollDepth);
  }, [language]);

  // ⏱️ Track Time on Page (30s, 60s, 120s, 180s)
  useEffect(() => {
    const timers = [30, 60, 120, 180].map((seconds) =>
      setTimeout(() => {
        trackTimeOnPage(seconds, window.location.pathname, language);
      }, seconds * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [language]);

  // ✨ GSAP ScrollTrigger — sve skrol animacije (reveal, parallax, brojači)
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Pojedinačni reveal elementi
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.fromTo(el,
            { y: 48, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 86%', once: true }
            }
          );
        });

        // Grupni stagger reveal (deca elementa)
        gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
          gsap.fromTo(group.children,
            { y: 44, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.11, ease: 'power3.out',
              scrollTrigger: { trigger: group, start: 'top 86%', once: true }
            }
          );
        });

        // Clip-path reveal za velike slike
        gsap.utils.toArray<HTMLElement>('[data-clip-reveal]').forEach((el) => {
          gsap.fromTo(el,
            { clipPath: 'inset(10% 8% 10% 8% round 2rem)', scale: 1.06, opacity: 0.6 },
            {
              clipPath: 'inset(0% 0% 0% 0% round 2rem)', scale: 1, opacity: 1,
              duration: 1.15, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 82%', once: true }
            }
          );
        });

        // Parallax na slikama unutar clip kontejnera (scrub uz skrol)
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(el,
            { yPercent: -7 },
            {
              yPercent: 7, ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true
              }
            }
          );
        });

        // Brojači u tamnoj traci
        gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
          const target = parseInt(el.dataset.counter || '0', 10);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target, duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate() { el.textContent = String(Math.round(obj.v)); }
          });
        });

        // Tamna traka — blagi ulazak pozadinskih orbova
        gsap.utils.toArray<HTMLElement>('[data-dark-orb]').forEach((el, i) => {
          gsap.fromTo(el,
            { scale: 0.6, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 1.6, delay: i * 0.15, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 95%', once: true }
            }
          );
        });

        // Scroll progress bar na vrhu stranice
        gsap.to('[data-scroll-progress]', {
          scaleX: 1, ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.4 }
        });

        // Hero sadržaj blago odlazi na gore dok se skroluje dalje
        const heroEl = document.querySelector<HTMLElement>('[data-hero-parallax]');
        if (heroEl) {
          gsap.to(heroEl, {
            yPercent: -12, opacity: 0.35, ease: 'none',
            scrollTrigger: {
              trigger: heroEl.closest('header') || heroEl,
              start: 'top top', end: 'bottom top', scrub: true
            }
          });
        }

        // Marquee traka blago klizi uz skrol (povrh CSS petlje)
        gsap.fromTo('[data-marquee-drift]',
          { x: 60 },
          {
            x: -60, ease: 'none',
            scrollTrigger: {
              trigger: '[data-marquee-drift]',
              start: 'top bottom', end: 'bottom top', scrub: true
            }
          }
        );

        // Čipovi na slikama iskaču elastično
        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0, rotation: -8, opacity: 0 },
            {
              scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(2.2)',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            }
          );
        });

        // Veliki CTA naslov u tamnoj traci — zoom uz skrol
        gsap.utils.toArray<HTMLElement>('[data-cta-zoom]').forEach((el) => {
          gsap.fromTo(el,
            { scale: 0.85 },
            {
              scale: 1, ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 95%', end: 'center 55%', scrub: true }
            }
          );
        });
      });

      return () => mm.revert();
    });

    // Osveži pozicije nakon učitavanja slika (lazy slike menjaju visinu)
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pb-[72px] md:pb-0">
      {/* SEO Meta Tags - Optimized for Pillar Pages Authority */}
      <SEOHelmet
        title={language === 'sr'
          ? 'AI Sajt - Agencija za Izradu Sajta | SEO Optimizacija | Beograd'
          : 'AI Sajt - Website Development Agency | SEO Optimization | Belgrade'
        }
        description={language === 'sr'
          ? 'AI Sajt - agencija iz Beograda. Profesionalna izrada sajtova i SEO optimizacija. Radimo širom Srbije - Beograd, Novi Sad.'
          : 'AI Sajt - agency from Belgrade. Professional website development and SEO optimization. We work across Serbia - Belgrade, Novi Sad.'
        }
        keywords={language === 'sr'
          ? 'agencija za izradu sajta, seo optimizacija, izrada sajta cena, seo optimizacija cena, web agencija beograd, aisajt'
          : 'website development agency, seo optimization, website development belgrade, digital agency'
        }
        canonicalUrl="https://aisajt.com/"
      />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] pointer-events-none" aria-hidden="true">
        <div
          data-scroll-progress
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500"
        ></div>
      </div>

      {/* Skip to content link - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Pređi na glavni sadržaj
      </a>

      <Navbar />

      <main id="main-content">
        <Hero language={language} />

        {/* Marquee band — dekorativna traka */}
        <div className="relative py-6 md:py-8 bg-white border-y border-violet-100/70 overflow-hidden" aria-hidden="true">
          <div className="lg-marquee" data-marquee-drift>
            {[0, 1].map((track) => (
              <div key={track} className="lg-marquee-track">
                {[
                  language === 'sr' ? 'Izrada Sajtova' : 'Web Development',
                  language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization',
                  language === 'sr' ? 'Web Dizajn' : 'Web Design',
                  language === 'sr' ? 'Online Prodavnice' : 'Online Stores',
                  language === 'sr' ? 'Održavanje' : 'Maintenance',
                ].map((item, i) => (
                  <span key={i} className="flex items-center flex-shrink-0">
                    <span className="text-2xl md:text-4xl font-black uppercase tracking-tight px-4 md:px-6 lg-outline-text whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-xl md:text-3xl text-violet-500/70">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Services Section — prva stvar koju posetilac vidi posle heroa ═══ */}
        <section className="py-12 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-white to-pink-50/30"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 -left-32 w-96 h-96 bg-gradient-to-br from-violet-300/25 to-indigo-400/15 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 -right-32 w-96 h-96 bg-gradient-to-br from-pink-300/25 to-violet-400/15 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div id="services-detailed" className="max-w-7xl mx-auto">

              {/* Section Header - SEO Optimized */}
              <div className="text-center mb-14 md:mb-20" data-reveal>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
                  {t.servicesHeading}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t.servicesSubheading}
                </p>
              </div>

              {/* Service 1 - Izrada Web Sajta */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 md:mb-28">
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-br from-violet-400/20 to-indigo-500/10 rounded-[2.5rem] blur-2xl pointer-events-none"></div>
                  <div className="relative overflow-hidden rounded-[2rem] shadow-2xl" data-clip-reveal>
                    <img
                      src="/images/izrada sajta cena.webp" width={1200} height={900}
                      alt="Izrada sajta cena - profesionalna izrada web sajtova u Beogradu - AI Sajt agencija"
                      className="w-full h-[300px] md:h-[440px] object-cover scale-110" loading="lazy" data-parallax />
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-950/40 via-transparent to-transparent"></div>
                    <span data-chip className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-bold text-gray-900 shadow-lg">
                      {language === 'sr' ? '⚡ Gotov za 7–14 dana' : '⚡ Ready in 7–14 days'}
                    </span>
                  </div>
                </div>
                <div className="space-y-5 md:space-y-6" data-reveal-group>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                    {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {language === 'sr' ? (
                      <>
                        AiSajt agencija iz Beograda specijalizovana je za profesionalnu izradu web sajtova. Od prezentacionih stranica do kompleksnih online prodavnica - pravimo moderne, brze i responzivne web platforme za klijente širom Srbije. Pogledajte našu stranicu{' '}
                        <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          izrada sajta cena
                        </Link>
                        {' '}za transparentne cenovnike.
                      </>
                    ) : (
                      <>
                        AiSajt agency from Belgrade specializes in professional website development. From presentation pages to complex online stores - we create modern, fast and responsive platforms for clients across Serbia. Check our{' '}
                        <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                          website pricing
                        </Link>
                        {' '}page for transparent rates.
                      </>
                    )}
                  </p>
                  <ul className="space-y-3">
                    {(language === 'sr'
                      ? ['Prezentacioni sajtovi i online prodavnice', 'Responzivni dizajn i brze performanse', 'Lokalna podrška: Beograd, Novi Sad, Srbija']
                      : ['Presentation sites and online stores', 'Responsive design and fast performance', 'Local support: Belgrade, Novi Sad, Serbia']
                    ).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-base md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Saznaj Više - Izrada Sajta', 'services_section', language);
                      navigate('/izrada-sajta-cena');
                    }}
                    className="group mt-4 px-7 py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                  >
                    {language === 'sr' ? 'Pogledaj Cenovnik' : 'View Pricing'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Service 2 - SEO Optimizacija */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 md:mb-28">
                <div className="space-y-5 md:space-y-6 order-2 md:order-1" data-reveal-group>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                    {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {language === 'sr' ? (
                      <>
                        AiSajt agencija pruža kompletne SEO optimizacione usluge za vrhunsko rangiranje na Google-u. Specijalizovani smo za lokalni SEO (Beograd, Novi Sad, Srbija), tehničku optimizaciju i content strategiju. Detaljne informacije na stranici{' '}
                        <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
                          SEO optimizacija cena
                        </Link>
                        {' '}sa transparentnim paketime.
                      </>
                    ) : (
                      <>
                        AiSajt agency provides complete SEO optimization services for top Google ranking. We specialize in local SEO (Belgrade, Novi Sad, Serbia), technical optimization and content strategy. Detailed information on{' '}
                        <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
                          SEO optimization pricing
                        </Link>
                        {' '}page with transparent packages.
                      </>
                    )}
                  </p>
                  <ul className="space-y-3">
                    {(language === 'sr'
                      ? ['Analiza ključnih reči i konkurencije', 'On-page i tehnička SEO optimizacija', 'Lokalni SEO za Beograd i Srbiju']
                      : ['Keyword and competition analysis', 'On-page and technical SEO optimization', 'Local SEO for Belgrade and Serbia']
                    ).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-base md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Saznaj Više - SEO', 'services_section', language);
                      navigate('/seo-optimizacija-cena');
                    }}
                    className="group mt-4 px-7 py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                  >
                    {language === 'sr' ? 'Pogledaj Cenovnik' : 'View Pricing'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
                <div className="relative order-1 md:order-2">
                  <div className="absolute -inset-6 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-[2.5rem] blur-2xl pointer-events-none"></div>
                  <div className="relative overflow-hidden rounded-[2rem] shadow-2xl" data-clip-reveal>
                    <img
                      src="/images/marketing.webp" width={984} height={634}
                      alt="SEO optimizacija i digitalni marketing - AI Sajt agencija Beograd"
                      className="w-full h-[300px] md:h-[420px] object-cover scale-110" loading="lazy" data-parallax />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 via-transparent to-transparent"></div>
                    <span data-chip className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-bold text-gray-900 shadow-lg">
                      {language === 'sr' ? '📈 Rast na Google-u' : '📈 Google growth'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service 3 - Web Dizajn */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-br from-pink-400/20 to-violet-500/10 rounded-[2.5rem] blur-2xl pointer-events-none"></div>
                  <div className="relative overflow-hidden rounded-[2rem] shadow-2xl" data-clip-reveal>
                    <img
                      src="/images/dizajn.webp" width={1400} height={788}
                      alt="Moderan web dizajn i UI/UX dizajn - web dizajn agencija Beograd"
                      className="w-full h-[300px] md:h-[440px] object-cover scale-110" loading="lazy" data-parallax />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-950/40 via-transparent to-transparent"></div>
                    <span data-chip className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-bold text-gray-900 shadow-lg">
                      {language === 'sr' ? '🎨 Dizajn koji prodaje' : '🎨 Design that sells'}
                    </span>
                  </div>
                </div>
                <div className="space-y-5 md:space-y-6" data-reveal-group>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                    {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {language === 'sr' ? (
                      <>
                        Kao web dizajn agencija iz Srbije, kreiramo moderne, estetske i funkcionalne dizajne koji privlače i konvertuju posetioce. Od UX/UI dizajna do kompletnog vizuelnog identiteta vašeg brenda. Detaljnije o{' '}
                        <Link to="/web-dizajn" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          web dizajn uslugama
                        </Link>
                        .
                      </>
                    ) : (
                      <>
                        As a web design agency from Serbia, we create modern, aesthetic and functional designs that attract and convert visitors. Learn more about{' '}
                        <Link to="/web-dizajn" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          web design services
                        </Link>
                        .
                      </>
                    )}
                  </p>
                  <ul className="space-y-3">
                    {(language === 'sr'
                      ? ['UI/UX dizajn i moderna estetika', 'Responzivni dizajn za sve uređaje', 'Branding i vizuelni identitet']
                      : ['UI/UX design and modern aesthetics', 'Responsive design for all devices', 'Branding and visual identity']
                    ).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-base md:text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
                      navigate('/web-dizajn');
                    }}
                    className="group mt-4 px-7 py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                  >
                    {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══ Portfolio — primeri radova odmah posle usluga ═══ */}
        <PortfolioCarousel language={language} />

        {/* ═══ Tamna traka — brojke + glavni poziv na akciju ═══ */}
        <section className="relative py-16 md:py-28 overflow-hidden bg-[#0d0a1a] text-white">
          <div className="absolute inset-0 lg-dot-grid-dark opacity-60"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div data-dark-orb className="absolute -top-32 -left-24 w-[30rem] h-[30rem] bg-gradient-to-br from-violet-600/30 to-indigo-600/20 rounded-full blur-3xl"></div>
            <div data-dark-orb className="absolute -bottom-40 -right-24 w-[34rem] h-[34rem] bg-gradient-to-br from-pink-600/25 to-violet-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mb-16 md:mb-20 text-center" data-reveal-group>
                <div>
                  <div className="text-4xl md:text-6xl font-black lg-grad-text mb-2">
                    <span data-counter="50">50</span>+
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">
                    {language === 'sr' ? 'Završenih projekata' : 'Completed projects'}
                  </p>
                </div>
                <div>
                  <div className="text-4xl md:text-6xl font-black lg-grad-text mb-2">
                    <span data-counter="7">7</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">
                    {language === 'sr' ? 'Dana do gotovog sajta' : 'Days to a finished site'}
                  </p>
                </div>
                <div>
                  <div className="text-4xl md:text-6xl font-black lg-grad-text mb-2">
                    <span data-counter="24">24</span>h
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">
                    {language === 'sr' ? 'Odgovor na svaki upit' : 'Reply to every inquiry'}
                  </p>
                </div>
                <div>
                  <div className="text-4xl md:text-6xl font-black lg-grad-text mb-2">
                    <span data-counter="100">100</span>%
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">
                    {language === 'sr' ? 'Posvećenost projektu' : 'Project dedication'}
                  </p>
                </div>
              </div>

              {/* Big CTA */}
              <div className="text-center" data-reveal>
                <p data-cta-zoom className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5">
                  {language === 'sr' ? (
                    <>Vaš sajt treba da <span className="lg-grad-text">dovodi klijente</span>.</>
                  ) : (
                    <>Your website should <span className="lg-grad-text">bring you clients</span>.</>
                  )}
                </p>
                <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-9">
                  {language === 'sr'
                    ? 'Javite nam se — besplatna procena i konkretan predlog u roku od 24 sata.'
                    : 'Get in touch — free assessment and a concrete proposal within 24 hours.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href={`tel:${NAP.phone.tel}`}
                    onClick={() => trackPhoneClick(NAP.phone.tel, 'dark_cta_band', language)}
                    className="lg-btn-call group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full flex items-center justify-center gap-3"
                  >
                    <span className="lg-phone-ring inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
                      <Phone className="w-4 h-4 text-white" />
                    </span>
                    {NAP.phone.display}
                  </a>
                  <Link
                    to="/funnel"
                    onClick={() => trackCTAClick('Besplatne Konsultacije', 'dark_cta_band', language)}
                    className="lg-btn-primary group w-full sm:w-auto px-8 py-4 text-white font-bold rounded-full flex items-center justify-center gap-2.5"
                  >
                    {language === 'sr' ? 'Zakaži besplatne konsultacije' : 'Book a free consultation'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══ Pillar Pages CTA Section - Brand Focused ═══ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-violet-50/40 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12" data-reveal>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                  {language === 'sr' ? 'Izrada Sajta i SEO Optimizacija - Naše Prioritetne Usluge' : 'Website Development & SEO Optimization - Our Priority Services'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Specijalizovani smo za profesionalnu izradu web sajtova i SEO optimizaciju sa transparentnim cenovnicima. AiSajt agencija iz Beograda za najbolje rezultate.'
                    : 'We specialize in professional website development and SEO optimization with transparent pricing. AiSajt agency from Belgrade for the best results.'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8" data-reveal-group>
                {/* Card 1: Izrada Sajta Detalji */}
                <Link
                  to="/izrada-sajta-detalji"
                  onClick={() => trackCTAClick('Izrada Sajta Detalji', 'pillar_section', language)}
                  className="lg-card group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-violet-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                        {language === 'sr' ? 'Izrada Sajta Beograd' : 'Website Development Belgrade'}
                      </h3>
                      <ArrowRight className="w-6 h-6 text-violet-600 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {language === 'sr'
                        ? 'Pogledaj šta ti donosi dobar sajt — više klijenata, jača online prisutnost i dokazani sistem privlačenja posla. Video i detalji od AiSajt tima. Preko 50+ uspešnih projekata.'
                        : 'See what a good website brings you — more clients, stronger online presence and a proven system for attracting business. Video and details from AiSajt team. Over 50+ successful projects.'
                      }
                    </p>
                    <div className="flex items-center gap-2 text-violet-600 font-semibold">
                      {language === 'sr' ? 'Saznaj Šta Ti Donosi Dobar Sajt →' : 'See What a Good Website Brings You →'}
                    </div>
                  </div>
                </Link>

                {/* Card 2: SEO Optimizacija Detalji */}
                <Link
                  to="/seo-optimizacija-detalji"
                  onClick={() => trackCTAClick('SEO Optimizacija Detalji', 'pillar_section', language)}
                  className="lg-card group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                        {language === 'sr' ? 'SEO Održavanje Beograd' : 'SEO Maintenance Belgrade'}
                      </h3>
                      <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {language === 'sr'
                        ? 'Pogledaj šta ti donosi redovno SEO održavanje — više posetilaca, bolje pozicije na Google-u i kontinuirani rast organskog saobraćaja. Video i detalji od AiSajt tima.'
                        : 'See what regular SEO maintenance brings you — more visitors, better Google rankings and continuous growth of organic traffic. Video and details from AiSajt team.'
                      }
                    </p>
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                      {language === 'sr' ? 'Saznaj Šta Ti Donosi SEO Održavanje →' : 'See What SEO Maintenance Brings You →'}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Team Section — video + osnivači (kondenzovano) ═══ */}
        <section className="py-12 md:py-24 relative overflow-hidden" id="team-section">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-pink-50/30 to-white"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-violet-400/15 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-300/20 to-indigo-400/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12" data-reveal>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
                {language === 'sr' ? 'Upoznajte Naš Tim' : 'Meet Our Team'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {language === 'sr'
                  ? 'Pogledajte video i saznajte ko stoji iza naših projekata. Strastveni smo u onome što radimo i posvećeni vašem uspehu.'
                  : 'Watch the video and discover who stands behind our projects. We are passionate about what we do and dedicated to your success.'
                }
              </p>
            </div>

            {/* Video */}
            <div className="max-w-4xl mx-auto mb-16 md:mb-24" id="video-section" data-reveal>
              <div className="bg-white/85 backdrop-blur-sm p-4 md:p-6 rounded-3xl border border-gray-200/60 lg-card">
                <YouTubeVideo
                  videoId="Adq2OJ_F24I"
                  title="Upoznajte naš tim i način rada"
                  className="rounded-2xl mb-6"
                  requireGate={false}
                />
                <div className="text-center space-y-4 pb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {language === 'sr' ? 'Upoznajte Nas i Naš Pristup' : 'Meet Us and Our Approach'}
                  </h3>
                  <button
                    onClick={() => {
                      trackCTAClick('Zakažite Besplatnu Konsultaciju', 'video_section', language);
                      navigate('/funnel');
                    }}
                    className="lg-btn-primary group px-8 py-3.5 text-white font-bold rounded-full inline-flex items-center gap-2"
                  >
                    {language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Founders */}
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10 md:mb-14" data-reveal>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                  {language === 'sr' ? 'Upoznajte Osnivače' : 'Meet the Founders'}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Strastveni developeri i vizionari koji transformišu ideje u digitalna iskustva'
                    : 'Passionate developers and visionaries who transform ideas into digital experiences'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8" data-reveal-group>
                {/* Founder 1 - Strahinja */}
                <div className="lg-card group bg-white/85 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-gray-200/60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-pink-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-5">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img
                        src="/images/zeka.webp" width={400} height={400}
                        alt="Strahinja, arhitekta i osnivač AiSajt tima za izradu web sajtova"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">Strahinja</h3>
                      <p className="text-violet-600 font-semibold uppercase tracking-wide text-xs mb-4">
                        {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                      </p>
                      <p className="text-gray-600 italic leading-relaxed text-sm md:text-base mb-5">
                        {language === 'sr'
                          ? '„Inovacija i kvalitet su srž svega što radimo. Svaki projekat je prilika da premašimo očekivanja."'
                          : '"Innovation and quality are at the core of everything we do. Every project is an opportunity to exceed expectations."'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-semibold rounded-full">Full Stack Dev</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 text-xs font-semibold rounded-full">AI Integration</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Arhitektura' : 'Architecture'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Founder 2 - Bogdan */}
                <div className="lg-card group bg-white/85 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-gray-200/60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-violet-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-5">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-500 to-violet-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img
                        src="/images/boban.webp" width={400} height={400}
                        alt="Bogdan, CEO i programer ETF, stručnjak za web razvoj i dizajn"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">Bogdan</h3>
                      <p className="text-indigo-600 font-semibold uppercase tracking-wide text-xs mb-4">
                        {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                      </p>
                      <p className="text-gray-600 italic leading-relaxed text-sm md:text-base mb-5">
                        {language === 'sr'
                          ? '„Sa znanjem stečenim na ETF-u i strašću prema programiranju, kreiram rešenja koja pokreću moderne digitalne projekte."'
                          : '"With knowledge gained at ETF and a passion for programming, I create solutions that power modern digital projects."'
                        }
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Programer (ETF)' : 'Programmer (ETF)'}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-indigo-100 text-pink-700 text-xs font-semibold rounded-full">Full Stack Dev</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Softversko Inženjerstvo' : 'Software Engineering'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Besplatni Resursi Section ═══ */}
        <section className="relative py-14 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12" data-reveal>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                  {language === 'sr'
                    ? 'Alati Koji Će Vam Pomoći'
                    : 'Tools That Will Help You'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Besplatni vodiči, kalkulatori, i resursi za donošenje pametnih odluka o vašem web sajtu'
                    : 'Free guides, calculators, and resources for making smart decisions about your website'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12" data-reveal-group>
                {/* Resource 1: Quiz */}
                <div
                  onClick={() => navigate('/resources/quiz')}
                  className="lg-card group bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-pink-400 cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                    {language === 'sr' ? 'Kviz: Koji Sajt Vam Treba?' : 'Quiz: Which Site Do You Need?'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                    {language === 'sr'
                      ? 'Odgovorite na 5 brzih pitanja i saznajte koji tip sajta najbolje odgovara vašem biznisu. Dobićete personalizovanu preporuku i ponudu.'
                      : 'Answer 5 quick questions and find out which type of site best suits your business. Get a personalized recommendation and quote.'
                    }
                  </p>
                  <span className="text-pink-600 font-bold text-base md:text-lg inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    {language === 'sr' ? 'Započni Kviz →' : 'Start Quiz →'}
                  </span>
                </div>

                {/* Resource 2: Audit Form */}
                <div
                  onClick={() => navigate('/resources/audit')}
                  className="lg-card group bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-violet-400 cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                    {language === 'sr' ? 'Besplatna Analiza Sajta' : 'Free Website Audit'}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                    {language === 'sr'
                      ? 'Već imate sajt? Saznajte šta vam košta u izgubljenim klijentima. Dobijate detaljnu analizu za 24h.'
                      : 'Already have a site? Find out what it costs you in lost clients. Get detailed analysis in 24h.'
                    }
                  </p>
                  <span className="text-violet-600 font-bold text-base md:text-lg inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    {language === 'sr' ? 'Analiziraj Sajt →' : 'Analyze Site →'}
                  </span>
                </div>
              </div>

              <div className="text-center" data-reveal>
                <button
                  onClick={() => navigate('/resources')}
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:shadow-2xl"
                >
                  {language === 'sr' ? 'Pogledaj Sve Resurse' : 'View All Resources'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Why AiSajt Section ═══ */}
        <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-violet-50/30 to-white" id="why-us">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" data-reveal>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                {language === 'sr' ? (
                  <>
                    Zašto Odabrati AiSajt
                    <br />
                    za Saradnju?
                  </>
                ) : (
                  'Why Choose AiSajt for Partnership?'
                )}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.whyAiSajtDesc}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto" data-reveal-group>
              {[
                {
                  icon: Clock,
                  title: language === 'sr' ? 'Brza Izrada' : 'Fast Development',
                  text: language === 'sr'
                    ? 'Standardni web sajt spreman za 7-14 dana. Za hitne projekte nudimo ekspresnu izradu za 24-48h.'
                    : 'Standard websites ready in 7-14 days. For urgent projects we offer express development in 24-48h.'
                },
                {
                  icon: Brain,
                  title: language === 'sr' ? 'AI Tehnologija' : 'AI Technology',
                  text: language === 'sr'
                    ? 'Koristimo AI za optimizaciju svake faze izrade - od dizajna, preko sadržaja, do SEO performansi.'
                    : 'We use AI to optimize every development phase - from design, through content, to SEO performance.'
                },
                {
                  icon: CheckCircle,
                  title: language === 'sr' ? 'Dokazani Rezultati' : 'Proven Results',
                  text: language === 'sr'
                    ? 'Preko 50 zadovoljnih klijenata širom Srbije. Merljivi rezultati i ROI koji opravdava investiciju.'
                    : 'Over 50 satisfied clients across Serbia. Measurable results and ROI that justifies the investment.'
                },
                {
                  icon: Cpu,
                  title: language === 'sr' ? 'Tehnički Stručni' : 'Technical Experts',
                  text: language === 'sr'
                    ? 'Tim sa višegodišnjim iskustvom u razvoju web aplikacija, e-commerce rešenja i kompleksnih sistema.'
                    : 'Team with years of experience in web application development, e-commerce solutions, and complex systems.'
                },
                {
                  icon: MapPin,
                  title: t.locationServed,
                  text: language === 'sr'
                    ? 'Bazirani u Beogradu, radimo projekte za klijente širom cele Srbije sa mogućnošću online komunikacije.'
                    : 'Based in Belgrade, we work on projects for clients across Serbia with online communication options.'
                },
                {
                  icon: MessageSquare,
                  title: language === 'sr' ? 'Podrška & Održavanje' : 'Support & Maintenance',
                  text: language === 'sr'
                    ? 'Neprestana podrška nakon lansiranja. Redovni backup-ovi, update-i i tehnička pomoć kada vam zatreba.'
                    : 'Continuous support after launch. Regular backups, updates, and technical help when you need it.'
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="lg-card bg-white rounded-2xl p-6 md:p-7 border border-gray-200 hover:border-violet-300">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-violet-700" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 pt-1.5">
                      {title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Internal Links */}
            <div className="mt-12 md:mt-16 text-center" data-reveal>
              <p className="text-gray-600 mb-6">
                {language === 'sr'
                  ? 'Želite da saznate više o procesu i cenama?'
                  : 'Want to learn more about the process and pricing?'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/resources"
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'Besplatni Resursi' : 'Free Resources'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/resources/audit"
                  className="px-6 py-3 bg-gray-900 text-white border-2 border-gray-900 font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'Besplatni Audit Sajta' : 'Free Site Audit'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Završni CTA — gradijent kartica pred FAQ ═══ */}
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div
              data-reveal
              className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-pink-600 text-white p-8 md:p-14 shadow-2xl"
            >
              <div className="absolute inset-0 lg-dot-grid-dark opacity-50 pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
                <div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
                    {language === 'sr'
                      ? 'Spremni da vaš biznis dobije sajt koji prodaje?'
                      : 'Ready for a website that actually sells?'}
                  </p>
                  <p className="text-white/85 text-base md:text-lg">
                    {language === 'sr'
                      ? 'Besplatne konsultacije, bez obaveza. Konkretan predlog i procena u roku od 24h.'
                      : 'Free consultation, no strings attached. Concrete proposal and estimate within 24h.'}
                  </p>
                </div>
                <div className="flex flex-col gap-3.5">
                  <Link
                    to="/funnel"
                    onClick={() => trackCTAClick('Besplatne Konsultacije', 'closing_cta', language)}
                    className="lg-btn-call group w-full px-7 py-4 bg-white text-gray-900 font-bold rounded-full flex items-center justify-center gap-2.5"
                  >
                    {language === 'sr' ? 'Zakaži konsultacije' : 'Book a consultation'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                  <a
                    href={`tel:${NAP.phone.tel}`}
                    onClick={() => trackPhoneClick(NAP.phone.tel, 'closing_cta', language)}
                    className="group w-full px-7 py-4 border-2 border-white/70 text-white font-bold rounded-full flex items-center justify-center gap-3 hover:bg-white/10 transition-colors duration-300"
                  >
                    <span className="lg-phone-ring inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500">
                      <Phone className="w-4 h-4 text-white" />
                    </span>
                    {NAP.phone.display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ language={language} />
      </main>

      <Footer />

      {/* Lead-gen sticky CTA (mobile bar + desktop pill) */}
      <StickyCallBar language={language} />
    </div>
  );
}
