import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, Award, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';

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
          industry: 'Nekretnine',
          image: '/images/favicon/kraljresidence.png',
          challenge: 'Dugogodišnja firma Kralj DOO iz Vrnjačke Banje je imala potrebu za modernim sajtem koji će im omogućiti online prodaju luksuznih apartmana.',
          solution: 'Kreirali smo moderan, elegantni sajt sa integrisanim booking sistemom, naprednim SEO optimizacijama, Google Maps integracijom i impresivnom galerijom sa preko 50 profesionalnih fotografija.',
          results: [
            'Sajt optimizovan za brzinu (<2s vreme učitavanja)',
            'Responsive dizajn za sve uređaje',
            'Integrisana online rezervacija',
            'Google Analytics i konverziono praćenje'
          ],
          stats: [
            { label: 'Prodato apartmana', value: '5-6' },
            { label: 'Google pozicija', value: 'Top 3' },
            { label: 'ROI', value: 'Izuzetan' }
          ],
          url: 'https://kraljresidence.com'
        },
        {
          id: '2',
          client: 'BN Autofolije',
          industry: 'Auto Zatamnjivanje',
          image: '/images/bnautofolije.png',
          challenge: 'Kompanija za profesionalno zatamnjivanje stakala nije imala web prisutnost. Klijenti dolazili su samo kroz preporuke, što je ograničavalo rast biznisa.',
          solution: 'Napravili smo atraktivan one-page sajt sa galerijom uradenih radova, detaljnim cenovnikom usluga, Google Maps integracijom i jednostavnom kontakt formom.',
          results: [
            'Profesionalna portfolio galerija',
            'Jasno prikazani paketi usluga i cene',
            'Direktan WhatsApp i poziv sa sajta',
            'Instagram integracija za dodatni marketing'
          ],
          stats: [
            { label: 'Novi klijenti mesečno', value: '+50' },
            { label: 'Online upita', value: '+200%' },
            { label: 'ROI za 3 meseca', value: '400%' }
          ],
          url: 'https://bnautofolije.rs'
        },
        {
          id: '3',
          client: 'IN-STAN Stolarija',
          industry: 'Stolarija',
          image: '/images/instan.png',
          challenge: 'Ozbiljna stolarija firma koja radi na celoj teritoriji Srbije tražila je profesionalan web sajt koji će odražavati kvalitet njihovog rada.',
          solution: 'Razvili smo kompletan web sajt sa galerijom projekata, prezentacijom usluga (nameštaj, kantovanje, CNC obrada), kontakt formom i SEO optimizacijom.',
          results: [
            'Elegantna prezentacija proizvoda',
            'Portfolio realizovanih projekata',
            'Detaljan prikaz usluga i mogućnosti',
            'Optimizacija za lokalna pretraživanja'
          ],
          stats: [
            { label: 'Povećanje upita', value: '+180%' },
            { label: 'Pokrivena teritorija', value: 'Srbija' },
            { label: 'Iskustvo', value: '20+ god' }
          ],
          url: 'https://instanstolarija.rs'
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
          industry: 'Real Estate',
          image: '/images/favicon/kraljresidence.png',
          challenge: 'Long-standing company Kralj DOO from Vrnjačka Banja needed a modern website to enable online sales of luxury apartments.',
          solution: 'We created a modern, elegant website with integrated booking system, advanced SEO, Google Maps integration, and impressive gallery with 50+ professional photos.',
          results: [
            'Site optimized for speed (<2s load time)',
            'Responsive design for all devices',
            'Integrated online booking',
            'Google Analytics and conversion tracking'
          ],
          stats: [
            { label: 'Apartments sold', value: '5-6' },
            { label: 'Google position', value: 'Top 3' },
            { label: 'ROI', value: 'Excellent' }
          ],
          url: 'https://kraljresidence.com'
        },
        {
          id: '2',
          client: 'BN Autofolije',
          industry: 'Auto Tinting',
          image: '/images/bnautofolije.png',
          challenge: 'Professional window tinting company had no web presence. Clients came only through referrals, limiting business growth.',
          solution: 'We created an attractive one-page site with gallery of completed work, detailed pricing, Google Maps integration, and simple contact form.',
          results: [
            'Professional portfolio gallery',
            'Clear service packages and pricing',
            'Direct WhatsApp and call from site',
            'Instagram integration for extra marketing'
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
          client: 'IN-STAN Carpentry',
          industry: 'Carpentry',
          image: '/images/instan.png',
          challenge: 'Serious carpentry company operating across Serbia needed a professional website reflecting the quality of their work.',
          solution: 'We developed a complete website with project gallery, service presentation (furniture, edging, CNC processing), contact form, and SEO optimization.',
          results: [
            'Elegant product presentation',
            'Portfolio of completed projects',
            'Detailed service and capabilities overview',
            'Local search optimization'
          ],
          stats: [
            { label: 'Inquiry increase', value: '+180%' },
            { label: 'Coverage area', value: 'Serbia' },
            { label: 'Experience', value: '20+ yrs' }
          ],
          url: 'https://instanstolarija.rs'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Studije Slučaja | Uspešni Web Projekti | AISajt' : 'Case Studies | Successful Web Projects | AISajt'}
        description={language === 'sr' ? 'Pogledajte naše uspešne web projekte i rezultate koje smo postigli za klijente. Realne studije slučaja sa merljivim rezultatima.' : 'Check out our successful web projects and results we achieved for clients. Real case studies with measurable results.'}
        keywords="studije slučaja, web projekti, portfolio, aisajt projekti"
        canonicalUrl="https://aisajt.com/case-studies"
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
          <div className="max-w-3xl mx-auto text-center">
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
                      <img 
                        src={study.image} 
                        alt={`${study.client} - ${study.industry}`}
                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                      />
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
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
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

