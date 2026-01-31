import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palette, Layout, Sparkles, CheckCircle, ArrowRight, Award, Users, Zap, Globe, Smartphone, ChevronDown, Layers, Eye, Target, Code, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { TeamCTA } from '../sections/TeamCTA';
import { ConsultationCTA } from '../sections/ConsultationCTA';
import { trackCTAClick } from '../../utils/analytics';

export function WebDizajnPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const faqItems = language === 'sr' ? [
    {
      question: "Koliko traje proces web dizajna?",
      answer: "Landing page dizajn traje 5-7 dana. Kompletan web dizajn (do 10 stranica) traje 2-3 nedelje. Vreme zavisi od broja revizija i brzine vašeg feedbacka."
    },
    {
      question: "Da li radite i development ili samo dizajn?",
      answer: "Radimo i dizajn i development! Možete naručiti samo web dizajn (dobijate Figma fajlove), ili kompletan paket dizajn + development (dobijate gotov funkcionalan sajt)."
    },
    {
      question: "Koliko revizija je uključeno u cenu?",
      answer: "Landing page paket uključuje 2 runde revizija. Kompletan web dizajn paket uključuje neograničene revizije tokom trajanja projekta. Želimo da budete 100% zadovoljni!"
    },
    {
      question: "Da li mogu da vidim primere vašeg rada?",
      answer: "Naravno! Tokom besplatne konsultacije pokazujemo portfolio sa prethodnim projektima. Možemo vam pokazati i case studies sa rezultatima (konverzije, bounce rate, itd.)."
    }
  ] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SEO Meta Tags - OPTIMIZOVANO za ključne reči */}
      <SEOHelmet
        title={language === 'sr' 
          ? 'Web Dizajn Cena | Profesionalan Web Dizajn Beograd | Dizajn Sajta'
          : 'Web Design Price | Professional Web Design Belgrade | Website Design'
        }
        description={language === 'sr'
          ? 'Profesionalan web dizajn po najpovoljnijoj ceni u Beogradu i Srbiji. Moderni, responzivni web dizajn prilagođen vašem brendu. Dizajn sajta od 350€. Besplatna konsultacija za web dizajn projekat.'
          : 'Professional web design at the best price in Belgrade and Serbia. Modern, responsive web design tailored to your brand. Website design from €350. Free consultation.'
        }
        keywords={language === 'sr'
          ? 'web dizajn, web dizajn cena, web dizajn beograd, dizajn sajta, dizajn web stranice, profesionalan web dizajn'
          : 'web design, web design price, web design belgrade, web design serbia, website design'
        }
        canonicalUrl="https://aisajt.com/web-dizajn"
        includeBusinessSchema={true}
        includeFAQSchema={true}
        faqItems={faqItems}
      />

      <Navbar />

      <main id="main-content">
        {/* Hero Section - H1 sa glavnom ključnom rečju */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-pink-50/30 to-white"></div>
          
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-violet-400 to-pink-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-rose-300 to-violet-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Giant Background Letter "W" - Hidden on small mobile */}
          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-rose-500 to-violet-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              W
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                {/* H1 - Glavna ključna reč - SAMO JEDAN H1 NA STRANICI */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-4 animate-fade-in-up animation-delay-400">
                  {language === 'sr' 
                    ? 'Dizajniramo digitalna iskustva koja ostavljaju utisak. Svaki piksel ima svrhu, svaka boja priča priču, svaki element vodi ka cilju. Web dizajn koji ne samo da izgleda dobro, već i radi ono što treba - konvertuje, angažuje, i raste sa vašim biznisom.'
                    : 'We design digital experiences that leave an impression. Every pixel has a purpose, every color tells a story, every element leads to a goal. Web design that not only looks good, but does what it should - converts, engages, and grows with your business.'
                  }
                </p>

                {/* CTA Button */}
                <div className="flex justify-center animate-fade-in-up animation-delay-600">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna Web Dizajn Konsultacija', 'web_dizajn_hero', language);
                      navigate('/contact');
                    }}
                    className="group px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Palette className="w-5 h-5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">{language === 'sr' ? 'Zakažite Besplatnu Konsultaciju' : 'Schedule Free Consultation'}</span>
                    <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Stats - Minimalist Design */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 md:mt-12 animate-fade-in-up animation-delay-800">
                {/* Stat 1 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">40+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Dizajniranih Sajtova' : 'Designed Sites'}</p>
                </div>

                {/* Stat 2 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-rose-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">40+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Zadovoljnih Klijenata' : 'Happy Clients'}</p>
                </div>

                {/* Stat 3 */}
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">3+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Godine Iskustva' : 'Years Experience'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filozofija i Pristup - Kreativnija sekcija */}
        <section className="py-10 md:py-24 bg-white relative overflow-visible">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 md:mb-16">
                <p className="text-pink-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                  {language === 'sr' ? 'Profesionalan Web Dizajn' : 'Professional Web Design'}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4 leading-tight">
                  {language === 'sr' 
                    ? 'Web Dizajn Srbija - Moderni Dizajn Za Vaš Brend'
                    : 'Web Design Serbia - Modern Design For Your Brand'
                  }
                </h2>
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                  {language === 'sr' ? (
                    <>
                      Profesionalan web dizajn u Beogradu i Srbiji nije samo vizuelna dekoracija - to je strateško oružje koje transformiše posetioce u kupce. Naš web dizajn pristup kombinuje estetiku, funkcionalnost i{' '}
                      <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                        SEO optimizaciju
                      </Link>{' '}
                      za maksimalne rezultate.
                    </>
                  ) : (
                    <>
                      Professional web design in Belgrade and Serbia is not just visual decoration - it's a strategic weapon that transforms visitors into customers. Our approach combines aesthetics, functionality and{' '}
                      <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                        SEO optimization
                      </Link>{' '}
                      for maximum results.
                    </>
                  )}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-16 items-center mb-10 md:mb-20">
                {/* Left - Image sa kreativnim layoutom */}
                <div className="relative order-2 md:order-1">
                  {/* Main image */}
                  <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img 
                      src="/images/dizajn/free-web-design-inspiration-sites.webp" 
                      alt={language === 'sr' ? 'Web dizajn showcase Srbija - primer modernog UI dizajna' : 'Web design showcase Serbia - modern UI design example'} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Floating element - slika detalja izlazi iz okvira */}
                  <div className="absolute -right-8 -bottom-8 md:-right-12 md:-bottom-12 w-48 h-48 md:w-64 md:h-64 rounded-3xl shadow-xl z-20 overflow-hidden">
                    <img 
                      src="/images/dizajn/free-web-design-inspiration-sites.jpg" 
                      alt={language === 'sr' ? 'Web dizajn detalji - kreativni elementi web dizajna' : 'Web design details - creative web design elements'} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Background decorative */}
                  <div className="absolute -left-8 -top-8 w-32 h-32 bg-violet-200/50 rounded-full blur-2xl"></div>
                </div>

                {/* Right - Content */}
                <div className="order-1 md:order-2">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-gray-900 mb-2">
                          {language === 'sr' ? 'Vizuelna Priča' : 'Visual Story'}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {language === 'sr'
                            ? 'Svaki web dizajn započinje sa pričom. Ko ste vi? Šta nudite? Zašto bi neko trebalo da vam veruje? Odgovori na ova pitanja oblikuju svaki piksel, boju, i font koji koristimo. Web dizajn nije šablon - to je personalizovano iskustvo koje odražava DNK vašeg brenda.'
                            : 'Every web design starts with a story. Who are you? What do you offer? Why should someone trust you? The answers shape every pixel, color, and font we use.'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-gray-900 mb-2">
                          {language === 'sr' ? 'Strategija Konverzije' : 'Conversion Strategy'}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {language === 'sr'
                            ? 'Lep sajt je besmislen ako ne konvertuje. Mi dizajniramo sa konverzijom u glavi od prvog dana - gde ide pogled korisnika, gde klikće, gde će odustati. Svaki CTA button, svaka forma, svaka sekcija je strateški postavljena. To je razlika između "lepog sajta" i sajta koji donosi profit.'
                            : 'A beautiful site is meaningless if it doesn\'t convert. We design with conversion in mind from day one. That\'s the difference between a "pretty site" and a site that brings profit.'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-gray-900 mb-2">
                          {language === 'sr' ? 'Performanse i Brzina' : 'Performance i Speed'}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          {language === 'sr'
                            ? 'Google rangira brze sajtove bolje. Korisnici napuštaju spore sajtove. Mi optimizujemo svaki dizajn za maksimalnu brzinu - kompresovane slike, efikasan kod, lazy loading, CDN. Web dizajn koji ne samo lepo izgleda, već se i momentalno učitava na svim uređajima.'
                            : 'Google ranks fast sites better. Users abandon slow sites. We optimize every design for maximum speed.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats bar - Mobile optimized */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-gradient-to-r from-pink-50 via-rose-50 to-violet-50 rounded-2xl md:rounded-3xl p-4 md:p-12 border border-pink-100">
                <div className="text-center">
                  <div className="text-2xl md:text-5xl font-bold text-pink-600 mb-1 md:mb-2">75%</div>
                  <p className="text-xs md:text-base text-gray-600 leading-tight">
                    {language === 'sr' ? 'Kredibilitet na osnovu dizajna' : 'Credibility based on design'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-5xl font-bold text-rose-600 mb-1 md:mb-2">0.05s</div>
                  <p className="text-xs md:text-base text-gray-600 leading-tight">
                    {language === 'sr' ? 'Prvi utisak' : 'First impression'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-5xl font-bold text-violet-600 mb-1 md:mb-2">88%</div>
                  <p className="text-xs md:text-base text-gray-600 leading-tight">
                    {language === 'sr' ? 'Ne vraća se posle lošeg UX' : 'Won\'t return'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-5xl font-bold text-purple-600 mb-1 md:mb-2">200%</div>
                  <p className="text-xs md:text-base text-gray-600 leading-tight">
                    {language === 'sr' ? 'ROI dizajna' : 'Design ROI'}
                  </p>
                </div>
              </div>

              {/* Team CTA - Integrisana u sekciju */}
              <TeamCTA />
            </div>
          </div>
        </section>

        {/* Web Dizajn usluge koje nudimo */}
        <section className="py-10 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 via-rose-50/20 to-violet-50/30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4 leading-tight">
                  {language === 'sr' 
                    ? 'Web Dizajn Usluge Beograd - Kompletan Pristup'
                    : 'Web Design Services Belgrade - Complete Approach'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Profesionalan web dizajn u Srbiji prilagođen vašim potrebama - od UI/UX dizajna do kompletnog brending-a i razvoja web sajta'
                    : 'Professional web design in Serbia tailored to your needs - from UI/UX design to complete branding and website development'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Service 1 - UI/UX Design */}
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Layout className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'UI/UX Dizajn' : 'UI/UX Design'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Dizajniramo interfejs koji je intuitivan, lep, i vodi korisnike ka cilju. Fokus na korisničko iskustvo.'
                        : 'We design interfaces that are intuitive, beautiful, and guide users to the goal. Focus on user experience.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Wireframes i Mockups' : 'Wireframes i Mockups'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'User Flow Optimizacija' : 'User Flow Optimization'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 2 - Responsive Design */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-violet-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Responsive Dizajn' : 'Responsive Design'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Vaš sajt savršeno izgleda na svim uređajima - desktop, tablet, mobilni. Mobile-first pristup.'
                        : 'Your site looks perfect on all devices - desktop, tablet, mobile. Mobile-first approach.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Mobile-first dizajn' : 'Mobile-first design'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Testiranje na svim uređajima' : 'Testing on all devices'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Optimizovano za touch' : 'Touch optimized'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 3 - Branding i Identitet */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Branding i Identitet' : 'Branding i Identity'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Kreiramo vizuelni identitet koji odražava vaš brend - boje, tipografija, logo, grafički elementi.'
                        : 'We create a visual identity that reflects your brand - colors, typography, logo, graphic elements.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Color palette i tipografija' : 'Color palette i typography'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Logo dizajn (opciono)' : 'Logo design (optional)'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 4 - Landing Page Dizajn */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-violet-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Landing Page Dizajn' : 'Landing Page Design'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Dizajn stranica optimizovanih za konverziju - za kampanje, proizvode, ili lead generation.'
                        : 'Design of pages optimized for conversion - for campaigns, products, or lead generation.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Conversion-focused dizajn' : 'Conversion-focused design'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'A/B testing spremno' : 'A/B testing ready'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 5 - E-commerce Dizajn */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'E-commerce Dizajn' : 'E-commerce Design'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Dizajn online prodavnica koji olakšava kupovinu i povećava prodaju. Optimizovan checkout proces.'
                        : 'Online store design that makes shopping easy and increases sales. Optimized checkout process.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Product page optimizacija' : 'Product page optimization'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Shopping cart i checkout' : 'Shopping cart i checkout'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Service 6 - Redesign Postojećeg Sajta */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-rose-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative p-4 sm:p-6 z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-rose-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {language === 'sr' ? 'Redesign Sajta' : 'Website Redesign'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {language === 'sr' 
                        ? 'Osvežavamo stari dizajn i donosimo ga u 2025. Moderni izgled, bolje performanse, više konverzija.'
                        : 'We refresh old design and bring it to 2025. Modern look, better performance, more conversions.'
                      }
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Analiza postojećeg sajta' : 'Existing site analysis'}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{language === 'sr' ? 'Moderni dizajn trendovi' : 'Modern design trends'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Showcase - Kreativna galerija sa slikama */}
        <section className="py-10 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-visible">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 md:mb-16">
                <p className="text-rose-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                  {language === 'sr' ? 'Web Dizajn Portfolio' : 'Web Design Portfolio'}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4 leading-tight">
                  {language === 'sr' 
                    ? 'Web Dizajn Projekti - Od Ideje do Realizacije'
                    : 'Web Design Projects - From Idea to Realization'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Naš web dizajn portfolio obuhvata sve - od minimalistički elegantnih landing page-a do kompleksnih e-commerce platformi. Svaki web dizajn projekat u Beogradu i Srbiji je priča o transformaciji ideje u profitabilno digitalno iskustvo.'
                    : 'Our web design portfolio includes everything - from minimalist elegant landing pages to complex e-commerce platforms.'
                  }
                </p>
              </div>

              {/* Grid Layout - 3 slike */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Slika 1 */}
                <div className="relative group">
                  <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[16/9] relative">
                    <img 
                      src="/images/dizajn/maxresdefault.jpg" 
                      alt={language === 'sr' ? 'Web dizajn inspiracija Srbija Beograd - moderni trendovi u web dizajnu 2025' : 'Web design inspiration Serbia Belgrade - modern web design trends 2025'} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Floating badge */}
                    <div className="absolute -top-4 -right-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl shadow-xl z-10 rotate-3">
                      <p className="font-bold text-sm">Featured</p>
                    </div>
                  </div>
                </div>

                {/* Slika 2 */}
                <div className="relative group">
                  <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[16/9] relative">
                    <img 
                      src="/images/dizajn/minimaliostic web dizajn.jpg" 
                      alt={language === 'sr' ? 'Minimalistički web dizajn Beograd - landing page web dizajn optimizovan za konverziju' : 'Minimalist web design Belgrade - landing page web design optimized for conversion'} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Slika 3 */}
                <div className="relative group">
                  <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[16/9] relative">
                    <img 
                      src="/images/dizajn/dizajn3.png" 
                      alt={language === 'sr' ? 'Moderni web dizajn Srbija - najbolje prakse i primeri web dizajna u Beogradu' : 'Modern web design Serbia - best practices and web design examples in Belgrade'} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Rezultati web dizajna - umesto testimonial */}
              <div className="mt-10 md:mt-20 relative">
                <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-violet-50 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-pink-100 relative overflow-hidden">
                  {/* Decorative element - izlazi iz okvira */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-3xl opacity-30"></div>
                  
                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="flex justify-center mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-base md:text-xl lg:text-2xl text-gray-900 font-medium italic mb-4 md:mb-6 leading-relaxed px-2">
                      {language === 'sr' 
                        ? '"Profesionalan web dizajn transformisao je naš biznis. Konverzije su porasle 4x, a klijenti u Beogradu i širom Srbije nas hvale kako sajt izgleda moderno i funkcioniše besprekorno!"'
                        : '"Professional web design transformed our business. Conversions increased 4x, and clients in Belgrade and across Serbia praise how modern the site looks and works flawlessly!"'
                      }
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {language === 'sr' ? '- Zadovoljan klijent, E-commerce Industrija' : '- Satisfied client, E-commerce Industry'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation CTA - Integrisana u sekciju */}
              <ConsultationCTA topic={language === 'sr' ? 'web dizajnu' : 'web design'} />
            </div>
          </div>
        </section>

        {/* Naš Pristup - umesto cene */}
        <section className="py-10 md:py-24 bg-white relative overflow-visible">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 md:mb-16">
                <p className="text-violet-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                  {language === 'sr' ? 'Kako Radimo' : 'How We Work'}
                </p>
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4 leading-tight">
                  {language === 'sr' 
                    ? 'Web Dizajn Cena i Proces - Transparentno i Efikasno'
                    : 'Web Design Price and Process - Transparent and Efficient'
                  }
                </h2>
                <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                  {language === 'sr'
                    ? 'Naš web dizajn proces u Beogradu počinje sa strategijom, ne šablonima. Cena web dizajna zavisi od kompleksnosti projekta, ali jedna stvar je sigurna - svaki piksel ima svrhu. Web dizajn Srbija ne mora biti skup da bi bio efektan - mi se zalažemo za transparentnost i rezultate.'
                    : 'Our web design process in Belgrade starts with strategy, not templates. Web design price depends on project complexity.'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mb-10 md:mb-20">
                {/* Image - kreativno pozicionirana */}
                  <div className="relative order-2 md:order-1">
                  <div className="relative">
                    {/* Main card */}
                    <div className="rounded-2xl md:rounded-3xl shadow-2xl aspect-square overflow-hidden relative">
                      <img 
                        src="/images/dizajn/web dizajn.webp" 
                        alt={language === 'sr' ? 'Web dizajn proces Srbija Beograd - od wireframe-a do finalnog dizajna, profesionalan web dizajn workflow' : 'Web design process Serbia Belgrade - from wireframe to final design, professional web design workflow'} 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Floating card - izlazi iz okvira */}
                    <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl w-36 md:w-48 z-10">
                      <div className="text-white">
                        <p className="text-2xl md:text-3xl font-bold mb-1">100%</p>
                        <p className="text-xs md:text-sm opacity-90">
                          {language === 'sr' ? 'Custom dizajn' : 'Custom design'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 md:order-2 space-y-5 md:space-y-8">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm md:text-base">01</span>
                      </div>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {language === 'sr' ? 'Razumevanje Brenda' : 'Understanding the Brand'}
                      </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-10 md:pl-13">
                      {language === 'sr' ? (
                        <>
                          Pre nego što otvorimo Figmu, razgovaramo. Ko ste vi? Šta vas čini različitim? Ko su vaši konkurenti? Ovi odgovori oblikuju svaki aspekt dizajna. Naš{' '}
                          <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                            SEO optimizovan web dizajn
                          </Link>{' '}
                          počinje sa strategijom, ne sa šablonima.
                        </>
                      ) : (
                        <>
                          Before we open Figma, we talk. Who are you? What makes you different? These answers shape every aspect of our{' '}
                          <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                            SEO-optimized web design
                          </Link>.
                        </>
                      )}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm md:text-base">02</span>
                      </div>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {language === 'sr' ? 'UX Pre Estetike' : 'UX Before Aesthetics'}
                      </p>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed pl-10 md:pl-13">
                      {language === 'sr'
                        ? 'Lep sajt koji je zbunjujuć je beskoristan. Mi prvo dizajniramo user flow - kako korisnik navigira, gde klikće, šta vidi prvo. Tek onda dodajemo vizuelni sloj. Rezultat? Dizajn koji izgleda dobro I funkcioniše savršeno. Web dizajn u Beogradu često zanemaruje UX - mi ga stavljamo na prvo mesto.'
                        : 'A beautiful site that\'s confusing is useless. We first design the user flow, then add the visual layer. Result? Design that looks good AND works perfectly.'
                      }
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm md:text-base">03</span>
                      </div>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">
                        {language === 'sr' ? 'Iteracija i Testiranje' : 'Iteration i Testing'}
                      </p>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed pl-10 md:pl-13">
                      {language === 'sr'
                        ? 'Dizajn nije jednokratan proces. Kreiramo, testiramo, iteriramo. Gledamo heat mape, analiziramo bounce rate, pratimo konverzije. Šta radi? Šta ne radi? Na osnovu podataka, optimizujemo. Web dizajn je živi organizam koji se konstantno poboljšava na osnovu stvarnog ponašanja korisnika.'
                        : 'Design is not a one-time process. We create, test, iterate. What works? What doesn\'t? Based on data, we optimize.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Dodatni tekst za SEO + vizuelni element */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200 relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-violet-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'sr' 
                      ? 'Web Dizajn Beograd - Zašto Je Kvalitetan Dizajn Investicija?'
                      : 'Web Design Belgrade - Why Is Quality Design an Investment?'}
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Povećane Konverzije' : 'Increased Conversions'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'sr' 
                          ? 'Dobro dizajniran sajt konvertuje 2-3x bolje od proseka. To znači više prodaja, više upita, više klijenata.'
                          : 'Well-designed sites convert 2-3x better than average.'
                        }
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Kredibilitet Brenda' : 'Brand Credibility'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'sr' 
                          ? 'Profesionalan dizajn gradi poverenje. 75% ljudi sudi kredibilnost kompanije na osnovu dizajna sajta.'
                          : '75% of people judge company credibility based on site design.'
                        }
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'SEO Prednost' : 'SEO Advantage'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'sr'
                          ? 'Google preferira brze, responsive sajtove. Dobar web dizajn direktno utiče na SEO rangiranje.'
                          : 'Google prefers fast, responsive sites. Good design directly affects SEO ranking.'
                        }
                      </p>
                    </div>
                  </div>

                  <p className="text-center text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    {language === 'sr' ? (
                      <>
                        Profesionalan web dizajn u Srbiji i Beogradu nije luksuz - to je konkurentska prednost. U digitalnom svetu gde prvi utisak traje 50 milisekundi, kvalitetan dizajn razlikuje lidere od pratilaca. Kada kombinujete odličan dizajn sa profesionalnom{' '}
                        <Link to="/izrada-sajta-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          izradom web sajta
                        </Link>{' '}
                        i{' '}
                        <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          SEO optimizacijom
                        </Link>, investicija se vraća kroz bolje konverzije, jači brend, i dugoročan rast.
                      </>
                    ) : (
                      <>
                        Professional web design is not a luxury - it's a competitive advantage. When you combine excellent design with professional{' '}
                        <Link to="/izrada-sajta-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          website development
                        </Link>{' '}
                        and{' '}
                        <Link to="/seo-optimizacija-cena" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                          SEO optimization
                        </Link>, the investment pays off through better conversions, stronger brand, and long-term growth.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Povezane Usluge - 2 Kartice */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 px-4">
                  {language === 'sr'
                    ? 'Kompletna Digitalna Rešenja'
                    : 'Complete Digital Solutions'
                  }
                </h2>
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Web dizajn je samo prvi korak. Kombinujte ga sa profesionalnom izradom sajta i SEO optimizacijom za maksimalne rezultate.'
                    : 'Web design is just the first step. Combine it with professional website development and SEO optimization for maximum results.'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Kartica 1 - Izrada Sajta */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Profesionalna izrada web sajta koja pretvara vaš dizajn u funkcionalan, brz i siguran digitalni proizvod.'
                      : 'Professional website development that turns your design into a functional, fast and secure digital product.'
                    }
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'React, Next.js, Node.js' : 'React, Next.js, Node.js'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'Responzivan i brz sajt' : 'Responsive and fast site'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'CMS i Admin panel' : 'CMS and Admin panel'}</span>
                    </li>
                  </ul>

                  <Link
                    to="/izrada-sajta-cena"
                    className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all duration-300"
                  >
                    {language === 'sr' ? 'Saznajte Više' : 'Learn More'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Kartica 2 - SEO Optimizacija */}
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
                      ? 'SEO optimizacija donosi organski saobraćaj i visoke pozicije na Google-u. Budite vidljivi kada vas klijenti traže.'
                      : 'SEO optimization brings organic traffic and high Google rankings. Be visible when clients search for you.'
                    }
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'Keyword research' : 'Keyword research'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'On-page i tehnički SEO' : 'On-page and technical SEO'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{language === 'sr' ? 'Link building strategija' : 'Link building strategy'}</span>
                    </li>
                  </ul>

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

        {/* Zašto izabrati nas za Web Dizajn */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50/40 via-white to-rose-50/30"></div>
          
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4">
                  {language === 'sr' 
                    ? 'Web Dizajn Srbija - Zašto Izabrati Nas?'
                    : 'Web Design Serbia - Why Choose Us?'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr' 
                    ? 'Profesionalan web dizajn Beograd sa fokusom na rezultate - kreativan pristup, tehnička ekspertiza, i transparentna web dizajn cena'
                    : 'Professional web design Belgrade with focus on results - creative approach, technical expertise, and transparent pricing'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Benefit 1 */}
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Decorative circle */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <Eye className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {language === 'sr' ? 'Moderni Dizajn Trendovi' : 'Modern Design Trends'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Pratimo najnovije dizajn trendove i best practices. Vaš sajt neće izgledati zastarelo ni za 2-3 godine.'
                        : 'We follow the latest design trends and best practices. Your site won\'t look outdated even in 2-3 years.'
                      }
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-rose-400/10 to-violet-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-violet-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'sr' ? 'Conversion-Focused' : 'Conversion-Focused'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Ne dizajniramo samo "lep sajt" - dizajniramo sajt koji konvertuje posetioce u klijente. Svaki element ima svrhu.'
                        : 'We don\'t just design a "pretty site" - we design a site that converts visitors into clients. Every element has a purpose.'
                      }
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                      <Code className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'sr' ? 'Dizajn + Razvoj' : 'Design + Development'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'sr' 
                        ? 'Radimo i dizajn i development - znamo šta je tehnički izvodljivo i optimizujemo dizajn za performanse.'
                        : 'We do both design and development - we know what\'s technically feasible and optimize design for performance.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proces Web Dizajna - Visual Timeline */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-pink-50/30 relative overflow-hidden">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center px-4">
                {language === 'sr' 
                  ? 'Kako Radimo na Vašem Web Dizajnu?'
                  : 'How Do We Work on Your Web Design?'
                }
              </h2>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="group bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border-l-4 border-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {language === 'sr' ? 'Besplatna Konsultacija i Brief' : 'Free Consultation i Brief'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr'
                          ? 'Razgovaramo o vašim ciljevima, ciljnoj grupi, konkurenciji, i željenom stilu. Definišemo scope projekta - od dizajna do razvoja i cene web dizajna.'
                          : 'We discuss your goals, target audience, competition, and desired style. We define project scope - from design to development and web design price.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-rose-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Wireframes i Struktura' : 'Wireframes i Structure'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Kreiramo wireframes (skice) koje pokazuju strukturu stranica i user flow. Odobravate layout pre nego što krenemo sa vizuelnim dizajnom.'
                          : 'We create wireframes (sketches) that show page structure and user flow. You approve layout before we start visual design.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-violet-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Vizuelni Dizajn i Mockups' : 'Visual Design i Mockups'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Dizajniramo finalni izgled - boje, tipografija, slike, ikone, animacije. Dobijate high-fidelity mockups za pregled.'
                          : 'We design the final look - colors, typography, images, icons, animations. You get high-fidelity mockups for review.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Revizije i Finalizacija' : 'Revisions i Finalization'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Radimo revizije na osnovu vašeg feedbacka. Finalizujemo dizajn i pripremamo sve fajlove za development.'
                          : 'We make revisions based on your feedback. We finalize design and prepare all files for development.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="group bg-white rounded-2xl p-6 md:p-8 border-l-4 border-rose-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      5
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'sr' ? 'Handoff i Podrška' : 'Handoff i Support'}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'sr' 
                          ? 'Predajemo dizajn developerima (ili radimo i development ako je u paketu). Pružamo podršku i nakon isporuke.'
                          : 'We hand off design to developers (or do development if included in package). We provide support even after delivery.'
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
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-violet-400 to-pink-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Web Dizajn Cena i FAQ - Najčešća Pitanja' : 'Web Design Price and FAQ - Common Questions'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr' 
                  ? 'Sve što treba da znate o web dizajnu u Beogradu i Srbiji - od cene web dizajna do procesa izrade i rokova'
                  : 'Everything you need to know about web design in Belgrade and Serbia - from pricing to process and deadlines'
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
                          Koliko traje proces web dizajna?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Landing page dizajn traje 5-7 dana. Kompletan web dizajn (do 10 stranica) traje 2-3 nedelje. Vreme zavisi od broja revizija i brzine vašeg feedbacka.
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
                          Da li radite i development ili samo dizajn?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Radimo i dizajn i development! Možete naručiti samo web dizajn (dobijate Figma fajlove), ili kompletan paket dizajn + development (dobijate gotov funkcionalan sajt).
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
                          Koliko revizija je uključeno u cenu?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Landing page paket uključuje 2 runde revizija. Kompletan web dizajn paket uključuje neograničene revizije tokom trajanja projekta. Želimo da budete 100% zadovoljni!
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
                          Da li mogu da vidim primere vašeg rada?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Naravno! Tokom besplatne konsultacije pokazujemo portfolio sa prethodnim projektima. Možemo vam pokazati i case studies sa rezultatima (konverzije, bounce rate, itd.).
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
                          How long does the web design process take?
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-pink-600 flex-shrink-0 transition-transform duration-300 ${
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
                            Landing page design takes 5-7 days. Complete web design (up to 10 pages) takes 2-3 weeks. Time depends on number of revisions and speed of your feedback.
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
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-rose-50 to-violet-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
                {language === 'sr' 
                  ? 'Web Dizajn Beograd - Zakažite Besplatnu Konsultaciju'
                  : 'Web Design Belgrade - Schedule Free Consultation'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {language === 'sr' 
                  ? 'Kontaktirajte nas za besplatnu konsultaciju o web dizajnu. Saznajte više o ceni web dizajna, procesu, i kako naš web dizajn pristup može transformisati vaš biznis u Srbiji.'
                  : 'Contact us for a free web design consultation. Learn more about web design pricing, process, and how our approach can transform your business in Serbia.'
                }
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => {
                    trackCTAClick('Besplatna Web Dizajn Konsultacija - Footer', 'web_dizajn_cta', language);
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

        {/* Link back to other services */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-600 mb-4">
                {language === 'sr' 
                  ? 'Pored web dizajna, nudimo i druge digitalne usluge u Beogradu i Srbiji:'
                  : 'In addition to web design, we also offer other digital services in Belgrade and Serbia:'
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link 
                  to="/"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Izrada Web Sajta Beograd' : 'Website Development Belgrade'}
                </Link>
                <Link 
                  to="/seo"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'SEO Optimizacija Cena' : 'SEO Optimization Price'}
                </Link>
                <Link 
                  to="/contact"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Kontakt - Besplatna Konsultacija' : 'Contact - Free Consultation'}
                </Link>
                <Link 
                  to="/resources"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Besplatni Resursi' : 'Free Resources'}
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

