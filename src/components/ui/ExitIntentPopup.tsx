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
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return; // Ne prikazuj na mobilnim
    }

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (step === 'withSite') {
        // Submit exit audit form (email + website)
        const result = await submitExitAuditForm({
          email: formData.email,
          website: formData.url,
        });

        navigate(`/thank-you?name=User&source=exit_popup_audit&lang=${language}`);
      } else {
        await submitExitGuideForm({
          email: formData.email,
        });

        navigate(`/thank-you?name=User&source=exit_popup_guide&lang=${language}`);
      }
    } catch (error) {
      // I dalje redirect na thank you page
      const source = step === 'withSite' ? 'exit_popup_audit' : 'exit_popup_guide';
      navigate(`/thank-you?name=User&source=${source}&lang=${language}`);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Container - kompaktniji za telefon */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-violet-500/20 overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative p-5 sm:p-8">
          {/* Step 1: Choice */}
          {step === 'choice' && (
            <div className="text-center animate-fade-in-up">
              {/* Icon - manji */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full p-3 sm:p-4">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Heading - kompaktniji */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                {language === 'sr' ? '🚀 Čekajte!' : '🚀 Wait!'}
              </h2>
              <p className="text-gray-600 mb-5 sm:mb-8 text-sm sm:text-base leading-snug">
                {language === 'sr' 
                  ? 'Besplatni saveti pre nego odete'
                  : 'Free advice before you leave'
                }
              </p>

              {/* Question */}
              <p className="text-gray-900 font-semibold mb-4 sm:mb-6 text-sm sm:text-base">
                {language === 'sr' ? 'Imate li već web sajt?' : 'Do you already have a website?'}
              </p>

              {/* Buttons - kompaktniji */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="group px-3 py-3 sm:px-6 sm:py-4 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-violet-500/30"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2" />
                  <span className="block text-xs sm:text-sm">
                    {language === 'sr' ? '✓ DA, imam' : '✓ YES'}
                  </span>
                  <span className="block text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">
                    {language === 'sr' ? 'Analiza' : 'Audit'}
                  </span>
                </button>

                <button
                  onClick={() => handleChoice(false)}
                  className="group px-3 py-3 sm:px-6 sm:py-4 bg-gradient-to-br from-pink-500 to-violet-600 text-white rounded-xl sm:rounded-2xl font-semibold active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-pink-500/30"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 sm:mb-2" />
                  <span className="block text-xs sm:text-sm">
                    {language === 'sr' ? '✗ NE, nemam' : '✗ NO'}
                  </span>
                  <span className="block text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">
                    {language === 'sr' ? 'Vodič' : 'Guide'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: With Site - Audit Form - kompaktniji */}
          {step === 'withSite' && (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full mb-3 sm:mb-4">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  {language === 'sr' ? '🔍 Besplatna Analiza' : '🔍 Free Audit'}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug px-2">
                  {language === 'sr' 
                    ? 'Saznajte šta sajt košta u izgubljenim klijentima'
                    : 'Find out what your site costs in lost clients'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    {language === 'sr' ? 'URL vašeg sajta' : 'Your website URL'}
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold active:scale-95 sm:hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">{language === 'sr' ? 'Šalje se...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">{language === 'sr' ? 'Analiziraj Besplatno' : 'Analyze Free'}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-center text-gray-500">
                  ✓ {language === 'sr' ? 'Rezultati za 24h' : 'Results in 24h'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('choice')}
                disabled={isSubmitting}
                className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
              >
                ← {language === 'sr' ? 'Nazad' : 'Back'}
              </button>
            </form>
          )}

          {/* Step 3: Without Site - Guide Download - kompaktniji */}
          {step === 'withoutSite' && (
            <form onSubmit={handleSubmit} className="animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full mb-3 sm:mb-4">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  {language === 'sr' ? '📋 Vodič za Početak' : '📋 Starter Guide'}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm px-2">
                  {language === 'sr' 
                    ? '"Od Ideje do Sajta: 7 Koraka"'
                    : '"From Idea to Website: 7 Steps"'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                <p className="text-xs sm:text-sm font-semibold text-violet-900 mb-2">
                  {language === 'sr' ? 'Šta ćete naučiti:' : 'What you\'ll learn:'}
                </p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-violet-800">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-600 flex-shrink-0">✓</span>
                    <span>{language === 'sr' ? 'Koji tip sajta vam treba' : 'Which type of site you need'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 flex-shrink-0">✓</span>
                    <span>{language === 'sr' ? 'Koliko košta i traje' : 'Cost and timeline'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 flex-shrink-0">✓</span>
                    <span>{language === 'sr' ? 'Šta pripremiti' : 'What to prepare'}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'sr' ? 'vas@email.com' : 'your@email.com'}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-lg sm:rounded-xl font-semibold active:scale-95 sm:hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">{language === 'sr' ? 'Šalje se...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">{language === 'sr' ? 'Preuzmi Vodič' : 'Download Guide'}</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-center text-gray-500">
                  ✓ {language === 'sr' ? 'Bez spam-a' : 'No spam'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('choice')}
                disabled={isSubmitting}
                className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
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

