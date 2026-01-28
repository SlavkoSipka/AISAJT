import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Palette, Zap, CheckCircle, ArrowRight, Award, Users, Sparkles, ShoppingCart, ChevronDown, Rocket, Monitor, Target } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { TeamCTA } from '../sections/TeamCTA';
import { FactorsCarousel } from '../sections/FactorsCarousel';
import { trackCTAClick } from '../../utils/analytics';

export function IzradaSajtaCenaPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const faqItems = language === 'sr' ? [
    {
      question: "Zašto cena izrade sajta nije fiksna?",
      answer: "Svaki biznis ima jedinstvene potrebe i ciljeve. Web shop sa 100 proizvoda zahteva mnogo više rada nego prezentacioni sajt sa 5 stranica. Zato početna cena počinje od 299€ za jednostavne projekte, a za kompleksnije pravimo personalizovanu ponudu - uvek transparentnu bez skrivenih troškova."
    },
    {
      question: "Da li izrada web sajta uključuje hosting i domen?",
      answer: "Cena izrade je odvojena od hostinga i domena. Mi pomažemo oko izbora - tipično 50-150€ godišnje."
    },
    {
      question: "Izrada sajtova sa mogućnošću dodavanja sadržaja naknadno?",
      answer: "Da! Uključuje CMS sistem - sami dodajete tekst, slike i video. Dobijate obuku."
    },
    {
      question: "Profesionalna izrada sajta van Beograda - Novi Sad, Niš?",
      answer: "Da! Radimo za klijente u Novom Sadu, Nišu, celoj Srbiji i inostranstvu. Komunikacija online - cena ista za sve."
    },
    {
      question: "Kako izgleda proces saradnje?",
      answer: "Profesionalna izrada web sajta prati jasnu strukturu: (1) Besplatna konsultacija, (2) Pisana ponuda, (3) Ugovor, (4) Dizajn faza sa revizijama, (5) Programiranje i razvoj, (6) Testiranje, (7) Lansiranje i obuka. Tokom celog procesa imate transparentan uvid."
    },
    {
      question: "Šta ako nisam zadovoljan dizajnom?",
      answer: "Proces izrade sajta uključuje više faza pregleda i revizija. Prvo kreiramo dizajn mockup, dobijamo vaš feedback, i radimo izmene dok ne budete 100% zadovoljni. Tek nakon vašeg odobrenja prelazimo na programiranje."
    },
    {
      question: "Ko je vlasnik sajta nakon izrade?",
      answer: "Vi ste 100% vlasnik sajta i svih fajlova. Dobijate pristup kod-u, hosting-u, domeni - sve je vaše. Možete ga preseliti na drugi hosting, menjati, razvijati dalje. Nema zaključavanja ili zavisnosti od nas."
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

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SEO Meta Tags */}
      <SEOHelmet
        title={language === 'sr' 
          ? 'Izrada Sajta Cena | Profesionalna Izrada Sajtova Beograd | Izrada Web Sajta'
          : 'Website Development Price | Professional Website Creation Belgrade'
        }
        description={language === 'sr'
          ? 'Izrada sajta cena od 299€. Profesionalna izrada sajtova u Beogradu, Novom Sadu i Srbiji. Transparentne cene za izradu web sajta. Besplatna konsultacija. Responzivni dizajn i SEO optimizacija.'
          : 'Website development from €299. Professional website creation in Belgrade, Novi Sad and Serbia. Transparent pricing. Free consultation.'
        }
        keywords={language === 'sr'
          ? 'izrada sajta cena, izrada sajtova, izrada web sajta, profesionalna izrada sajtova, izrada sajta beograd, cena izrade sajta'
          : 'website development price, website creation, professional web development'
        }
        canonicalUrl="https://aisajt.com/izrada-sajta-cena"
        includeBusinessSchema={true}
        includeFAQSchema={true}
        faqItems={faqItems}
      />

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              W
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2">
                  {language === 'sr' ? 'Izrada Sajta Cena' : 'Website Development Price'}
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                  {language === 'sr' 
                    ? 'Profesionalna izrada web sajta u Beogradu, Novom Sadu i celoj Srbiji. Transparentne cene za izradu sajtova - od jednostavnih prezentacionih do kompleksnih poslovnih rešenja. Bez skrivenih troškova.'
                    : 'Professional website development in Belgrade, Novi Sad and all of Serbia. Transparent pricing - from simple presentation to complex business solutions.'
                  }
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna Konsultacija - Hero', 'izrada_sajta_hero', language);
                      navigate('/contact');
                    }}
                    className="group px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">{language === 'sr' ? 'Zatražite Besplatnu Ponudu' : 'Request Free Quote'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 md:mt-12">
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">100+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Projekata' : 'Projects'}</p>
                </div>

                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">100%</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Zadovoljni' : 'Satisfied'}</p>
                </div>

                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">3+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Godina' : 'Years'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Uvodni tekst - Sa strukturom */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              {language === 'sr' ? (
                <div className="space-y-12">
                  {/* Deo 1 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Šta Podrazumeva Profesionalna Izrada Sajta?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Izrada web sajta je kompleksan proces koji objedinjuje više disciplina. Nije samo programiranje ili samo dizajn - to je strategija koja uključuje planiranje korisničkog iskustva, vizuelni identitet, tehnički razvoj i optimizaciju. Kada govorimo o ceni izrade sajta, razumevanje ovog procesa pomaže da shvatite zašto svaki projekat nosi svoju specifičnu vrednost. Profesionalna izrada sajtova u Beogradu i Srbiji znači kombinaciju stručnosti, iskustva i razumevanja vašeg biznisa.
                    </p>
                  </div>

                  {/* Deo 2 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Koliko Košta Izrada Sajta u 2025. Godini?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      U Beogradu, Novom Sadu i širom Srbije cena izrade web sajta varira u zavisnosti od kompleksnosti. Jednostavan prezentacioni sajt sa nekoliko stranica počinje od 299€, dok napredna poslovna rešenja, web aplikacije i custom platforme mogu koštati i preko 2000€. Razlika u ceni odražava razliku u funkcionalnostima, dizajnu, vremenu razvoja i nivou prilagođavanja. Zato je važno razumeti šta vam zaista treba pre nego što dobijete ponudu za izradu sajtova.
                    </p>
                  </div>

                  {/* Deo 3 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Transparentnost i Kompletna Usluga
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Naš pristup profesionalnoj izradi web sajta je transparentan - znate tačno šta plaćate i šta dobijate. Bez skrivenih troškova ili iznenađenja. Radimo sa klijentima u Beogradu, Novom Sadu i celoj Srbiji, nudeći kompletna digitalna rešenja: od inicijalne konsultacije, preko dizajna i programiranja, do lansiranja, obuke i kontinuirane podrške. Izrada sajtova nije jednokratna transakcija - to je partnerstvo fokusirano na vaš dugoročni digitalni uspeh.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Part 1 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      What Does Professional Website Development Include?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Website development is a complex process that combines multiple disciplines. It's not just programming or design - it's a strategy that includes user experience planning, visual identity, technical development and optimization. When we talk about website development pricing, understanding this process helps you grasp why each project carries its specific value. Professional website creation means a combination of expertise, experience and understanding of your business.
                    </p>
                  </div>

                  {/* Part 2 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      How Much Does Website Development Cost in 2025?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Website development prices vary depending on complexity. A simple presentation website with several pages starts from €299, while advanced business solutions, web applications and custom platforms can cost over €2000. The price difference reflects the difference in functionalities, design, development time and level of customization. That's why it's important to understand what you really need before you get a quote.
                    </p>
                  </div>

                  {/* Part 3 */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Transparency and Complete Service
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Our approach to professional website development is transparent - you know exactly what you're paying for and what you're getting. No hidden costs or surprises. We offer complete digital solutions: from initial consultation, through design and programming, to launch, training and ongoing support. Website development is not a one-time transaction - it's a partnership focused on your long-term digital success.
                    </p>
                  </div>
                </div>
              )}

              {/* Team CTA - Integrisana u sekciju */}
              <TeamCTA />
            </div>
          </div>
        </section>

        {/* Cenovnik */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/30 via-indigo-50/20 to-pink-50/30"></div>
          
          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto scroll-animate">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                  {language === 'sr' 
                    ? 'Cena Izrade Sajta - Transparentni Cenovnik'
                    : 'Website Development Price - Transparent Pricing'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Svaka cena izrade web sajta se prilagođava vašim potrebama. Evo naših startnih paketa:'
                    : 'Each website development price is tailored to your needs. Here are our starting packages:'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 scroll-animate">
                
                {/* Paket 1 */}
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-violet-600">od 299€</div>
                        <p className="text-xs text-gray-500">{language === 'sr' ? 'cena u dogovoru' : 'price negotiable'}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {language === 'sr' ? 'Jednostavan Web Sajt' : 'Simple Website'}
                    </h3>

                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {language === 'sr' 
                        ? 'Idealno za male biznise, zanatstvo i lokalne usluge u Beogradu i Srbiji.'
                        : 'Ideal for small businesses, crafts and local services.'
                      }
                    </p>
                    
                    <ul className="space-y-1.5 mb-4">
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Do 5 stranica sadržaja' : 'Up to 5 pages'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Responzivan dizajn' : 'Responsive design'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Kontakt forma' : 'Contact form'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Osnovna optimizacija' : 'Basic optimization'}</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => {
                        trackCTAClick('Jednostavan Sajt - Pricing', 'pricing_simple', language);
                        navigate('/contact');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>{language === 'sr' ? 'Zakažite Konsultaciju' : 'Schedule Consultation'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Paket 2 */}
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-2 border-indigo-400">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-4 z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">od 499€</div>
                        <p className="text-xs text-gray-500">{language === 'sr' ? 'cena u dogovoru' : 'price negotiable'}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {language === 'sr' ? 'Online Prodavnica' : 'Online Store'}
                    </h3>

                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {language === 'sr' 
                        ? 'Kompletan e-commerce sistem za online prodaju. Više detalja na '
                        : 'Complete e-commerce system. More details on '
                      }
                      <Link to="/izrada-web-shopa" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
                        {language === 'sr' ? 'izrada online prodavnice' : 'online store page'}
                      </Link>.
                    </p>
                    
                    <ul className="space-y-1.5 mb-4">
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Kompletan shop sistem' : 'Complete shop system'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Korpa i online plaćanje' : 'Cart and payment'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Admin panel' : 'Admin panel'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Prilagodljivo' : 'Customizable'}</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => {
                        trackCTAClick('Online Prodavnica - Pricing', 'pricing_shop', language);
                        navigate('/contact');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>{language === 'sr' ? 'Zakažite Konsultaciju' : 'Schedule Consultation'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Paket 3 */}
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-violet-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">od 699€</div>
                        <p className="text-xs text-gray-500">{language === 'sr' ? 'cena u dogovoru' : 'price negotiable'}</p>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {language === 'sr' ? 'Kompletna Izrada Sajta' : 'Complete Solution'}
                    </h3>

                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {language === 'sr' 
                        ? 'Za kompanije koje žele kompletan digitalni prisustvo. Napredne funkcionalnosti i custom rešenja.'
                        : 'For companies that want complete digital presence. Advanced features and custom solutions.'
                      }
                    </p>
                    
                    <ul className="space-y-1.5 mb-4">
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Neograničeno strana' : 'Unlimited pages'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Napredne funkcije' : 'Advanced features'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Custom dizajn' : 'Custom design'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Integracije' : 'Integrations'}</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => {
                        trackCTAClick('Složeni Sajt - Pricing', 'pricing_complex', language);
                        navigate('/contact');
                      }}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>{language === 'sr' ? 'Zakažite Konsultaciju' : 'Schedule Consultation'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Projekat */}
              <div className="max-w-4xl mx-auto">
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500"></div>
                  
                  <div className="relative p-6 sm:p-8 z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Rocket className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {language === 'sr' ? 'Projekat' : 'Project'}
                          </h3>
                          <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                            {language === 'sr' ? 'ZA VEĆE BIZNISE' : 'FOR BIGGER BUSINESSES'}
                          </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-violet-600 mb-3">
                          od 1899€
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {language === 'sr' 
                            ? 'Za kompanije koje trebaju napredna rešenja: custom web aplikacije, korisnički portali, napredne integracije sa eksternim sistemima, automatizacija procesa. Sve što zamislite - mi realizujemo sa punom posvetom i dugoročnom podrškom.'
                            : 'For companies that need advanced solutions: custom web applications, user portals, advanced integrations, process automation. Everything you imagine - we deliver with full dedication.'
                          }
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {language === 'sr' ? 'Web Aplikacije' : 'Web Apps'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {language === 'sr' ? 'Custom Rešenja' : 'Custom Solutions'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {language === 'sr' ? 'Integracije' : 'Integrations'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {language === 'sr' ? 'Dugoročna Podrška' : 'Long-term Support'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => {
                            trackCTAClick('Projekat - Pricing', 'pricing_complex_premium', language);
                            navigate('/contact');
                          }}
                          className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                        >
                          <span>{language === 'sr' ? 'Razgovarajmo o Projektu' : 'Let\'s Discuss'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Primer - Kompletan Sajt */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Levo - Slika */}
                <div className="order-2 md:order-1">
                  <a 
                    href="https://prestigegradnja.rs/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:border-violet-300 transition-all duration-300 hover:shadow-2xl group"
                  >
                    <img 
                      src="/images/kompletan poslovni web sajt.png" 
                      alt="Prestige Gradnja - Primer izrade kompletnog poslovnog web sajta za građevinsku kompaniju - profesionalna izrada sajta Beograd"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                      {language === 'sr' ? 'Kompletan Sajt' : 'Complete Website'}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white text-violet-600 rounded-lg font-medium text-sm shadow-xl">
                          {language === 'sr' ? 'Posetite sajt' : 'Visit website'}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Desno - Tekst */}
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {language === 'sr' ? 'Primer: Kompletan Poslovni Sajt' : 'Example: Complete Business Website'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Primer našeg rada - Prestige Gradnja, građevinska kompanija iz Beograda specijalizovana za izgradnju prestižnih stambenih objekata. Profesionalna izrada web sajta obuhvata kompletan custom dizajn, galeriju projekata, prezentaciju nekretnina, interaktivne elemente i integrisane kontakt forme. Ovakav nivo izrade sajta idealan je za kompanije koje žele vrhunsku digitalnu prezentaciju koja odražava kvalitet njihovih usluga.'
                      : 'Example of our work - Prestige Gradnja, a construction company from Belgrade specialized in building prestigious residential buildings. Professional website development includes complete custom design, project gallery, property presentation, interactive elements and integrated contact forms.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Custom dizajn' : 'Custom design'}</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Premium kvalitet' : 'Premium quality'}</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Galerija' : 'Gallery'}</span>
                  </div>
                  <a 
                    href="https://prestigegradnja.rs/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Posetite Prestige Gradnja' : 'Visit Prestige Gradnja'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Od čega zavisi cena - Carousel */}
        <FactorsCarousel language={language} />

        {/* Bonus info section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              {/* Bonus info */}
              <div className="mt-12 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-violet-200 text-center">
                <div className="flex justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Transparentna Cena - Bez Iznenađenja' : 'Transparent Price - No Surprises'}
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Nakon besplatne konsultacije dobijate detaljnu ponudu sa tačnom cenom izrade sajta. Bez skrivenih troškova, bez naknadnih doplata. Znate tačno šta plaćate i šta dobijate. To je naš pristup profesionalnoj izradi sajtova u Srbiji - transparentno, pošteno i kvalitetno.'
                    : 'After a free consultation, you receive a detailed offer with the exact price. No hidden costs, no additional charges.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Primer - Online Prodavnica */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-indigo-50/50 via-white to-pink-50/50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Levo - Tekst */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {language === 'sr' ? 'Primer: Online Prodavnica' : 'Example: Online Store'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Primer našeg rada - Custom RC Parts, profesionalna online prodavnica za RC delove i opremu. Izrada online prodavnice obuhvata kompletnu e-commerce funkcionalnost: katalog sa stotinama proizvoda, napredno filtriranje, korpa za kupovinu, integraciju plaćanja, praćenje porudžbina i moćan admin panel. Ovaj tip web shop-a idealan je za biznise koji žele da prodaju online sa profesionalnom prezentacijom proizvoda i glatkim korisničkim iskustvom.'
                      : 'Example of our work - Custom RC Parts, professional online store for RC parts and equipment. Online store development includes complete e-commerce functionality: catalog with hundreds of products, advanced filtering, shopping cart, payment integration, order tracking and powerful admin panel.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Web Shop</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Online plaćanje' : 'Online payment'}</span>
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">Admin panel</span>
                  </div>
                  <a 
                    href="https://customrc.parts/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Posetite Custom RC Parts' : 'Visit Custom RC Parts'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Desno - Slika */}
                <div>
                  <a 
                    href="https://customrc.parts/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl group"
                  >
                    <img 
                      src="/images/online prodavnica sajt.png" 
                      alt="Custom RC Parts - Primer izrade online prodavnice za RC delove - profesionalan web shop sa e-commerce funkcijama"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                      {language === 'sr' ? 'Online Prodavnica' : 'Online Store'}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium text-sm shadow-xl">
                          {language === 'sr' ? 'Posetite prodavnicu' : 'Visit store'}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kompletna usluga - povezane oblasti */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center px-4">
                {language === 'sr' 
                  ? 'Kompletno Digitalno Rešenje - Više od Obične Izrade Sajta'
                  : 'Complete Digital Solution - More Than Simple Website Development'
                }
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed text-center max-w-3xl mx-auto">
                {language === 'sr' 
                  ? 'Profesionalna izrada web sajta je samo početak. Za pravi digitalni uspeh, potrebno je integrisati dizajn, optimizaciju, marketing i kontinuiranu podršku. Evo kako naš pristup obuhvata sve aspekte:'
                  : 'Professional website development is just the beginning. For real digital success, you need to integrate design, optimization, marketing and continuous support.'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Web Dizajn */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Palette className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Profesionalan Web Dizajn' : 'Professional Web Design'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Izrada sajta počinje sa kvalitetnim dizajnom. Vizuelni identitet, korisničko iskustvo, intuitivna navigacija - sve to utiče na uspeh. Naša '
                      : 'Website development starts with quality design. Visual identity, user experience, intuitive navigation - all affect success. Our '
                    }
                    <Link to="/web-dizajn" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                      {language === 'sr' ? 'web dizajn usluga' : 'web design service'}
                    </Link>
                    {language === 'sr' 
                      ? ' kreira moderne, responzivne i konverzione dizajne prilagođene vašoj industriji. Dizajn nije samo estetika - to je strategija koja donosi rezultate.'
                      : ' creates modern, responsive and conversion-focused designs tailored to your industry.'
                    }
                  </p>
                  <Link 
                    to="/web-dizajn"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Saznajte više o web dizajnu' : 'Learn more about web design'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* SEO Optimizacija */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'SEO Optimizacija Sajta' : 'Website SEO Optimization'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Svaka izrada web sajta uključuje osnovnu tehničku pripremu, ali za pravu vidljivost na Google-u potrebna je strategija. Naša '
                      : 'Every website development includes basic technical preparation, but for real Google visibility you need strategy. Our '
                    }
                    <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
                      {language === 'sr' ? 'SEO optimizacija' : 'SEO optimization'}
                    </Link>
                    {language === 'sr' 
                      ? ' donosi organski saobraćaj, bolje pozicije i kvalitetne posetioce koji traže upravo ono što nudite. Cena SEO optimizacije se isplati kroz rast biznisa.'
                      : ' brings organic traffic, better positions and quality visitors who are looking for exactly what you offer.'
                    }
                  </p>
                  <Link 
                    to="/seo-optimizacija-cena"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Pogledajte SEO cenovnik' : 'View SEO pricing'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Održavanje i Podrška */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Monitor className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Održavanje i Tehnička Podrška' : 'Maintenance and Technical Support'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Profesionalna izrada sajtova ne završava se sa lansiranjem. Web tehnologije se razvijaju, sigurnosni standardi se menjaju, potrebe rastu. Nudimo kontinuiranu tehničku podršku, redovne backup-ove, nadogradnje sistema, brzo rešavanje problema. Cena održavanja sajta je minimalna u odnosu na vrednost koju dobijate - bezbednost, pouzdanost i mir.'
                      : 'Professional website development doesn\'t end with launch. We offer continuous technical support, regular backups, system upgrades, quick problem solving.'
                    }
                  </p>
                </div>

                {/* Online Prodavnica */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'E-Commerce Rešenja' : 'E-Commerce Solutions'}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Ako prodajete proizvode, klasična izrada sajta nije dovoljna. Potreban vam je kompletan e-commerce sistem. Naša '
                      : 'If you sell products, classic website development is not enough. You need a complete e-commerce system. Our '
                    }
                    <Link to="/izrada-web-shopa" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                      {language === 'sr' ? 'izrada online prodavnice' : 'online store development'}
                    </Link>
                    {language === 'sr' 
                      ? ' obuhvata kompletnu funkcionalnost web shop-a, integraciju plaćanja, upravljanje inventarom, automatizaciju. Cena online prodavnice zavisi od broja proizvoda i funkcionalnosti.'
                      : ' includes complete web shop functionality, payment integration, inventory management, automation.'
                    }
                  </p>
                  <Link 
                    to="/izrada-web-shopa"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Saznajte o online prodavnici' : 'Learn about online store'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* CTA Box */}
              <div className="mt-12 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-violet-200 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Kompletna Digitalna Strategija' : 'Complete Digital Strategy'}
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                  {language === 'sr' 
                    ? 'Najbolji rezultati dolaze kada kombinujete kvalitetnu izradu web sajta, profesionalan dizajn, SEO optimizaciju i kontinuiranu podršku. Mi smo tu da kreiramo kompletno digitalno rešenje prilagođeno vašim ciljevima i budžetu.'
                    : 'Best results come when you combine quality website development, professional design, SEO optimization and continuous support.'
                  }
                </p>
                <button
                  onClick={() => {
                    trackCTAClick('Kompletno Rešenje - CTA', 'complete_solution', language);
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

        {/* Zašto mi */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-white to-indigo-50/30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto scroll-animate">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
                  {language === 'sr' 
                    ? 'Zašto Odabrati Nas za Izradu Web Sajta?'
                    : 'Why Choose Us for Website Development?'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Profesionalna izrada sajtova sa fokusom na vaš uspeh'
                    : 'Professional website development focused on your success'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Benefit 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {language === 'sr' ? 'Moderne Tehnologije' : 'Modern Technologies'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {language === 'sr' 
                      ? 'Koristimo najnovije tehnologije za izradu sajtova - React, TypeScript, moderne CSS framework-e. Rezultat su brzi, sigurni i lako održivi web sajtovi koji će služiti vašem biznisu godinama.'
                      : 'We use the latest technologies - React, TypeScript, modern CSS frameworks. The result is fast, secure and easy to maintain websites.'
                    }
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {language === 'sr' ? 'Iskustvo i Portfolio' : 'Experience and Portfolio'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {language === 'sr' 
                      ? 'Preko 100 uspešnih projekata izrade web sajtova za klijente u Beogradu, Novom Sadu i celoj Srbiji. Od malih preduzeća do velikih kompanija - imamo iskustvo u različitim industrijama i razumevanje specifičnih potreba svakog biznisa.'
                      : 'Over 100 successful website development projects for clients in Belgrade, Novi Sad and all of Serbia.'
                    }
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {language === 'sr' ? 'Dugoročna Podrška' : 'Long-term Support'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {language === 'sr' 
                      ? 'Profesionalna izrada sajtova ne završava se sa lansiranjem. Nudimo kontinuiranu tehničku podršku, održavanje, nadogradnje i pomoć. Vaš uspeh je naš uspeh - zato gradimo dugoročne odnose sa klijentima.'
                      : 'Professional website development doesn\'t end with launch. We offer continuous technical support, maintenance and help.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primer - Jednostavan Sajt */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-pink-50/50 via-white to-violet-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Levo - Slika */}
                <div className="order-2 md:order-1">
                  <a 
                    href="https://bnautofolije.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:border-pink-300 transition-all duration-300 hover:shadow-2xl group"
                  >
                    <img 
                      src="/images/Jednostavan web sajt.png" 
                      alt="BN Autofolije - Primer izrade jednostavnog web sajta za zatamnjivanje stakala automobila - profesionalna izrada sajta Novi Sad"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay badge */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                      {language === 'sr' ? 'Jednostavan Sajt' : 'Simple Website'}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white text-pink-600 rounded-lg font-medium text-sm shadow-xl">
                          {language === 'sr' ? 'Posetite sajt' : 'Visit website'}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Desno - Tekst */}
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {language === 'sr' ? 'Primer: Jednostavan Web Sajt' : 'Example: Simple Website'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr' 
                      ? 'Primer našeg rada - BN Autofolije, kompanija za profesionalno zatamnjivanje stakala automobila iz Novog Sada. Izrada sajta obuhvata sve najvažnije stranice, moderan dizajn, galeriju radova, kontakt formu i osnovnu SEO optimizaciju. Ovaj tip web sajta idealan je za male biznise, zanatlije i lokalne usluge koji žele profesionalnu digitalnu prezentaciju po pristupačnoj ceni.'
                      : 'Example of our work - BN Autofolije, a professional car window tinting company from Novi Sad. Website includes all essential pages, modern design, gallery, contact form and basic SEO optimization.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">{language === 'sr' ? '5 stranica' : '5 pages'}</span>
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Responzivan' : 'Responsive'}</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Brz' : 'Fast'}</span>
                  </div>
                  <a 
                    href="https://bnautofolije.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Posetite BN Autofolije' : 'Visit BN Autofolije'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Često Postavljana Pitanja o Izradi Sajta' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr' 
                  ? 'Odgovori na najčešća pitanja o ceni i procesu izrade web sajtova'
                  : 'Answers to the most common questions about price and process'
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
                          Zašto cena izrade sajta nije fiksna?
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
                            Svaki biznis ima jedinstvene potrebe. Startna cena od 299€ za jednostavne projekte. Za složenije pravimo personalizovanu ponudu - transparentnu i bez skrivenih troškova.
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
                          Da li izrada web sajta uključuje hosting i domen?
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
                            Cena izrade je odvojena od hostinga i domena. Mi pomažemo oko izbora - tipično 50-150€ godišnje.
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
                          Izrada sajtova sa mogućnošću dodavanja sadržaja naknadno?
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
                            Da! Uključuje CMS sistem - sami dodajete tekst, slike i video. Dobijate obuku.
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
                          Profesionalna izrada sajta van Beograda - Novi Sad, Niš?
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
                            Da! Radimo za klijente u Novom Sadu, Nišu, celoj Srbiji i inostranstvu. Komunikacija online - cena ista za sve.
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
                          Kako izgleda proces saradnje?
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
                            Profesionalna izrada web sajta prati jasnu strukturu: (1) Besplatna konsultacija gde razgovaramo o ciljevima, (2) Pisana ponuda sa tačnom cenom i planom, (3) Ugovor i početak projekta, (4) Dizajn faza sa revizijama, (5) Programiranje i razvoj, (6) Testiranje, (7) Lansiranje i obuka. Tokom celog procesa imate transparentan uvid u napredak i mogućnost feedback-a.
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
                          Šta ako nisam zadovoljan dizajnom?
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
                            Proces izrade sajta uključuje više faza pregleda i revizija. Prvo kreiramo dizajn mockup, dobijamo vaš feedback, i radimo izmene dok ne budete 100% zadovoljni. Tek nakon vašeg odobrenja prelazimo na programiranje. Nema iznenađenja - sve vidite i odobravate pre nego što postane finalno. To je naš pristup profesionalnoj izradi sajtova.
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
                          Ko je vlasnik sajta nakon izrade?
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
                            Vi ste 100% vlasnik sajta i svih fajlova. Dobijate pristup kod-u, hosting-u, domeni - sve je vaše. Možete ga preseliti na drugi hosting, menjati, razvijati dalje. Nema zaključavanja ili zavisnosti od nas. Profesionalna izrada web sajtova znači da radimo za vas, a vi ste vlasnik svega što kreiramo.
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
                          Why isn't the website development price fixed?
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
                            Every business has unique needs and goals. A web shop with 100 products and warehouse integration requires much more work than a 5-page presentation site. That's why the starting price begins at €299 for simple projects, and for more complex ones we create a personalized offer - always transparent with no hidden costs. Professional website development means adapting to your specific needs, not one-size-fits-all solutions.
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
                          Does the price include hosting and domain?
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
                            Website development price is separate from annual hosting and domain costs. Hosting is the space where your site "lives" on the internet, and the domain is your address (e.g., yourcompany.com). We help you choose quality hosting and register a domain - you can pay directly or through us. Typically, hosting and domain for a small to medium site cost €50-150 per year.
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
                          Can I add new pages and content later?
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
                            Absolutely! Every professional website development includes an easy content management system (CMS). You can add, change and delete text, images, videos and other content yourself. You'll receive complete training on how to do this. For more complex changes (adding new functionalities, design changes), we're here to help at a reasonable price.
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
                          Do you work with clients worldwide?
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
                            Yes! We develop websites for clients worldwide. All communication is done online (video calls, Slack, email), so physical location is not a barrier to quality collaboration. The website development price remains the same regardless of where you are located.
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
                          What does the collaboration process look like?
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
                            Professional website development follows a clear structure: (1) Free consultation where we discuss goals, (2) Written proposal with exact price and plan, (3) Contract and project start, (4) Design phase with revisions, (5) Programming and development, (6) Testing, (7) Launch and training. Throughout the process you have transparent insight into progress and the ability to provide feedback.
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
                          What if I'm not satisfied with the design?
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
                            The website development process includes multiple review and revision phases. First we create a design mockup, get your feedback, and make changes until you're 100% satisfied. Only after your approval do we proceed with programming. No surprises - you see and approve everything before it becomes final. That's our approach to professional website development.
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
                          Who owns the website after development?
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
                            You are 100% the owner of the website and all files. You get access to the code, hosting, domain - everything is yours. You can move it to another host, modify it, develop it further. No lock-in or dependency on us. Professional website development means we work for you, and you own everything we create.
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
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-violet-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                {language === 'sr' 
                  ? 'Spremni za Izradu Vašeg Web Sajta?'
                  : 'Ready for Your Website Development?'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {language === 'sr' 
                  ? 'Zakažite besplatnu konsultaciju i dobijte personalizovanu ponudu za izradu sajta.'
                  : 'Schedule a free consultation and get a personalized quote.'
                }
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    trackCTAClick('Final CTA', 'izrada_sajta_final', language);
                    navigate('/contact');
                  }}
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
                >
                  {language === 'sr' ? 'Zakažite Konsultaciju' : 'Schedule Consultation'}
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
                  ? '✨ Odgovaramo u roku od 24h'
                  : '✨ We respond within 24h'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Links */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center scroll-animate">
              <p className="text-gray-600 mb-4">
                {language === 'sr' 
                  ? 'Pogledajte i druge usluge:'
                  : 'Check out our other services:'
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  to="/seo-optimizacija-cena"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                </Link>
                <Link 
                  to="/web-dizajn"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </Link>
                <Link 
                  to="/izrada-web-shopa"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Online Prodavnica' : 'Online Store'}
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
