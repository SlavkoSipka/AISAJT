import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Palette, Zap, CheckCircle, XCircle, ArrowRight, Award, Users, Sparkles, ShoppingCart, ChevronDown, Rocket, Monitor, Target } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { FAQSchema } from '../seo/FAQSchema';
import { ServiceSchema } from '../seo/ServiceSchema';
import { TeamCTA } from '../sections/TeamCTA';
import { FactorsCarousel } from '../sections/FactorsCarousel';
import { trackCTAClick } from '../../utils/analytics';

export function IzradaSajtaPage() {
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
      question: "Da li mogu naknadno da dodajem sadržaj sam?",
      answer: "Da! Uključuje CMS sistem - sami dodajete tekst, slike i video. Dobijate obuku."
    },
    {
      question: "Radite li izradu sajta van Beograda, na primer u Novom Sadu ili Nišu?",
      answer: "Da! Radimo za klijente u Novom Sadu, Nišu, celoj Srbiji i inostranstvu. Komunikacija online - cena ista za sve."
    },
    {
      question: "Kako izgleda proces saradnje?",
      answer: "Izrada sajta prati jasnu strukturu: (1) Besplatna konsultacija, (2) Pisana ponuda, (3) Ugovor, (4) Dizajn faza sa revizijama, (5) Programiranje i razvoj, (6) Testiranje, (7) Lansiranje i obuka. Tokom celog procesa imate transparentan uvid."
    },
    {
      question: "Šta ako nisam zadovoljan dizajnom?",
      answer: "Proces uključuje više faza pregleda i revizija. Prvo kreiramo dizajn mockup, dobijamo vaš feedback, i radimo izmene dok ne budete 100% zadovoljni. Tek nakon vašeg odobrenja prelazimo na programiranje."
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
          ? 'Izrada Sajta: Cene, Paketi i Proces | od 299€ | AiSajt'
          : 'Website Development: Pricing, Packages and Process | from €299 | AiSajt'
        }
        description={language === 'sr'
          ? 'Izrada sajta od 299€, sa transparentnim cenama i rokom 2 do 4 nedelje. Radimo za firme u Beogradu. Besplatna konsultacija.'
          : 'Website development from €299, transparent pricing and a 2 to 4 week timeline. We work with businesses in Belgrade, Novi Sad and across Serbia. Free consultation.'
        }
        keywords={language === 'sr'
          ? 'izrada sajta, izrada web sajta, izrada sajta beograd, izrada sajta cena, izrada web sajta cena'
          : 'website development, website creation, website development belgrade, website price'
        }
        canonicalUrl="https://aisajt.com/izrada-sajta"
      />
      <FAQSchema items={faqItems} />
      <ServiceSchema
        serviceType="Izrada web sajta"
        description="Profesionalna izrada web sajta za firme u Beogradu."
        path="/izrada-sajta"
        startingPrice={299}
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
                  {language === 'sr' ? 'Izrada sajta po meri vašeg biznisa' : 'Website Development Tailored to Your Business'}
                </h1>

                {/* Answer-first blok — direktan odgovor u prvih 40 do 60 reči,
                    pre marketinškog uvoda, po pravilu 4.1 iz SEO vodiča. */}
                <div className="max-w-3xl mx-auto mb-6 md:mb-8 px-4 py-4 rounded-2xl bg-violet-50 border border-violet-200 text-left">
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {language === 'sr'
                      ? <>Izrada sajta je proces planiranja, dizajna, programiranja i lansiranja veb prezentacije prilagođene vašem biznisu. U AiSajt-u izrada sajta počinje od <strong>299€</strong> za jednostavan prezentacioni sajt, a standardan projekat traje <strong>2 do 4 nedelje</strong>. Cena zavisi od broja stranica, funkcionalnosti i dizajna, i dobijate je posle besplatne konsultacije, bez skrivenih troškova.</>
                      : <>Website development is the process of planning, designing, programming and launching a web presence tailored to your business. At AiSajt, website development starts from <strong>€299</strong> for a simple presentation site, and a standard project takes <strong>2 to 4 weeks</strong>. The price depends on the number of pages, features and design, and you get it after a free consultation, with no hidden costs.</>
                    }
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      trackCTAClick('Besplatna Konsultacija - Hero', 'izrada_sajta_hero', language);
                      navigate('/izrada-sajta-detalji');
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

        {/* Šta je izrada sajta - definicioni blok */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              {language === 'sr' ? (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Šta je Izrada Sajta?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Izrada sajta je usluga koja obuhvata pet koraka: analizu potreba, planiranje strukture stranica, dizajn, programiranje i objavljivanje veb sajta sa podešenom analitikom. Kod nas to znači kombinaciju dizajna, tehničkog razvoja na React stack-u i osnovne SEO pripreme, tako da sajt izgleda profesionalno i radi brzo od prvog dana.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Web sajt danas nije samo digitalna vizit karta. Za firmu sa fizičkom adresom u Beogradu, Novom Sadu ili bilo gde u Srbiji, sajt je često prvi kontakt sa potencijalnim klijentom, pre telefonskog poziva ili posete. Zato izrada sajta uključuje i osnovne SEO postavke i responzivan dizajn za mobilne uređaje, ne samo izgled na desktopu.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      What Is Website Development?
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      Website development is a service covering five steps: needs analysis, page structure planning, design, programming and publishing a website with analytics set up. For us that means combining design, technical development on the React stack, and basic SEO preparation, so the site looks professional and runs fast from day one.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      A website today is not just a digital business card. For a company with a physical address in Belgrade, Novi Sad or anywhere in Serbia, the site is often the first contact a potential client has, before a phone call or a visit.
                    </p>
                  </div>
                </div>
              )}

              {/* Team CTA - Integrisana u sekciju */}
              <TeamCTA />
            </div>
          </div>
        </section>

        {/* Kome je namenjeno, a kome nije */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {language === 'sr' ? 'Kome je Namenjeno, a Kome Nije' : 'Who It\'s For, and Who It Isn\'t'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                {language === 'sr'
                  ? 'Izrada sajta kod nas je namenjena malim i srednjim preduzećima, zanatlijama, lokalnim uslugama i firmama koje žele online prodavnicu, a već imaju jasno definisanu ponudu, proizvode ili usluge koje žele da predstave. Radimo i sa kompanijama koje žele veći, prilagođen sistem, kroz paket "Projekat".'
                  : 'Website development with us is for small and medium businesses, tradespeople, local services and companies that want an online store, and already have a clearly defined offer, products or services to present. We also work with companies that want a larger, custom system through the "Project" package.'
                }
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">{language === 'sr' ? 'Za koga jeste' : 'Who it\'s for'}</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>{language === 'sr' ? 'Mala i srednja preduzeća sa definisanom ponudom' : 'Small and medium businesses with a defined offer'}</li>
                    <li>{language === 'sr' ? 'Zanatlije i lokalne usluge' : 'Tradespeople and local services'}</li>
                    <li>{language === 'sr' ? 'Firme koje žele online prodavnicu' : 'Companies that want an online store'}</li>
                    <li>{language === 'sr' ? 'Kompanije kojima treba veći, custom sistem' : 'Companies that need a larger, custom system'}</li>
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <h3 className="text-lg font-bold text-gray-900">{language === 'sr' ? 'Za koga nije' : 'Who it\'s not for'}</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>{language === 'sr' ? 'Marketplace platforme sa više nezavisnih prodavaca - potrebna je specijalizovana platforma' : 'Marketplace platforms with multiple independent sellers - a specialized platform is needed'}</li>
                    <li>{language === 'sr' ? 'Projekti bez definisane ponude ili materijala - prvo treba razjasniti šta se nudi' : 'Projects without a defined offer or materials - what\'s being offered needs to be clear first'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA sekcija za Izrada Sajta Detalji */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-pink-50/5 via-white to-white relative overflow-hidden">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/izrada-sajta-detalji"
                onClick={() => trackCTAClick('Izrada Sajta Detalji CTA', 'izrada_sajta_mid_section', language)}
                className="group relative block bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-500/20 hover:border-pink-500 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                        {language === 'sr'
                          ? 'Upoznajte tim i proces rada'
                          : 'Meet the team and how we work'
                        }
                      </h3>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {language === 'sr'
                          ? 'Pogledaj video i upoznaj AiSajt tim: kako radimo, dokazan sistem privlačenja klijenata i preko 50+ uspešnih projekata.'
                          : 'Watch the video and meet the AiSajt team: how we work, a proven system for attracting clients, and over 50+ successful projects.'
                        }
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl group-hover:bg-pink-600 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30">
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

        {/* Šta tačno dobijate */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Šta Tačno Dobijate' : 'What Exactly You Get'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  language === 'sr' ? 'Do 5 stranica sadržaja u osnovnom paketu (Početna, O nama, Usluge, Portfolio, Kontakt), sa mogućnošću proširenja' : 'Up to 5 pages in the base package, with room to expand',
                  language === 'sr' ? 'Responzivan dizajn, prilagođen mobilnim uređajima i desktopu' : 'Responsive design, tailored to mobile and desktop',
                  language === 'sr' ? 'Kontakt forma povezana sa vašim mejlom' : 'Contact form connected to your email',
                  language === 'sr' ? 'CMS sistem za samostalno dodavanje teksta, slika i videa, sa obukom nakon lansiranja' : 'CMS to add text, images and video yourself, with training after launch',
                  language === 'sr' ? 'Osnovna tehnička SEO priprema (struktura, meta tagovi, brzina učitavanja)' : 'Basic technical SEO preparation (structure, meta tags, load speed)',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm md:text-base leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kako izgleda proces izrade sajta */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Kako Izgleda Proces Izrade Sajta' : 'What the Website Development Process Looks Like'}
              </h2>
              <ol className="space-y-4">
                {(language === 'sr' ? [
                  ['Besplatna konsultacija.', 'Razgovaramo o ciljevima, ponudi i budžetu.'],
                  ['Pisana ponuda.', 'Dobijate tačnu cenu i plan projekta, bez obaveze.'],
                  ['Ugovor i početak.', 'Definišemo rokove i materijale koje treba da obezbedite.'],
                  ['Dizajn faza.', 'Kreiramo mockup, dobijamo vaš feedback, radimo izmene dok ne budete zadovoljni.'],
                  ['Programiranje i razvoj.', 'Prelazimo na kod tek nakon vašeg odobrenja dizajna.'],
                  ['Testiranje.', 'Proveravamo sajt na različitim uređajima i pretraživačima.'],
                  ['Lansiranje i obuka.', 'Sajt ide uživo, a vi dobijate obuku za CMS.'],
                ] : [
                  ['Free consultation.', 'We discuss your goals, offer and budget.'],
                  ['Written proposal.', 'You get an exact price and project plan, no obligation.'],
                  ['Contract and kickoff.', 'We define deadlines and materials you need to provide.'],
                  ['Design phase.', 'We create a mockup, get your feedback, revise until you\'re happy.'],
                  ['Programming and development.', 'We move to code only after you approve the design.'],
                  ['Testing.', 'We check the site across devices and browsers.'],
                  ['Launch and training.', 'The site goes live, and you get CMS training.'],
                ]).map(([title, desc], i) => (
                  <li key={title} className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">{title}</strong> {desc}
                    </p>
                  </li>
                ))}
              </ol>
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
                    ? 'Koliko Košta Izrada Sajta'
                    : 'How Much Website Development Costs'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Izrada sajta nema fiksnu cenu jer svaki projekat nosi drugačiji obim posla. Tabela ispod pokazuje naše startne pakete.'
                    : 'Website development doesn\'t have a fixed price since each project carries a different scope. The table below shows our starting packages.'
                  }
                </p>
              </div>

              {/* Prava tabela — najlakši format za izvlačenje po SEO vodiču */}
              <div className="overflow-x-auto mb-12 rounded-2xl border border-gray-200 shadow-md bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 text-white">
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Paket' : 'Package'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Cena od' : 'Price from'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold hidden md:table-cell">{language === 'sr' ? 'Za koga' : 'For whom'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold hidden md:table-cell">{language === 'sr' ? 'Šta uključuje' : 'What\'s included'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        sr: ['Jednostavan web sajt', '299€', 'Male biznise, zanatlije, lokalne usluge', 'Do 5 stranica, responzivan dizajn, kontakt forma, osnovna optimizacija'],
                        en: ['Simple website', '€299', 'Small businesses, tradespeople, local services', 'Up to 5 pages, responsive design, contact form, basic optimization'],
                      },
                      {
                        sr: ['Online prodavnica', '499€', 'Firme koje prodaju proizvode online', 'Kompletan shop sistem, korpa, online plaćanje, admin panel'],
                        en: ['Online store', '€499', 'Companies selling products online', 'Complete shop system, cart, online payment, admin panel'],
                      },
                      {
                        sr: ['Kompletna izrada sajta', '699€', 'Kompanije koje žele potpuno digitalno prisustvo', 'Neograničeno stranica, napredne funkcije, custom dizajn, integracije'],
                        en: ['Complete website', '€699', 'Companies wanting a full digital presence', 'Unlimited pages, advanced features, custom design, integrations'],
                      },
                      {
                        sr: ['Projekat', '1899€', 'Veće biznise sa naprednim potrebama', 'Custom web aplikacije, korisnički portali, integracije, dugoročna podrška'],
                        en: ['Project', '€1899', 'Larger businesses with advanced needs', 'Custom web apps, user portals, integrations, long-term support'],
                      },
                    ].map((row) => {
                      const [pkg, price, forWhom, includes] = language === 'sr' ? row.sr : row.en;
                      return (
                        <tr key={pkg} className="hover:bg-violet-50/40 transition-colors">
                          <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-gray-900 text-sm md:text-base">{pkg}</td>
                          <td className="px-4 py-3 md:px-6 md:py-4 font-bold text-violet-600 text-sm md:text-base whitespace-nowrap">{price}</td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-gray-600 text-sm hidden md:table-cell">{forWhom}</td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-gray-600 text-sm hidden md:table-cell">{includes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                        navigate('/izrada-sajta-detalji');
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
                        navigate('/izrada-sajta-detalji');
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
                        navigate('/izrada-sajta-detalji');
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
                            navigate('/izrada-sajta-detalji');
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

        {/* Koliko traje / šta nije uključeno */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-violet-100">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Koliko Traje Izrada Sajta' : 'How Long Website Development Takes'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'sr'
                    ? 'Standardna izrada sajta traje 2 do 4 nedelje od potvrde teksta i materijala, zavisno od složenosti. Ovaj rok pokriva dizajn, razvoj, testiranje i izmene po vašim komentarima. Hitniji rokovi su mogući, ali zahtevaju realokaciju resursa i utiču na cenu.'
                    : 'Standard website development takes 2 to 4 weeks from confirming text and materials, depending on complexity. Faster deadlines are possible but affect price.'
                  }
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-violet-50 rounded-2xl p-6 md:p-8 border border-pink-100">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {language === 'sr' ? 'Šta Nije Uključeno u Cenu' : 'What\'s Not Included in the Price'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'sr'
                    ? 'Cena izrade sajta je odvojena od hostinga i domena. Hosting je prostor gde sajt "živi" na internetu, a domen je vaša adresa (na primer, vasafirma.rs). Pomažemo oko izbora, hosting i domen zajedno tipično koštaju 50 do 150€ godišnje.'
                    : 'The website development price is separate from hosting and domain. We help you choose, hosting and domain together typically cost €50 to €150 per year.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Primer - Kompletan Sajt */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Primeri iz Prakse' : 'Real Examples'}
              </h2>
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
                      src="/images/kompletan poslovni web sajt.webp" width={1200} height={677}
                      alt="Prestige Gradnja - Primer izrade kompletnog poslovnog web sajta za građevinsku kompaniju - profesionalna izrada sajta Beograd"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
                    {language === 'sr' ? 'Prestige Gradnja' : 'Prestige Gradnja'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Građevinska kompanija iz Beograda, izgradnja i prodaja luksuznih nekretnina. Izrada sajta je obuhvatila kompletan custom dizajn, galeriju projekata, prezentaciju nekretnina i integrisane kontakt forme. Ovaj nivo izrade je za kompanije kojima je vizuelna prezentacija ključni deo prodaje.'
                      : 'A construction company from Belgrade, building and selling luxury real estate. The site includes complete custom design, a project gallery, property presentation and integrated contact forms.'
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
                    ? 'Nakon besplatne konsultacije dobijate detaljnu ponudu sa tačnom cenom izrade sajta. Bez skrivenih troškova, bez naknadnih doplata. Znate tačno šta plaćate i šta dobijate. Izrada sajta cena je uvek jasna i dogovorena unapred.'
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
                    {language === 'sr' ? 'Custom RC Parts' : 'Custom RC Parts'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Online prodavnica za RC delove i opremu. Izrada sajta je obuhvatila e-commerce funkcionalnost: katalog sa stotinama proizvoda, filtriranje, korpu, integraciju plaćanja, praćenje porudžbina i admin panel.'
                      : 'An online store for RC parts and equipment. The site includes complete e-commerce functionality: a catalog with hundreds of products, advanced filtering, shopping cart, payment integration, order tracking and admin panel.'
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
                      src="/images/online prodavnica sajt.webp" width={1200} height={678}
                      alt="Custom RC Parts - Primer izrade online prodavnice za RC delove - profesionalan web shop sa e-commerce funkcijama"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
                      src="/images/Jednostavan web sajt.webp" width={1200} height={679}
                      alt="BN Autofolije - Primer izrade jednostavnog web sajta za zatamnjivanje stakala automobila - profesionalna izrada sajta Novi Sad"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
                    {language === 'sr' ? 'BN Autofolije' : 'BN Autofolije'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Kompanija za profesionalno zatamnjivanje stakala automobila iz Novog Sada. Jednostavan sajt sa 5 stranica, moderan dizajn, galerija radova, kontakt forma i osnovna SEO optimizacija. Tipičan primer izrade sajta za lokalnu uslugu sa ograničenim budžetom.'
                      : 'A professional car window tinting company from Novi Sad. A simple 5-page site with modern design, gallery, contact form and basic SEO optimization.'
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

        {/* Izrada sajta naspram alternativa */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Izrada Sajta Naspram Alternativa' : 'Website Development vs. Alternatives'}
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold"></th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Agencija (mi)' : 'Agency (us)'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">{language === 'sr' ? 'Freelancer' : 'Freelancer'}</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-semibold">DIY builder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(language === 'sr' ? [
                      ['Cena', 'Srednja, transparentna po projektu', 'Promenljiva, zavisi od pojedinca', 'Niska, mesečna pretplata'],
                      ['Vreme do lansiranja', '2 do 4 nedelje', 'Zavisi od dostupnosti', 'Odmah, ali samostalno gradite'],
                      ['Custom dizajn', 'Da, po potrebi', 'Zavisi od iskustva', 'Ograničeno na template'],
                      ['Tehnička SEO priprema', 'Uključena', 'Zavisi od freelancer-a', 'Osnovna, u okviru platforme'],
                      ['Dugoročna podrška', 'Tim dostupan i posle lansiranja', 'Zavisi od dogovora', 'Sami održavate'],
                      ['Vlasništvo nad kodom', '100% vaše, prenosivo', 'Zavisi od dogovora', 'Zaključano u platformi'],
                    ] : [
                      ['Price', 'Mid, transparent per project', 'Variable, depends on the person', 'Low, monthly subscription'],
                      ['Time to launch', '2 to 4 weeks', 'Depends on availability', 'Instant, but you build it yourself'],
                      ['Custom design', 'Yes, as needed', 'Depends on experience', 'Limited to templates'],
                      ['Technical SEO prep', 'Included', 'Depends on the freelancer', 'Basic, within the platform'],
                      ['Long-term support', 'Team available after launch', 'Depends on agreement', 'You maintain it yourself'],
                      ['Code ownership', '100% yours, portable', 'Depends on agreement', 'Locked into the platform'],
                    ]).map(([label, us, freelancer, diy]) => (
                      <tr key={label} className="hover:bg-violet-50/40 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 font-semibold text-gray-900 text-sm">{label}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{us}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{freelancer}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-gray-700 text-sm">{diy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm md:text-base mt-6 max-w-3xl mx-auto text-center leading-relaxed">
                {language === 'sr'
                  ? 'Ako vam treba samo jednostavna landing stranica bez CMS-a i bez rasta u planu, DIY builder može biti brže i jeftinije rešenje. Izrada sajta kod agencije se isplati kada vam je bitna prilagođenost, brzina sajta, SEO priprema i podrška posle lansiranja.'
                  : 'If you just need a simple landing page with no CMS and no growth planned, a DIY builder can be faster and cheaper. Agency website development pays off when customization, site speed, SEO preparation and post-launch support matter to you.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Kompletna usluga - povezane oblasti */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center px-4">
                {language === 'sr'
                  ? 'Kompletno Digitalno Rešenje'
                  : 'Complete Digital Solution'
                }
              </h2>

              <p className="text-base md:text-lg text-gray-700 mb-10 leading-relaxed text-center max-w-3xl mx-auto">
                {language === 'sr'
                  ? 'Izrada sajta je samo početak. Za pravi digitalni uspeh, potrebno je integrisati dizajn, optimizaciju, marketing i kontinuiranu podršku.'
                  : 'Website development is just the beginning. For real digital success, you need to integrate design, optimization, marketing and continuous support.'
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
                      ? 'Vizuelni identitet i korisničko iskustvo direktno utiču na to da li posetilac ostaje na sajtu ili odlazi. Naša '
                      : 'Visual identity and user experience directly affect whether a visitor stays on the site or leaves. Our '
                    }
                    <Link to="/web-dizajn" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                      {language === 'sr' ? 'web dizajn usluga' : 'web design service'}
                    </Link>
                    {language === 'sr'
                      ? ' kreira moderne, responzivne dizajne prilagođene vašoj industriji.'
                      : ' creates modern, responsive designs tailored to your industry.'
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
                      ? 'Osnovna tehnička SEO priprema je uključena, ali za pravu vidljivost na Google-u potrebna je strategija. Naša '
                      : 'Basic technical SEO preparation is included, but for real Google visibility you need a strategy. Our '
                    }
                    <Link to="/seo-optimizacija-cena" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
                      {language === 'sr' ? 'SEO optimizacija' : 'SEO optimization'}
                    </Link>
                    {language === 'sr'
                      ? ' donosi organski saobraćaj i kvalitetne posetioce koji traže upravo ono što nudite.'
                      : ' brings organic traffic and quality visitors looking for exactly what you offer.'
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
                      ? 'Izrada sajta se ne završava sa lansiranjem. Nudimo kontinuiranu tehničku podršku, redovne backup-ove, nadogradnje sistema, brzo rešavanje problema.'
                      : 'Website development doesn\'t end with launch. We offer continuous technical support, regular backups, system upgrades, quick problem solving.'
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
                      ? 'Ako prodajete proizvode, klasična izrada sajta nije dovoljna. Naša '
                      : 'If you sell products, classic website development is not enough. Our '
                    }
                    <Link to="/izrada-web-shopa" className="text-pink-600 hover:text-pink-700 font-semibold underline">
                      {language === 'sr' ? 'izrada online prodavnice' : 'online store development'}
                    </Link>
                    {language === 'sr'
                      ? ' obuhvata kompletnu funkcionalnost web shop-a, integraciju plaćanja, upravljanje inventarom.'
                      : ' includes complete web shop functionality, payment integration, inventory management.'
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
                    ? 'Najbolji rezultati dolaze kada kombinujete kvalitetnu izradu sajta, profesionalan dizajn, SEO optimizaciju i kontinuiranu podršku.'
                    : 'Best results come when you combine quality website development, professional design, SEO optimization and continuous support.'
                  }
                </p>
                <button
                  onClick={() => {
                    trackCTAClick('Kompletno Rešenje - CTA', 'complete_solution', language);
                    navigate('/izrada-sajta-detalji');
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
                    ? 'Zašto Odabrati Nas za Izradu Sajta?'
                    : 'Why Choose Us for Website Development?'
                  }
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {language === 'sr'
                    ? 'Izrada sajta sa fokusom na vaš uspeh'
                    : 'Website development focused on your success'
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
                      ? 'Koristimo React, TypeScript i moderne CSS framework-e. Rezultat su brzi, sigurni i lako održivi sajtovi koji će služiti vašem biznisu godinama.'
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
                      ? 'Preko 100 uspešnih projekata izrade sajtova za klijente u Beogradu, Novom Sadu i celoj Srbiji, u različitim industrijama.'
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
                      ? 'Izrada sajta ne završava se sa lansiranjem. Nudimo kontinuiranu tehničku podršku, održavanje i pomoć.'
                      : 'Website development doesn\'t end with launch. We offer continuous technical support, maintenance and help.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio link */}
        <section className="py-8 bg-white text-center">
          <Link
            to="/izrada-sajta-detalji#case-study"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
          >
            <span>{language === 'sr' ? 'Pogledajte kompletan portfolio' : 'View complete portfolio'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6 px-4">
                {language === 'sr' ? 'Česta Pitanja o Izradi Sajta' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                {language === 'sr'
                  ? 'Odgovori na najčešća pitanja o ceni i procesu izrade sajta'
                  : 'Answers to the most common questions about price and process'
                }
              </p>

              <div className="space-y-4">
                {(language === 'sr' ? faqItems : [
                  { question: "Why isn't the website development price fixed?", answer: "Every business has unique needs and goals. A web shop with 100 products and warehouse integration requires much more work than a 5-page presentation site. That's why the starting price begins at €299 for simple projects, and for more complex ones we create a personalized offer - always transparent with no hidden costs." },
                  { question: "Does the price include hosting and domain?", answer: "Website development price is separate from annual hosting and domain costs. We help you choose quality hosting and register a domain. Typically, hosting and domain for a small to medium site cost €50-150 per year." },
                  { question: "Can I add new pages and content later?", answer: "Absolutely! Every website development includes an easy content management system (CMS). You can add, change and delete text, images, videos and other content yourself. You'll receive complete training on how to do this." },
                  { question: "Do you work with clients worldwide?", answer: "Yes! We develop websites for clients worldwide. All communication is done online, so physical location is not a barrier to quality collaboration. The website development price remains the same regardless of where you are located." },
                  { question: "What does the collaboration process look like?", answer: "Website development follows a clear structure: free consultation, written proposal, contract, design phase with revisions, programming, testing, launch and training. Throughout the process you have transparent insight into progress." },
                  { question: "What if I'm not satisfied with the design?", answer: "The process includes multiple review and revision phases. First we create a design mockup, get your feedback, and make changes until you're 100% satisfied. Only after your approval do we proceed with programming." },
                  { question: "Who owns the website after development?", answer: "You are 100% the owner of the website and all files. You get access to the code, hosting, domain, everything is yours. You can move it to another host, modify it, develop it further." },
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
                  ? 'Spremni za Izradu Vašeg Sajta?'
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
                    navigate('/izrada-sajta-detalji');
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
