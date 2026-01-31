import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { trackCTAClick } from '../../utils/analytics';

export function TeamCTA() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleClick = () => {
    trackCTAClick('Upoznaj AiSajt Tim', '/', language);
    navigate('/');
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="max-w-3xl mx-auto">
          <button
            onClick={handleClick}
            className="group relative w-full bg-gradient-to-br from-white to-violet-50/30 hover:to-violet-50/50 rounded-xl p-6 md:p-7 border border-violet-200/60 hover:border-violet-300 transition-all duration-300 hover:shadow-lg text-left overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400/5 to-indigo-400/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                {language === 'sr' ? '👋 Upoznaj AiSajt Tim' : '👋 Meet AiSajt Team'}
              </h3>
              
              <p className="text-sm md:text-base text-gray-600 mb-3 leading-relaxed">
                {language === 'sr' 
                  ? 'Saznaj više o nama, našem radu i kako pomažemo biznisima da rastu online'
                  : 'Learn more about us, our work and how we help businesses grow online'
                }
              </p>
              
              <div className="flex items-center text-violet-600 font-semibold text-sm md:text-base group-hover:gap-3 gap-2 transition-all">
                <span>{language === 'sr' ? 'Pogledaj Portfolio' : 'View Portfolio'}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>
    </div>
  );
}

