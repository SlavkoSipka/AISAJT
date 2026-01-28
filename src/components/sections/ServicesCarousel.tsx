import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Zap, TrendingUp, Globe, BarChart3, LineChart, CheckCircle } from 'lucide-react';
import { Language } from '../../types/language';

interface ServicesCarouselProps {
  language: Language;
}

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

export function ServicesCarousel({ language }: ServicesCarouselProps) {
  const serviceItems: ServiceItem[] = [
    {
      icon: Search,
      title: language === 'sr' ? 'Keyword Research' : 'Keyword Research',
      description: language === 'sr' 
        ? 'Pronalazimo najbolje ključne reči za vašu industriju - one koje donose kvalitetan saobraćaj i konverzije.'
        : 'We find the best keywords for your industry - ones that bring quality traffic and conversions.',
      features: [
        language === 'sr' ? 'Analiza konkurencije' : 'Competition analysis',
        language === 'sr' ? 'Long-tail keywords' : 'Long-tail keywords',
      ],
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-indigo-600',
      iconColor: 'text-violet-600',
    },
    {
      icon: Zap,
      title: language === 'sr' ? 'On-Page SEO' : 'On-Page SEO',
      description: language === 'sr' 
        ? 'Optimizujemo svaki element vašeg sajta - od meta tagova do strukture sadržaja.'
        : 'We optimize every element of your site - from meta tags to content structure.',
      features: [
        language === 'sr' ? 'Meta tagovi (title, description)' : 'Meta tags (title, description)',
        language === 'sr' ? 'Heading struktura (H1-H6)' : 'Heading structure (H1-H6)',
        language === 'sr' ? 'URL optimizacija' : 'URL optimization',
      ],
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-violet-600',
      iconColor: 'text-indigo-600',
    },
    {
      icon: TrendingUp,
      title: language === 'sr' ? 'Tehnički SEO' : 'Technical SEO',
      description: language === 'sr' 
        ? 'Rešavamo tehničke probleme koji sprečavaju Google da pravilno indeksira vaš sajt.'
        : 'We solve technical issues that prevent Google from properly indexing your site.',
      features: [
        language === 'sr' ? 'Site speed optimizacija' : 'Site speed optimization',
        language === 'sr' ? 'Mobile-first indexing' : 'Mobile-first indexing',
        language === 'sr' ? 'Structured data' : 'Structured data',
      ],
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-violet-600',
      iconColor: 'text-pink-600',
    },
    {
      icon: Globe,
      title: language === 'sr' ? 'Off-Page SEO' : 'Off-Page SEO',
      description: language === 'sr' 
        ? 'Gradimo autoritet vašeg sajta kroz kvalitetne backlink-ove i PR.'
        : 'We build your site authority through quality backlinks and PR.',
      features: [
        language === 'sr' ? 'Link building strategija' : 'Link building strategy',
        language === 'sr' ? 'Guest posting' : 'Guest posting',
      ],
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-pink-600',
      iconColor: 'text-violet-600',
    },
    {
      icon: BarChart3,
      title: language === 'sr' ? 'SEO Analitika' : 'SEO Analytics',
      description: language === 'sr' 
        ? 'Pratimo rezultate i prilagođavamo strategiju za maksimalan ROI.'
        : 'We track results and adjust strategy for maximum ROI.',
      features: [
        language === 'sr' ? 'Google Analytics setup' : 'Google Analytics setup',
        language === 'sr' ? 'Mesečni izveštaji' : 'Monthly reports',
      ],
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-pink-600',
      iconColor: 'text-indigo-600',
    },
    {
      icon: LineChart,
      title: language === 'sr' ? 'Lokalni SEO' : 'Local SEO',
      description: language === 'sr' 
        ? 'Optimizacija za lokalne pretrage i Google Maps da vas pronađu ljudi u vašem gradu.'
        : 'Optimization for local searches and Google Maps so people in your city can find you.',
      features: [
        language === 'sr' ? 'Google My Business' : 'Google My Business',
        language === 'sr' ? 'Lokalni direktorijumi' : 'Local directories',
      ],
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-indigo-600',
      iconColor: 'text-pink-600',
    },
  ];

  const extendedItems = [...serviceItems, ...serviceItems, ...serviceItems];
  const [currentIndex, setCurrentIndex] = useState(serviceItems.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(384);
  const [cardGap, setCardGap] = useState(32);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCardWidth(300);
        setCardGap(12);
      } else {
        setCardWidth(384);
        setCardGap(32);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, 40000); // 40 seconds
    return () => clearInterval(interval);
  }, [isTransitioning, language]);

  useEffect(() => {
    if (isTransitioning) {
      const transitionEnd = () => {
        setIsTransitioning(false);

        if (currentIndex >= serviceItems.length * 2) {
          setCurrentIndex(serviceItems.length);
          if (containerRef.current) {
            containerRef.current.style.transitionDuration = '0ms';
            containerRef.current.style.transform = `translateX(calc(50% - ${serviceItems.length * (cardWidth + cardGap)}px - ${cardWidth / 2}px))`;
          }
        } else if (currentIndex < serviceItems.length) {
          setCurrentIndex(serviceItems.length * 2 - 1);
          if (containerRef.current) {
            containerRef.current.style.transitionDuration = '0ms';
            containerRef.current.style.transform = `translateX(calc(50% - ${(serviceItems.length * 2 - 1) * (cardWidth + cardGap)}px - ${cardWidth / 2}px))`;
          }
        }
      };

      const currentContainer = containerRef.current;
      currentContainer?.addEventListener('transitionend', transitionEnd);
      return () => currentContainer?.removeEventListener('transitionend', transitionEnd);
    }
  }, [isTransitioning, currentIndex, serviceItems.length, cardWidth, cardGap]);

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <section className="py-16 md:py-20 pb-20 md:pb-24 relative overflow-hidden order-2 md:order-1">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/30 via-indigo-50/20 to-pink-50/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
              {language === 'sr' 
                ? 'Naše Usluge'
                : 'Our Services'
              }
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'sr' 
                ? 'Kompletna optimizacija prilagođena vašim potrebama i budžetu'
                : 'Complete optimization tailored to your needs and budget'
              }
            </p>
          </div>

          <div className="relative overflow-x-auto md:overflow-hidden scrollbar-hide">
            <div
              ref={containerRef}
              className="flex py-4 md:py-8 md:transition-transform md:duration-700 md:ease-in-out scrollbar-hide"
              style={{
                transform: !isMobile ? `translateX(calc(50% - ${currentIndex * (cardWidth + cardGap)}px - ${cardWidth / 2}px))` : 'none',
                transitionDuration: isTransitioning && !isMobile ? '700ms' : '0ms',
                touchAction: 'pan-x pan-y'
              }}
            >
              {extendedItems.map((item, index) => {
                const distance = Math.abs(index - currentIndex);
                // Fade effect using opacity only (no overlay rectangles)
                const opacity = isMobile ? 1 : Math.max(0.3, 1 - distance * 0.25);
                const scale = isMobile ? 1 : Math.max(0.92, 1 - distance * 0.04);

                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[300px] md:w-96 px-2"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      transition: isMobile ? 'none' : 'all 0.7s ease-in-out',
                      marginRight: index < extendedItems.length - 1 ? `${cardGap}px` : '0',
                    }}
                  >
                    <div className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div className="relative p-5 md:p-6 z-10 h-full flex flex-col">
                        <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <item.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                        </div>
                        <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-0.5 bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} md:hidden`}></div>
                            <span className="text-xs font-medium text-gray-500 md:hidden">
                              {language === 'sr' ? 'Uključuje' : 'Includes'}
                            </span>
                          </div>
                          <ul className="space-y-1.5 md:space-y-2">
                            {item.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                                <CheckCircle className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.iconColor} flex-shrink-0 mt-0.5`} />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows - Desktop only */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-2">
              <button
                onClick={goToPrevious}
                className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-300 shadow-md"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-300 shadow-md"
                aria-label="Next service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

