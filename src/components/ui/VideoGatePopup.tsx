import { useState, useEffect } from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import emailjs from '@emailjs/browser';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "O6sCZaCGoXrFHvBGT";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_rsasqr9";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_jf2rgsy";

interface VideoGatePopupProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export function VideoGatePopup({ onClose, onSubmitSuccess }: VideoGatePopupProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicijalizuj EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pošalji email sa video gate informacijama (sve parametre koje template očekuje)
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          form_type: 'VIDEO_GATE',
          to_email: 'office@aisajt.com',
          user_name: name,
          user_email: email,
          user_phone: 'N/A',
          message: `🎥 VIDEO GATE - Novi korisnik je otkljucao video!\n\n👤 Ime: ${name}\n📧 Email: ${email}\n🎬 Video: Upoznajte naš tim i način rada\n🌐 Jezik: ${language === 'sr' ? 'Srpski' : 'English'}`,
          quiz_result: 'N/A',
          website_url: 'N/A',
          language: language
        }
      );

      if (result.status === 200) {
        console.log('✅ Video gate email poslat uspešno!');
      }
      
      // Zatvori popup i pokreni video
      onSubmitSuccess();
    } catch (error) {
      console.error('❌ Video gate email greška:', error);
      // I dalje dozvoli video da se pokrene
      onSubmitSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div className="relative bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl animate-scale-in border-2 border-violet-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'sr' ? 'Vaše ime' : 'Your name'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors text-gray-900"
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
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group px-6 py-4 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

