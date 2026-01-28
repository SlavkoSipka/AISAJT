import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Target, BarChart3, CheckCircle, ArrowRight, Award, Users, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { TeamCTA } from '../sections/TeamCTA';
import { ServicesCarousel } from '../sections/ServicesCarousel';
import { trackCTAClick } from '../../utils/analytics';

export function SEOPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const faqItems = language === 'sr' ? [
    {
      question: "Koliko traje SEO optimizacija sajta do prvih rezultata?",
      answer: "2-4 meseca za značajne rezultate. Tehničke poboljšanja (brzina, struktura) deluju odmah."
    },
    {
      question: "SEO optimizacija cena - jednokratna ili mesečna usluga?",
      answer: "Oba. Jednokratna optimizacija za fiksnu cenu ili mesečni kontinuirani rad (content, link building)."
    },
    {
      question: "Cena SEO optimizacije sajta za mali biznis?",
      answer: "Basic SEO paket od 250€ jednokratno ili 250€ mesečno za kontinuirani rad."
    },
    {
      question: "Da li garantujete prva pozicija Google posle SEO optimizacije?",
      answer: "Ne možemo garantovati jer se Google algoritam menja. Garantujemo porast pozicija i saobraćaja kroz White Hat SEO."
    },
    {
      question: "Šta je uključeno u mesečnu SEO optimizaciju?",
      answer: "Mesečni paket uključuje kontinuirano praćenje pozicija, kreiranje SEO optimizovanog sadržaja, link building aktivnosti, tehničke optimizacije, analizu konkurencije i detaljne mesečne izveštaje sa preporukama."
    },
    {
      question: "Da li radite lokalni SEO za Beograd i Srbiju?",
      answer: "Da, specijalizovani smo za lokalnu SEO optimizaciju. Optimizujemo vaš Google My Business profil, lokalne direktorijume, i targetiramo ključne reči specifične za Beograd, Novi Sad i druge gradove u Srbiji."
    },
    {
      question: "Mogu li dobiti SEO optimizaciju ako tek pravim sajt?",
      answer: "Apsolutno! To je zapravo idealno vreme da počnete sa SEO optimizacijom. Kada sajt pravimo od nule sa osnovama (tehnički SEO, pravilna struktura, optimizovane performanse), kasnija SEO optimizacija je jednostavnija i daje brže rezultate."
    },
    {
      question: "Šta je razlika između SEO optimizacije i Google Ads oglašavanja?",
      answer: "SEO optimizacija donosi organske (besplatne) rezultate na dugi rok - jednom optimizovan sajt nastavlja da privlači posetioce bez stalnih troškova. Google Ads daje trenutne rezultate ali zahteva kontinuiranu investiciju."
    },
    {
      question: "Kako merite uspeh SEO optimizacije?",
      answer: "Pratimo ključne metrike: pozicije ključnih reči u Google pretrazi, organsku poseticu, vreme na sajtu, conversion rate, bounce rate i ROI. Dobijate detaljne mesečne izveštaje sa jasnim grafikonima i preporukama za dalji rad."
    }
  ] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SEO Meta Tags - OPTIMIZOVANO za ključne reči */}
      <SEOHelmet
        title={language === 'sr' 
          ? 'SEO Optimizacija Cena | SEO Optimizacija Sajta | Prva Pozicija Google'
          : 'SEO Optimization Price | Website SEO | First Google Position'
        }
        description={language === 'sr'
          ? 'SEO optimizacija sajta za prvu poziciju na Google u Beogradu i Srbiji. Profesionalna SEO optimizacija - cena od 250€. Besplatna analiza sajta. Dovedite svoj web sajt na prvu stranicu Google pretrage.'
          : 'Website SEO optimization for first Google position in Belgrade and Serbia. Professional SEO optimization - price from 250€. Free website analysis.'
        }
        keywords={language === 'sr'
          ? 'seo optimizacija cena, seo optimizacija sajta, cena seo optimizacije, seo optimizacija beograd, prva pozicija google, seo cena beograd'
          : 'seo optimization price, seo optimization, seo cost, website seo optimization, seo optimization belgrade'
        }
        canonicalUrl="https://aisajt.com/seo-optimizacija-cena"
        includeBusinessSchema={true}
        includeFAQSchema={true}
        faqItems={faqItems}
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

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                {/* H1 - Glavna ključna reč */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                  {language === 'sr' ? 'SEO Optimizacija Cena' : 'SEO Optimization Price'}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-4 animate-fade-in-up animation-delay-400">
                  {language === 'sr' 
                    ? 'Profesionalna optimizacija za pretraživače u Beogradu. Cena zavisi od konkurencije i ključnih reči. Besplatna analiza i transparentna ponuda.'
                    : 'Professional search engine optimization in Belgrade. Price depends on competition and keywords. Free analysis and transparent offer.'
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

        {/* Uvodni tekst - Sa strukturom */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              {language === 'sr' ? (
                <div className="space-y-12">
                  {/* Deo 1 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Šta Podrazumeva Profesionalna SEO Optimizacija?
                    </h2>
                    {/* Mobile text - shorter (30% reduction) */}
                    <p className="text-base md:hidden text-gray-700 leading-relaxed">
                      Optimizacija sajta kombinuje tehničke optimizacije, content marketing i link building. Ovo je dugoročna strategija koja zahteva planiranje i stručnost.
                    </p>
                    {/* Desktop text - full */}
                    <p className="hidden md:block text-lg text-gray-700 leading-relaxed">
                      Optimizacija sajta za pretraživače je sveobuhvatan proces koji kombinuje tehničke optimizacije, content marketing, link building i kontinuiranu analizu rezultata. Ovo nije jednokratna intervencija - već dugoročna strategija koja zahteva planiranje, strpljenje i stručnost. Profesionalni pristup znači razumevanje algoritama Google-a, ponašanja korisnika i konkurencije u vašoj industriji.
                    </p>
                  </div>

                  {/* Deo 2 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Koliko Košta SEO Optimizacija u Beogradu i Srbiji?
                    </h2>
                    {/* Mobile text - shorter (30% reduction) */}
                    <p className="text-base md:hidden text-gray-700 leading-relaxed">
                      Cena zavisi od više faktora. Osnovna usluga počinje od 250€ mesečno, napredni paketi 500€+. Nakon besplatne analize dobijate jasnu ponudu sa očekivanim rezultatima.
                    </p>
                    {/* Desktop text - full */}
                    <p className="hidden md:block text-lg text-gray-700 leading-relaxed">
                      Cena u Beogradu, Novom Sadu i širom Srbije zavisi od više faktora. Osnovna usluga počinje od 250€ mesečno, dok napredni paketi za visoko konkurentne ključne reči mogu koštati 500€+ mesečno. Važno je razumeti da cena nije fiksna - zavisi od broja ključnih reči, konkurencije, trenutnog stanja sajta i vaših ciljeva. Naš pristup je transparentan: nakon besplatne analize, dobijate jasnu ponudu sa očekivanim rezultatima i vremenskim okvirom.
                    </p>
                  </div>

                  {/* Deo 3 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Zašto Je SEO Optimizacija Sajta Neophodna za Vaš Biznis?
                    </h2>
                    {/* Mobile text - shorter (30% reduction) */}
                    <p className="text-base md:hidden text-gray-700 leading-relaxed mb-4">
                      Bez optimizacije, vaš sajt je nevidljiv. Preko 75% korisnika ne pregleda drugu stranicu Google rezultata. Ova strategija donosi ljude koji traže proizvode ili usluge koje nudite.
                    </p>
                    {/* Desktop text - full */}
                    <p className="hidden md:block text-lg text-gray-700 leading-relaxed mb-4">
                      Bez kvalitetne optimizacije za pretraživače, vaš sajt je praktično nevidljiv za potencijalne klijente. Statistika pokazuje da preko 75% korisnika nikada ne pregleda drugu stranicu Google rezultata. Ako ste na trećoj ili četvrtoj strani, šanse da vas neko pronađe su minimalne. Ova strategija donosi kvalitetan organski saobraćaj - ljude koji aktivno traže proizvode ili usluge koje vi nudite.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Povezanost između optim rangiranja na Google-u i uspešne digitalne prezentacije je ključna. Profesionalna <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-medium underline">izrada sajta</Link> sa tehničkim osnovama, zajedno sa kontinuiranom optimizacijom, stvara snažan digitalni kanal za privlačenje novih klijenata. U kombinaciji sa kvalitetnim <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">web dizajnom</Link>, vaš sajt postaje ne samo lep već i funkcionalan alat za generisanje biznisa.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      What Does Professional SEO Optimization Include?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Website SEO optimization is a comprehensive process that combines technical optimizations, content marketing, link building and continuous analysis of results. When we talk about SEO optimization, we don't mean a one-time intervention - this is a long-term strategy that requires planning, patience and expertise.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      How Much Does SEO Optimization Cost?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      SEO optimization prices depend on several factors. Basic SEO optimization starts from €250 per month, while advanced packages for highly competitive keywords can cost €500+ per month. Our approach is transparent: after a free analysis, you get a clear proposal with expected results and timeframe.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Why Is Website SEO Optimization Essential for Your Business?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Without quality SEO optimization, your website is practically invisible to potential clients. Statistics show that over 75% of users never check the second page of Google results.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Professional <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-medium underline">website development</Link> with technical SEO foundations, together with continuous optimization, creates a powerful digital channel for attracting new clients. Combined with quality <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">web design</Link>, your site becomes not only beautiful but also a functional tool for generating business.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Šta je SEO optimizacija - Long-form content sa vizuelnim elementima */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-violet-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-violet-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto scroll-animate">
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
                      {/* Mobile text - shorter (30% reduction) */}
                      <p className="text-base md:hidden text-gray-700 mb-4 leading-relaxed">
                        SEO je proces poboljšanja vidljivosti sajta u organskim rezultatima pretraživača. Niz tehničkih intervencija koje dovode do boljeg rangiranja.
                      </p>
                      
                      <p className="text-base md:hidden text-gray-700 mb-4 leading-relaxed">
                        Ovo je kontinuiran proces praćenja i prilagođavanja. Cena zavisi od konkurencije, broja ključnih reči i trenutnog stanja sajta.
                      </p>

                      <p className="text-base md:hidden text-gray-700 mb-4 leading-relaxed">
                        Paketi se kreću od 250€ do preko 1000€ mesečno. Za lokalni biznis fokus je na lokalnom targetiranju.
                      </p>

                      {/* Desktop text - full */}
                      <p className="hidden md:block text-lg text-gray-700 mb-4 leading-relaxed">
                        SEO (Search Engine Optimization) je proces poboljšanja vidljivosti vašeg web sajta u organskim rezultatima pretraživača kao što su Google, Bing i Yahoo. Mislimo na niz tehničkih i sadržajnih intervencija koje dovode do boljeg rangiranja.
                      </p>
                      
                      <p className="hidden md:block text-lg text-gray-700 mb-4 leading-relaxed">
                        Ovo nije jednokratna aktivnost - već kontinuiran proces praćenja, analiziranja i prilagođavanja. Cena zavisi od više faktora: konkurencije u vašoj industriji, broja ključnih reči koje targetirate, trenutnog stanja sajta, i vaših ciljeva.
                      </p>

                      <p className="hidden md:block text-lg text-gray-700 mb-4 leading-relaxed">
                        Paketi se kreću od 250€ do preko 1000€ mesečno, zavisno od obima posla. Za lokalni biznis u Beogradu ili Novom Sadu, fokus je često na lokalnom targetiranju, što je ekonomičnija opcija. Za kompanije koje targetiraju šire tržište, potrebna je napredna strategija koja obuhvata nacionalni ili međunarodni targeting.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        SEO optimization (Search Engine Optimization) is the process of improving your website's visibility in organic search results on search engines like Google, Bing, and Yahoo.
                      </p>
                      
                      <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                        Professional SEO optimization is not a one-time activity - it's a continuous process of monitoring, analyzing, and adjusting. SEO optimization prices range from €250 to over €1000 per month, depending on the scope of work.
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

                <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6">
                  <div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Ako vaš sajt nije na prvoj stranici Google rezultata, praktično ne postoji za potencijalne klijente. Preko 75% korisnika nikada ne pregleda drugu stranicu rezultata. Zato je ova strategija ključna - donosi kvalitetan organski saobraćaj bez stalnog plaćanja oglasa.'
                        : 'If your site is not on the first page of Google results, it practically doesn\'t exist for potential clients. Over 75% of users never check the second page of results.'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Kada ljudi traže "izrada web sajta Beograd" ili "najbolji marketing u Srbiji", vi želite da budete među prvim rezultatima. To je tačno ono što ova usluga postiže - donosi vam ljude koji već TRAŽE ono što vi nudite.'
                        : 'When people search for services you offer, you want to be among the first results. That\'s exactly what this service achieves.'
                      }
                    </p>
                  </div>
                </div>

                <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                  {language === 'sr' 
                    ? 'Organska vidljivost funkcioniše najbolje kada je integrisana od samog početka. Ako tek planirate digitalnu prezentaciju, preporučujemo da kvalitetnu '
                    : 'Organic visibility works best when integrated from the very beginning. If you\'re planning a digital presence, we recommend combining quality '
                  }
                  <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-medium underline">
                    {language === 'sr' ? 'izradu sajta' : 'website development'}
                  </Link>
                  {language === 'sr' 
                    ? ' kombinujete sa strategijom rangiranja. Tehnički dobro napravljen sajt sa osnovama olakšava kasnije optimizacije i ubrzava rezultate. Takođe, moderni '
                    : ' with a ranking strategy. A technically well-built website makes later optimizations easier. Modern '
                  }
                  <Link to="/web-dizajn" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                    {language === 'sr' ? 'web dizajn' : 'web design'}
                  </Link>
                  {language === 'sr' 
                    ? ' koji je UX-optimizovan direktno utiče na performanse kroz bolje metrike angažovanja korisnika.'
                    : ' that is UX-optimized directly affects performance through better user engagement metrics.'
                  }
                </p>

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

                {/* Team CTA - Integrisana u sekciju */}
                <TeamCTA />
              </div>
            </div>
          </div>
        </section>

        {/* Flex container za mobilni redosled */}
        <div className="flex flex-col">
        
        {/* SEO usluge koje nudimo - Carousel */}
        <ServicesCarousel language={language} />

        {/* Cena SEO optimizacije sekcija */}
        <section className="py-16 md:py-24 bg-white order-1 md:order-2">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center px-4">
                {language === 'sr' 
                  ? 'Koliko Košta?'
                  : 'How Much Does It Cost?'
                }
              </h2>

              <div className="prose prose-lg max-w-none text-center">
                {language === 'sr' ? (
                  <>
                    <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                      Cena nije fiksna - zavisi od više faktora. Obračunava se na osnovu obima posla, konkurencije u vašoj niši, broja ključnih reči, i trenutnog stanja sajta. Evo kako formiramo ponudu:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-6 h-6 text-violet-600" />
                          Basic SEO Paket
                        </h3>
                        <div className="text-3xl font-bold text-violet-600 mb-2">od 250€</div>
                        <p className="text-sm text-gray-600 mb-4">mesečno / jednokratno</p>
                        <ul className="space-y-2 text-sm text-gray-700 mb-6">
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
                        <button
                          onClick={() => {
                            trackCTAClick('Basic SEO Paket - Pricing', 'pricing_basic_seo', language);
                            navigate('/contact');
                          }}
                          className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>{language === 'sr' ? 'Zakaži Konsultaciju' : 'Schedule Consultation'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
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
                        <ul className="space-y-2 text-sm text-gray-700 mb-6">
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
                        <button
                          onClick={() => {
                            trackCTAClick('Advanced SEO Paket - Pricing', 'pricing_advanced_seo', language);
                            navigate('/contact');
                          }}
                          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>{language === 'sr' ? 'Zakaži Konsultaciju' : 'Schedule Consultation'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
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
                          <p className="text-gray-600 mt-1">Ako se natječete za visoko konkurentne ključne reči kao "izrada sajta Beograd" ili "marketing Novi Sad", potrebno je više rada i budžeta nego za nišne termine. Cena raste sa konkurencijom.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-indigo-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Trenutno stanje vašeg sajta</strong>
                          <p className="text-gray-600 mt-1">Ako web sajt već ima dobru osnovu (brz je, optimizovan, ima backlink-ove), posao košta manje. Ako sajt ima tehničke probleme ili penale, potrebno je više rada.</p>
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
        
        </div>
        {/* Kraj flex container-a */}

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

        {/* SEO i Povezane Usluge */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center px-4">
                {language === 'sr' 
                  ? 'Kompletna Digitalna Strategija'
                  : 'Complete Digital Strategy'
                }
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed text-center max-w-3xl mx-auto">
                {language === 'sr' 
                  ? 'Optimizacija za pretraživače je najefikasnija kada je deo kompletne digitalne strategije. Evo kako se investicija isplati kroz integraciju sa drugim ključnim uslugama:'
                  : 'Search engine optimization is most effective when part of a complete digital strategy. Here\'s how the investment pays off through integration with other key services:'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Izrada Sajta */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Izrada Sajta sa Osnovama' : 'Website Development with Foundations'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Najbolji rezultati dolaze kada se optimizacija planira od samog početka. Profesionalna '
                      : 'Best results come when optimization is planned from the very beginning. Professional '
                    }
                    <Link to="/izrada-sajta-cena" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                      {language === 'sr' ? 'izrada sajta' : 'website development'}
                    </Link>
                    {language === 'sr' 
                      ? ' sa tehničkim osnovama (brzo učitavanje, pravilna struktura, responzivan dizajn) olakšava kasniju optimizaciju i ubrzava rezultate. Sajt koji je tehnički solidan zahteva manje posla, što znači i nižu cenu.'
                      : ' with technical foundations makes later optimization easier and accelerates results.'
                    }
                  </p>
                  <Link 
                    to="/izrada-sajta-cena"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Saznajte o izradi sajta' : 'Learn about website development'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Web Dizajn */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Web Dizajn i Korisničko Iskustvo' : 'Web Design and User Experience'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Google rangira sajtove koji pružaju odlično korisničko iskustvo. Kvalitetan '
                      : 'Google ranks sites that provide excellent user experience. Quality '
                    }
                    <Link to="/web-dizajn" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                      {language === 'sr' ? 'web dizajn' : 'web design'}
                    </Link>
                    {language === 'sr' 
                      ? ' koji je intuitivan, brz i mobilno-optimizovan direktno utiče na performanse. Metrike kao što su bounce rate, vreme na sajtu i click-through rate su faktori rangiranja koje poboljšava dobar dizajn. Kombinacija optimizacije i profesionalnog dizajna daje najbolje rezultate.'
                      : ' that is intuitive, fast and mobile-optimized directly affects performance.'
                    }
                  </p>
                  <Link 
                    to="/web-dizajn"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Saznajte o web dizajnu' : 'Learn about web design'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* CTA Box */}
              <div className="mt-12 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-violet-200 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Kompletna Web Strategija' : 'Complete Web Strategy'}
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                  {language === 'sr' 
                    ? 'Najbolji rezultati dolaze kada kombinujete kvalitetan sajt, odličan dizajn i profesionalnu optimizaciju. Mi nudimo kompletna digitalna rešenja prilagođena vašim ciljevima i budžetu. Ova investicija se vraća kroz kontinuirani organski saobraćaj.'
                    : 'The best results come when you combine a quality site, excellent design and professional optimization.'
                  }
                </p>
                <button
                  onClick={() => {
                    trackCTAClick('Kompletna SEO Strategija - CTA', 'seo_complete_strategy', language);
                    navigate('/contact');
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <span>{language === 'sr' ? 'Zatražite Kompletnu Ponudu' : 'Request Complete Offer'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
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
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Česta Pitanja' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr' 
                  ? 'Odgovori na najčešća pitanja o ceni, procesu i rezultatima'
                  : 'Answers to the most common questions about pricing, process and results'
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
                          Koliko traje SEO optimizacija sajta do prvih rezultata?
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
                            2-4 meseca za značajne rezultate. Tehničke poboljšanja (brzina, struktura) deluju odmah.
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
                          SEO optimizacija cena - jednokratna ili mesečna usluga?
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
                            Oba. Jednokratna optimizacija za fiksnu cenu ili mesečni kontinuirani rad (content, link building).
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
                          Cena SEO optimizacije sajta za mali biznis?
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
                            Basic SEO paket od 250€ jednokratno ili 250€ mesečno za kontinuirani rad.
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
                          Da li garantujete prva pozicija Google posle SEO optimizacije?
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
                            Ne možemo garantovati jer se Google algoritam menja. Garantujemo porast pozicija i saobraćaja kroz White Hat SEO.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 5 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 4 ? null : 4)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Šta je uključeno u mesečnu SEO optimizaciju?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Mesečni paket uključuje kontinuirano praćenje pozicija, kreiranje SEO optimizovanog sadržaja, link building aktivnosti, tehničke optimizacije, analizu konkurencije i detaljne mesečne izveštaje sa preporukama. Cena zavisi od broja ključnih reči i konkurencije u vašoj industriji.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 6 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 5 ? null : 5)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Da li radite lokalni SEO za Beograd i Srbiju?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Da, specijalizovani smo za lokalnu SEO optimizaciju. Optimizujemo vaš Google My Business profil, lokalne direktorijume, i targetiramo ključne reči specifične za Beograd, Novi Sad i druge gradove u Srbiji. Lokalni SEO je često ekonomičnija i brža opcija za mala i srednja preduzeća.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 7 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 6 ? null : 6)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Mogu li dobiti SEO optimizaciju ako tek pravim sajt?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 6 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 6 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Apsolutno! To je zapravo idealno vreme da počnete sa SEO optimizacijom. Kada sajt pravimo od nule sa osnovama (tehnički SEO, pravilna struktura, optimizovane performanse), kasnija SEO optimizacija je jednostavnija i daje brže rezultate. Cena je često niža jer nema potrebe za velikim popravkama.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 8 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 7 ? null : 7)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Šta je razlika između SEO optimizacije i Google Ads oglašavanja?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            SEO optimizacija donosi organske (besplatne) rezultate na dugi rok - jednom optimizovan sajt nastavlja da privlači posetioce bez stalnih troškova. Google Ads daje trenutne rezultate ali zahteva kontinuiranu investiciju - čim prestanete da plaćate, nestaju i rezultati. SEO je dugoročna strategija sa boljim ROI, dok su Ads idealni za brze kampanje. Najbolji pristup je kombinacija oba.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 9 */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 8 ? null : 8)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Kako merite uspeh SEO optimizacije?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Pratimo nekoliko ključnih metrika: pozicije ključnih reči na Google-u, organski saobraćaj (broj posetilaca sa pretraživača), bounce rate, vreme provedeno na sajtu, broj konverzija i ROI. U mesečnim izveštajima vidite jasne brojke i grafike koji pokazuju napredak. Fokusiramo se na metrike koje direktno utiču na vaš biznis - ne samo na pozicije, već i na kvalitet saobraćaja i konverzije.
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

                    {/* FAQ 2 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 1 ? null : 1)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Is this a one-time or monthly service?
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
                            Both options are available. You can do a one-time optimization (on-page, technical) for a fixed price, or engage us monthly for continuous work (content, link building, tracking).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 3 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 2 ? null : 2)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          How much does it cost for small business?
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
                            For small businesses, we recommend the Basic SEO package starting from €250 one-time for technical optimization, or a monthly package from €250 for continuous content and link building work.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 4 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 3 ? null : 3)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Do you guarantee first position on Google?
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
                            No one can guarantee the first position as Google's algorithm constantly changes. However, we guarantee improved rankings and organic traffic growth. We only use White Hat SEO techniques that are sustainable long-term.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 5 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 4 ? null : 4)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          What's included in monthly SEO optimization?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Monthly packages include continuous position tracking, creation of SEO-optimized content, link building activities, technical optimizations, competitor analysis, and detailed monthly reports with recommendations. Price depends on the number of keywords and competition in your industry.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 6 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 5 ? null : 5)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Do you do local SEO for Belgrade and Serbia?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Yes, we specialize in local SEO optimization. We optimize your Google My Business profile, local directories, and target keywords specific to Belgrade, Novi Sad and other cities in Serbia. Local SEO is often a more economical and faster option for small and medium businesses.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 7 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 6 ? null : 6)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          Can I get SEO if I'm just building my website?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                            openFAQIndex === 6 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          openFAQIndex === 6 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                          <p className="text-gray-600 leading-relaxed">
                            Absolutely! That's actually the ideal time to start SEO. When we build a site from scratch with SEO foundations (technical SEO, proper structure, optimized performance), later SEO optimization is simpler and yields faster results. The cost is often lower because there's no need for major fixes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 8 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 7 ? null : 7)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          What's the difference between SEO and Google Ads?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            SEO brings organic (free) long-term results - once optimized, your site continues attracting visitors without ongoing costs. Google Ads provide immediate results but require continuous investment - once you stop paying, results disappear. SEO is a long-term strategy with better ROI, while Ads are ideal for quick campaigns. The best approach is combining both.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FAQ 9 - English */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQIndex(openFAQIndex === 8 ? null : 8)}
                        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                      >
                        <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                          How do you measure SEO success?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
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
                            We track several key metrics: keyword positions on Google, organic traffic (visitors from search engines), bounce rate, time on site, conversions, and ROI. Monthly reports show clear numbers and charts demonstrating progress. We focus on metrics that directly impact your business - not just rankings, but also traffic quality and conversions.
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
