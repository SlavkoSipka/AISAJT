import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Target, BarChart3, Zap, CheckCircle, ArrowRight, Award, Users, Sparkles, Globe, LineChart, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { trackCTAClick } from '../../utils/analytics';

export function SEOPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SEO Meta Tags - OPTIMIZOVANO za ključne reči */}
      <SEOHelmet
        title={language === 'sr' 
          ? 'SEO Optimizacija Cena | SEO Optimizacija Sajta | Cena SEO Optimizacije Beograd'
          : 'SEO Optimization Price | Website SEO | SEO Optimization Cost Belgrade'
        }
        description={language === 'sr'
          ? 'SEO optimizacija sajta po najpovoljnijoj ceni u Beogradu. Profesionalna SEO optimizacija - cena zavisi od projekta. Besplatna konsultacija za SEO optimizaciju vašeg web sajta.'
          : 'Website SEO optimization at the best price in Belgrade. Professional SEO optimization - price depends on the project. Free consultation for SEO optimization of your website.'
        }
        keywords={language === 'sr'
          ? 'seo optimizacija cena, seo optimizacija, cena seo optimizacije, seo optimizacija sajta, seo optimizacija beograd, seo cena'
          : 'seo optimization price, seo optimization, seo cost, website seo optimization, seo optimization belgrade'
        }
        canonicalUrl="https://aisajt.com/seo"
      />

      <Navbar />

      <main id="main-content">
        {/* Hero Section - H1 sa glavnom ključnom rečju */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>
          
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Giant Background Letter "S" - Hidden on small mobile */}
          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              S
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                {/* H1 - Glavna ključna reč */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                  {language === 'sr' ? 'SEO Optimizacija Cena' : 'SEO Optimization Price'}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-4 animate-fade-in-up animation-delay-400">
                  {language === 'sr' 
                    ? 'Profesionalna SEO optimizacija sajta u Beogradu. Cena SEO optimizacije zavisi od konkurencije i ključnih reči. Besplatna analiza i transparentna ponuda.'
                    : 'Professional website SEO optimization in Belgrade. SEO optimization cost depends on competition and keywords. Free analysis and transparent offer.'
                  }
                </p>

                {/* CTA Button */}
                <div className="flex justify-center animate-fade-in-up animation-delay-600">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna SEO Analiza', 'seo_hero', language);
                      navigate('/contact');
                    }}
                    className="group px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-5 h-5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">{language === 'sr' ? 'Zakažite Besplatnu Analizu' : 'Schedule Free Analysis'}</span>
                    <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Stats - Minimalist Design */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 md:mt-12 animate-fade-in-up animation-delay-800">
                {/* Stat 1 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">+250%</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Rast Prometa' : 'Traffic Growth'}</p>
                </div>

                {/* Stat 2 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">50+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Klijenata' : 'Clients'}</p>
                </div>

                {/* Stat 3 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">TOP 5+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Pozicije' : 'Rankings'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Šta je SEO optimizacija - Long-form content sa vizuelnim elementima */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-violet-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-violet-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center px-4">
                {language === 'sr' 
                  ? 'Šta je SEO Optimizacija Sajta?'
                  : 'What is Website SEO Optimization?'
                }
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
                {/* Left - Text Content */}
                <div className="prose prose-lg max-w-none">
                  {language === 'sr' ? (
                    <>
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        SEO optimizacija (Search Engine Optimization) je proces poboljšanja vidljivosti vašeg web sajta u organskim rezultatima pretraživača kao što su Google, Bing i Yahoo. Kada govorimo o SEO optimizaciji sajta, mislimo na niz tehničkih i sadržajnih intervencija koje dovode do boljeg rangiranja na Google-u.
                      </p>
                      
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        Profesionalna SEO optimizacija nije jednokratna aktivnost - to je kontinuiran proces praćenja, analiziranja i prilagođavanja. Cena SEO optimizacije zavisi od više faktora: konkurencije u vašoj industriji, broja ključnih reči koje targetirate, trenutnog stanja sajta, i vaših ciljeva.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        SEO optimization (Search Engine Optimization) is the process of improving your website's visibility in organic search results on search engines like Google, Bing, and Yahoo.
                      </p>
                      
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        Professional SEO optimization is not a one-time activity - it's a continuous process of monitoring, analyzing, and adjusting.
                      </p>
                    </>
                  )}
                </div>

                {/* Right - Visual Element (Keywords Cloud) - Simplified for mobile */}
                <div className="relative mt-6 md:mt-0">
                  <div className="bg-gradient-to-br from-violet-50 via-indigo-50 to-pink-50 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-violet-200 shadow-xl">
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center">
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-violet-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md flex items-center">SEO Optimizacija</span>
                      <span className="px-2 py-1 md:px-3 md:py-2 bg-indigo-400 text-white rounded-full text-[10px] md:text-xs font-medium flex items-center">Google Ranking</span>
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-pink-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md flex items-center">Ključne Reči</span>
                      <span className="hidden sm:flex px-2 py-1 md:px-3 md:py-2 bg-violet-400 text-white rounded-full text-[10px] md:text-xs font-medium items-center">Backlinks</span>
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md flex items-center">Organski Saobraćaj</span>
                      <span className="hidden sm:flex px-2 py-1 md:px-3 md:py-2 bg-pink-400 text-white rounded-full text-[10px] md:text-xs font-medium items-center">On-Page SEO</span>
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-violet-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md flex items-center">Meta Tagovi</span>
                      <span className="hidden sm:flex px-2 py-1 md:px-3 md:py-2 bg-indigo-400 text-white rounded-full text-[10px] md:text-xs font-medium items-center">Content</span>
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-pink-500 text-white rounded-full text-xs md:text-sm font-semibold shadow-md flex items-center">Link Building</span>
                      <span className="hidden sm:flex px-2 py-1 md:px-3 md:py-2 bg-violet-400 text-white rounded-full text-[10px] md:text-xs font-medium items-center">Tehnički SEO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* New section with subheading */}
              <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 shadow-lg border border-gray-100">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center px-4">
                  {language === 'sr' ? 'Zašto Vam Treba SEO Optimizacija?' : 'Why Do You Need SEO Optimization?'}
                </h3>

                <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Ako vaš sajt nije na prvoj stranici Google rezultata, praktično ne postoji za potencijalne klijente. Preko 75% korisnika nikada ne pregleda drugu stranicu rezultata. Zato je SEO optimizacija ključna - ona donosi kvalitetan organski saobraćaj bez stalnog plaćanja oglasa.'
                        : 'If your site is not on the first page of Google results, it practically doesn\'t exist for potential clients. Over 75% of users never check the second page of results.'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Kada ljudi traže "izrada web sajta Beograd" ili "najbolji marketing u Srbiji", vi želite da budete među prvim rezultatima. To je tačno ono što SEO optimizacija postiže - donosi vam ljude koji već TRAŽE ono što vi nudite.'
                        : 'When people search for services you offer, you want to be among the first results. That\'s exactly what SEO optimization achieves.'
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                  <h4 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 text-center px-2">
                    {language === 'sr' ? 'Konkretni Rezultati SEO Optimizacije:' : 'Concrete SEO Optimization Results:'}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-violet-100">
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold text-violet-600 mb-0.5 md:mb-1">2-4</div>
                      <p className="text-[10px] md:text-xs lg:text-sm text-gray-600">{language === 'sr' ? 'meseca' : 'months'}</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-indigo-100">
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600 mb-0.5 md:mb-1">10x</div>
                      <p className="text-[10px] md:text-xs lg:text-sm text-gray-600">{language === 'sr' ? 'saobraćaj' : 'traffic'}</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-pink-100">
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold text-pink-600 mb-0.5 md:mb-1">TOP 5+</div>
                      <p className="text-[10px] md:text-xs lg:text-sm text-gray-600">{language === 'sr' ? 'pozicije' : 'positions'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO usluge koje nudimo */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/30 via-indigo-50/20 to-pink-50/30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                  {language === 'sr' 
                    ? 'Naše SEO Optimizacija Usluge'
                    : 'Our SEO Optimization Services'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Kompletna SEO optimizacija prilagođena vašim potrebama i budžetu'
                    : 'Complete SEO optimization tailored to your needs and budget'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Service 1 - Keyword Research */}
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Keyword Research' : 'Keyword Research'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Pronalazimo najbolje ključne reči za vašu industriju - one koje donose kvalitetan saobraćaj i konverzije.'
                        : 'We find the best keywords for your industry - ones that bring quality traffic and conversions.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Analiza konkurencije' : 'Competition analysis'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Long-tail keywords' : 'Long-tail keywords'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 2 - On-Page SEO */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'On-Page SEO' : 'On-Page SEO'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Optimizujemo svaki element vašeg sajta - od meta tagova do strukture sadržaja.'
                        : 'We optimize every element of your site - from meta tags to content structure.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Meta tagovi (title, description)' : 'Meta tags (title, description)'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Heading struktura (H1-H6)' : 'Heading structure (H1-H6)'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'URL optimizacija' : 'URL optimization'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 3 - Tehnički SEO */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-violet-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Tehnički SEO' : 'Technical SEO'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Rešavamo tehničke probleme koji sprečavaju Google da pravilno indeksira vaš sajt.'
                        : 'We solve technical issues that prevent Google from properly indexing your site.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Site speed optimizacija' : 'Site speed optimization'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Mobile-first indexing' : 'Mobile-first indexing'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Structured data' : 'Structured data'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 4 - Off-Page SEO */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Off-Page SEO' : 'Off-Page SEO'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Gradimo autoritet vašeg sajta kroz kvalitetne backlink-ove i PR.'
                        : 'We build your site authority through quality backlinks and PR.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Link building strategija' : 'Link building strategy'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Guest posting' : 'Guest posting'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 5 - SEO Analitika */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'SEO Analitika' : 'SEO Analytics'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Pratimo rezultate i prilagođavamo strategiju za maksimalan ROI.'
                        : 'We track results and adjust strategy for maximum ROI.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Google Analytics setup' : 'Google Analytics setup'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Mesečni izveštaji' : 'Monthly reports'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 6 - Lokalni SEO */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <LineChart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Lokalni SEO' : 'Local SEO'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Optimizacija za lokalne pretrage i Google Maps da vas pronađu ljudi u vašem gradu.'
                        : 'Optimization for local searches and Google Maps so people in your city can find you.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Google My Business' : 'Google My Business'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Lokalni direktorijumi' : 'Local directories'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Section - SEO Results Showcase */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center px-4">
                {language === 'sr' 
                  ? 'Kako Izgleda Uspešna SEO Optimizacija Sajta?'
                  : 'What Does Successful SEO Look Like?'
                }
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Before */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-red-200 relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    {language === 'sr' ? 'PRE' : 'BEFORE'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {language === 'sr' ? 'Bez SEO Optimizacije' : 'Without SEO'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Google Rang' : 'Google Rank'}</span>
                      <span className="text-red-600 font-bold">Stranica 5+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Mesečni Promet' : 'Monthly Traffic'}</span>
                      <span className="text-red-600 font-bold">~200</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Konverzije' : 'Conversions'}</span>
                      <span className="text-red-600 font-bold">~5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'SEO Score' : 'SEO Score'}</span>
                      <span className="text-red-600 font-bold">35/100</span>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-green-200 relative overflow-hidden shadow-xl">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {language === 'sr' ? 'POSLE' : 'AFTER'}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {language === 'sr' ? 'Sa Našom SEO Optimizacijom' : 'With Our SEO'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Google Rang' : 'Google Rank'}</span>
                      <span className="text-green-600 font-bold">TOP 5+ ✨</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Mesečni Promet' : 'Monthly Traffic'}</span>
                      <span className="text-green-600 font-bold">~2,500+ 📈</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'Konverzije' : 'Conversions'}</span>
                      <span className="text-green-600 font-bold">~80+ 🎯</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{language === 'sr' ? 'SEO Score' : 'SEO Score'}</span>
                      <span className="text-green-600 font-bold">95/100 🏆</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial / Result */}
              <div className="mt-12 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-3xl p-8 border border-violet-200 text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-violet-600" />
                </div>
                <p className="text-lg md:text-xl text-gray-900 font-medium italic mb-3">
                  {language === 'sr' 
                    ? '"Nakon 3 meseca SEO optimizacije, naš sajt je prešao sa 3. stranice na TOP 5+ pozicije. Organski saobraćaj je porastao 12x!"'
                    : '"After 3 months of SEO optimization, our site moved from page 3 to TOP 5+ positions. Organic traffic increased 12x!"'
                  }
                </p>
                <p className="text-gray-600 text-sm">
                  {language === 'sr' ? '- Klijent, E-commerce Industrija' : '- Client, E-commerce Industry'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cena SEO optimizacije sekcija */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center px-4">
                {language === 'sr' 
                  ? 'Cena SEO Optimizacije?'
                  : 'SEO Optimization Price?'
                }
              </h2>

              <div className="prose prose-lg max-w-none text-center">
                {language === 'sr' ? (
                  <>
                    <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                      Cena SEO optimizacije sajta nije fiksna - zavisi od više faktora. SEO optimizacija cena se obračunava na osnovu obima posla, konkurencije u vašoj niši, broja ključnih reči, i trenutnog stanja sajta. Evo kako formiramo cenu za SEO optimizaciju:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-6 h-6 text-violet-600" />
                          Basic SEO Paket
                        </h3>
                        <div className="text-3xl font-bold text-violet-600 mb-2">od 250€</div>
                        <p className="text-sm text-gray-600 mb-4">mesečno / jednokratno</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                            <span>Keyword research (do 10 ključnih reči)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                            <span>On-page optimizacija</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                            <span>Meta tagovi i struktura</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                            <span>Tehnička SEO analiza</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                            <span>Mesečni izveštaji</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-400 relative">
                        <div className="absolute -top-3 right-6 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                          NAJPOPULARNIJE
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-indigo-600" />
                          Advanced SEO Paket
                        </h3>
                        <div className="text-3xl font-bold text-indigo-600 mb-2">od 500€</div>
                        <p className="text-sm text-gray-600 mb-4">mesečno</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Sve iz Basic paketa</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Link building (5-10 backlink-ova)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Content kreacija (1-2 SEO članka)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Konkurentska analiza</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <span>Detaljni mesečni izveštaji</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4 text-center">
                      Od čega zavisi cena SEO optimizacije?
                    </h3>

                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed text-center max-w-3xl mx-auto">
                      Kada određujemo cenu SEO optimizacije sajta, uzimamo u obzir nekoliko ključnih faktora koji utiču na ukupan budžet i trajanje projekta:
                    </p>

                    <ul className="space-y-4 my-8 max-w-3xl mx-auto text-left">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-violet-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Konkurencija u vašoj industriji</strong>
                          <p className="text-gray-600 mt-1">Ako se natječete za visoko konkurentne ključne reči kao "izrada sajta Beograd" ili "SEO optimizacija Novi Sad", potrebno je više rada i budžeta nego za nišne termine. Cena SEO optimizacije raste sa konkurencijom.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-indigo-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Trenutno stanje vašeg sajta</strong>
                          <p className="text-gray-600 mt-1">Ako web sajt već ima dobru osnovu (brz je, optimizovan, ima backlink-ove), SEO optimizacija košta manje. Ako sajt ima tehničke probleme ili penale, potrebno je više posla za SEO optimizaciju sajta.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-pink-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Broj ključnih reči za SEO</strong>
                          <p className="text-gray-600 mt-1">SEO optimizacija za 5 ključnih reči košta manje od optimizacije za 50 ključnih reči. Mi preporučujemo početi sa 10-15 najvažnijih ključnih reči i širiti dalje nakon prvih rezultata.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-violet-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Geografsko targetiranje (lokalni SEO)</strong>
                          <p className="text-gray-600 mt-1">Lokalna SEO optimizacija (npr. "web dizajn Beograd") je jeftinija od nacionalne ili internacionalne SEO optimizacije. Cena zavisi od geografske oblasti koju targetirate.</p>
                        </div>
                      </li>
                    </ul>

                    <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-violet-200 mt-8 text-center max-w-3xl mx-auto">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-violet-600" />
                        Transparentna cena SEO optimizacije
                      </h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Za razliku od mnogih agencija za SEO optimizaciju, mi ne skrivamo cenu iza "kontaktirajte nas za ponudu". Svaki klijent dobija detaljnu SEO analizu, transparentnu ponudu za SEO optimizaciju sajta, i procenu koliko će trajati dok ne vidite rezultate.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Besplatna SEO analiza vašeg web sajta traje 30-45 minuta i možete je zakazati već danas. Dobijate konkretne preporuke šta treba uraditi i kolika bi bila cena SEO optimizacije za vaš projekat.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                      The cost of SEO optimization is not fixed - it depends on several factors. SEO optimization price is calculated based on the scope of work, competition in your niche, number of keywords, and current state of the site.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Zašto izabrati nas za SEO - Redesigned */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-white to-indigo-50/30"></div>
          
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-violet-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
                  {language === 'sr' 
                    ? 'Zašto Odabrati Nas za SEO Optimizaciju?'
                    : 'Why Choose Us for SEO Optimization?'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Dokazani rezultati, transparentna komunikacija, i pristup baziran na podacima'
                    : 'Proven results, transparent communication, and data-driven approach'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Benefit 1 */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Decorative circle */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-violet-400/10 to-indigo-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {language === 'sr' ? 'Dokazani Rezultati' : 'Proven Results'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Preko 50 zadovoljnih klijenata sa merljivim porastom organskog saobraćaja i konverzija. Naša SEO optimizacija donosi realne rezultate.'
                        : 'Over 50 satisfied clients with measurable increase in organic traffic and conversions.'
                      }
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'sr' ? 'Stručnost i Iskustvo' : 'Expertise and Experience'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Tim sa višegodišnjim iskustvom u SEO optimizaciji, praćenjem najnovijih Google algoritama i best practices za SEO optimizaciju sajta.'
                        : 'Team with years of experience in SEO, tracking the latest Google algorithms and best practices.'
                      }
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-violet-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-violet-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'sr' ? 'Transparentni Izveštaji' : 'Transparent Reports'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Mesečni SEO izveštaji sa konkretnim metrikama - pozicije ključnih reči, organski saobraćaj, konverzije. Pratite cenu SEO optimizacije i ROI.'
                        : 'Monthly reports with concrete metrics - keyword positions, traffic, conversions.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proces SEO Optimizacije - Visual Timeline */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-violet-50/30 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center px-4">
                {language === 'sr' 
                  ? 'Kako Radimo na Vašoj SEO Optimizaciji?'
                  : 'How Do We Work on Your SEO?'
                }
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="group bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border-l-4 border-violet-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {language === 'sr' ? 'Besplatna SEO Analiza' : 'Free SEO Analysis'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Analiziramo vaš web sajt, konkurenciju, i ključne reči. Dobijate detaljnu analizu trenutnog stanja i procenu cene SEO optimizacije.'
                          : 'We analyze your website, competition, and keywords. You get a detailed analysis and cost estimate.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Keyword Research & Strategija' : 'Keyword Research & Strategy'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Pronalazimo najbolje ključne reči za vašu industriju i pravimo SEO strategiju. Definišemo prioritete i cilj optimize.'
                          : 'We find the best keywords and create an SEO strategy. We define priorities and optimization goals.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'On-Page Optimizacija' : 'On-Page Optimization'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Optimizujemo vaš sajt - meta tagove, heading strukturu, URL-ove, slike, brzinu učitavanja. Sve što Google "gleda" pri rangiranju.'
                          : 'We optimize your site - meta tags, heading structure, URLs, images, loading speed.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-violet-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Content & Link Building' : 'Content & Link Building'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Kreiramo kvalitetan SEO content i gradimo backlink-ove. Ovo je ključ dugoročnog uspeha SEO optimizacije.'
                          : 'We create quality SEO content and build backlinks. This is key to long-term SEO success.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      5
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Praćenje & Izveštaji' : 'Tracking & Reports'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Mesečni izveštaji sa konkretnim rezultatima - pozicije, saobraćaj, ROI. Vidite tačno gde ide vaš budžet za SEO optimizaciju.'
                          : 'Monthly reports with concrete results - positions, traffic, ROI.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Sekcija sa Accordion */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Česta Pitanja o SEO Optimizaciji' : 'Frequently Asked Questions About SEO'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr' 
                  ? 'Odgovori na najčešća pitanja o SEO optimizaciji, ceni, i rezultatima'
                  : 'Answers to the most common questions about SEO optimization, pricing, and results'
                }
              </p>

              <div className="space-y-4">
                {language === 'sr' ? (
                  <>
                    {/* FAQ 1 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 0 ? null : 0)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Koliko traje da vidim rezultate SEO optimizacije?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 0 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Realno, potrebno je 2-4 meseca da vidite značajne rezultate. SEO nije brza reklama - to je dugoročna investicija. Međutim, tehničke poboljšanja (brzina sajta, struktura) daju rezultate odmah.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 2 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 1 ? null : 1)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Da li je SEO optimizacija jednokratna ili mesečna usluga?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 1 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Oba. Možete uraditi jednokratnu SEO optimizaciju sajta (on-page, tehnički SEO) za fiksnu cenu, ili angažovati nas mesečno za kontinuiranu optimizaciju (content, link building, praćenje).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 3 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 2 ? null : 2)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Koliko košta SEO optimizacija za mali biznis?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 2 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Za male biznise preporučujemo Basic SEO paket od 250€ jednokratno za tehničku optimizaciju, ili mesečni paket od 250€ ako želite kontinuirani rad na content-u i link buildingu.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 4 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 3 ? null : 3)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Da li garantujete prvu poziciju na Google-u?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 3 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Niko ne može garantovati prvu poziciju jer Google algoritam se menja. Ali garantujemo porast pozicija i organskog saobraćaja. Radimo samo White Hat SEO tehnike koje su dugoročno održive.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* FAQ 1 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 0 ? null : 0)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          How long does it take to see SEO results?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 0 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Realistically, it takes 2-4 months to see significant results. SEO is not quick advertising - it's a long-term investment. However, technical improvements (site speed, structure) show results immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Besplatna Konsultacija */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-violet-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                {language === 'sr' 
                  ? 'Spremni za Bolji Rang na Google-u?'
                  : 'Ready for Better Google Rankings?'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {language === 'sr' 
                  ? 'Zakažite besplatnu SEO analizu i saznajte kako možemo pomoći vašem biznisu da raste.'
                  : 'Schedule a free SEO analysis and find out how we can help your business grow.'
                }
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    trackCTAClick('Besplatna SEO Analiza - Footer', 'seo_cta', language);
                    navigate('/contact');
                  }}
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
                >
                  {language === 'sr' ? 'Zakažite Besplatnu Analizu' : 'Schedule Free Analysis'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/"
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'Nazad na Početnu' : 'Back to Homepage'}
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                {language === 'sr' 
                  ? '✨ Odgovaramo u roku od 24h. Bez obaveza.'
                  : '✨ We respond within 24h. No obligations.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Link back to other services */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-600 mb-4">
                {language === 'sr' 
                  ? 'Pored SEO optimizacije, nudimo i druge digitalne usluge:'
                  : 'In addition to SEO optimization, we also offer other digital services:'
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  to="/"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
                </Link>
                <Link 
                  to="/"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </Link>
                <Link 
                  to="/"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Digital Marketing' : 'Digital Marketing'}
                </Link>
                <Link 
                  to="/"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'E-commerce' : 'E-commerce'}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
