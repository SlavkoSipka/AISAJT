import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Target, Palette, Zap, Globe2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../../types/language';

interface FactorsCarouselProps {
  language: Language;
}

interface FactorItem {
  icon: React.ElementType;
  title: string;
  titleEn: string;
  mobileText: string;
  mobileTextEn: string;
  fullText: React.ReactNode;
  fullTextEn: React.ReactNode;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export function FactorsCarousel({ language }: FactorsCarouselProps) {
  const factorItems: FactorItem[] = [
    {
      icon: Target,
      title: 'Kompleksnost i Broj Strana Web Sajta',
      titleEn: 'Complexity and Number of Pages',
      mobileText: 'Jednostavan sajt sa 5 stranica košta manje od kompleksnog sa 20+ stranica i custom funkcionalnostima. Što je projekat složeniji, veća je cena ali i vrednost.',
      mobileTextEn: 'A simple 5-page site costs less than a complex one with 20+ pages. More complex projects have higher prices but also more value.',
      fullText: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            Jednostavan prezentacioni sajt sa 5 stranica (Početna, O nama, Usluge, Portfolio, Kontakt) je jedan nivo složenosti. Međutim, ako vam je potreban sajt sa 20+ stranica, custom funkcionalnostima, članovima, rezervacijama ili drugim interaktivnim elementima - to je znatno kompleksniji posao koji zahteva više vremena i stručnosti.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Profesionalna izrada sajtova podrazumeva ne samo vizuelni dizajn, već i pažljivo planiranje arhitekture, navigacije, user experience-a. Što je projekat složeniji, to je i cena izrade web sajta veća, ali i vrednost koju dobijate proporcionalno raste.
          </p>
        </>
      ),
      fullTextEn: (
        <p className="text-gray-700 leading-relaxed">
          A simple presentation site with 5 pages is one level of complexity. However, if you need a site with 20+ pages, custom functionalities - that's significantly more complex work.
        </p>
      ),
      borderColor: 'border-violet-500',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-indigo-600',
    },
    {
      icon: Palette,
      title: 'Dizajn - Template ili Custom Izrada',
      titleEn: 'Design - Template or Custom',
      mobileText: 'Template dizajn je brži i jeftiniji. Custom dizajn košta više ali daje jedinstveni izgled.',
      mobileTextEn: 'Template design is faster and cheaper. Custom design costs more but provides unique look.',
      fullText: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            Postoje dva osnovna pristupa dizajnu. Prvi je korišćenje postojećih template-a koje prilagođavamo vašem brendu - ovo je brža i ekonomičnija opcija. Drugi pristup je potpuno custom dizajn gde naš tim kreira jedinstveni vizuelni identitet od nule, prilagođen isključivo vašoj industriji i target publici.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Ako vam je važan prepoznatljiv brend i želite da se izdvojite od konkurencije, preporučujemo našu{' '}
            <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
              web dizajn uslugu
            </Link>
            {' '}gde kreiramo unikatan vizuelni jezik za vaš biznis. Custom dizajn košta više, ali investicija se vraća kroz jači brend i bolju konverziju.
          </p>
        </>
      ),
      fullTextEn: (
        <p className="text-gray-700 leading-relaxed">
          There are two basic design approaches. The first is using existing templates that we adapt to your brand. The second approach is completely custom design.
        </p>
      ),
      borderColor: 'border-indigo-500',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-pink-600',
    },
    {
      icon: Zap,
      title: 'Funkcionalnosti i Integracije',
      titleEn: 'Features and Integrations',
      mobileText: 'Kontakt forma je standard. Ali online plaćanje, rezervacije, članstvo i druge funkcionalnosti utiču na cenu. Planiramo sve od početka.',
      mobileTextEn: 'Contact form is standard. But payment, bookings, membership and other features affect the price. We plan everything from the start.',
      fullText: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            Osnovna kontakt forma je standardna funkcionalnost. Ali šta ako vam trebaju: online plaćanje, rezervacioni sistem, članstvo sa prijavljanjem, korisnički paneli, live chat, newsletter integracije, CRM sistemi, analitika, automatizovani email-ovi? Svaka dodatna funkcionalnost dodaje vrednost sajtu, ali utiče i na cenu izrade.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Naša izrada sajtova u Beogradu i Novom Sadu uključuje planiranje potrebnih integracija i funkcionalnosti od samog početka projekta. Tako izbegavamo naknadne dodatne troškove i osiguravamo da sajt radi tačno kako ste zamislili.
          </p>
        </>
      ),
      fullTextEn: (
        <p className="text-gray-700 leading-relaxed">
          A basic contact form is a standard feature. But what if you need: online payment, booking system, membership, user panels, live chat, newsletter integrations?
        </p>
      ),
      borderColor: 'border-pink-500',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-violet-600',
    },
    {
      icon: Globe2,
      title: 'Optimizacija za Pretraživače (SEO)',
      titleEn: 'Search Engine Optimization (SEO)',
      mobileText: 'Osnovna SEO priprema je uključena. Za TOP rangiranje treba ozbiljnija ',
      mobileTextEn: 'Basic SEO is included. For TOP ranking you need serious ',
      fullText: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            Svaka profesionalna izrada web sajta uključuje osnovnu tehničku SEO pripremu - pravilnu strukturu, meta tagove, brzinu učitavanja, responzivnost. Ovo su osnove bez kojih sajt ne može funkcionisati. Međutim, ako želite da vaš sajt stvarno rangira na prvoj strani Google-a za konkurentne ključne reči - to zahteva ozbiljniju{' '}
            <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-medium underline">
              SEO optimizaciju
            </Link>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Izrada sajta sa naprednom SEO strategijom košta više, ali donosi merljive rezultate. Većina naših klijenata u Srbiji bira kombinaciju - izrada web sajta sa osnovnom optimizacijom, pa kasnije nadogradnja sa SEO kampanjom kada su spremni za investiciju u organski saobraćaj.
          </p>
        </>
      ),
      fullTextEn: (
        <p className="text-gray-700 leading-relaxed">
          Every professional website development includes basic technical SEO preparation. However, if you want your site to actually rank on the first page of Google - that requires serious SEO optimization.
        </p>
      ),
      borderColor: 'border-violet-500',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-indigo-600',
    },
    {
      icon: Clock,
      title: 'Rok i Hitnost Projekta',
      titleEn: 'Deadline and Project Urgency',
      mobileText: 'Standardna izrada traje 2-4 sedmice. Hitni projekti sa bržim rokom zahtevaju dodatne resurse i utiču na cenu.',
      mobileTextEn: 'Standard development takes 2-4 weeks. Urgent projects with faster deadlines require additional resources and affect the price.',
      fullText: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            Standardna profesionalna izrada web sajta u Beogradu i Novom Sadu traje 2-4 sedmice, zavisno od složenosti. Ovaj rok omogućava kvalitetan dizajn, razvoj, testiranje i prilagođavanje prema vašim komentarima. Ali šta ako vam projekat treba hitno - za nedelju dana ili dve?
          </p>
          <p className="text-gray-700 leading-relaxed">
            Hitni projekti zahtevaju realokaciju resursa, rad van radnog vremena, ponekad i angažovanje dodatnih ljudi. Ovo sve utiče na ukupnu cenu izrade sajta. Ako imate fleksibilnost sa rokom, dobijate bolju cenu i sigurnost da je svaki detalj pažljivo isplaniran i urađen.
          </p>
        </>
      ),
      fullTextEn: (
        <p className="text-gray-700 leading-relaxed">
          Standard development takes 2-4 weeks. Urgent projects with faster deadlines require additional resources and affect the price.
        </p>
      ),
      borderColor: 'border-indigo-500',
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-violet-600',
    },
  ];

  const extendedItems = [...factorItems, ...factorItems, ...factorItems];
  const [currentIndex, setCurrentIndex] = useState(factorItems.length);
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

        if (currentIndex >= factorItems.length * 2) {
          setCurrentIndex(factorItems.length);
          if (containerRef.current) {
            containerRef.current.style.transitionDuration = '0ms';
            containerRef.current.style.transform = `translateX(calc(50% - ${factorItems.length * (cardWidth + cardGap)}px - ${cardWidth / 2}px))`;
          }
        } else if (currentIndex < factorItems.length) {
          setCurrentIndex(factorItems.length * 2 - 1);
          if (containerRef.current) {
            containerRef.current.style.transitionDuration = '0ms';
            containerRef.current.style.transform = `translateX(calc(50% - ${(factorItems.length * 2 - 1) * (cardWidth + cardGap)}px - ${cardWidth / 2}px))`;
          }
        }
      };

      const currentContainer = containerRef.current;
      currentContainer?.addEventListener('transitionend', transitionEnd);
      return () => currentContainer?.removeEventListener('transitionend', transitionEnd);
    }
  }, [isTransitioning, currentIndex, factorItems.length, cardWidth, cardGap]);

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
    <section className="py-16 md:py-20 pb-20 md:pb-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center px-4">
            {language === 'sr' 
              ? 'Od Čega Zavisi Cena Izrade Sajta?'
              : 'What Determines Website Development Price?'
            }
          </h2>

          <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed text-center max-w-3xl mx-auto">
            {language === 'sr' 
              ? 'Izrada web sajta nije usluga koja ima fiksnu cenu. Svaki projekat nosi svoje specifičnosti i zahteve. Evo glavnih faktora koji određuju koliko košta profesionalna izrada sajtova u Beogradu, Novom Sadu i širom Srbije:'
              : 'Website development is not a service with a fixed price. Each project has its specifics and requirements. Here are the main factors:'
            }
          </p>

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
                    <div className={`bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl md:rounded-2xl p-5 md:p-8 border-l-4 ${item.borderColor} shadow-lg h-full`}>
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
                          <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                            {language === 'sr' ? item.title : item.titleEn}
                          </h3>
                          {/* Mobile text - shorter with better structure */}
                          <div className="md:hidden space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {language === 'sr' ? (
                                <>
                                  {item.mobileText}
                                  {item.title.includes('SEO') && (
                                    <>
                                      <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-medium underline">
                                        SEO optimizacija
                                      </Link>
                                      {' koja košta više ali donosi rezultate.'}
                                    </>
                                  )}
                                  {item.title.includes('Dizajn') && (
                                    <>
                                      {' Pogledajte našu '}
                                      <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                                        web dizajn uslugu
                                      </Link>.
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {item.mobileTextEn}
                                  {item.titleEn.includes('SEO') && (
                                    <>
                                      <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-medium underline">
                                        SEO optimization
                                      </Link>
                                      {' which costs more but brings results.'}
                                    </>
                                  )}
                                  {item.titleEn.includes('Design') && (
                                    <>
                                      {' Check our '}
                                      <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                                        web design service
                                      </Link>.
                                    </>
                                  )}
                                </>
                              )}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <div className={`w-8 h-0.5 bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}`}></div>
                              <span className="text-xs font-medium text-gray-500">
                                {language === 'sr' ? 'Glavni faktor cene' : 'Main price factor'}
                              </span>
                            </div>
                          </div>
                          {/* Desktop text - full */}
                          <div className="hidden md:block">
                            {language === 'sr' ? item.fullText : item.fullTextEn}
                          </div>
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
                className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300 shadow-md"
                aria-label="Previous factor"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300 shadow-md"
                aria-label="Next factor"
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

