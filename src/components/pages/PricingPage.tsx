import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Star, Crown, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

interface PriceCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  gradient: string;
  popular?: boolean;
  delay: number;
  ctaText: string;
  onCTA: () => void;
}

function PriceCard({ name, price, period, description, features, icon: Icon, gradient, popular, delay, ctaText, onCTA }: PriceCardProps) {
  return (
    <div 
      className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up ${
        popular ? 'border-violet-500 shadow-xl shadow-violet-500/20' : 'border-gray-200 hover:border-violet-300'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
            <Star className="w-4 h-4" />
            {language === 'sr' ? 'Najpopularnije' : 'Most Popular'}
          </div>
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 ${gradient} rounded-2xl mb-6`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Name */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl md:text-5xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600 ml-2">{period}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6">{description}</p>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onCTA}
        className={`w-full group px-6 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          popular 
            ? 'bg-gray-900 text-white hover:bg-white hover:text-gray-900 border-2 border-gray-900 hover:scale-105'
            : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105'
        }`}
      >
        {ctaText}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export function PricingPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
    sr: {
      hero: 'Transparentne Cene',
      subtitle: 'Bez skrivenih troškova. Sve je unapred jasno.',
      packages: {
        landing: {
          name: 'Landing Page',
          price: 'od 800€',
          period: 'projekat',
          desc: 'Savršeno za predstavljanje jedne usluge ili proizvoda',
          features: [
            'Jedna stranica, svi elementi',
            'Responzivan dizajn (desktop + mobil)',
            'Kontakt forma',
            'Google Analytics',
            'SEO osnovna optimizacija',
            '30 dana besplatna podrška'
          ],
          cta: 'Započni Projekat'
        },
        onepage: {
          name: 'One-Page Web',
          price: '1,500€',
          period: 'projekat',
          desc: 'Najčešće biran paket - sve sekcije na jednoj stranici',
          features: [
            'Sve funkcionalnosti Landing Page',
            '5-7 sekcija (Hero, Usluge, Portfolio, O nama, Kontakt)',
            'Galerija slika/portfolio',
            'Google Maps integracija',
            'SSL sertifikat',
            '60 dana besplatna podrška',
            'Besplatno 1 revizija'
          ],
          cta: 'Najpopularnije',
          popular: true
        },
        multipage: {
          name: 'Multi-Page Web',
          price: 'od 2,500€',
          period: 'projekat',
          desc: 'Za kompanije koje žele kompletan web sistem',
          features: [
            'Sve funkcionalnosti One-Page',
            '10+ posebnih stranica',
            'Blog / News sekcija',
            'CMS za lakše ažuriranje',
            'Napredni SEO',
            'Email marketing integracija',
            '90 dana besplatna podrška',
            'Besplatno 3 revizije'
          ],
          cta: 'Premium Paket'
        }
      },
      addons: {
        title: 'Dodatne Usluge',
        items: [
          { name: 'E-commerce (Online prodavnica)', price: '+1,000€' },
          { name: 'Booking sistem (Rezervacije)', price: '+500€' },
          { name: 'Multilingvalni sajt (2+ jezika)', price: '+300€' },
          { name: 'Google Ads kampanja setup', price: '+400€' },
          { name: 'Logo dizajn', price: '+200€' },
          { name: 'Content writing (profesionalni tekstovi)', price: '+150€/stranica' }
        ]
      },
      faq: {
        title: 'Često Postavljana Pitanja',
        items: [
          {
            q: 'Šta je uključeno u cenu?',
            a: 'Dizajn, programiranje, hosting setup, osnovni SEO, Google Analytics, i podršku.'
          },
          {
            q: 'Koliko traje izrada?',
            a: 'Landing Page: 1-2 nedelje, One-Page: 2-3 nedelje, Multi-Page: 3-6 nedelja.'
          },
          {
            q: 'Da li mogu platiti na rate?',
            a: 'Da! Nudimo opciju plaćanja na 2-3 rate bez kamate.'
          },
          {
            q: 'Šta ako nemam logotip ili slike?',
            a: 'Pomažemo! Logo dizajn je +200€, a stock slike su uključene.'
          }
        ]
      },
      cta: {
        title: 'Niste sigurni koji paket vam treba?',
        subtitle: 'Zakažite besplatnu konsultaciju i pomožićemo vam da izaberete najbolje rešenje.',
        button: 'Besplatna Konsultacija'
      }
    },
    en: {
      hero: 'Transparent Pricing',
      subtitle: 'No hidden costs. Everything is clear upfront.',
      packages: {
        landing: {
          name: 'Landing Page',
          price: 'from 800€',
          period: 'project',
          desc: 'Perfect for presenting one service or product',
          features: [
            'One page, all elements',
            'Responsive design (desktop + mobile)',
            'Contact form',
            'Google Analytics',
            'Basic SEO optimization',
            '30 days free support'
          ],
          cta: 'Start Project'
        },
        onepage: {
          name: 'One-Page Website',
          price: '1,500€',
          period: 'project',
          desc: 'Most chosen package - all sections on one page',
          features: [
            'All Landing Page features',
            '5-7 sections (Hero, Services, Portfolio, About, Contact)',
            'Image gallery/portfolio',
            'Google Maps integration',
            'SSL certificate',
            '60 days free support',
            'Free 1 revision'
          ],
          cta: 'Most Popular',
          popular: true
        },
        multipage: {
          name: 'Multi-Page Website',
          price: 'from 2,500€',
          period: 'project',
          desc: 'For companies that want a complete web system',
          features: [
            'All One-Page features',
            '10+ separate pages',
            'Blog / News section',
            'CMS for easy updates',
            'Advanced SEO',
            'Email marketing integration',
            '90 days free support',
            'Free 3 revisions'
          ],
          cta: 'Premium Package'
        }
      },
      addons: {
        title: 'Additional Services',
        items: [
          { name: 'E-commerce (Online store)', price: '+1,000€' },
          { name: 'Booking system (Reservations)', price: '+500€' },
          { name: 'Multilingual site (2+ languages)', price: '+300€' },
          { name: 'Google Ads campaign setup', price: '+400€' },
          { name: 'Logo design', price: '+200€' },
          { name: 'Content writing (professional copy)', price: '+150€/page' }
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'What\'s included in the price?',
            a: 'Design, development, hosting setup, basic SEO, Google Analytics, and support.'
          },
          {
            q: 'How long does it take?',
            a: 'Landing Page: 1-2 weeks, One-Page: 2-3 weeks, Multi-Page: 3-6 weeks.'
          },
          {
            q: 'Can I pay in installments?',
            a: 'Yes! We offer payment in 2-3 installments with no interest.'
          },
          {
            q: 'What if I don\'t have a logo or images?',
            a: 'We help! Logo design is +200€, stock images are included.'
          }
        ]
      },
      cta: {
        title: 'Not sure which package you need?',
        subtitle: 'Schedule a free consultation and we\'ll help you choose the best solution.',
        button: 'Free Consultation'
      }
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Cene Izrade Sajta | Transparentni Paket Cene | AISajt' : 'Website Development Pricing | Transparent Package Prices | AISajt'}
        description={language === 'sr' ? 'Transparentne cene za izradu web sajtova. Landing stranice, kompleksni sajtovi i premium paketi. Bez skrivenih troškova.' : 'Transparent prices for website development. Landing pages, complex websites and premium packages. No hidden costs.'}
        keywords="cene sajta, cenovnik, landing page cena, izrada sajta cena, web development pricing"
        canonicalUrl="https://aisajt.com/pricing"
      />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {t.hero}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed animate-fade-in-up animation-delay-400">
              {t.subtitle}
            </p>
            
            <p className="text-base text-gray-500 animate-fade-in-up animation-delay-500">
              {language === 'sr' ? (
                <>
                  Prvo put na sajtu? Pogledajte{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    početnu stranicu
                  </Link>
                  {' '}ili saznajte više o našoj{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimizaciji
                  </Link>.
                </>
              ) : (
                <>
                  First time here? Check out our{' '}
                  <Link to="/" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    homepage
                  </Link>
                  {' '}or learn more about our{' '}
                  <Link to="/seo" className="text-violet-600 hover:text-violet-700 font-semibold underline">
                    SEO optimization
                  </Link>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Package 1: Landing */}
            <PriceCard
              name={t.packages.landing.name}
              price={t.packages.landing.price}
              period={t.packages.landing.period}
              description={t.packages.landing.desc}
              features={t.packages.landing.features}
              icon={Zap}
              gradient="bg-gradient-to-br from-violet-500 to-indigo-600"
              delay={0.2}
              ctaText={t.packages.landing.cta}
              onCTA={() => navigate('/contact')}
            />

            {/* Package 2: One-Page (Popular) */}
            <PriceCard
              name={t.packages.onepage.name}
              price={t.packages.onepage.price}
              period={t.packages.onepage.period}
              description={t.packages.onepage.desc}
              features={t.packages.onepage.features}
              icon={Star}
              gradient="bg-gradient-to-br from-pink-500 to-violet-600"
              popular
              delay={0.3}
              ctaText={t.packages.onepage.cta}
              onCTA={() => navigate('/contact')}
            />

            {/* Package 3: Multi-Page */}
            <PriceCard
              name={t.packages.multipage.name}
              price={t.packages.multipage.price}
              period={t.packages.multipage.period}
              description={t.packages.multipage.desc}
              features={t.packages.multipage.features}
              icon={Crown}
              gradient="bg-gradient-to-br from-indigo-500 to-pink-600"
              delay={0.4}
              ctaText={t.packages.multipage.cta}
              onCTA={() => navigate('/contact')}
            />

          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-gradient-to-b from-white via-violet-50/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              {t.addons.title}
            </h2>
            <p className="text-center text-gray-600 mb-12">
              {language === 'sr' ? 'Proširite funkcionalnost vašeg sajta' : 'Expand your website functionality'}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {t.addons.items.map((addon, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <span className="text-gray-800 font-medium">{addon.name}</span>
                  <span className="text-violet-600 font-bold">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              {t.faq.title}
            </h2>

            <div className="space-y-6">
              {t.faq.items.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
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
            <Sparkles className="w-16 h-16 text-violet-600 mx-auto mb-6 animate-bounce-subtle" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t.cta.subtitle}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="group px-10 py-5 bg-gray-900 text-white rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:shadow-2xl"
            >
              {t.cta.button}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

