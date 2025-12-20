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

  // 🔒 Blokiraj body scroll kada je popup otvoren (iOS fix)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    
    // Blokiraj scroll na body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Vrati originalne stilove kada se popup zatvori
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.style.height = '';
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
        console.log('✅ Video gate poslat na HubSpot!');
        
        // Track video gate u Google Analytics i Facebook Pixel
        trackVideoGate(name, email, 'Adq2OJ_F24I', language);
      } else {
        console.error('❌ HubSpot greška:', result.message);
      }
      
      // Zatvori popup i pokreni video (čak i ako HubSpot fails)
      onSubmitSuccess();
    } catch (error) {
      console.error('❌ Video gate greška:', error);
      // I dalje dozvoli video da se pokrene
      onSubmitSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in"
      style={{
        // iOS Safari fix: Force proper stacking
        WebkitTransform: 'translate3d(0,0,0)',
        padding: 'max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))'
      }}
    >
      {/* Backdrop - bez backdrop-blur za iOS kompatibilnost */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        style={{
          WebkitTapHighlightColor: 'transparent' // iOS Safari fix
        }}
      />

      {/* Popup Card - optimizovan za iPhone */}
      <div 
        className="relative bg-white rounded-3xl p-6 md:p-12 max-w-md w-full shadow-2xl animate-scale-in border-2 border-violet-200 max-h-[90vh] overflow-y-auto"
        style={{
          // iOS Safari fix: Prevent zoom on input focus
          WebkitTransform: 'translate3d(0,0,0)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Close Button - Optimizovan za iPhone */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 active:text-gray-600 transition-colors p-2 -m-2"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 rounded-full p-4">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            {language === 'sr' ? 'Otkrijte AiSajt Tim' : 'Discover AiSajt Team'}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === 'sr' 
              ? 'Unesite vaše podatke i pogledajte kako radimo i šta možemo da vam ponudimo!' 
              : 'Enter your details and see how we work and what we can offer you!'}
          </p>
        </div>

        {/* Form - Optimizovano za iPhone */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'sr' ? 'Vaše ime' : 'Your name'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-gray-900"
              style={{
                fontSize: '16px', // iOS fix: Prevents auto-zoom on focus
                WebkitAppearance: 'none', // Remove iOS default styling
                WebkitTapHighlightColor: 'transparent'
              }}
              autoComplete="name"
            />
          </div>

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'sr' ? 'Vaš email' : 'Your email'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-gray-900"
              style={{
                fontSize: '16px', // iOS fix: Prevents auto-zoom on focus
                WebkitAppearance: 'none', // Remove iOS default styling
                WebkitTapHighlightColor: 'transparent'
              }}
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group px-6 py-4 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              WebkitTapHighlightColor: 'transparent', // iOS fix
              touchAction: 'manipulation' // Disable double-tap zoom
            }}
          >
            <Play className="w-5 h-5" />
            {isSubmitting 
              ? (language === 'sr' ? 'Šalje se...' : 'Sending...') 
              : (language === 'sr' ? 'Pusti Video' : 'Play Video')}
          </button>
        </form>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {language === 'sr' 
            ? 'Vaši podaci su sigurni i neće biti deljeni sa trećim licima.' 
            : 'Your data is safe and will not be shared with third parties.'}
        </p>
      </div>
    </div>
  );
}

