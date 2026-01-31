import { MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { trackCTAClick } from '../../utils/analytics';

interface ConsultationCTAProps {
  topic?: string; // "izradi sajta", "SEO optimizaciji", "web dizajnu"
}

export function ConsultationCTA({ topic = "tvom projektu" }: ConsultationCTAProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleClick = () => {
    trackCTAClick('Besplatna Konsultacija', '/contact', language);
    navigate('/contact');
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="max-w-3xl mx-auto">
          <button
            onClick={handleClick}
            className="group relative w-full bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 rounded-xl p-6 md:p-7 border border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 text-left overflow-hidden"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] md:text-xs font-bold">
                  {language === 'sr' ? 'BESPLATNO' : 'FREE'}
                </div>
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-white mb-2">
                {language === 'sr' ? '🚀 Zakaži Besplatnu Konsultaciju' : '🚀 Schedule Free Consultation'}
              </h3>
              
              <p className="text-sm md:text-base text-white/90 mb-3 leading-relaxed">
                {language === 'sr' 
                  ? `Pričaj sa našim stručnjacima o ${topic}. Bez obaveze, potpuno besplatno.`
                  : `Talk to our experts about ${topic}. No obligation, completely free.`
                }
              </p>
              
              <div className="flex items-center text-white font-semibold text-sm md:text-base group-hover:gap-3 gap-2 transition-all">
                <span>{language === 'sr' ? 'Pošalji Poruku' : 'Send Message'}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
  );
}

