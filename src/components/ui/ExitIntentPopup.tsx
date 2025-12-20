import { useState, useEffect } from 'react';
import { X, Search, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { submitExitAuditForm, submitExitGuideForm } from '../../utils/hubspot';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [step, setStep] = useState<'choice' | 'withSite' | 'withoutSite'>('choice');
  const [formData, setFormData] = useState({ url: '', email: '' });
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Proveri da li je korisnik već zatvorio popup
    const hasClosedBefore = localStorage.getItem('exitPopupClosed');
    if (hasClosedBefore === 'true') {
      setHasShown(true); // Ne prikazuj popup
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Show after 30 seconds as fallback
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown]);

  // 🔒 Blokiraj body scroll kada je popup otvoren
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Zapamti da je korisnik zatvorio popup
    localStorage.setItem('exitPopupClosed', 'true');
  };

  const handleChoice = (hasSite: boolean) => {
    setStep(hasSite ? 'withSite' : 'withoutSite');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (step === 'withSite') {
        // Submit exit audit form (email + website)
        const result = await submitExitAuditForm({
          email: formData.email,
          website: formData.url,
        });

        if (result.success) {
          console.log('✅ Exit Audit popup poslat na HubSpot!');
        } else {
          console.error('❌ HubSpot greška:', result.message);
        }

        navigate(`/thank-you?name=User&source=exit_popup_audit&lang=${language}`);
      } else {
        // Submit exit guide form (email only)
        const result = await submitExitGuideForm({
          email: formData.email,
        });

        if (result.success) {
          console.log('✅ Exit Guide popup poslat na HubSpot!');
        } else {
          console.warn('⚠️ Exit Guide form not configured yet');
        }

        navigate(`/thank-you?name=User&source=exit_popup_guide&lang=${language}`);
      }
    } catch (error) {
      console.error('❌ Exit popup greška:', error);
      // I dalje redirect na thank you page
      const source = step === 'withSite' ? 'exit_popup_audit' : 'exit_popup_guide';
      navigate(`/thank-you?name=User&source=${source}&lang=${language}`);
    } finally {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-violet-500/20 overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative p-8">
          {/* Step 1: Choice */}
          {step === 'choice' && (
            <div className="text-center animate-fade-in-up">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full p-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {language === 'sr' ? '🚀 Čekajte!' : '🚀 Wait!'}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {language === 'sr' 
                  ? 'Dobijte besplatne savete pre nego odete'
                  : 'Get free advice before you leave'
                }
              </p>

              {/* Question */}
              <p className="text-gray-900 font-semibold mb-6">
                {language === 'sr' ? 'Imate li već web sajt?' : 'Do you already have a website?'}
              </p>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="group px-6 py-4 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/30"
                >
                  <Search className="w-6 h-6 mx-auto mb-2" />
                  <span className="block text-sm">
                    {language === 'sr' ? '✓ DA, imam' : '✓ YES, I have'}
                  </span>
                  <span className="block text-xs opacity-90 mt-1">
                    {language === 'sr' ? 'Besplatna analiza' : 'Free audit'}
                  </span>
                </button>

                <button
                  onClick={() => handleChoice(false)}
                  className="group px-6 py-4 bg-gradient-to-br from-pink-500 to-violet-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/30"
                >
                  <BookOpen className="w-6 h-6 mx-auto mb-2" />
                  <span className="block text-sm">
                    {language === 'sr' ? '✗ NE, nemam' : '✗ NO, I don\'t'}
                  </span>
                  <span className="block text-xs opacity-90 mt-1">
                    {language === 'sr' ? 'Vodič za početak' : 'Starter guide'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: With Site - Audit Form */}
          {step === 'withSite' && (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'sr' ? '🔍 Besplatna Analiza' : '🔍 Free Audit'}
                </h3>
                <p className="text-gray-600">
                  {language === 'sr' 
                    ? 'Saznajte šta vam sajt košta u izgubljenim klijentima'
                    : 'Find out what your site costs in lost clients'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'sr' ? 'URL vašeg sajta' : 'Your website URL'}
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {language === 'sr' ? 'Analiziraj Besplatno' : 'Analyze Free'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-center text-gray-500">
                  ✓ {language === 'sr' ? 'Rezultati za 24h' : 'Results in 24h'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('choice')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                ← {language === 'sr' ? 'Nazad' : 'Back'}
              </button>
            </form>
          )}

          {/* Step 3: Without Site - Guide Download */}
          {step === 'withoutSite' && (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'sr' ? '📋 Vodič za Početak' : '📋 Starter Guide'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'sr' 
                    ? '"Od Ideje do Sajta: 7 Koraka"'
                    : '"From Idea to Website: 7 Steps"'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-violet-900 mb-2">
                  {language === 'sr' ? 'Šta ćete naučiti:' : 'What you\'ll learn:'}
                </p>
                <ul className="space-y-2 text-sm text-violet-800">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600">✓</span>
                    <span>{language === 'sr' ? 'Koji tip sajta vam treba' : 'Which type of site you need'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600">✓</span>
                    <span>{language === 'sr' ? 'Koliko košta i traje' : 'Cost and timeline'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600">✓</span>
                    <span>{language === 'sr' ? 'Šta pripremiti' : 'What to prepare'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group px-6 py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {language === 'sr' ? 'Preuzmi Vodič' : 'Download Guide'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-center text-gray-500">
                  ✓ {language === 'sr' ? 'Bez spam-a' : 'No spam'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('choice')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                ← {language === 'sr' ? 'Nazad' : 'Back'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

