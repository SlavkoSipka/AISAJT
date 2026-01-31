import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Search, MessageCircle, Mail, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
}

function FAQItem({ question, answer, isOpen, onToggle, delay }: FAQItemProps) {
  return (
    <div 
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-violet-300 transition-all duration-300 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        <ChevronDown 
          className={`w-6 h-6 text-violet-600 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const content = {
    sr: {
      hero: 'Često Postavljana Pitanja',
      subtitle: 'Odgovori na najčešća pitanja o izradi web sajtova',
      intro: 'Pronađite odgovore na sva vaša pitanja o našim uslugama.',
      search: 'Pretražite pitanja...',
      categories: {
        general: 'Opšta Pitanja',
        pricing: 'Cene i Plaćanje',
        process: 'Proces Izrade',
        support: 'Podrška i Održavanje',
        technical: 'Tehnička Pitanja'
      },
      faqs: {
        general: [
          {
            q: 'Koliko traje izrada web sajta?',
            a: 'Vreme izrade zavisi od tipa sajta: Landing Page (1-2 nedelje), One-Page (2-3 nedelje), Multi-Page (3-6 nedelja). Ovo uključuje dizajn, razvoj, testiranje i deployment.'
          },
          {
            q: 'Da li mogu videti sajt pre nego što bude završen?',
            a: 'Apsolutno! Tokom izrade dobijate pristup test verziji sajta gde možete pratiti napredak i davati feedback u realnom vremenu.'
          },
          {
            q: 'Šta ako mi se ne dopadne dizajn?',
            a: 'Svaki paket uključuje određen broj besplatnih revizija (Landing: 1, One-Page: 1, Multi-Page: 3). Dodatne izmene se naplaćuju po dogovoru.'
          },
          {
            q: 'Da li radite i za klijente van Srbije?',
            a: 'Da! Radimo sa klijentima iz cele Ex-Yu regije, Europe i sveta. Komunikacija preko Zoom/Skype, plaćanje preko PayPal/banka.'
          }
        ],
        pricing: [
          {
            q: 'Šta je tačno uključeno u cenu?',
            a: 'Cena uključuje: dizajn, programiranje, responzivnost (desktop+mobil+tablet), hosting setup, domenu (1 godina), SSL sertifikat, Google Analytics, osnovni SEO, i podršku tokom perioda navedenog u paketu.'
          },
          {
            q: 'Da li mogu platiti na rate?',
            a: 'Da! Nudimo fleksibilne opcije plaćanja: 50% unapred + 50% na kraju, ili podelu na 3 rate (bez kamate) - 40% početak, 30% u toku, 30% na kraju.'
          },
          {
            q: 'Koliko košta održavanje sajta?',
            a: 'Hosting + domena: ~50-100€/godišnje. Ako želite da mi održavamo sajt (izmene, backup, sigurnost): od 50€/mesec za osnovni plan.'
          },
          {
            q: 'Da li su prikazane cene konačne?',
            a: 'Prikazane cene su početne. Konačna cena zavisi od kompleksnosti projekta, dodatnih funkcionalnosti koje tražite, i specifičnih zahteva.'
          }
        ],
        process: [
          {
            q: 'Kako izgleda proces izrade sajta?',
            a: '1) Besplatna konsultacija, 2) Ponuda i ugovor, 3) Prikupljanje materijala (slike, tekstovi, logo), 4) Dizajn mockup, 5) Programiranje, 6) Testiranje, 7) Deployment i obuka.'
          },
          {
            q: 'Šta ako nemam logotip ili slike?',
            a: 'Nije problem! Logo dizajn je +200€, a kvalitetne stock slike su uključene u cenu. Možemo preporučiti i fotografa ako vam trebaju profesionalne fotografije.'
          },
          {
            q: 'Ko piše tekstove za sajt?',
            a: 'Vi možete dostaviti tekstove, ili mi možemo napisati profesionalne tekstove za +150€ po stranici. Uključuje SEO optimizaciju i copywriting.'
          },
          {
            q: 'Da li moram da znam nešto o programiranju?',
            a: 'Apsolutno ne! Mi se bavimo svim tehničkim aspektima. Vi samo dajete feedback i mi realizujemo vašu viziju.'
          }
        ],
        support: [
          {
            q: 'Šta se dešava nakon lansiranja sajta?',
            a: 'Dobijate period besplatne podrške (30-90 dana zavisno od paketa), obuku kako da koristite sajt, i pristup našoj tehničkoj podršci za sva pitanja.'
          },
          {
            q: 'Ko je vlasnik sajta nakon izrade?',
            a: 'Vi ste 100% vlasnik sajta i svih fajlova. Dobijate pristup kod-u, hosting-u, domeni - sve je vaše.'
          },
          {
            q: 'Šta ako trebam hitnu izmenu?',
            a: 'Odgovaramo na sve upite u roku od 24h. Za hitne izmene (bug-ove) reagujemo odmah. Redovne izmene zavise od dogovorenog paketa podrške.'
          },
          {
            q: 'Da li nudite obuku kako da koristim sajt?',
            a: 'Da! Nakon završetka projekta održavamo video call sesiju gde vas obučavamo kako da menjate tekstove, slike, i osnovne stvari na sajtu.'
          }
        ],
        technical: [
          {
            q: 'Koje tehnologije koristite?',
            a: 'Koristimo moderne tehnologije: React, TypeScript, Vite, Tailwind CSS. Za kompleksnije projekte: Node.js, MongoDB, Next.js. Sve zavisi od zahteva projekta.'
          },
          {
            q: 'Da li su sajtovi responzivni?',
            a: 'Apsolutno! Svi naši sajtovi su 100% responzivni i funkcionišu savršeno na svim uređajima - desktop, tablet, mobilni telefoni.'
          },
          {
            q: 'Da li radite SEO optimizaciju?',
            a: 'Da! Svaki paket uključuje osnovni SEO (meta tagovi, brzina, struktura). Za napredni SEO (keyword research, content plan, backlinks): +500€.'
          },
          {
            q: 'Da li integrisete Google Analytics i Email marketing?',
            a: 'Google Analytics je uključen u svim paketima. Email marketing (Mailchimp, Brevo) integracija je moguća za +200€.'
          }
        ]
      },
      cta: {
        title: 'Niste našli odgovor?',
        subtitle: 'Kontaktirajte nas direktno - odgovorićemo u roku od 24h',
        button: 'Pošaljite Pitanje'
      }
    },
    en: {
      hero: 'Frequently Asked Questions',
      subtitle: 'Answers to the most common questions about web development',
      search: 'Search questions...',
      categories: {
        general: 'General Questions',
        pricing: 'Pricing & Payment',
        process: 'Development Process',
        support: 'Support & Maintenance',
        technical: 'Technical Questions'
      },
      faqs: {
        general: [
          {
            q: 'How long does website development take?',
            a: 'Timeline depends on site type: Landing Page (1-2 weeks), One-Page (2-3 weeks), Multi-Page (3-6 weeks). This includes design, development, testing, and deployment.'
          },
          {
            q: 'Can I see the site before it\'s finished?',
            a: 'Absolutely! During development you get access to a test version where you can track progress and give real-time feedback.'
          },
          {
            q: 'What if I don\'t like the design?',
            a: 'Each package includes a number of free revisions (Landing: 1, One-Page: 1, Multi-Page: 3). Additional changes are charged by agreement.'
          },
          {
            q: 'Do you work with clients outside Serbia?',
            a: 'Yes! We work with clients from entire Ex-Yu region, Europe, and worldwide. Communication via Zoom/Skype, payment via PayPal/bank.'
          }
        ],
        pricing: [
          {
            q: 'What exactly is included in the price?',
            a: 'Price includes: design, development, responsiveness (desktop+mobile+tablet), hosting setup, domain (1 year), SSL certificate, Google Analytics, basic SEO, and support during the stated period.'
          },
          {
            q: 'Can I pay in installments?',
            a: 'Yes! We offer flexible payment options: 50% upfront + 50% at the end, or split into 3 installments (no interest) - 40% start, 30% middle, 30% end.'
          },
          {
            q: 'How much does site maintenance cost?',
            a: 'Hosting + domain: ~50-100€/year. If you want us to maintain the site (changes, backup, security): from 50€/month for basic plan.'
          },
          {
            q: 'Are the displayed prices final?',
            a: 'Displayed prices are starting prices. Final price depends on project complexity, additional functionality you request, and specific requirements.'
          }
        ],
        process: [
          {
            q: 'What does the development process look like?',
            a: '1) Free consultation, 2) Quote and contract, 3) Gathering materials (images, texts, logo), 4) Design mockup, 5) Development, 6) Testing, 7) Deployment and training.'
          },
          {
            q: 'What if I don\'t have a logo or images?',
            a: 'No problem! Logo design is +200€, and quality stock images are included. We can also recommend a photographer if you need professional photos.'
          },
          {
            q: 'Who writes the website copy?',
            a: 'You can provide texts, or we can write professional copy for +150€ per page. Includes SEO optimization and copywriting.'
          },
          {
            q: 'Do I need to know anything about programming?',
            a: 'Absolutely not! We handle all technical aspects. You just give feedback and we realize your vision.'
          }
        ],
        support: [
          {
            q: 'What happens after site launch?',
            a: 'You get a free support period (30-90 days depending on package), training on how to use the site, and access to our tech support for all questions.'
          },
          {
            q: 'Who owns the site after development?',
            a: 'You are 100% owner of the site and all files. You get access to code, hosting, domain - everything is yours.'
          },
          {
            q: 'What if I need urgent changes?',
            a: 'We respond to all inquiries within 24h. For urgent changes (bugs) we react immediately. Regular changes depend on agreed support package.'
          },
          {
            q: 'Do you offer training on how to use the site?',
            a: 'Yes! After project completion we hold a video call session where we train you how to change texts, images, and basic things on the site.'
          }
        ],
        technical: [
          {
            q: 'What technologies do you use?',
            a: 'We use modern technologies: React, TypeScript, Vite, Tailwind CSS. For more complex projects: Node.js, MongoDB, Next.js. Everything depends on project requirements.'
          },
          {
            q: 'Are the sites responsive?',
            a: 'Absolutely! All our sites are 100% responsive and work perfectly on all devices - desktop, tablet, mobile phones.'
          },
          {
            q: 'Do you do SEO optimization?',
            a: 'Yes! Each package includes basic SEO (meta tags, speed, structure). For advanced SEO (keyword research, content plan, backlinks): +500€.'
          },
          {
            q: 'Do you integrate Google Analytics and Email marketing?',
            a: 'Google Analytics is included in all packages. Email marketing (Mailchimp, Brevo) integration is possible for +200€.'
          }
        ]
      },
      cta: {
        title: 'Didn\'t find an answer?',
        subtitle: 'Contact us directly - we\'ll respond within 24h',
        button: 'Send Question'
      }
    }
  };

  const t = content[language];

  // Combine all FAQs for search
  const allFAQs = [
    ...t.faqs.general.map(faq => ({ ...faq, category: t.categories.general })),
    ...t.faqs.pricing.map(faq => ({ ...faq, category: t.categories.pricing })),
    ...t.faqs.process.map(faq => ({ ...faq, category: t.categories.process })),
    ...t.faqs.support.map(faq => ({ ...faq, category: t.categories.support })),
    ...t.faqs.technical.map(faq => ({ ...faq, category: t.categories.technical }))
  ];

  // Filter FAQs based on search
  const filteredFAQs = searchQuery 
    ? allFAQs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFAQs;

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Česta Pitanja (FAQ) | Sve o Izradi Sajta | AISajt' : 'Frequently Asked Questions (FAQ) | All About Website Development | AISajt'}
        description={language === 'sr' ? 'Odgovori na najčešća pitanja o izradi web sajtova, cenama, vremenskim rokovima i procesu razvoja. Sve što trebate da znate o web development-u.' : 'Answers to the most common questions about website development, prices, deadlines and development process. Everything you need to know about web development.'}
        keywords="faq, česta pitanja, izrada sajta pitanja, cene sajta, web development faq"
        canonicalUrl="https://aisajt.com/faq"
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {t.hero}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed animate-fade-in-up animation-delay-400">
              {t.subtitle}
            </p>
            
            <p className="text-base text-gray-500 mb-10 animate-fade-in-up animation-delay-500">
              {language === 'sr' ? (
                <>
                  Pogledajte sve naše usluge na{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    početnoj stranici
                  </Link>
                  {' '}ili saznajte više o{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimizaciji
                  </Link>.
                </>
              ) : (
                <>
                  View all our services on our{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    homepage
                  </Link>
                  {' '}or learn more about{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimization
                  </Link>.
                </>
              )}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                  delay={0.05 * index}
                />
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-20">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {language === 'sr' ? 'Nema rezultata. Pokušajte drugu pretragu.' : 'No results. Try another search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-16 h-16 text-violet-600 mx-auto mb-6 animate-bounce-subtle" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t.cta.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t.cta.button}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a 
                href="tel:+381641234567"
                className="group px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {language === 'sr' ? 'Pozovite Nas' : 'Call Us'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

