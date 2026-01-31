import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, CreditCard, Truck, Shield, BarChart3, CheckCircle, ArrowRight, Award, Users, Sparkles, Target, ChevronDown, Zap, Globe, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { TeamCTA } from '../sections/TeamCTA';
import { BenefitsCarousel } from '../sections/BenefitsCarousel';
import { trackCTAClick } from '../../utils/analytics';

export function WebShopPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const faqItems = language === 'sr' ? [
    {
      question: "Koliko traje izrada web shopa?",
      answer: "Basic shop 7-10 dana, Advanced shop 14-21 dan, Enterprise projekti 30+ dana. Zavisi od broja proizvoda i custom funkcionalnosti."
    },
    {
      question: "Koje metode plaćanja postoje za izrada web shopa?",
      answer: "Podržavamo sve popularne metode: bankarska kartica (Visa/Mastercard), PayPal, pouzećem, virmansko plaćanje i kripto valute. Provizije zavise od gateway-a."
    },
    {
      question: "Da li mogu sam upravljati web shopom nakon izrade?",
      answer: "Da! Dobijate obuku za upravljanje. Dodavanje proizvoda, cene i praćenje zaliha su jednostavni kroz admin panel - bez programerskog znanja."
    },
    {
      question: "Šta je uključeno u cenu izrade web prodavnice?",
      answer: "Uključeno: dizajn, razvoj, hosting (godina dana), SSL, obuka, osnovna SEO optimizacija i tehnička podrška. Specifične integracije se naplaćuju dodatno."
    },
    {
      question: "Cena održavanja internet prodavnice nakon izrade web shopa?",
      answer: "Hosting, sigurnost, backup i tehnička podrška od 40-70€ mesečno. Sa profesionalnom SEO optimizacijom koja dovodi web shop na prvu poziciju Google-a, cena je od 250€ mesečno."
    }
  ] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHelmet
        title={language === 'sr' 
          ? 'Izrada Web Shopa | Online Prodavnica Beograd, Novi Sad, Srbija'
          : 'Web Shop Development | Online Store Belgrade, Novi Sad, Serbia'
        }
        description={language === 'sr'
          ? 'Profesionalna izrada web shopa u Beogradu, Novom Sadu i Srbiji. Izrada sajta za online prodaju - WooCommerce, Shopify. Cena izrade web prodavnice od 499€. Besplatna konsultacija.'
          : 'Professional web shop development in Belgrade and Serbia. E-commerce website creation. Free consultation.'
        }
        keywords={language === 'sr'
          ? 'izrada web shopa, izrada web shopa cena, izrada sajta za online prodaju, cena izrada web prodavnice, izrada internet prodavnice, izrada web shopa beograd'
          : 'web shop development, ecommerce website, online store creation'
        }
        canonicalUrl="https://aisajt.com/izrada-web-shopa"
        includeBusinessSchema={true}
        includeFAQSchema={true}
        faqItems={faqItems}
      />

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white"></div>
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-violet-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-violet-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              S
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2">
                  {language === 'sr' ? 'Izrada Web Shopa' : 'Web Shop Development'}
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                  {language === 'sr' 
                    ? 'Profesionalna izrada web shopa u Beogradu, Novom Sadu i celoj Srbiji. Kreirajte online prodavnicu koja prodaje 24/7. Od jednostavnog kataloga do kompleksne web prodavnice sa integracijom plaćanja i dostave.'
                    : 'Professional web shop development in Belgrade, Novi Sad and all of Serbia. Create an online store that sells 24/7.'
                  }
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna Konsultacija - Hero Web Shop', 'web_shop_hero', language);
                      navigate('/contact');
                    }}
                    className="group px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">{language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}</span>
                    <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 md:mt-12">
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">20+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Web Shopova' : 'Web Shops'}</p>
                </div>

                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">400%</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Prosečan ROI' : 'Average ROI'}</p>
                </div>

                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">14 dana</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Prosečan Rok' : 'Average Deadline'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Šta je Web Shop */}
        <section className="py-10 md:py-24 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-16">
                <p className="text-indigo-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                  {language === 'sr' ? 'Online Prodaja' : 'Online Sales'}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4 leading-tight">
                  {language === 'sr' 
                    ? 'Šta je Izrada Web Shopa i Zašto Vam Treba?'
                    : 'What is Web Shop Development and Why Do You Need It?'
                  }
                </h2>
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                  {language === 'sr' ? (
                    <>
                      Izrada sajta za online prodaju je proces kreiranja digitalne prodavnice koja radi 24/7 i donosi profit dok vi spavate. Sa profesionalnom <Link to="/izrada-sajta-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">izradom sajta</Link>, vaša internet prodavnica može dosegnuti klijente širom Srbije i regiona. Cena izrade web prodavnice zavisi od kompleksnosti, ali investicija se vraća kroz povećanu prodaju i smanjenje troškova.
                    </>
                  ) : (
                    'Web shop development is the process of creating a digital store that works 24/7 and generates profit while you sleep.'
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-12">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 mb-2">
                        {language === 'sr' ? 'Prodaja Bez Granica' : 'Borderless Sales'}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr'
                          ? 'Web shop nije ograničen radnim vremenom ili lokacijom. Vaši proizvodi su dostupni kupcima iz Beograda, Novog Sada i cele Srbije, bilo kada, bilo gde. To znači više porudžbina i veći prihod.'
                          : 'Your web shop is not limited by working hours or location. Products are available anytime, anywhere.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 mb-2">
                        {language === 'sr' ? 'Praćenje Prodaje' : 'Sales Tracking'}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr'
                          ? 'Svaka porudžbina, svaki proizvod, svaki kupac - sve je evidentirano. Znate šta se prodaje, kada, i kome. Ove informacije su zlato za optimizaciju asortimana i marketing strategije.'
                          : 'Every order, every product, every customer - all tracked. This data is gold for optimizing your strategy.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 mb-2">
                        {language === 'sr' ? 'Automatizacija Procesa' : 'Process Automation'}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' ? (
                          <>
                            Od prijema porudžbine do obaveštenja o isporuci - sve je automatizirano. Kvalitetna izrada internet prodavnice uključuje i <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">SEO optimizaciju</Link> kako bi vaš shop bio vidljiv na Google-u.
                          </>
                        ) : (
                          'From order receipt to delivery notification - everything is automated. Quality development includes SEO optimization.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img 
                      src="/images/izrada-web-shopa.webp" 
                      alt={language === 'sr' ? 'Primer izrade web shopa Beograd - moderna online prodavnica' : 'Web shop development example'} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl p-6 shadow-2xl w-48 z-10">
                    <div className="text-white">
                      <p className="text-3xl font-bold mb-1">24/7</p>
                      <p className="text-sm opacity-90">
                        {language === 'sr' ? 'Otvoreno za kupce' : 'Open for business'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cenovnik */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center px-4">
                {language === 'sr' 
                  ? 'Izrada Web Shopa Cena - Transparentne Cene'
                  : 'Web Shop Development Price - Transparent Pricing'
                }
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
                {language === 'sr' 
                  ? 'Cena izrade web prodavnice zavisi od kompleksnosti i broja proizvoda. Sve usluge uključuju hosting, SSL sertifikat i obuku za korišćenje.'
                  : 'Web shop development price depends on complexity and number of products. All services include hosting, SSL certificate and training.'
                }
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-12">
                {/* Basic Shop */}
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-violet-600" />
                    {language === 'sr' ? 'Mali Web Shop' : 'Basic Shop'}
                  </h3>
                  <div className="text-3xl font-bold text-violet-600 mb-2">od 499€</div>
                  <p className="text-sm text-gray-600 mb-4">jednokratna uplata</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6 min-h-[180px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>Do 50 proizvoda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>Responzivan dizajn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>Osnovne metode plaćanja</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>SSL sertifikat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>Obuka za upravljanje</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Basic Shop - Pricing', 'pricing_basic_shop', language);
                      navigate('/contact');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{language === 'sr' ? 'Zakaži Konsultaciju' : 'Schedule Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Advanced Shop */}
                <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-400 relative">
                  <div className="absolute -top-3 right-6 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                    NAJPOPULARNIJE
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                    {language === 'sr' ? 'Napredna Web Prodavnica' : 'Advanced Shop'}
                  </h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">od 1199€</div>
                  <p className="text-sm text-gray-600 mb-4">jednokratna uplata</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6 min-h-[180px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Do 200 proizvoda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Custom dizajn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Sve metode plaćanja</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Integracija sa kuririma</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Marketing alati (kuponi, popusti)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>Osnovna SEO optimizacija</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Advanced Shop - Pricing', 'pricing_advanced_shop', language);
                      navigate('/contact');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{language === 'sr' ? 'Zakaži Konsultaciju' : 'Schedule Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Enterprise Shop */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-6 h-6 text-pink-600" />
                    {language === 'sr' ? 'Shop Projekat' : 'Enterprise Shop'}
                  </h3>
                  <div className="text-3xl font-bold text-pink-600 mb-2">od 2999€</div>
                  <p className="text-sm text-gray-600 mb-4">jednokratna uplata</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6 min-h-[180px]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Neograničeno proizvoda</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Premium custom dizajn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Multi-jezična podrška</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Integracija sa ERP/CRM sistemima</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Napredna SEO optimizacija</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Prioritetna podrška</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      trackCTAClick('Enterprise Shop - Pricing', 'pricing_enterprise_shop', language);
                      navigate('/contact');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{language === 'sr' ? 'Zakaži Konsultaciju' : 'Schedule Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Carousel */}
        <BenefitsCarousel language={language} />

        {/* Team CTA - integrated */}
        <div className="bg-white -mt-16 md:-mt-20 pb-10 md:pb-16 relative z-10">
          <TeamCTA />
        </div>

        {/* Zašto Web Shop - Detaljno */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 px-4">
                  {language === 'sr' 
                    ? 'Zašto Svaki Biznis Treba Web Shop u 2025?'
                    : 'Why Every Business Needs a Web Shop in 2025?'
                  }
                </h2>
              </div>

              {language === 'sr' ? (
                <div className="space-y-12">
                  {/* Deo 1 */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      Web Shop Kao Digitalni Kanal Prodaje - Neograničene Mogućnosti
                    </h3>
                    {/* Mobile - Short */}
                    <p className="md:hidden text-base text-gray-700 leading-relaxed mb-4">
                      Izrada web shopa je investicija u budućnost biznisa. Dok fizička prodavnica radi 8-10 sati, online prodavnica radi 24/7. Kupci pregledaju, kupuju i plaćaju dok vi spavite. Cena izrade se vraća kroz povećanu prodaju već u prvim mesecima, a doseg ide širom Srbije, regiona i sveta.
                    </p>
                    <p className="md:hidden text-base text-gray-700 leading-relaxed">
                      Profesionalna <Link to="/izrada-sajta-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">izrada sajta</Link> sa e-commerce funkcionalnostima automatizuje prodaju i smanjuje troškove. Web shop ne zahteva kiriju ili radno vreme - konstantno generiše prihod bez dodatnih troškova.
                    </p>
                    
                    {/* Desktop - Full */}
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Izrada web shopa nije samo tehnički projekat - to je investicija u budućnost vašeg biznisa. Dok tradicionalna prodavnica u Beogradu ili Novom Sadu radi 8-10 sati dnevno, online prodavnica radi 24/7 bez pauze. Vaši kupci mogu da pregledaju proizvode, dodaju ih u korpu i plate dok vi spavite. To znači da svaki dan gubite profit ako nemate web shop. Cena izrade web prodavnice se vraća kroz povećanu prodaju već u prvim mesecima. Biznis sa internet prodavnicom dostiže klijente ne samo u svom gradu, već širom Srbije, regiona, pa i sveta.
                    </p>
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed">
                      Profesionalna <Link to="/izrada-sajta-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">izrada sajta</Link> sa e-commerce funkcionalnostima omogućava vam da automatizujete proces prodaje, smanjite troškove zaposlenih i fokusirate se na širenje asortimana. Za razliku od fizičke prodavnice, web shop ne zahteva kiriju, velike troškove režija ili radno vreme. To je kanal koji konstantno generiše prihod bez dodatnih troškova po transakciji.
                    </p>
                  </div>

                  {/* Deo 2 */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      SEO Optimizacija i Prva Pozicija na Google - Ključ Uspeha Web Shopa
                    </h3>
                    {/* Mobile - Short */}
                    <p className="md:hidden text-base text-gray-700 leading-relaxed mb-4">
                      Web shop bez vidljivosti je beskoristan. <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">SEO optimizacija</Link> stavlja vašu prodavnicu na prvu stranicu Google-a. Kada neko traži "kupovina Beograd" ili "online prodavnica Srbija", vi morate biti među prvima. Bez SEO-a, tehnički radite, ali niko ne kupuje.
                    </p>
                    <p className="md:hidden text-base text-gray-700 leading-relaxed">
                      Naš pristup uključuje SEO od prvog dana - brz sajt, optimizovane slike, čist kod. Google odmah razume šta prodajete. Rezultat? Viša pozicija, više saobraćaja, više porudžbina. Biznisi sa kontinuiranom SEO optimizacijom postižu do 400% ROI u prvoj godini.
                    </p>
                    
                    {/* Desktop - Full */}
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Najbolji web shop je beskoristan ako ga niko ne pronađe. Tu dolazi <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">SEO optimizacija</Link> - proces koji stavlja vašu online prodavnicu na prvu stranicu Google rezultata kada potencijalni kupci pretražuju vaše proizvode. Kada neko ukuca "kupovina proizvoda Beograd" ili "online prodavnica Srbija", vi želite da budete među prvima. Izrada sajta za online prodaju bez SEO strategije je kao otvaranje prodavnice u sokaku gde niko ne prolazi - tehnički radi, ali niko ne kupuje.
                    </p>
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed">
                      Naš pristup izrade web shopa uključuje osnovnu SEO optimizaciju od prvog dana - optimizovane slike, brz sajt, čisti kod, struktuirani podaci. To znači da Google odmah razume šta prodajete i kome. Rezultat? Viša pozicija u rezultatima pretrage, više organskog saobraćaja, više porudžbina. Biznisi koji kombinuju kvalitetnu izradu internet prodavnice sa kontinuiranom SEO optimizacijom postižu do 400% ROI u prvoj godini. To nije pretera - to je realnost digitalne prodaje u 2025.
                    </p>
                  </div>

                  {/* Deo 3 */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      Marketing Mogućnosti i Širenje Biznisa Kroz Online Prodavnicu
                    </h3>
                    {/* Mobile - Short */}
                    <p className="md:hidden text-base text-gray-700 leading-relaxed mb-4">
                      Web shop je marketing mašina. Svaki proizvod je prilika za targetiranje kupaca. Facebook oglasi, Google Ads, email marketing - sve vodi u vašu prodavnicu. Digitalni marketing daje precizne metrike: koliko je kliknulo, dodalo u korpu, kupilo.
                    </p>
                    <p className="md:hidden text-base text-gray-700 leading-relaxed">
                      Cena izrade se višestruko isplati kroz targetirani marketing. Kreirajte kampanje za različite segmente - popusti za nove, loyalty za postojeće, retargeting za napuštene korpe. Profesionalni <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">web dizajn</Link> gradi poverenje i konvertuje posetioce u kupce. Biznis bez web shopa stagnira dok konkurencija raste.
                    </p>
                    
                    {/* Desktop - Full */}
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Web shop nije samo prodajni kanal - to je marketing mašina. Svaki proizvod, svaka kategorija, svaka landing stranica je prilika za targetiranje različitih kupaca. Facebook oglasi, Google Ads, email marketing, influencer kampanje - sve to vodi direktno u vašu online prodavnicu gde se dešava konverzija. Za razliku od tradicionalnog marketinga gde ne znate koliko ljudi je videlo bilboard ili flayer, digitalni marketing kroz web shop daje precizne metrike: koliko ljudi je kliknulo, koliko je dodalo u korpu, koliko je kupilo.
                    </p>
                    <p className="hidden md:block text-base md:text-lg text-gray-700 leading-relaxed">
                      Cena izrade web prodavnice se višestruko isplati kroz targetirani marketing. Možete kreirati specifične kampanje za različite segmente - popusti za nove kupce, loyalty programi za postojeće, retargeting za one koji su napustili korpu. Sve to je automatizovano i precizno. Dodatno, profesionalni <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">web dizajn</Link> osigurava da vaša internet prodavnica ne samo privlači pažnju, već i gradi poverenje i konvertuje posetioce u kupce. U eri digitalne transformacije, biznis bez web shopa je biznis koji stagnira dok konkurencija raste.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      Web Shop As a Digital Sales Channel - Unlimited Possibilities
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Web shop development is not just a technical project - it's an investment in your business future. While a traditional store works 8-10 hours a day, an online store works 24/7. Your customers can browse products, add them to cart and pay while you sleep.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Primeri - Placeholder */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {language === 'sr' 
                    ? 'Naši Web Shopovi - Primeri Uspešnih Projekata'
                    : 'Our Web Shops - Successful Project Examples'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Pogledajte kako smo pomogli biznisima u Srbiji da kreiraju profitabilne online prodavnice'
                    : 'See how we helped businesses in Serbia create profitable online stores'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Primer 1 - Prestige Gradnja */}
                <a 
                  href="https://prestigegradnja.rs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-violet-100 overflow-hidden">
                    <img 
                      src="https://aislike.rs/aisajt/prestige-min.png" 
                      alt="Prestige Gradnja - Online Prodaja Nekretnina"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'sr' ? 'Prestige Gradnja - Online Prodaja Nekretnina' : 'Prestige Gradnja - Online Real Estate Sales'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'sr' 
                        ? 'Moderan sajt za online prodaju nekretnina i apartmana u Vrnjačkoj Banji. Omogućava klijentima da pregledaju dostupne stanove, vide cene, planove i rezervišu termine za razgledanje - sve online. Integrisana je galerija slika, interaktivni planovi i kontakt forma za direktnu komunikaciju.'
                        : 'Modern website for online real estate and apartment sales in Vrnjačka Banja. Allows clients to browse available properties, view prices, plans and schedule viewings - all online. Integrated image gallery, interactive plans and contact form for direct communication.'
                      }
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{language === 'sr' ? 'Nekretnine' : 'Real Estate'}</span>
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">Custom Design</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">SEO</span>
                    </div>
                  </div>
                </a>

                {/* Primer 2 - Custom RC Parts */}
                <a 
                  href="https://customrc.parts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <div className="aspect-video bg-gradient-to-br from-violet-100 to-pink-100 overflow-hidden">
                    <img 
                      src="https://aislike.rs/aisajt/rc-min.png" 
                      alt="Custom RC Parts - Web Shop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'sr' ? 'Custom RC Parts - Međunarodni Web Shop' : 'Custom RC Parts - International Web Shop'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'sr' 
                        ? 'Klasičan online shop koji prodaje RC delove širom sveta. Kompletan e-commerce sistem sa katalogom proizvoda, košaricom, online plaćanjem i automatskom obradom porudžbina. Višejezična podrška za međunarodno tržište i integracija sa kurirskim službama za globalne isporuke.'
                        : 'Classic online shop selling RC parts worldwide. Complete e-commerce system with product catalog, shopping cart, online payment and automatic order processing. Multi-language support for international market and integration with courier services for global deliveries.'
                      }
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">E-commerce</span>
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{language === 'sr' ? 'Međunarodna Prodaja' : 'International Sales'}</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">WooCommerce</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Povezane usluge */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 px-4">
                  {language === 'sr'
                    ? 'Kompletna Rešenja za Online Prodaju'
                    : 'Complete Solutions for Online Sales'
                  }
                </h2>
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Izrada web shopa je samo početak. Kombinujte sa profesionalnom izradom sajta, SEO optimizacijom i web dizajnom za maksimalne rezultate.'
                    : 'Web shop development is just the beginning. Combine with professional website development, SEO and web design for maximum results.'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Profesionalna izrada sajta koja pretvara posetioce u kupce. Brz, siguran i funkcionalan online prostor za vaš biznis.'
                      : 'Professional website development that converts visitors into customers.'
                    }
                  </p>

                  <Link
                    to="/izrada-sajta-cena"
                    className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all duration-300"
                  >
                    {language === 'sr' ? 'Saznajte Više' : 'Learn More'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 text-center">
                  <div className="mb-6">
                    <Users className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {language === 'sr' ? 'Upoznaj AiSajt Tim' : 'Meet AiSajt Team'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'sr'
                        ? 'Saznaj više o nama i kako možemo pomoći tvom biznisu'
                        : 'Learn more about us and how we can help your business'
                      }
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-all duration-300"
                  >
                    {language === 'sr' ? 'O nama' : 'About Us'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Budite vidljivi kada vas klijenti traže. Organski saobraćaj i visoke pozicije na Google-u.'
                      : 'Be visible when clients search for you. Organic traffic and high Google rankings.'
                    }
                  </p>

                  <Link
                    to="/seo-optimizacija-cena"
                    className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all duration-300"
                  >
                    {language === 'sr' ? 'Saznajte Više' : 'Learn More'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Najčešća Pitanja o Izradi Web Shopa' : 'FAQ About Web Shop Development'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr' 
                  ? 'Sve što treba da znate o izradi internet prodavnice - od cene do rokova'
                  : 'Everything you need to know about creating an online store - from pricing to deadlines'
                }
              </p>

              <div className="space-y-4">
                {language === 'sr' ? (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 0 ? null : 0)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Koliko traje izrada web shopa?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Basic shop 7-10 dana, Advanced shop 14-21 dan, Enterprise projekti 30+ dana. Zavisi od broja proizvoda i custom funkcionalnosti.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 1 ? null : 1)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Koje metode plaćanja postoje za izrada web shopa?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Podržavamo sve popularne metode: bankarska kartica (Visa/Mastercard), PayPal, pouzećem, virmansko plaćanje i kripto valute. Provizije zavise od gateway-a.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 2 ? null : 2)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Da li mogu sam upravljati web shopom nakon izrade?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Da! Dobijate obuku za upravljanje. Dodavanje proizvoda, cene i praćenje zaliha su jednostavni kroz admin panel - bez programerskog znanja.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 3 ? null : 3)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Šta je uključeno u cenu izrade web prodavnice?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Uključeno: dizajn, razvoj, hosting (godina dana), SSL, obuka, osnovna SEO optimizacija i tehnička podrška. Specifične integracije se naplaćuju dodatno.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 4 ? null : 4)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Cena održavanja internet prodavnice nakon izrade web shopa?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 4 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 4 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Hosting, sigurnost, backup i tehnička podrška od 40-70€ mesečno. Sa profesionalnom SEO optimizacijom koja dovodi web shop na prvu poziciju Google-a, cena je od 250€ mesečno.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 5 ? null : 5)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Da li izrada web shopa uključuje responzivni mobilni dizajn?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 5 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 5 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Da! Svi naši shopovi su potpuno responzivni. Preko 60% kupovine dolazi sa telefona, zato je mobile-first pristup obavezan.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 7 ? null : 7)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          SEO optimizacija web shopa za Instagram i društvene mreže?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 7 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 7 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Integrišemo Facebook Pixel i Instagram Shopping - tagujte proizvode na storyima i kupci naručuju direktno. Uključeno u Advanced i Enterprise pakete.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 8 ? null : 8)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Pravni zahtevi za pokretanje web prodavnice u Srbiji?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 8 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 8 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Preporučujemo registraciju paušalnog preduzetnika ili DOO-a za legalno fakturisanje i ugovor sa bankama za online plaćanje.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 9 ? null : 9)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Kako doći na prvu poziciju Google sa novim web shopom?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 9 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 9 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Kombinacija Facebook/Instagram oglasa (10-15€ dnevno) i SEO optimizacija. Za 3-6 meseci možete biti na prvoj poziciji Google za vaše proizvode.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 0 ? null : 0)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          How long does web shop development take?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-indigo-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Basic shop takes 7-10 days, Advanced shop 14-21 days, and Enterprise projects 30+ days. Time depends on number of products, custom functionality and speed of your feedback.
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

        {/* Final CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-violet-50 to-pink-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                {language === 'sr' 
                  ? 'Spremni za Vašu Online Prodavnicu?'
                  : 'Ready for Your Online Store?'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {language === 'sr' 
                  ? 'Kontaktirajte nas za besplatnu konsultaciju. Saznajte više o ceni izrade web shopa i kako možemo pomoći vašem biznisu.'
                  : 'Contact us for a free consultation. Learn more about web shop development pricing and how we can help your business.'
                }
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    trackCTAClick('Besplatna Konsultacija - Footer Web Shop', 'web_shop_cta', language);
                    navigate('/contact');
                  }}
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
                >
                  {language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}
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
      </main>

      <Footer />
    </div>
  );
}

