import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, BookOpen, CheckCircle, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import emailjs from '@emailjs/browser';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

type MagnetType = 'guide' | 'checklist';

export function LeadMagnetDownloadPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Determine which lead magnet based on URL
  const pathname = window.location.pathname;
  const magnetType: MagnetType = pathname.includes('guide') ? 'guide' : 'checklist';

  const content = {
    sr: {
      guide: {
        hero: 'Vodič: Od Ideje do Sajta',
        subtitle: '7 koraka do vašeg savršenog web sajta',
        benefits: [
          'Koji tip sajta vam treba',
          'Koliko košta i koliko traje',
          'Šta pripremiti pre nego započnete',
          'Kako izabrati pravu agenciju',
          'Red flags na koje treba paziti',
          'Checklist za kompletnu pripremu'
        ]
      },
      checklist: {
        hero: '27 Stvari koje Sajt Mora Imati',
        subtitle: 'Kompletan checklist za proveru vašeg sajta',
        benefits: [
          'SEO osnove (meta tagovi, brzina)',
          'Sigurnost (SSL, HTTPS)',
          'Responzivnost (desktop, mobil, tablet)',
          'Pravni dokumenti (Privacy, Terms)',
          'Google Analytics i tracking',
          'Kontakt forma i informacije'
        ]
      },
      form: {
        title: 'Preuzmite Besplatno',
        subtitle: 'PDF stiže na email odmah',
        name: 'Vaše Ime',
        email: 'Email Adresa',
        button: 'Preuzmi PDF',
        processing: 'Šaljemo...'
      }
    },
    en: {
      guide: {
        hero: 'Guide: From Idea to Website',
        subtitle: '7 steps to your perfect website',
        benefits: [
          'Which type of site you need',
          'How much it costs and how long it takes',
          'What to prepare before starting',
          'How to choose the right agency',
          'Red flags to watch for',
          'Checklist for complete preparation'
        ]
      },
      checklist: {
        hero: '27 Things Your Site Must Have',
        subtitle: 'Complete checklist to verify your website',
        benefits: [
          'SEO basics (meta tags, speed)',
          'Security (SSL, HTTPS)',
          'Responsiveness (desktop, mobile, tablet)',
          'Legal documents (Privacy, Terms)',
          'Google Analytics and tracking',
          'Contact form and information'
        ]
      },
      form: {
        title: 'Download Free',
        subtitle: 'PDF arrives by email immediately',
        name: 'Your Name',
        email: 'Email Address',
        button: 'Download PDF',
        processing: 'Sending...'
      }
    }
  };

  const t = content[language];
  const magnet = t[magnetType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Odredi naziv PDF-a za email
    const pdfType = magnetType === 'guide' ? 'VODIČ' : 'CHECKLIST';
    
    // Pošalji email TEBI na office@aisajt.com
    emailjs.send(
      'service_rsasqr9',
      'template_jf2rgsy',
      {
        form_type: pdfType,
        to_email: 'office@aisajt.com',
        user_name: name,
        user_email: email,
        user_phone: 'N/A',
        message: `Korisnik je preuzeo ${pdfType} PDF.`,
        quiz_result: 'N/A',
        website_url: 'N/A',
        language: language
      },
      'O6sCZaCGoXrFHvBGT'
    ).then(() => {
      console.log(`✅ ${pdfType} email poslat!`);
    }).catch((error) => {
      console.error('❌ Email greška:', error);
    });
    
    // Redirect na Thank You stranicu
    navigate(`/thank-you?name=${encodeURIComponent(name)}&source=${magnetType}&lang=${language}`);
  };

  const Icon = magnetType === 'guide' ? BookOpen : FileText;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-pink-50/30 to-white" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left: Info */}
              <div className="animate-fade-in-up">
                <div className="inline-block mb-6">
                  <span className="px-6 py-2 bg-gradient-to-r from-pink-100 via-violet-100 to-indigo-100 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-wider border border-pink-200 rounded-full">
                    📄 {language === 'sr' ? 'Besplatan Download' : 'Free Download'}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {magnet.hero}
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {magnet.subtitle}
                </p>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-pink-50 via-violet-50 to-indigo-50 rounded-2xl p-6 border border-pink-100">
                  <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {language === 'sr' ? 'Šta ćete naučiti:' : 'What you\'ll learn:'}
                  </h3>
                  <ul className="space-y-2">
                    {magnet.benefits.map((item, index) => (
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
                    <Icon className="w-8 h-8 text-pink-600" />
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marko Marković"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.form.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="marko@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full group px-6 py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      {t.form.button}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      ✓ {language === 'sr' ? 'Bez spam-a. Odmah u inbox.' : 'No spam. Immediately in inbox.'}
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

