import { useState, useEffect } from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { trackVideoGate } from '../../utils/analytics';
import { submitVideoGateForm } from '../../utils/hubspot';

interface VideoGatePopupProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export function VideoGatePopup({ onClose, onSubmitSuccess }: VideoGatePopupProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔒 Blokiraj body scroll kada je popup otvoren
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to HubSpot
      const result = await submitVideoGateForm({
        name: name,
        email: email,
      });

      if (result.success) {
        trackVideoGate(name, email, 'Adq2OJ_F24I', language);
      }
      
      onSubmitSuccess();
    } catch (error) {
      onSubmitSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Card - Optimizovan za telefon */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl animate-scale-in border-2 border-violet-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Icon - manji na telefonu */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 rounded-full p-3 sm:p-4">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title - kompaktniji na telefonu */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
            {language === 'sr' ? 'Otkrijte AiSajt Tim' : 'Discover AiSajt Team'}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-snug">
            {language === 'sr' 
              ? 'Unesite vaše podatke i pogledajte kako radimo!' 
              : 'Enter your details and see how we work!'}
          </p>
        </div>

        {/* Form - kompaktniji */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'sr' ? 'Vaše ime' : 'Your name'}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-gray-900"
              style={{ fontSize: '16px' }}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'sr' ? 'Vaš email' : 'Your email'}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-gray-900"
              style={{ fontSize: '16px' }}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{language === 'sr' ? 'Šalje se...' : 'Sending...'}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{language === 'sr' ? 'Pusti Video' : 'Play Video'}</span>
              </>
            )}
          </button>
        </form>

        {/* Privacy Note - kompaktniji */}
        <p className="text-xs text-gray-500 text-center mt-3 leading-tight">
          {language === 'sr' 
            ? 'Vaši podaci su sigurni.' 
            : 'Your data is safe.'}
        </p>
      </div>
    </div>
  );
}

