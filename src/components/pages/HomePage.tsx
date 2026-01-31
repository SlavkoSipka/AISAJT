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
import { PortfolioCarousel } from '../sections/PortfolioCarousel';
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
        includeBusinessSchema={true}
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
                requireGate={false}
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

            {/* Service 1 - Izrada Web Sajta (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/60 via-indigo-100/40 to-transparent rounded-[40%_60%_70%_30%_/_60%_30%_70%_40%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "I" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[60%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-[0.06]" aria-hidden="true">
                  I
                </div>
              </div>
              
              <div className="relative service-image-reveal service-image-left z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-400 to-indigo-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', width: '115%', marginLeft: '-15%' }}>
                  <img 
                    src="/images/izrada sajta cena.jpg"
                    alt="Izrada sajta cena - profesionalna izrada web sajtova u Beogradu - AI Sajt agencija"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-2 relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
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
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Prezentacioni sajtovi i online prodavnice' : 'Presentation sites and online stores'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Responzivni dizajn i brze performanse' : 'Responsive design and fast performance'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Lokalna podrška: Beograd, Novi Sad, Srbija' : 'Local support: Belgrade, Novi Sad, Serbia'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Izrada Sajta', 'services_section', language);
                    navigate('/izrada-sajta-cena');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Pogledaj Cenovnik' : 'View Pricing'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Service 2 - SEO Optimizacija (Image Right) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-100/60 via-pink-100/40 to-transparent rounded-[60%_40%_30%_70%_/_40%_70%_30%_60%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "S" */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[40%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-pink-500 to-violet-500 select-none opacity-[0.06]" aria-hidden="true">
                  S
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 order-2 md:order-1 service-text-reveal service-delay-2 relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
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
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Analiza ključnih reči i konkurencije' : 'Keyword and competition analysis'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'On-page i tehnička SEO optimizacija' : 'On-page and technical SEO optimization'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Lokalni SEO za Beograd i Srbiju' : 'Local SEO for Belgrade and Serbia'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - SEO', 'services_section', language);
                    navigate('/seo-optimizacija-cena');
                  }}
                  className="group mt-8 px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  {language === 'sr' ? 'Pogledaj Cenovnik' : 'View Pricing'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
              <div className="relative order-1 md:order-2 service-image-reveal service-image-right z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-400 to-pink-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%', width: '85%', marginLeft: 'auto', marginRight: '0' }}>
                  <img 
                    src="/images/marketing.png"
                    alt="SEO optimizacija i digitalni marketing - AI Sajt agencija Beograd"
                    className="w-full h-[340px] md:h-[380px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-600/20"></div>
                </div>
              </div>
            </div>

            {/* Service 3 - Web Dizajn (Image Left) */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center relative">
              {/* Brush Stroke Background */}
              <div className="absolute inset-0 -inset-y-10 -inset-x-8 md:-inset-x-16 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/60 via-violet-100/40 to-transparent rounded-[70%_30%_50%_50%_/_30%_60%_40%_70%] blur-3xl"></div>
              </div>
              
              {/* Giant Background Letter "W" */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-[55%] md:-translate-x-1/2 z-0 pointer-events-none overflow-hidden">
                <div className="text-[280px] sm:text-[320px] md:text-[380px] lg:text-[420px] xl:text-[480px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-violet-500 to-indigo-500 select-none opacity-[0.06]" aria-hidden="true">
                  W
                </div>
              </div>
              
              <div className="relative service-image-reveal service-image-left service-delay-1 z-10" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-pink-400 to-violet-600 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%' }}></div>
                <div className="relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700" style={{ borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%', width: '95%', marginTop: '20px' }}>
                  <img 
                    src="/images/dizajn.png"
                    alt="Moderan web dizajn i UI/UX dizajn - web dizajn agencija Beograd"
                    className="w-full h-[380px] md:h-[440px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-violet-600/20"></div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6 service-text-reveal service-delay-3 relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
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
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'UI/UX dizajn i moderna estetika' : 'UI/UX design and modern aesthetics'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Responzivni dizajn za sve uređaje' : 'Responsive design for all devices'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">
                      {language === 'sr' ? 'Branding i vizuelni identitet' : 'Branding and visual identity'}
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    trackCTAClick('Saznaj Više - Web Dizajn', 'services_section', language);
                    navigate('/web-dizajn');
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

      {/* Pillar Pages CTA Section - Brand Focused */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-violet-50/60 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-violet-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 scroll-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'sr' ? 'Izrada Sajta i SEO Optimizacija - Naše Prioritetne Usluge' : 'Website Development & SEO Optimization - Our Priority Services'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'sr' 
                  ? 'Specijalizovani smo za profesionalnu izradu web sajtova i SEO optimizaciju sa transparentnim cenovnicima. AiSajt agencija iz Beograda za najbolje rezultate.'
                  : 'We specialize in professional website development and SEO optimization with transparent pricing. AiSajt agency from Belgrade for the best results.'
                }
              </p>
            </div>

            {/* Pillar Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 scroll-fade-in">
              
              {/* Card 1: Izrada Sajta Cena */}
              <Link 
                to="/izrada-sajta-cena"
                onClick={() => trackCTAClick('Izrada Sajta Cena', 'pillar_section', language)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-violet-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                      {language === 'sr' ? 'Izrada Sajta' : 'Website Development'}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-violet-600 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {language === 'sr' 
                      ? 'Detaljni cenovnik usluga izrade web sajtova. Transparentne cene za prezentacione sajtove, online prodavnice i složene web aplikacije. Saznajte tačnu cenu za vaš projekat.'
                      : 'Detailed website development pricing list. Transparent prices for presentation sites, online stores and complex web applications. Find out the exact price for your project.'
                    }
                  </p>
                  
                  <div className="flex items-center gap-2 text-violet-600 font-semibold">
                    {language === 'sr' ? 'Izrada Sajta Cenovnik →' : 'Website Pricing →'}
                  </div>
                </div>
              </Link>

              {/* Card 2: SEO Optimizacija Cena */}
              <Link 
                to="/seo-optimizacija-cena"
                onClick={() => trackCTAClick('SEO Optimizacija Cena', 'pillar_section', language)}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {language === 'sr' 
                      ? 'Kompletni cenovnik SEO optimizacije. On-page SEO, tehnička optimizacija, link building i lokalni SEO za Beograd i Srbiju. Garantovani rezultati na Google-u.'
                      : 'Complete SEO optimization pricing. On-page SEO, technical optimization, link building and local SEO for Belgrade and Serbia. Guaranteed Google results.'
                    }
                  </p>
                  
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                    {language === 'sr' ? 'SEO Optimizacija Cenovnik →' : 'SEO Pricing →'}
                  </div>
                </div>
              </Link>

            </div>


          </div>
        </div>
      </section>

      {/* Informativna sekcija - Long-form content za SEO */}
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
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
              {/* Resource 1: Quiz */}
              <div 
                onClick={() => navigate('/resources/quiz')}
                className="group bg-white rounded-2xl p-5 md:p-8 border-2 border-gray-200 hover:border-pink-400 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 cursor-pointer scroll-fade-in"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
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
                className="group bg-white rounded-2xl p-5 md:p-8 border-2 border-gray-200 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 cursor-pointer scroll-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
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

      {/* Portfolio Section - Carousel */}
      <PortfolioCarousel language={language} />

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

