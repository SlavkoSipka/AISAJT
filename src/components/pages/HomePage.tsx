import { useEffect, useRef } from 'react';
import { Clock, MessageSquare, CheckCircle, ArrowRight, Brain, Cpu, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { PortfolioCard } from '../cards/PortfolioCard';
import { Hero } from '../sections/Hero';
import { YouTubeVideo } from '../video/YouTubeVideo';
import { FAQ } from '../sections/FAQ';
import { SEOHelmet } from '../seo/SEOHelmet';
import { rafThrottle } from '../../utils/performance';
import { Link, useNavigate } from 'react-router-dom';
import { trackCTAClick, trackScrollDepth, trackTimeOnPage } from '../../utils/analytics';

export function HomePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const parallaxRefs = useRef<Set<HTMLElement>>(new Set());
  const observedElements = useRef<Set<Element>>(new Set());


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
    const timeTracked = {
      '30': false,
      '60': false,
      '120': false,
      '180': false
    };

    const timer30 = setTimeout(() => {
      if (!timeTracked['30']) {
        timeTracked['30'] = true;
        trackTimeOnPage(30, window.location.pathname, language);
      }
    }, 30000); // 30 seconds

    const timer60 = setTimeout(() => {
      if (!timeTracked['60']) {
        timeTracked['60'] = true;
        trackTimeOnPage(60, window.location.pathname, language);
      }
    }, 60000); // 1 minute

    const timer120 = setTimeout(() => {
      if (!timeTracked['120']) {
        timeTracked['120'] = true;
        trackTimeOnPage(120, window.location.pathname, language);
      }
    }, 120000); // 2 minutes

    const timer180 = setTimeout(() => {
      if (!timeTracked['180']) {
        timeTracked['180'] = true;
        trackTimeOnPage(180, window.location.pathname, language);
      }
    }, 180000); // 3 minutes

    return () => {
      clearTimeout(timer30);
      clearTimeout(timer60);
      clearTimeout(timer120);
      clearTimeout(timer180);
    };
  }, [language]);


  // Parallax scroll efekat - optimizovan bez duplikata
  useEffect(() => {
    const handleParallax = rafThrottle(() => {
      parallaxRefs.current.forEach(element => {
        const rect = element.getBoundingClientRect();
        const scrollOffset = window.innerHeight - rect.top;
        if (scrollOffset > 0) {
          const parallaxValue = Math.min(scrollOffset * 0.15, 100);
          element.style.setProperty('--scroll-offset', `${parallaxValue}px`);
        }
      });
    });

    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleParallax);
      parallaxRefs.current.clear(); // Očisti Set pri unmount
    };
  }, []);

  // IntersectionObserver za scroll animacije - optimizovan sa "once" ponašanjem
  useEffect(() => {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return; // Ne skidaj klase kada izađe iz viewport-a
            
            const target = entry.target;
            
            // Dodaj 'visible' klasu samo jednom
            if (!observedElements.current.has(target)) {
              target.classList.add('visible');
              observedElements.current.add(target);
              
              // Grid stagger efekat
              if (target.classList.contains('grid')) {
                const children = Array.from(target.children);
                children.forEach((item, index) => {
                  item.classList.add(`stagger-delay-${index + 1}`);
                  item.classList.add('visible');
                });
              }
              
              // Unobserve nakon što postane vidljiv (performance boost)
              observerRef.current?.unobserve(target);
            }
          });
        });
      },
      options
    );

    // Selektuj sve elemente samo jednom
    const elementsToObserve = document.querySelectorAll(
      '.scroll-fade-in, .scroll-scale-in, .parallax-scroll, .stagger-grid-item, ' +
      '.fly-in-left, .fly-in-right, .portfolio-card-reveal, .video-reveal, ' +
      '.founder-reveal, .service-image-reveal, .service-text-reveal, ' +
      '.section-header-reveal, .badge-reveal'
    );
    
    elementsToObserve.forEach((element) => {
      observerRef.current?.observe(element);
      
      // Dodaj u parallax Set bez duplikata
      if (element.classList.contains('parallax-scroll')) {
        parallaxRefs.current.add(element as HTMLElement);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      observedElements.current.clear();
    };
  }, []);


  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SEO Meta Tags - dinamički po jeziku */}
      <SEOHelmet
        title={language === 'sr' 
          ? 'Izrada Web Sajta | Izrada Sajtova | Izrada Sajta Cena Beograd'
          : 'Website Development | Web Design | Website Creation Belgrade'
        }
        description={language === 'sr'
          ? 'Profesionalna izrada web sajta i izrada sajtova u Beogradu. Izrada sajta cena od 150€. Cena izrade sajta zavisi od projekta. Besplatna konsultacija i transparentna ponuda.'
          : 'Professional website development and web design in Belgrade. Website creation from €150. Transparent pricing. Free consultation.'
        }
        keywords={language === 'sr'
          ? 'izrada web sajta, izrada sajtova, izrada sajta cena, web sajt izrada, cena izrade sajta, izrada web sajta cena, izrada web sajta novi sad'
          : 'website development, web design, website creation, web development belgrade'
        }
        canonicalUrl="https://aisajt.com/"
      />

      {/* Skip to content link - accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Pređi na glavni sadržaj
      </a>
      
      {/* ✅ Navbar komponenta - jedna za ceo sajt */}
      <Navbar />

      <main id="main-content">
        <Hero language={language} />

      {/* Team Section */}
      <section className="py-16 md:py-28 relative overflow-hidden" id="team-section">
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 via-violet-50/50 to-indigo-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-100/30 to-violet-100/40"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-violet-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-indigo-300/25 to-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight section-header-reveal">
              {language === 'sr' ? 'Upoznajte Naš Tim' : 'Meet Our Team'}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {language === 'sr' 
                ? 'Pogledajte video i saznajte ko stoji iza naših projekata. Strastveni smo u onome što radimo i posvećeni vašem uspehu.'
                : 'Watch the video and discover who stands behind our projects. We are passionate about what we do and dedicated to your success.'
              }
            </p>
          </div>

          {/* Video Section */}
          <div className="max-w-5xl mx-auto video-reveal" id="video-section">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <YouTubeVideo 
                videoId="Adq2OJ_F24I"
                title="Upoznajte naš tim i način rada"
                className="rounded-lg mb-6"
                requireGate={true}
              />
              <div className="text-center space-y-5">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {language === 'sr' ? 'Upoznajte Nas i Naš Pristup' : 'Meet Us and Our Approach'}
                </h3>
                <button
                  onClick={() => {
                    trackCTAClick('Zakažite Besplatnu Konsultaciju', 'video_section', language);
                    navigate('/contact');
                  }}
                  className="group px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="py-16 md:py-24 max-w-6xl mx-auto relative overflow-visible">
            {/* Background Elements - Hidden on mobile to improve readability */}
            <div className="hidden md:block absolute -inset-20 pointer-events-none">
              {/* Animated circles */}
              <div className="absolute top-20 left-0 w-72 h-72 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-8 animate-blob blur-xl"></div>
              <div className="absolute bottom-10 right-0 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-8 animate-blob animation-delay-2000 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-5 animate-blob animation-delay-4000 blur-2xl"></div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16 relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight section-header-reveal">
                {language === 'sr' ? 'Upoznajte Osnivače' : 'Meet the Founders'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'sr' 
                  ? 'Strastveni developeri i vizionari koji transformišu ideje u digitalna iskustva'
                  : 'Passionate developers and visionaries who transform ideas into digital experiences'
                }
              </p>
            </div>

            {/* Founders Staggered Layout */}
            <div className="space-y-12 md:space-y-16 relative z-10">
              
              {/* Founder 1 - Strahinja (Left Aligned, Wider) */}
              <div className="relative group founder-reveal founder-reveal-left w-full md:w-[75%] md:ml-0">
                {/* Background Letter "S" */}
                <div className="absolute -top-12 -left-12 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="text-[200px] md:text-[280px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-10" aria-hidden="true">
                    S
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* Profile Image with Gradient Border */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img 
                        src="/images/zeka.jpg"
                        alt="Strahinja, arhitekta i osnivač AiSajt tima za izradu web sajtova"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Name & Role */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                          Strahinja
                        </h3>
                        <p className="text-violet-600 font-semibold uppercase tracking-wide text-sm">
                          {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                        </p>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-4">
                        <div className="absolute -left-2 -top-2 text-3xl text-violet-300 font-serif">"</div>
                        <p className="text-gray-700 italic px-4 leading-relaxed text-base md:text-lg">
                          {language === 'sr' 
                            ? 'Inovacija i kvalitet su srž svega što radimo. Svaki projekat je prilika da premašimo očekivanja.'
                            : 'Innovation and quality are at the core of everything we do. Every project is an opportunity to exceed expectations.'
                          }
                        </p>
                        <div className="absolute -right-2 -bottom-2 text-3xl text-violet-300 font-serif">"</div>
                      </div>

                      {/* Skills/Tags */}
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-xs font-semibold rounded-full">
                          Full Stack Dev
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 text-xs font-semibold rounded-full">
                          AI Integration
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-violet-100 text-pink-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Arhitektura' : 'Architecture'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder 2 - Bogdan (Right Aligned, Wider, Offset Down) */}
              <div className="relative group founder-reveal founder-reveal-right w-full md:w-[75%] md:ml-auto md:mt-8">
                {/* Background Letter "B" */}
                <div className="absolute -top-12 -right-12 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="text-[200px] md:text-[280px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-pink-500 to-violet-500 select-none opacity-10" aria-hidden="true">
                    B
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8">
                    {/* Profile Image with Gradient Border */}
                    <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-pink-500 to-violet-500 rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                      <img 
                        src="/images/boban.jpg"
                        alt="Bogdan, CEO i programer ETF, stručnjak za web razvoj i dizajn"
                        className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-right">
                      {/* Name & Role */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                          Bogdan
                        </h3>
                        <p className="text-indigo-600 font-semibold uppercase tracking-wide text-sm">
                          {language === 'sr' ? 'Osnivač & CEO' : 'Founder & CEO'}
                        </p>
                      </div>

                      {/* Quote */}
                      <div className="relative mb-4">
                        <div className="absolute -left-2 -top-2 text-3xl text-indigo-300 font-serif">"</div>
                        <p className="text-gray-700 italic px-4 leading-relaxed text-base md:text-lg">
                          {language === 'sr' 
                            ? 'Sa znanjem stečenim na ETF-u i strašću prema programiranju, kreiram rešenja koja pokreću moderne digitalne projekte.'
                            : 'With knowledge gained at ETF and a passion for programming, I create solutions that power modern digital projects.'
                          }
                        </p>
                        <div className="absolute -right-2 -bottom-2 text-3xl text-indigo-300 font-serif">"</div>
                      </div>

                      {/* Skills/Tags */}
                      <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 text-xs font-semibold rounded-full">
                          {language === 'sr' ? 'Programer (ETF)' : 'Programmer (ETF)'}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-indigo-100 text-pink-700 text-xs font-semibold rounded-full">
                          Full Stack Dev
                        </span>
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

        </div>
      </section>

      {/* What We Do - strukturni SEO blok sa prirodnim keyword-ima */}
      <section className="w-full py-12 md:py-16 bg-white relative z-20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center scroll-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 section-header-reveal">
              {language === 'sr' 
                ? 'Izrada Web Sajta - Profesionalne Usluge u Beogradu' 
                : 'Website Development - Professional Services in Belgrade'
              }
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {language === 'sr' 
                ? 'Tražite pouzdanu agenciju za izradu web sajta? AiSajt je tim baziran u Beogradu koji nudi kompletne usluge izrade web sajta - od dizajna do programiranja i lansiranja. Svaki web sajt koji kreiramo je prilagođen vašim potrebama, bilo da je u pitanju prezentacioni sajt, web shop ili kompleksna e-commerce platforma.'
                : 'Looking for a reliable website development agency? AiSajt is a Belgrade-based team offering complete website development services - from design to programming and launch. Every website we create is tailored to your needs, whether it\'s a presentation site, web shop or complex e-commerce platform.'
              }
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {language === 'sr' 
                ? 'Da li se pitate koliko košta kvalitetan sajt? Cena izrade sajta zavisi od obima projekta. Transparentna ponuda bez skrivenih troškova - to je ono što možete očekivati kada radite sa nama. Radimo sa klijentima širom Srbije, od Beograda do Novog Sada, ali i za inostranstvo.'
                : 'Wondering how much a quality website costs? Website creation price depends on the project scope. Transparent offer without hidden costs - that\'s what you can expect when working with us. We work with clients across Serbia, from Belgrade to Novi Sad, and internationally.'
              }
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'sr' 
                ? 'Na internetu danas nije dovoljno samo biti prisutan - važno je da vaša web stranica privlači i zadržava posetioce. Zato se naša izrada sajtova fokusira na brze, moderne i SEO optimizovane web stranice koje donose rezultate za vaš biznis.'
                : 'On the internet today, it\'s not enough to just be present - it\'s important that your website attracts and retains visitors. That\'s why our website development focuses on fast, modern and SEO optimized websites that deliver results for your business.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Services and Pricing Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-28 relative overflow-hidden">
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 via-violet-50/50 to-indigo-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-100/30 to-violet-100/40"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-violet-400/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-indigo-300/25 to-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Services Section - Split Layout */}
          <div id="services-detailed" className="pt-4 md:pt-8 pb-12 md:pb-20 max-w-7xl mx-auto relative">
            {/* Smooth gradient transition to next section */}
            <div className="absolute -bottom-32 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-indigo-50/20 to-violet-50/30 pointer-events-none z-20"></div>
            {/* Animated Background Circles - Full Coverage */}
            <div className="absolute -inset-32 overflow-visible pointer-events-none">
              {/* Top Left Corner */}
              <div className="absolute -top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-15 animate-blob"></div>
              {/* Top Right Corner */}
              <div className="absolute top-10 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-12 animate-blob animation-delay-2000"></div>
              {/* Middle Left */}
              <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
              {/* Middle Right */}
              <div className="absolute top-1/2 -right-24 w-64 h-64 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full opacity-12 animate-blob animation-delay-2000"></div>
              {/* Bottom Left */}
              <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-full opacity-15 animate-blob animation-delay-4000"></div>
              {/* Bottom Right */}
              <div className="absolute -bottom-20 -right-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-600 rounded-full opacity-10 animate-blob"></div>
              {/* Center Accents */}
              <div className="absolute top-2/3 left-1/2 w-56 h-56 bg-gradient-to-br from-violet-300 to-pink-400 rounded-full opacity-8 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-300 to-violet-400 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Section Header - SEO Optimized */}
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight section-header-reveal">
                {t.servicesHeading}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t.servicesSubheading}
              </p>
            </div>

            {/* Service 1 - Web Dizajn (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/60 via-indigo-100/40 to-transparent rounded-[40%_60%_70%_30%_/_60%_30%_70%_40%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "W" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[60%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-[0.06]" aria-hidden="true">
                  W
                </div>
              </div>
              
              <div className="relative service-image-reveal service-image-left z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-400 to-indigo-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', width: '115%', marginLeft: '-15%' }}>
                  <img 
                    src="/images/dizajn.png"
                    alt="Moderan i profesionalan web dizajn za poslovne sajtove"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-2 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Kreiramo moderne, responzivne web sajtove koji ne samo da izgledaju sjajno, već i donose rezultate. Svaki dizajn je prilagođen vašem brendu i ciljevima, sa fokusom na korisničko iskustvo i konverzije.'
                    : 'We create modern, responsive websites that not only look great but also deliver results. Every design is tailored to your brand and goals, with a focus on user experience and conversions.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Responsive dizajn za sve uređaje' : 'Responsive design for all devices'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'SEO optimizacija od prvog dana' : 'SEO optimization from day one'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Brzo učitavanje i maksimalne performanse' : 'Fast loading and maximum performance'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Service 2 - Baze Podataka (Image Right) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-100/60 via-pink-100/40 to-transparent rounded-[60%_40%_30%_70%_/_40%_70%_30%_60%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "B" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[40%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-pink-500 to-violet-500 select-none opacity-[0.06]" aria-hidden="true">
                  B
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 order-2 md:order-1 service-text-reveal service-delay-2 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Baze Podataka' : 'Databases'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Razvijamo i optimizujemo baze podataka za vaše poslovanje. Od analize postojećih sistema do kreiranja potpuno novih, skalabilnih rešenja koja rastu zajedno sa vašom kompanijom.'
                    : 'We develop and optimize databases for your business. From analyzing existing systems to creating completely new, scalable solutions that grow with your company.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Optimizacija postojećih baza podataka' : 'Optimization of existing databases'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Kreiranje novih, skalabilnih rešenja' : 'Creating new, scalable solutions'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Sigurnost i zaštita podataka' : 'Data security and protection'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Baze Podataka', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
              <div className="relative order-1 md:order-2 service-image-reveal service-image-right z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400 to-pink-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%', width: '85%', marginLeft: 'auto', marginRight: '0' }}>
                  <img 
                    src="/images/baza.jpg"
                    alt="Upravljanje bazama podataka i backend razvoj web aplikacija"
                    className="w-full h-[340px] md:h-[380px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-600/20"></div>
                </div>
              </div>
            </div>

            {/* Service 3 - Online Marketing (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/60 via-violet-100/40 to-transparent rounded-[70%_30%_50%_50%_/_30%_60%_40%_70%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "M" */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-[55%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-violet-500 to-indigo-500 select-none opacity-[0.06]" aria-hidden="true">
                  M
                </div>
              </div>
              
              <div className="relative service-image-reveal service-image-left service-delay-1 z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-pink-400 to-violet-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%', width: '95%', marginTop: '20px' }}>
                  <img 
                    src="/images/marketing.png"
                    alt="Digitalni marketing i promocija web sajtova putem društvenih mreža"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-violet-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-3 relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'SEO i Marketing' : 'SEO & Marketing'}
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {language === 'sr' 
                    ? 'Dovedite pravu publiku do vašeg brenda kroz strategije digitalnog marketinga koje donose rezultate. Google Ads, društvene mreže, SEO - sve na jednom mestu za maksimalan ROI.'
                    : 'Bring the right audience to your brand through digital marketing strategies that deliver results. Google Ads, social media, SEO - everything in one place for maximum ROI.'
                  }
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Google Ads i Facebook kampanje' : 'Google Ads and Facebook campaigns'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Social media menadžment' : 'Social media management'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Email marketing i content kreacija' : 'Email marketing and content creation'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - SEO i Marketing', 'services_section', language);
                    navigate('/contact');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Saznaj Više' : 'Learn More'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom gradient transition to Portfolio */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-violet-50/40 to-violet-50/60 pointer-events-none z-10"></div>
      </section>

      {/* Informativna sekcija - Long-form content za SEO */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto scroll-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center section-header-reveal">
              {language === 'sr' 
                ? 'Sve što treba da znate o izradi web sajta' 
                : 'Everything you need to know about website development'
              }
            </h2>
            
            <div className="prose prose-lg max-w-none">
              {language === 'sr' ? (
                <>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Kada govorimo o uslugama, često se postavlja pitanje: "Da li mi je uopšte potreban sajt?" Odgovor je jednostavan - u digitalnom dobu, web stranica je digitalni izlog vašeg biznisa. Profesionalna izrada web sajta služi kao most između vas i vaših potencijalnih klijenata na internetu. Svaki web sajt koji napravimo donosi vrednost vašem poslovanju.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Šta obuhvata profesionalna izrada web sajta?
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Kada izaberete nas za vaš projekat, dobijate kompletno rešenje. Naša izrada web sajta obuhvata planiranje, dizajn, razvoj, testiranje i lansiranje. To znači da se ne bavimo samo dizajnom. Bilo da vam je u pitanju jednostavna prezentacija, web shop za online prodaju, ili kompleksna platforma, pristup je isti: profesionalan i detaljan.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Zašto je cena izrade sajta različita za svaki projekat?
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Često nas pitaju o ceni. Razlog zbog kojeg nemamo jednu fiksnu cenu je što svaki biznis ima jedinstvene potrebe. Web shop sa 100 proizvoda zahteva više posla nego prezentacioni sajt sa 5 stranica. Zato izrada sajta cena počinje od 450€ za osnovne projekte, dok se za složenije platforme pravi prilagođena ponuda. Ono što je važno - uvek dobijate transparentnu ponudu bez skrivenih troškova.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Kako izgleda proces saradnje sa nama?
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Proces počinje besplatnom konsultacijom gde razgovaramo o vašim ciljevima. Zatim izrađujemo plan i ponudu. Nakon vaše saglasnosti, prelazimo na dizajn i razvoj. Tokom celog procesa ste u kontaktu sa našim timom i možete da pratite napredak. Na kraju dobijate potpuno funkcionalan sajt, obuku za korišćenje, i podršku nakon lansiranja.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    When we talk about website development, the question often arises: "Do I even need a website?" The answer is simple - in the digital age, a website is the digital storefront of your business. Every website we create serves as a bridge between you and your potential clients on the internet.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    What does professional website development include?
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    When you choose us for your project, you get a complete solution. This means we don't just do design - our service includes planning, design, development, testing and launch. Whether it's a simple presentation, web shop for online sales, or complex platform, the approach is the same: professional and detailed.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    Why is the website price different for each project?
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    We're often asked about pricing. The reason we don't have one fixed price is that every business has unique needs. A web shop with 100 products requires more work than a presentation site with 5 pages. That's why website creation starts from €150 for basic projects, while more complex platforms get customized quotes.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Besplatni Resursi Section - Pomereno PRE Portfolio */}
      <section className="relative py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 scroll-fade-in">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 section-header-reveal">
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

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Resource 1: Quiz */}
              <div 
                onClick={() => navigate('/resources/quiz')}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-pink-400 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 cursor-pointer scroll-fade-in"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Kviz: Koji Sajt Vam Treba?' : 'Quiz: Which Site Do You Need?'}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {language === 'sr' 
                    ? 'Odgovorite na 5 brzih pitanja i saznajte koji tip sajta najbolje odgovara vašem biznisu. Dobićete personalizovanu preporuku i ponudu.'
                    : 'Answer 5 quick questions and find out which type of site best suits your business. Get a personalized recommendation and quote.'
                  }
                </p>
                <span className="text-pink-600 font-bold text-lg inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  {language === 'sr' ? 'Započni Kviz →' : 'Start Quiz →'}
                </span>
              </div>

              {/* Resource 2: Audit Form */}
              <div 
                onClick={() => navigate('/resources/audit')}
                className="group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 cursor-pointer scroll-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Besplatna Analiza Sajta' : 'Free Website Audit'}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {language === 'sr' 
                    ? 'Već imate sajt? Saznajte šta vam košta u izgubljenim klijentima. Dobijate detaljnu analizu za 24h.'
                    : 'Already have a site? Find out what it costs you in lost clients. Get detailed analysis in 24h.'
                  }
                </p>
                <span className="text-violet-600 font-bold text-lg inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  {language === 'sr' ? 'Analiziraj Sajt →' : 'Analyze Site →'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center scroll-fade-in">
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

      {/* Portfolio Section */}
      <section className="py-20 md:py-32 relative overflow-hidden" id="portfolio">
        {/* Top gradient transition from Services */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-50/60 via-violet-50/30 to-transparent pointer-events-none z-10"></div>
        {/* Smooth layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-indigo-50/30 to-pink-50/25"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-50/15 to-indigo-50/20"></div>
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-10 animate-blob"></div>
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 -right-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-violet-500 rounded-full opacity-5 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 section-header-reveal leading-tight">
              {language === 'sr' ? (
                <>
                  Izuzetni Sajtovi
                  <br />
                  za Izuzetne Brendove
                </>
              ) : (
                <>
                  Exceptional Results
                  <br />
                  for Exceptional Brands
                </>
              )}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto section-header-reveal">
              {language === 'sr' 
                ? 'Svaki projekat je priča o uspehu. Od ideje do realizacije, stvaramo digitalna iskustva koja inspirišu i pretvaraju posetiоce u klijente.'
                : 'Every project is a success story. From concept to completion, we create digital experiences that inspire and convert visitors into customers.'
              }
            </p>
          </div>

          {/* Smooth transition to Contact section */}
          <div className="absolute -bottom-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-indigo-50/20 to-violet-50/40 pointer-events-none z-0"></div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto relative z-10">
            <div className="portfolio-card-reveal portfolio-card-delay-1">
              <PortfolioCard
                title="Kralj Residence"
                description={language === 'sr' ? "Moderan web sajt za apartmane i hotele" : "Modern website for apartments and hotels"}
                image="https://res.cloudinary.com/dij7ynio3/image/upload/v1739663014/kralj12_um1xrk.png"
                tags={language === 'sr' ? ["Web Sajt", "Responzivan"] : ["Website", "Responsive"]}
                link="https://kraljresidence.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-2">
              <PortfolioCard
                title="BN Autofolije"
                description={language === 'sr' ? "Profesionalni web sajt za auto folije i detailing" : "Professional website for car wraps and detailing"}
                image="https://res.cloudinary.com/dij7ynio3/image/upload/v1740502433/pozadina-min_gfbxfp.png"
                tags={language === 'sr' ? ["Web Sajt", "Auto Detailing", "SEO"] : ["Website", "Auto Detailing", "SEO"]}
                link="https://bnautofolije.com/"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-3">
              <PortfolioCard
                title="Prestige Gradnja"
                description={language === 'sr' ? "Moderan web sajt za nekretnine i apartmane" : "Modern website for real estate and apartments"}
                image="https://aislike.rs/aisajt/prestige-min.png"
                tags={language === 'sr' ? ["Web Sajt"] : ["Website"]}
                link="https://prestigegradnja.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-4">
              <PortfolioCard
                title="Custom RC Parts"
                description={language === 'sr' ? "Ecommerce web sajt" : "Ecommerce website"}
                image="https://aislike.rs/aisajt/rc-min.png"
                tags={["E-commerce", language === 'sr' ? "Web Shop" : "Online Store"]}
                link="https://customrc.parts"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-5">
              <PortfolioCard
                title="White Club"
                description={language === 'sr' ? "Online rezervacije" : "Online reservations"}
                image="https://aislike.rs/aisajt/white-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Rezervacije"] : ["Website", "Reservations"]}
                link="https://whiteclub.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-6">
              <PortfolioCard
                title="Pokloni Portret"
                description={language === 'sr' ? "Personalizovani portreti kao poklon" : "Personalized portraits as gifts"}
                image="https://aislike.rs/aisajt/pokloniportret-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Umetnost"] : ["Website", "Art"]}
                link="https://pokloniportret.rs"
              />
            </div>
            
            <div className="portfolio-card-reveal portfolio-card-delay-7">
              <PortfolioCard
                title="IN-STAN"
                description={language === 'sr' ? "Stolarija i nameštaj po meri" : "Custom carpentry and furniture"}
                image="https://aislike.rs/aisajt/instan-min.png"
                tags={language === 'sr' ? ["Web Sajt", "Stolarija"] : ["Website", "Carpentry"]}
                link="https://in-stan.rs"
              />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 md:mt-20 scroll-fade-in">
            <p className="text-gray-600 mb-6 text-lg">
              {language === 'sr' 
                ? 'Spremni da postanete sledeća priča uspeha?' 
                : 'Ready to become the next success story?'
              }
            </p>
            <button
              onClick={() => {
                trackCTAClick('Razgovarajmo o Vašem Projektu', 'portfolio_section', language);
                navigate('/contact');
              }}
              className="group px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              {language === 'sr' ? 'Razgovarajmo o Vašem Projektu' : "Let's Talk About Your Project"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Why AiSajt Section - NEW */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white" id="why-us">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {language === 'sr' ? (
                <>
                  Zašto Odabrati AiSajt
                  <br />
                  za Izradu Web Sajta?
                </>
              ) : (
                t.whyAiSajt
              )}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.whyAiSajtDesc}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {language === 'sr' ? 'Brza Izrada' : 'Fast Development'}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Standardni web sajt spreman za 7-14 dana. Za hitne projekte nudimo ekspresnu izradu za 24-48h.'
                  : 'Standard websites ready in 7-14 days. For urgent projects we offer express development in 24-48h.'
                }
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {language === 'sr' ? 'AI Tehnologija' : 'AI Technology'}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Koristimo AI za optimizaciju svake faze izrade - od dizajna, preko sadržaja, do SEO performansi.'
                  : 'We use AI to optimize every development phase - from design, through content, to SEO performance.'
                }
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {language === 'sr' ? 'Dokazani Rezultati' : 'Proven Results'}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Preko 50 zadovoljnih klijenata širom Srbije. Merljivi rezultati i ROI koji opravdava investiciju.'
                  : 'Over 50 satisfied clients across Serbia. Measurable results and ROI that justifies the investment.'
                }
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {language === 'sr' ? 'Tehnički Stručni' : 'Technical Experts'}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Tim sa višegodišnjim iskustvom u razvoju web aplikacija, e-commerce rešenja i kompleksnih sistema.'
                  : 'Team with years of experience in web application development, e-commerce solutions, and complex systems.'
                }
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {t.locationServed}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Bazirani u Beogradu, radimo projekte za klijente širom cele Srbije sa mogućnošću online komunikacije.'
                  : 'Based in Belgrade, we work on projects for clients across Serbia with online communication options.'
                }
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50 hover:border-violet-300 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-2">
                  {language === 'sr' ? 'Podrška & Održavanje' : 'Support & Maintenance'}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {language === 'sr' 
                  ? 'Neprestana podrška nakon lansiranja. Redovni backup-ovi, update-i i tehnička pomoć kada vam zatreba.'
                  : 'Continuous support after launch. Regular backups, updates, and technical help when you need it.'
                }
              </p>
            </div>
          </div>

          {/* Internal Links */}
          <div className="mt-12 md:mt-16 text-center">
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

        {/* FAQ Section */}
        <FAQ language={language} />
      </main>

      {/* ✅ Footer komponenta - jedna za ceo sajt */}
      <Footer />
    </div>
  );
}

