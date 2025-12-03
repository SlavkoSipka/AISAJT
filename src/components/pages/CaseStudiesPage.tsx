import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Award, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  image: string;
  challenge: string;
  solution: string;
  results: string[];
  stats: { label: string; value: string; }[];
  url?: string;
}

export function CaseStudiesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const content = {
    sr: {
      hero: 'Studije Slučaja',
      subtitle: 'Rezultati koji govore sami za sebe',
      cta: 'Započnite Vaš Projekat',
      viewWebsite: 'Posetite Sajt',
      challenge: 'Izazov',
      solution: 'Rešenje',
      results: 'Rezultati',
      caseStudies: [
        {
          id: '1',
          client: 'Kralj Residence',
          industry: 'Apartmani',
          image: '/images/kralj-residence.jpg',
          challenge: 'Klijent je imao stari sajt bez mogućnosti rezervacija. Nije bilo online prisutnosti, konkurencija ih je prestizala na Google-u.',
          solution: 'Kreirali smo moderan one-page sajt sa integrisanim booking sistemom, naprednim SEO, Google Maps, i galerijom sa 50+ slika.',
          results: [
            'Sajt optimizovan za brzinu (<2s load time)',
            'Mobile-first dizajn',
            'Integracija sa Booking.com',
            'Google Analytics i Facebook Pixel setup'
          ],
          stats: [
            { label: 'Povećanje rezervacija', value: '+300%' },
            { label: 'Google pozicija', value: 'Top 3' },
            { label: 'Profit za 6 meseci', value: '15,000€' }
          ],
          url: 'https://kraljresidence.com'
        },
        {
          id: '2',
          client: 'BN Autofolije',
          industry: 'Auto Usluge',
          image: '/images/bn-autofolije.jpg',
          challenge: 'Kompanija nije imala web sajt. Svi klijenti dolazili su preporukom, nisu mogli da skaliraju biznis.',
          solution: 'Napravili smo elegantni one-page sa galerijom uradenih radova, cenovnikom, Google Maps, i kontakt formom.',
          results: [
            'Portfolio galerija sa before/after slikama',
            'Jasni paketi i cene',
            'WhatsApp i poziv direktno sa sajta',
            'Instagram integracija'
          ],
          stats: [
            { label: 'Novi klijenti mesečno', value: '+50' },
            { label: 'Online upita', value: '+200%' },
            { label: 'ROI za 3 meseca', value: '400%' }
          ],
          url: 'https://bnautof olije.rs'
        },
        {
          id: '3',
          client: 'Modern Interior',
          industry: 'Dizajn Enterijera',
          image: '/images/modern-interior.jpg',
          challenge: 'Designer je želeo portfolio koji prikazuje projekte na elegantan način, ali bez komplikovanog CMS-a.',
          solution: 'Multi-page sajt sa portfolio stranicom, detaljnim view-om svakog projekta, blog sekcijom, i kontakt formom.',
          results: [
            'Minimalistički dizajn',
            'Portfolio sa filterima po tipu projekta',
            'Blog za SEO (kako dizajnirati, trendovi)',
            'Lead forma sa upitom za ponudu'
          ],
          stats: [
            { label: 'Porast upita', value: '+180%' },
            { label: 'Organic traffic', value: '+250%' },
            { label: 'Konverzija', value: '8.5%' }
          ]
        }
      ]
    },
    en: {
      hero: 'Case Studies',
      subtitle: 'Results that speak for themselves',
      cta: 'Start Your Project',
      viewWebsite: 'Visit Website',
      challenge: 'Challenge',
      solution: 'Solution',
      results: 'Results',
      caseStudies: [
        {
          id: '1',
          client: 'Kralj Residence',
          industry: 'Apartments',
          image: '/images/kralj-residence.jpg',
          challenge: 'Client had an old site without booking capability. No online presence, competition was surpassing them on Google.',
          solution: 'We created a modern one-page site with integrated booking system, advanced SEO, Google Maps, and gallery with 50+ images.',
          results: [
            'Site optimized for speed (<2s load time)',
            'Mobile-first design',
            'Booking.com integration',
            'Google Analytics and Facebook Pixel setup'
          ],
          stats: [
            { label: 'Booking increase', value: '+300%' },
            { label: 'Google position', value: 'Top 3' },
            { label: 'Profit in 6 months', value: '15,000€' }
          ],
          url: 'https://kraljresidence.com'
        },
        {
          id: '2',
          client: 'BN Autofolije',
          industry: 'Auto Services',
          image: '/images/bn-autofolije.jpg',
          challenge: 'Company had no website. All clients came by referral, couldn\'t scale the business.',
          solution: 'We made an elegant one-page with gallery of completed work, pricing, Google Maps, and contact form.',
          results: [
            'Portfolio gallery with before/after images',
            'Clear packages and prices',
            'WhatsApp and call directly from site',
            'Instagram integration'
          ],
          stats: [
            { label: 'New clients monthly', value: '+50' },
            { label: 'Online inquiries', value: '+200%' },
            { label: 'ROI in 3 months', value: '400%' }
          ],
          url: 'https://bnautofolije.rs'
        },
        {
          id: '3',
          client: 'Modern Interior',
          industry: 'Interior Design',
          image: '/images/modern-interior.jpg',
          challenge: 'Designer wanted a portfolio showcasing projects elegantly, but without complicated CMS.',
          solution: 'Multi-page site with portfolio page, detailed view of each project, blog section, and contact form.',
          results: [
            'Minimalist design',
            'Portfolio with filters by project type',
            'Blog for SEO (how to design, trends)',
            'Lead form with quote request'
          ],
          stats: [
            { label: 'Inquiry increase', value: '+180%' },
            { label: 'Organic traffic', value: '+250%' },
            { label: 'Conversion', value: '8.5%' }
          ]
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="px-6 py-2 bg-gradient-to-r from-violet-100 via-indigo-100 to-pink-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-violet-200 rounded-full">
                🏆 {language === 'sr' ? 'Naši Projekti' : 'Our Projects'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
              {t.hero}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-32 max-w-7xl mx-auto">
            
            {t.caseStudies.map((study, index) => (
              <div 
                key={study.id}
                className={`grid md:grid-cols-2 gap-12 items-center animate-fade-in-up ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden aspect-video shadow-2xl">
                      {/* Placeholder for actual image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-24 h-24 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="inline-block px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
                    {study.industry}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {study.client}
                  </h2>

                  {/* Challenge */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-violet-600" />
                      <h3 className="font-bold text-gray-900">{t.challenge}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-gray-900">{t.solution}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-pink-600" />
                      <h3 className="font-bold text-gray-900">{t.results}</h3>
                    </div>
                    <ul className="space-y-2">
                      {study.results.map((result, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-600">✓</span>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {study.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {study.url && (
                    <a
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all group"
                    >
                      {t.viewWebsite}
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 text-violet-600 mx-auto mb-6 animate-bounce-subtle" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'sr' 
                ? 'Želite slične rezultate?'
                : 'Want similar results?'
              }
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'sr' 
                ? 'Zakažite besplatnu konsultaciju i porazgovarajmo o vašem projektu.'
                : 'Schedule a free consultation and let\'s talk about your project.'
              }
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="group px-10 py-5 bg-gray-900 text-white rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:shadow-2xl"
            >
              {t.cta}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

