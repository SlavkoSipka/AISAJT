import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { SEOHelmet } from '../seo/SEOHelmet';
import { trackAuditFormSubmit } from '../../utils/analytics';
import { submitAuditForm } from '../../utils/hubspot';

export function AuditFormPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    phone: ''
  });

  const content = {
    sr: {
      hero: 'Besplatna Analiza Sajta',
      subtitle: 'Saznajte šta vam sajt košta u izgubljenim klijentima',
      benefits: {
        title: 'Šta dobijate u analizi:',
        items: [
          'SEO skor i šta poboljšati',
          'Brzina učitavanja stranice',
          'Dizajn i UX pregled',
          'Konkurentska analiza',
          'Konkretni akcioni koraci',
          'Besplatne preporuke za poboljšanje'
        ]
      },
      form: {
        title: 'Popunite Formu',
        subtitle: 'Rezultati stižu na email za 24h',
        name: 'Vaše Ime',
        email: 'Email Adresa',
        website: 'URL Vašeg Sajta',
        phone: 'Telefon (opciono)',
        button: 'Pošalji na Analizu',
        processing: 'Šaljemo...'
      }
    },
    en: {
      hero: 'Free Website Audit',
      subtitle: 'Find out what your site costs in lost clients',
      benefits: {
        title: 'What you get in the analysis:',
        items: [
          'SEO score and what to improve',
          'Page loading speed',
          'Design and UX review',
          'Competitive analysis',
          'Concrete action steps',
          'Free improvement recommendations'
        ]
      },
      form: {
        title: 'Fill the Form',
        subtitle: 'Results arrive by email in 24h',
        name: 'Your Name',
        email: 'Email Address',
        website: 'Your Website URL',
        phone: 'Phone (optional)',
        button: 'Send for Analysis',
        processing: 'Sending...'
      }
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit to HubSpot
      const result = await submitAuditForm({
        name: formData.name,
        email: formData.email,
        website: formData.website,
        phone: formData.phone || undefined,
      });

      if (result.success) {
        trackAuditFormSubmit(formData.name, formData.email, formData.website, language);
        navigate(`/thank-you?name=${encodeURIComponent(formData.name)}&source=audit_form&lang=${language}`);
      } else {
        throw new Error(result.message || 'HubSpot submission failed');
      }
    } catch (error) {
      navigate(`/thank-you?name=${encodeURIComponent(formData.name)}&source=audit_form&lang=${language}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title={language === 'sr' ? 'Besplatan Audit Sajta | Analiza Performansi i SEO | AISajt' : 'Free Website Audit | Performance & SEO Analysis | AISajt'}
        description={language === 'sr' ? 'Dobijte besplatnu profesionalnu analizu vašeg sajta. Proveravamo SEO, performanse, sigurnost i korisničko iskustvo. Rezultati u roku od 24h.' : 'Get a free professional analysis of your website. We check SEO, performance, security and user experience. Results within 24 hours.'}
        keywords="audit sajta, besplatna analiza, seo analiza, web audit, performanse sajta, aisajt audit"
        canonicalUrl="https://aisajt.com/resources/audit"
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
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left: Info */}
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {language === 'sr' ? (
                    <>
                      Besplatna<br />
                      Analiza Sajta
                    </>
                  ) : (
                    t.hero
                  )}
                </h1>

                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  {t.subtitle}
                </p>
                
                <p className="text-sm text-gray-500 mb-8">
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
                      Check out all our services on our{' '}
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

                {/* Benefits */}
                <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl p-6 border border-violet-100">
                  <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t.benefits.title}
                  </h3>
                  <ul className="space-y-2">
                    {t.benefits.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-violet-800">
                        <CheckCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Form */}
              <div className="animate-fade-in-up animation-delay-200">
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Search className="w-8 h-8 text-violet-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {t.form.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {t.form.subtitle}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.form.name}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Marko Marković"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.form.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="marko@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.form.website}
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.form.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+381 64 123 4567"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full group px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {t.form.button}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      ✓ {language === 'sr' ? 'Bez spam-a. Rezultati za 24h.' : 'No spam. Results in 24h.'}
                    </p>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

