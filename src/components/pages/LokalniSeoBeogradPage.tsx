import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { FAQSchema } from '../seo/FAQSchema';
import { ServiceSchema } from '../seo/ServiceSchema';
import { trackCTAClick } from '../../utils/analytics';

const OPSTINE = ['Novi Beograd', 'Vračar', 'Zvezdara', 'Voždovac', 'Palilula'];

export function LokalniSeoBeogradPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const faqItems = language === 'sr' ? [
    {
      question: 'Po čemu se lokalni SEO za opštine razlikuje od običnog SEO-a?',
      answer: 'Cilja uže, geografski specifične upite ("usluga + opština" ili "usluga + kraj grada") umesto samo "usluga + Beograd". Uključuje Google My Business optimizaciju, lokalne direktorijume i sadržaj koji pominje konkretne delove grada koje opslužujete.'
    },
    {
      question: 'Radite li lokalni SEO samo za ovih pet opština?',
      answer: 'Ne, ovo su opštine gde imamo konkretan, dokumentovan primer rada (Komotraks). Lokalni SEO radimo za bilo koju opštinu ili deo Beograda, kao i za druge gradove u Srbiji, u zavisnosti gde su vaši klijenti.'
    },
    {
      question: 'Koliko košta lokalna SEO optimizacija?',
      answer: 'Ista logika cene kao i za standardnu SEO optimizaciju: zavisi od broja ciljanih opština i konkurencije. Pogledajte cenovnik na stranici SEO optimizacija cena za tačne pakete.'
    },
    {
      question: 'Da li mi treba lokalni SEO ako već imam sajt?',
      answer: 'Da, lokalni SEO se nadograđuje na postojeći sajt. Ne morate praviti novi sajt da biste dodali lokalno targetiranje po opštinama.'
    },
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
      <SEOHelmet
        title={language === 'sr'
          ? 'Lokalna SEO Optimizacija za Beogradske Opštine | AiSajt'
          : 'Local SEO Optimization for Belgrade Municipalities | AiSajt'
        }
        description={language === 'sr'
          ? 'Lokalna SEO optimizacija po beogradskim opštinama: Novi Beograd, Vračar, Zvezdara, Voždovac, Palilula i dalje. Pogledajte kako smo to uradili za Komotraks.'
          : 'Local SEO optimization for Belgrade municipalities: Novi Beograd, Vračar, Zvezdara, Voždovac, Palilula and beyond. See how we did it for Komotraks.'
        }
        keywords={language === 'sr'
          ? 'lokalni seo beograd, seo za beogradske opštine, lokalna seo optimizacija'
          : 'local seo belgrade, seo for belgrade municipalities, local seo optimization'
        }
        canonicalUrl="https://aisajt.com/lokalni-seo-beograd"
      />
      <FAQSchema items={faqItems} />
      <ServiceSchema
        serviceType="Lokalna SEO optimizacija"
        description="Lokalna SEO optimizacija po beogradskim opštinama, sa fokusom na geografski specifične pretrage."
        path="/lokalni-seo-beograd"
        areaServed={[
          ...OPSTINE.map((o) => ({ '@type': 'AdministrativeArea', name: o })),
          { '@type': 'City', name: 'Beograd' },
        ]}
      />

      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-16 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white"></div>
          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 md:mb-6 px-2">
                {language === 'sr' ? 'Lokalna SEO Optimizacija za Beogradske Opštine' : 'Local SEO Optimization for Belgrade Municipalities'}
              </h1>

              <div className="max-w-3xl mx-auto mb-8 px-4 py-4 rounded-2xl bg-violet-50 border border-violet-200 text-left">
                <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                  {language === 'sr'
                    ? <>Lokalni SEO za beogradske opštine cilja upite specifične za konkretan deo grada, umesto samo "Beograd" uopšteno. Radimo ovo kao nadgradnju na standardnu SEO optimizaciju, sa fokusom na Google My Business, lokalne direktorijume i sadržaj koji pominje deo grada koji opslužujete.</>
                    : <>Local SEO for Belgrade municipalities targets queries specific to a particular part of the city, rather than just "Belgrade" broadly. We do this as an addition to standard SEO optimization, focused on Google My Business, local directories and content that names the part of the city you serve.</>
                  }
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    trackCTAClick('Besplatna Konsultacija - Lokalni SEO Hero', 'lokalni_seo_hero', language);
                    navigate('/izrada-sajta-detalji');
                  }}
                  className="group px-6 py-3.5 sm:px-7 sm:py-4 bg-gray-900 text-white text-base sm:text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">{language === 'sr' ? 'Zatražite Besplatnu Analizu' : 'Request Free Analysis'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Šta je lokalni SEO na nivou opštine - definicioni blok */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sr' ? 'Šta je Lokalni SEO na Nivou Opštine?' : 'What Is Municipality-Level Local SEO?'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                {language === 'sr'
                  ? 'Lokalni SEO na nivou opštine je optimizacija sajta za pretrage koje pominju konkretan deo grada, na primer "ugradnja komarnika Vračar" umesto samo "ugradnja komarnika Beograd". Obuhvata Google My Business profil, upise u lokalne direktorijume, i sadržaj na sajtu koji imenuje opštine ili delove grada koje opslužujete. Ima smisla za firme koje fizički pokrivaju ili dolaze na adresu u određenim delovima grada, ne za sajtove koji prodaju isključivo online bez geografskog ograničenja.'
                  : 'Municipality-level local SEO is optimization for searches that name a specific part of the city, for example "insect screen installation Vračar" instead of just "insect screen installation Belgrade". It covers a Google My Business profile, local directory listings, and on-site content that names the municipalities or parts of the city you serve. It makes sense for businesses that physically cover or visit addresses in specific parts of the city, not for sites selling purely online with no geographic limit.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Opštine */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sr' ? 'Opštine Gde Imamo Dokumentovan Primer Rada' : 'Municipalities Where We Have a Documented Example'}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
                {language === 'sr'
                  ? 'Ovih pet opština smo konkretno targetirali za klijenta Komotraks. Lokalni SEO radimo i za druge delove Beograda i Srbije, u zavisnosti gde tražite klijente.'
                  : 'We specifically targeted these five municipalities for our client Komotraks. We also do local SEO for other parts of Belgrade and Serbia, depending on where your clients are.'
                }
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {OPSTINE.map((opstina) => (
                  <span key={opstina} className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full text-violet-700 font-medium text-sm">
                    <MapPin className="w-4 h-4" />
                    {opstina}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Primer: Komotraks */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Primer: Komotraks' : 'Example: Komotraks'}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 shadow-lg border border-gray-100">
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
                </a>
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {language === 'sr'
                      ? 'Komotraks, firma za ugradnju komarnika, harmonika vrata i zavesa u Beogradu, dobio je sajt sa lokalnim SEO-om targetiranim po beogradskim opštinama i blog sekcijom za organski saobraćaj. Bez plaćenih oglasa, sajt je počeo da privlači posetioce direktno iz pretrage za lokalne upite specifične za njihovu delatnost.'
                      : 'Komotraks, an insect screen, folding door and blinds installer in Belgrade, got a site with local SEO targeted by Belgrade municipalities and a blog section for organic traffic. With no paid ads, the site started attracting visitors directly from search for local queries specific to their trade.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">{language === 'sr' ? 'Lokalni SEO' : 'Local SEO'}</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Lead Gen</span>
                  </div>
                  <Link
                    to="/portfolio/komotraks"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium group"
                  >
                    <span>{language === 'sr' ? 'Pogledajte projekat Komotraks' : 'View the Komotraks project'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Zašto lokalni SEO pravi razliku */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                {language === 'sr' ? 'Zašto Lokalni SEO Pravi Razliku' : 'Why Local SEO Makes a Difference'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  language === 'sr' ? 'Manja konkurencija za "usluga + opština" nego za "usluga + Beograd"' : 'Less competition for "service + municipality" than for "service + Belgrade"',
                  language === 'sr' ? 'Ljudi koji pretražuju sa lokalnom namerom su bliže odluci o kupovini' : 'People searching with local intent are closer to a buying decision',
                  language === 'sr' ? 'Google My Business profil se pojavljuje na mapi za lokalne pretrage' : 'Google My Business profile appears on the map for local searches',
                  language === 'sr' ? 'Radi bez plaćanja po kliku, za razliku od geo-targetiranih oglasa' : 'Works without paying per click, unlike geo-targeted ads',
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

        {/* Kako izgleda proces lokalne SEO optimizacije */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sr' ? 'Kako Izgleda Proces Lokalne SEO Optimizacije' : 'What the Local SEO Process Looks Like'}
              </h2>
              <ol className="space-y-4">
                {(language === 'sr' ? [
                  ['Google My Business profil.', 'Kreiramo ili optimizujemo profil sa tačnom adresom, radnim vremenom, kategorijama usluga i oblastima koje pokrivate.'],
                  ['Sadržaj specifičan za opštinu.', 'Na sajtu dodajemo sekcije ili stranice koje imenuju konkretne opštine ili delove grada koje opslužujete, umesto generičkog "Beograd".'],
                  ['Lokalni direktorijumi.', 'Upisujemo firmu u relevantne lokalne direktorijume, sa identičnim imenom, adresom i telefonom (NAP) kao na sajtu.'],
                  ['Praćenje pozicija po opštini.', 'Pratimo kako sajt rangira za lokalne upite u svakoj ciljanoj opštini, ne samo za grad uopšteno.'],
                ] : [
                  ['Google My Business profile.', 'We create or optimize the profile with the exact address, hours, service categories and areas covered.'],
                  ['Municipality-specific content.', 'We add sections or pages naming the specific municipalities or parts of the city you serve, instead of generic "Belgrade".'],
                  ['Local directories.', 'We list the business in relevant local directories, with a name, address and phone number identical to the site.'],
                  ['Per-municipality tracking.', 'We track how the site ranks for local queries in each targeted municipality, not just the city overall.'],
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

        {/* Cena - link ka pillar stranici */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center scroll-animate">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {language === 'sr' ? 'Cena Lokalne SEO Optimizacije' : 'Local SEO Optimization Pricing'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {language === 'sr'
                  ? <>Lokalni SEO se obračunava po istoj logici kao i standardna SEO optimizacija: zavisi od broja opština koje targetirate i konkurencije. Pogledajte tačne pakete na stranici{' '}
                      <Link to="/seo-optimizacija-cena" className="text-violet-600 hover:text-violet-700 font-semibold underline">SEO optimizacija cena</Link>.</>
                  : <>Local SEO is priced with the same logic as standard SEO optimization: it depends on how many municipalities you target and competition. See exact packages on the{' '}
                      <Link to="/seo-optimizacija-cena" className="text-violet-600 hover:text-violet-700 font-semibold underline">SEO optimization pricing</Link> page.</>
                }
              </p>
              <button
                onClick={() => {
                  trackCTAClick('Lokalni SEO - CTA', 'lokalni_seo_cta', language);
                  navigate('/izrada-sajta-detalji');
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>{language === 'sr' ? 'Zatražite Ponudu' : 'Request a Quote'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto scroll-animate">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10 px-4">
                {language === 'sr' ? 'Česta Pitanja' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {(language === 'sr' ? faqItems : [
                  { question: 'How is municipality-level local SEO different from regular SEO?', answer: 'It targets narrower, geographically specific queries ("service + municipality") instead of just "service + Belgrade". It includes Google My Business optimization, local directories and content naming the specific parts of the city you serve.' },
                  { question: 'Do you only do local SEO for these five municipalities?', answer: 'No, these are the municipalities where we have a concrete, documented example (Komotraks). We do local SEO for any municipality or part of Belgrade, and other cities in Serbia, depending on where your clients are.' },
                  { question: 'How much does local SEO optimization cost?', answer: 'Same pricing logic as standard SEO: it depends on the number of targeted municipalities and competition. See the SEO optimization pricing page for exact packages.' },
                  { question: 'Do I need local SEO if I already have a website?', answer: 'Yes, local SEO builds on top of an existing site. You don\'t need a new website to add municipality-level local targeting.' },
                ]).map((item, index) => (
                  <div key={item.question} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left transition-colors duration-300 hover:bg-gray-50"
                    >
                      <span className="text-base md:text-lg font-semibold text-gray-900 flex-1">{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-violet-600 flex-shrink-0 transition-transform duration-300 ${openFAQIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${openFAQIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-6 pb-5 pt-2">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA + cross-links */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-10 h-10 text-violet-600 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {language === 'sr' ? 'Spremni da Vas Nađu u Vašoj Opštini?' : 'Ready to Be Found in Your Municipality?'}
              </h2>
              <p className="text-gray-600 mb-8">
                {language === 'sr' ? 'Zakažite besplatnu analizu i saznajte koliko konkurencije ima za vaše lokalne ključne reči.' : 'Schedule a free analysis and find out how much competition there is for your local keywords.'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  onClick={() => {
                    trackCTAClick('Final CTA', 'lokalni_seo_final', language);
                    navigate('/izrada-sajta-detalji');
                  }}
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-xl"
                >
                  {language === 'sr' ? 'Zakažite Besplatnu Analizu' : 'Schedule Free Analysis'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link
                  to="/seo-optimizacija-cena"
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                >
                  {language === 'sr' ? 'SEO Optimizacija Cena' : 'SEO Optimization Pricing'}
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
