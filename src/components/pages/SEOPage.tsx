import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart3, CheckCircle, XCircle, ArrowRight, Award, Users, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { FAQSchema } from '../seo/FAQSchema';
import { ServiceSchema } from '../seo/ServiceSchema';
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
      answer: "Ne možemo garantovati tačnu poziciju jer Google algoritam nije pod našom kontrolom. Radimo isključivo sa White Hat SEO tehnikama koje su dokazano održive dugoročno, i napredak pratite kroz mesečne izveštaje sa konkretnim brojevima."
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
      {/* SEO Meta Tags */}
      <SEOHelmet
        title={language === 'sr'
          ? 'SEO Optimizacija Cena | od 250€ | AiSajt'
          : 'SEO Optimization Price | from €250 | AiSajt'
        }
        description={language === 'sr'
          ? 'SEO optimizacija sajta od 250€. Radimo u Beogradu i širom Srbije, sa besplatnom analizom i transparentnom ponudom, jednokratno ili mesečno.'
          : 'Website SEO optimization from €250. We work in Belgrade and across Serbia, with a free analysis and transparent offer, one-time or monthly.'
        }
        keywords={language === 'sr'
          ? 'seo optimizacija cena, seo optimizacija, seo optimizacija sajta, seo optimizacija beograd, cena seo optimizacije'
          : 'seo optimization price, seo optimization, seo cost, website seo optimization, seo optimization belgrade'
        }
        canonicalUrl="https://aisajt.com/seo-optimizacija-cena"
      />
      <FAQSchema items={faqItems} />
      <ServiceSchema
        serviceType="SEO optimizacija"
        description="Tehnička SEO optimizacija sajta za bolju poziciju na Google, u Beogradu i širom Srbije."
        path="/seo-optimizacija-cena"
        startingPrice={250}
      />

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="hidden sm:block absolute top-1/2 left-0 md:left-10 -translate-y-1/2 z-[2] pointer-events-none overflow-hidden">
            <div className="text-[180px] sm:text-[280px] md:text-[350px] lg:text-[420px] xl:text-[500px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-indigo-500 to-pink-500 select-none opacity-20 sm:opacity-30 md:opacity-25" aria-hidden="true">
              S
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2 animate-fade-in-up animation-delay-200">
                  {language === 'sr' ? 'SEO Optimizacija Cena' : 'SEO Optimization Price'}
                </h1>

                {/* Answer-first blok — direktan odgovor pre marketinškog uvoda */}
                <div className="max-w-3xl mx-auto mb-6 md:mb-8 px-4 py-4 rounded-2xl bg-violet-50 border border-violet-200 text-left animate-fade-in-up animation-delay-400">
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {language === 'sr'
                      ? <>SEO optimizacija je proces poboljšanja vidljivosti sajta u organskim rezultatima pretrage, kroz tehničke izmene, sadržaj i link building. <strong>Cena kod AiSajt počinje od 250€</strong> za osnovni paket, jednokratno ili mesečno. Napredniji paketi za konkurentnije ključne reči idu od 500€ mesečno. Tačnu ponudu dobijate posle besplatne analize sajta.</>
                      : <>SEO optimization is the process of improving a site's visibility in organic search results, through technical changes, content and link building. <strong>Price at AiSajt starts from €250</strong> for the basic package, one-time or monthly. Advanced packages for more competitive keywords start from €500 per month. You get an exact quote after a free site analysis.</>
                    }
                  </p>
                </div>

                <div className="flex justify-center animate-fade-in-up animation-delay-600">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna SEO Analiza', 'seo_hero', language);
                      navigate('/funnel');
                    }}
                    className="group px-6 py-3.5 sm:px-7 sm:py-4 md:px-8 md:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-5 h-5 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span className="whitespace-nowrap">{language === 'sr' ? 'Zakažite Besplatnu Analizu' : 'Schedule Free Analysis'}</span>
                    <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 md:mt-12 animate-fade-in-up animation-delay-800">
                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">+250%</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Rast Prometa' : 'Traffic Growth'}</p>
                </div>

                <div className="group bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 text-center">
                  <div className="flex justify-center mb-1.5 sm:mb-2 md:mb-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">50+</div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-tight">{language === 'sr' ? 'Klijenata' : 'Clients'}</p>
                </div>

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

        {/* Šta je SEO optimizacija - definicioni blok */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              {language === 'sr' ? (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Šta je SEO Optimizacija?
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      SEO optimizacija (Search Engine Optimization) je proces poboljšanja vidljivosti sajta u organskim rezultatima pretraživača kao što su Google i Bing. Obuhvata tehničke izmene, optimizaciju sadržaja i izgradnju autoriteta kroz linkove. Nije jednokratna intervencija, već kontinuiran rad na praćenju i prilagođavanju rezultatima.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Bitno je razlikovati dve stvari koje se često mešaju. Svaki sajt koji mi napravimo dobija osnovnu, tehničku pripremu koja Google-u daje jasan kontekst o čemu se sajt radi: struktura, meta tagovi, brzina učitavanja. To je uključeno u <Link to="/izrada-sajta" className="text-violet-600 hover:text-violet-700 font-medium underline">izradu sajta</Link> i besplatno je. SEO optimizacija opisana na ovoj stranici je nešto drugo: aktivan, kontinuiran rad na rangiranju za konkretne ključne reči, iznad te osnove.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      What Is SEO Optimization?
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      SEO optimization (Search Engine Optimization) is the process of improving a website's visibility in organic search results on engines like Google and Bing. It covers technical changes, content optimization and building authority through links. It is not a one-time intervention, but continuous monitoring and adjustment.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      It's worth separating two things that often get mixed up. Every site we build gets basic technical preparation that gives Google clear context about what the site is about. That's included in website development and free. The SEO optimization described on this page is different: active, ongoing work on ranking for specific keywords, beyond that baseline.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Kome je namenjeno, a kome nije */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {language === 'sr' ? 'Kome je Namenjeno, a Kome Nije' : 'Who It\'s For, and Who It Isn\'t'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                {language === 'sr'
                  ? 'SEO optimizacija je za firme koje već imaju sajt, ili ga tek prave, i žele dugoročan, organski izvor posetilaca umesto isključivog oslanjanja na plaćene oglase. Radimo i jednokratnu tehničku optimizaciju i mesečni kontinuirani rad.'
                  : 'SEO optimization is for businesses that already have a site, or are building one, and want a long-term, organic source of visitors instead of relying only on paid ads.'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">{language === 'sr' ? 'Za koga jeste' : 'Who it\'s for'}</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>{language === 'sr' ? 'Firme sa postojećim sajtom koje žele organski saobraćaj' : 'Businesses with an existing site that want organic traffic'}</li>
                    <li>{language === 'sr' ? 'Nove sajtove izgrađene od nule sa SEO osnovama' : 'New sites built from scratch with SEO foundations'}</li>
                    <li>{language === 'sr' ? 'Lokalne biznise koji žele da ih nađu u Beogradu, Novom Sadu i drugim gradovima' : 'Local businesses that want to be found in Belgrade, Novi Sad and other cities'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-bold text-gray-900">{language === 'sr' ? 'Za koga nije' : 'Who it\'s not for'}</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>{language === 'sr' ? 'Firme kojima trebaju rezultati za par dana - za to je bolji Google Ads, koji donosi trenutan, ali plaćen saobraćaj' : 'Businesses that need results in a few days - Google Ads is better for that, bringing instant but paid traffic'}</li>
                    <li>{language === 'sr' ? 'Sajtove bez ijedne stranice sadržaja o usluzi ili proizvodu - SEO optimizuje postojeći sadržaj, ne izmišlja ga' : 'Sites without any content about the service or product - SEO optimizes existing content, it doesn\'t invent it'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA sekcija za SEO Optimizacija Detalji */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-[#05afd1]/5 via-white to-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/seo-optimizacija-detalji"
                onClick={() => trackCTAClick('SEO Optimizacija Detalji CTA', 'seo_mid_section', language)}
                className="group relative block bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#05afd1]/20 hover:border-[#05afd1] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#05afd1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#05afd1]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#05afd1]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#05afd1] transition-colors duration-300">
                        {language === 'sr'
                          ? 'Želiš da saznaš našu detaljnu ponudu SEO optimizacije?'
                          : 'Want to learn about our detailed SEO optimization offer?'
                        }
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {language === 'sr'
                          ? 'Pogledaj video i saznaj šta ti donosi redovno SEO održavanje: više posetilaca, bolje pozicije na Google-u i kontinuirani rast organskog saobraćaja.'
                          : 'Watch the video and learn what regular SEO maintenance brings you: more visitors, better Google rankings and continuous growth of organic traffic.'
                        }
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#05afd1] text-white font-semibold rounded-xl group-hover:bg-[#05afd1] group-hover:scale-105 transition-all duration-300 shadow-lg shadow-[#05afd1]/30">
                        <span>{language === 'sr' ? 'Pogledaj Video' : 'Watch Video'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Šta tačno dobijate + primer Komotraks */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-violet-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-violet-200/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center px-4">
                {language === 'sr' ? 'Šta Tačno Dobijate' : 'What Exactly You Get'}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-16">
                {[
                  language === 'sr' ? 'Detaljnu analizu trenutnog stanja sajta i konkurencije pre početka rada' : 'A detailed analysis of your site\'s current state and competitors before starting',
                  language === 'sr' ? 'Keyword research prilagođen vašoj industriji i lokaciji' : 'Keyword research tailored to your industry and location',
                  language === 'sr' ? 'On-page optimizaciju: meta tagove, heading strukturu, brzinu učitavanja' : 'On-page optimization: meta tags, heading structure, load speed',
                  language === 'sr' ? 'Mesečne izveštaje sa pozicijama, saobraćajem i preporukama' : 'Monthly reports with rankings, traffic and recommendations',
                  language === 'sr' ? 'Lokalnu SEO optimizaciju za Beograd, Novi Sad i ostatak Srbije' : 'Local SEO optimization for Belgrade, Novi Sad and the rest of Serbia',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Primer: Komotraks */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 shadow-lg border border-gray-100">
                <a
                  href="https://ugradnja-zavesa-komarnika.com"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block relative rounded-2xl overflow-hidden shadow-xl border-4 border-white hover:border-violet-300 transition-all duration-300 hover:shadow-2xl group"
                >
                  <img
                    src="/images/portfolio/komotraks.webp" width={1200} height={800}
                    alt="Komotraks - primer lokalne SEO optimizacije za beogradske opštine"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-4 left-4 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold text-sm shadow-lg">
                    {language === 'sr' ? 'Primer iz Prakse' : 'Real Example'}
                  </div>
                </a>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {language === 'sr' ? 'Komotraks: Lokalni SEO u Praksi' : 'Komotraks: Local SEO in Practice'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Komotraks, firma za ugradnju komarnika, harmonika vrata i zavesa u Beogradu, dobio je sajt sa lokalnim SEO-om targetiranim po beogradskim opštinama (Novi Beograd, Vračar, Zvezdara, Voždovac, Palilula) i blog sekcijom za organski saobraćaj. Rezultat je primetan rast broja posetilaca koji dolaze direktno iz pretrage, bez plaćenih oglasa.'
                      : 'Komotraks, an insect screen, folding door and blinds installer in Belgrade, got a site with local SEO targeted by Belgrade municipalities and a blog section for organic traffic. The result was a noticeable rise in visitors coming directly from search, with no paid ads.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link
                      to="/portfolio/komotraks"
                      className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                    >
                      <span>{language === 'sr' ? 'Pogledajte projekat Komotraks' : 'View the Komotraks project'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/lokalni-seo-beograd"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group"
                    >
                      <span>{language === 'sr' ? 'Lokalni SEO po opštinama' : 'Local SEO by municipality'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Team CTA */}
              <div className="mt-12">
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
                  ? 'Koliko Košta SEO Optimizacija'
                  : 'How Much SEO Optimization Costs'
                }
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed text-center max-w-2xl mx-auto">
                {language === 'sr'
                  ? 'Cena nije fiksna, zavisi od obima posla, konkurencije u vašoj niši, broja ključnih reči i trenutnog stanja sajta.'
                  : 'The price is not fixed, it depends on the scope of work, competition in your niche, number of keywords and the site\'s current state.'
                }
              </p>

              {/* Prava tabela cenovnika */}
              <div className="overflow-x-auto mb-12 rounded-2xl border border-gray-200 shadow-md bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 text-white">
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Paket' : 'Package'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Cena' : 'Price'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Uključuje' : 'Includes'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        sr: ['Basic SEO', 'od 250€ mesečno / jednokratno', 'Keyword research (do 10 fraza), on-page optimizacija, meta tagovi, tehnička analiza, mesečni izveštaji'],
                        en: ['Basic SEO', 'from €250 monthly / one-time', 'Keyword research (up to 10 phrases), on-page optimization, meta tags, technical analysis, monthly reports'],
                      },
                      {
                        sr: ['Advanced SEO', 'od 500€ mesečno', 'Sve iz Basic paketa, link building (5-10 backlinkova), 1-2 SEO članka mesečno, konkurentska analiza'],
                        en: ['Advanced SEO', 'from €500 monthly', 'Everything in Basic, link building (5-10 backlinks), 1-2 SEO articles monthly, competitor analysis'],
                      },
                    ].map((row) => {
                      const [pkg, price, includes] = language === 'sr' ? row.sr : row.en;
                      return (
                        <tr key={pkg} className="hover:bg-violet-50/40 transition-colors">
                          <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-gray-900 text-sm md:text-base">{pkg}</td>
                          <td className="px-4 py-3 md:px-6 md:py-4 font-bold text-violet-600 text-sm md:text-base whitespace-nowrap">{price}</td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-gray-600 text-sm">{includes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="prose prose-lg max-w-none text-center">
                {language === 'sr' ? (
                  <>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-4 text-center">
                      Od čega zavisi cena?
                    </h3>

                    <ul className="space-y-4 my-8 max-w-3xl mx-auto text-left">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-violet-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Konkurencija u vašoj industriji</strong>
                          <p className="text-gray-600 mt-1">Ako se natječete za visoko konkurentne ključne reči kao "izrada sajta Beograd" ili "marketing Novi Sad", potrebno je više rada i budžeta nego za nišne termine.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-indigo-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Trenutno stanje vašeg sajta</strong>
                          <p className="text-gray-600 mt-1">Ako sajt već ima dobru osnovu (brz je, optimizovan, ima backlinkove), posao košta manje. Ako ima tehničke probleme, potrebno je više rada.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-pink-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Broj ključnih reči</strong>
                          <p className="text-gray-600 mt-1">Optimizacija za 5 ključnih reči košta manje od optimizacije za 50. Preporučujemo početi sa 10-15 najvažnijih i širiti dalje nakon prvih rezultata.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-violet-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <strong className="text-gray-900">Geografsko targetiranje</strong>
                          <p className="text-gray-600 mt-1">Lokalna SEO optimizacija je jeftinija od nacionalne ili internacionalne. Cena zavisi od geografske oblasti koju targetirate.</p>
                        </div>
                      </li>
                    </ul>

                    <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-violet-200 mt-8 text-center max-w-3xl mx-auto">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-violet-600" />
                        Transparentna cena
                      </h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Za razliku od agencija koje skrivaju cenu iza "kontaktirajte nas za ponudu", svaki klijent dobija detaljnu analizu, transparentnu ponudu i procenu koliko će trajati dok ne vidite rezultate.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Besplatna analiza vašeg sajta traje 30-45 minuta i možete je zakazati već danas.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                      The cost is not fixed. It's calculated based on scope of work, competition in your niche, number of keywords, and current state of the site.
                    </p>
                  </>
                )}
              </div>

            </div>
          </div>
        </section>

        </div>
        {/* Kraj flex container-a */}

        {/* Koliko traje / Naspram alternativa */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12 max-w-3xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Koliko Traje do Prvih Rezultata' : 'How Long Until the First Results'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'sr'
                    ? 'Tehnička poboljšanja (brzina sajta, struktura, meta tagovi) deluju odmah nakon implementacije. Za značajan pomak u pozicijama i organskom saobraćaju potrebno je 2 do 4 meseca, zavisno od konkurencije u vašoj industriji.'
                    : 'Technical improvements (site speed, structure, meta tags) take effect right after implementation. For a significant shift in rankings and organic traffic, expect 2 to 4 months, depending on competition in your industry.'
                  }
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'SEO Optimizacija Naspram Alternativa' : 'SEO Optimization vs. Alternatives'}
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold"></th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">SEO {language === 'sr' ? 'optimizacija' : 'optimization'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">Google Ads</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Bez optimizacije' : 'No optimization'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(language === 'sr' ? [
                      ['Kada donosi rezultate', '2 do 4 meseca', 'Odmah', 'Nikad, sajt ostaje nevidljiv'],
                      ['Troškovi posle postizanja pozicije', 'Nastavlja da radi bez dodatnog plaćanja po kliku', 'Nestaje čim prestanete da plaćate', '-'],
                      ['Poverenje korisnika', 'Organski rezultat, veće poverenje', 'Označeno kao oglas', '-'],
                      ['Dugoročna vrednost', 'Raste tokom vremena', 'Ravna linija dok plaćate', 'Opada'],
                    ] : [
                      ['When it delivers results', '2 to 4 months', 'Immediately', 'Never, the site stays invisible'],
                      ['Cost after ranking is reached', 'Keeps working with no extra cost per click', 'Disappears once you stop paying', '-'],
                      ['User trust', 'Organic result, higher trust', 'Labeled as an ad', '-'],
                      ['Long-term value', 'Grows over time', 'Flat line while you pay', 'Declines'],
                    ]).map(([label, seo, ads, none]) => (
                      <tr key={label} className="hover:bg-violet-50/40 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-gray-900 text-sm">{label}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{seo}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{ads}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{none}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm md:text-base mt-6 max-w-3xl mx-auto text-center leading-relaxed">
                {language === 'sr'
                  ? <>Najbolji pristup je često kombinacija: Google Ads za trenutne rezultate dok SEO optimizacija gradi dugoročnu, besplatnu vidljivost. Detaljno poređenje pročitajte u tekstu{' '}
                      <Link to="/blog/google-ads-ili-seo" className="text-violet-600 hover:text-violet-700 font-medium underline">Google Ads ili SEO: šta je bolji izbor</Link>.</>
                  : <>The best approach is often a combination: Google Ads for immediate results while SEO builds long-term, free visibility.</>
                }
              </p>
            </div>
          </div>
        </section>

        {/* Zašto izabrati nas za SEO */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-white to-indigo-50/30"></div>

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
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                        ? 'Preko 50 zadovoljnih klijenata sa merljivim porastom organskog saobraćaja i konverzija.'
                        : 'Over 50 satisfied clients with measurable increase in organic traffic and conversions.'
                      }
                    </p>
                  </div>
                </div>

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
                        ? 'Tim sa višegodišnjim iskustvom, praćenjem najnovijih Google algoritama i best practices.'
                        : 'Team with years of experience, tracking the latest Google algorithms and best practices.'
                      }
                    </p>
                  </div>
                </div>

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
                        ? 'Mesečni izveštaji sa konkretnim metrikama: pozicije, organski saobraćaj, konverzije i ROI.'
                        : 'Monthly reports with concrete metrics: rankings, traffic, conversions and ROI.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proces SEO Optimizacije */}
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
                {(language === 'sr' ? [
                  ['Besplatna SEO Analiza', 'Analiziramo vaš sajt, konkurenciju i ključne reči. Dobijate detaljnu analizu trenutnog stanja i procenu cene.', 'border-violet-500', 'from-violet-500 to-indigo-600'],
                  ['Keyword Research & Strategija', 'Pronalazimo najbolje ključne reči za vašu industriju i pravimo strategiju. Definišemo prioritete i ciljeve.', 'border-indigo-500', 'from-indigo-500 to-violet-600'],
                  ['On-Page Optimizacija', 'Optimizujemo sajt: meta tagove, heading strukturu, URL-ove, slike, brzinu učitavanja.', 'border-pink-500', 'from-pink-500 to-violet-600'],
                  ['Content & Link Building', 'Kreiramo kvalitetan sadržaj i gradimo backlinkove. Ovo je ključ dugoročnog uspeha.', 'border-violet-500', 'from-violet-500 to-pink-600'],
                  ['Praćenje & Izveštaji', 'Mesečni izveštaji sa konkretnim rezultatima: pozicije, saobraćaj, ROI.', 'border-indigo-500', 'from-indigo-500 to-pink-600'],
                ] : [
                  ['Free SEO Analysis', 'We analyze your website, competition, and keywords. You get a detailed analysis and cost estimate.', 'border-violet-500', 'from-violet-500 to-indigo-600'],
                  ['Keyword Research & Strategy', 'We find the best keywords and create an SEO strategy. We define priorities and goals.', 'border-indigo-500', 'from-indigo-500 to-violet-600'],
                  ['On-Page Optimization', 'We optimize your site: meta tags, heading structure, URLs, images, loading speed.', 'border-pink-500', 'from-pink-500 to-violet-600'],
                  ['Content & Link Building', 'We create quality content and build backlinks. This is key to long-term SEO success.', 'border-violet-500', 'from-violet-500 to-pink-600'],
                  ['Tracking & Reports', 'Monthly reports with concrete results: positions, traffic, ROI.', 'border-indigo-500', 'from-indigo-500 to-pink-600'],
                ]).map(([title, desc, border, gradient], i) => (
                  <div key={title} className={`group bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border-l-4 ${border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2`}>
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{title}</h3>
                        <p className="text-gray-600 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                  ? 'SEO optimizacija je najefikasnija kada je deo kompletne digitalne strategije. Evo kako se investicija isplati kroz integraciju sa drugim uslugama:'
                  : 'SEO optimization is most effective when part of a complete digital strategy. Here\'s how the investment pays off through integration with other services:'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
                    <Link to="/izrada-sajta" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                      {language === 'sr' ? 'izrada sajta' : 'website development'}
                    </Link>
                    {language === 'sr'
                      ? ' sa tehničkim osnovama olakšava kasniju optimizaciju i ubrzava rezultate.'
                      : ' with technical foundations makes later optimization easier and accelerates results.'
                    }
                  </p>
                  <Link
                    to="/izrada-sajta"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Saznajte o izradi sajta' : 'Learn about website development'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

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
                      ? ' koji je intuitivan, brz i mobilno-optimizovan direktno utiče na performanse.'
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
                    ? 'Najbolji rezultati dolaze kada kombinujete kvalitetan sajt, odličan dizajn i profesionalnu optimizaciju.'
                    : 'The best results come when you combine a quality site, excellent design and professional optimization.'
                  }
                </p>
                <button
                  onClick={() => {
                    trackCTAClick('Kompletna SEO Strategija - CTA', 'seo_complete_strategy', language);
                    navigate('/funnel');
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

        {/* FAQ Sekcija */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-5 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Česta Pitanja o SEO Optimizaciji' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr'
                  ? 'Odgovori na najčešća pitanja o ceni, procesu i rezultatima'
                  : 'Answers to the most common questions about pricing, process and results'
                }
              </p>

              <div className="space-y-4">
                {(language === 'sr' ? faqItems : [
                  { question: "How long does it take to see SEO results?", answer: "Realistically, it takes 2-4 months to see significant results. However, technical improvements (site speed, structure) show results immediately." },
                  { question: "Is this a one-time or monthly service?", answer: "Both options are available. You can do a one-time optimization (on-page, technical) for a fixed price, or engage us monthly for continuous work." },
                  { question: "How much does it cost for small business?", answer: "For small businesses, we recommend the Basic SEO package starting from €250 one-time, or a monthly package from €250 for continuous work." },
                  { question: "Do you guarantee first position on Google?", answer: "No one can guarantee the first position as Google's algorithm constantly changes. We only use White Hat SEO techniques that are sustainable long-term, and you track progress through monthly reports." },
                  { question: "What's included in monthly SEO optimization?", answer: "Monthly packages include continuous position tracking, creation of SEO-optimized content, link building, technical optimizations, competitor analysis, and detailed monthly reports." },
                  { question: "Do you do local SEO for Belgrade and Serbia?", answer: "Yes, we specialize in local SEO optimization. We optimize your Google My Business profile, local directories, and target keywords specific to Belgrade, Novi Sad and other cities in Serbia." },
                  { question: "Can I get SEO if I'm just building my website?", answer: "Absolutely! That's the ideal time to start. When we build a site from scratch with SEO foundations, later optimization is simpler and yields faster results." },
                  { question: "What's the difference between SEO and Google Ads?", answer: "SEO brings organic (free) long-term results. Google Ads provide immediate results but require continuous investment. The best approach is combining both." },
                  { question: "How do you measure SEO success?", answer: "We track keyword positions, organic traffic, bounce rate, time on site, conversions, and ROI. Monthly reports show clear numbers and progress." },
                ]).map((item, index) => (
                  <div key={item.question} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                      className="w-full px-6 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                    >
                      <span className="text-lg md:text-xl font-semibold text-gray-900 flex-1">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
                          openFAQIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openFAQIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 md:px-8 pb-5 md:pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    navigate('/funnel');
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
                  to="/izrada-sajta"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'Izrada Web Sajta' : 'Website Development'}
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
                <Link
                  to="/seo-optimizacija-detalji"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-colors text-sm font-medium"
                >
                  {language === 'sr' ? 'SEO Održavanje' : 'SEO Maintenance'}
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
