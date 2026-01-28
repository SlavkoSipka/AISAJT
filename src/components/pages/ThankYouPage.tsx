import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Home, Mail, Sparkles, Star } from 'lucide-react';
import { trackLeadGeneration } from '../../utils/analytics';

// Globalna varijabla za tracking downloada (van React-a)
declare global {
  interface Window {
    pdfDownloadInProgress?: boolean;
  }
}

// Confetti particle component
const ConfettiParticle = ({ delay, duration }: { delay: number; duration: number }) => {
  const colors = ['#8B5CF6', '#6366F1', '#EC4899', '#F59E0B', '#10B981'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  
  return (
    <div
      className="absolute w-2 h-2 rounded-full opacity-0"
      style={{
        left: `${randomX}%`,
        top: '-20px',
        backgroundColor: randomColor,
        animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
        transform: `rotate(${randomRotation}deg)`,
      }}
    />
  );
};

// Floating icon component
const FloatingIcon = ({ icon: Icon, delay, position }: { icon: any; delay: number; position: { top: string; left: string } }) => {
  return (
    <div
      className="absolute opacity-0"
      style={{
        ...position,
        animation: `floatIn 1s ease-out ${delay}s forwards, float 3s ease-in-out ${delay + 1}s infinite`,
      }}
    >
      <Icon className="w-8 h-8 text-violet-400/30" />
    </div>
  );
};

export function ThankYouPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const downloadTriggered = useRef(false);
  const leadTracked = useRef(false); // ✅ Zaštita protiv duplog tracking-a
  
  // Dobij podatke iz URL parametara
  const userName = searchParams.get('name') || 'Korisnik';
  const source = searchParams.get('source') || 'contact_page';
  const language = searchParams.get('lang') || 'sr';

  useEffect(() => {
    // Triggeruj GLAVNI LEAD EVENT kada se stranica učita - SAMO JEDNOM!
    if (!leadTracked.current) {
      trackLeadGeneration(
        source as 'contact_page' | 'home_page',
        userName,
        language as 'sr' | 'en'
      );
      leadTracked.current = true; // ✅ Označi da je lead trackovan
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Pokaži content sa delay-om
    setTimeout(() => setShowContent(true), 100);

    // Zaustavi confetti nakon 4 sekunde
    setTimeout(() => setShowConfetti(false), 4000);

    // AUTO-DOWNLOAD PDF ako je guide ili checklist (SAMO JEDNOM!)
    const downloadKey = `pdf_downloaded_${source}`;
    
    if (!downloadTriggered.current && (source === 'guide' || source === 'checklist')) {
      // TROSTRUKA ZAŠTITA protiv duplog downloada:
      // 1. useRef
      // 2. sessionStorage
      // 3. window.pdfDownloadInProgress (globalna varijabla)
      
      if (!sessionStorage.getItem(downloadKey) && !window.pdfDownloadInProgress) {
        downloadTriggered.current = true;
        window.pdfDownloadInProgress = true;
        sessionStorage.setItem(downloadKey, 'true');
        
        const timeoutId = setTimeout(() => {
          const link = document.createElement('a');
          
          if (source === 'guide') {
            link.href = '/downloads/vodic.pdf';
            link.download = 'Vodic-Od-Ideje-Do-Sajta.pdf';
          } else {
            link.href = '/downloads/checklist.pdf';
            link.download = '27-Stvari-Koje-Sajt-Mora-Imati.pdf';
          }
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Reset nakon 5 sekundi
          setTimeout(() => {
            sessionStorage.removeItem(downloadKey);
            window.pdfDownloadInProgress = false;
          }, 5000);
        }, 1500);
      }
    }
  }, []); // ✅ Prazan dependency array - izvršava se SAMO JEDNOM pri mount-u

  // Generate confetti particles
  const confettiParticles = showConfetti ? Array.from({ length: 50 }, (_, i) => (
    <ConfettiParticle
      key={i}
      delay={Math.random() * 0.5}
      duration={2 + Math.random() * 2}
    />
  )) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-violet-50/30 to-white flex items-center justify-center px-4 overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {confettiParticles}
      </div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-8 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <FloatingIcon icon={Sparkles} delay={0.5} position={{ top: '15%', left: '10%' }} />
      <FloatingIcon icon={Star} delay={0.7} position={{ top: '25%', right: '15%' }} />
      <FloatingIcon icon={Sparkles} delay={0.9} position={{ bottom: '20%', left: '12%' }} />
      <FloatingIcon icon={Star} delay={1.1} position={{ bottom: '30%', right: '10%' }} />
      <FloatingIcon icon={Sparkles} delay={1.3} position={{ top: '40%', left: '5%' }} />
      <FloatingIcon icon={Star} delay={1.5} position={{ top: '60%', right: '8%' }} />

      <div className={`max-w-2xl w-full relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Success Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-violet-500/10 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative animate-scale-in">
              {/* Pulsing rings */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full opacity-20 animate-ping"></div>
              
              {/* Main icon */}
              <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full p-6 shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white animate-draw-check" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up animation-delay-200">
              {language === 'sr' ? `Hvala vam, ${userName}!` : `Thank you, ${userName}!`}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400">
              {language === 'sr' 
                ? 'Vaša poruka je uspešno poslata. Javićemo vam se uskoro!' 
                : 'Your message has been sent successfully. We will get back to you soon!'
              }
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 rounded-2xl p-6 mb-8 border border-violet-100 animate-fade-in-up animation-delay-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1 animate-bounce-subtle" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'sr' ? 'Šta je sledeće?' : "What's next?"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2 animate-slide-in-left animation-delay-700">
                    <span className="text-violet-600 font-bold">•</span>
                    <span>
                      {language === 'sr' 
                        ? 'Naš tim će pregledati vašu poruku u najkraćem roku'
                        : 'Our team will review your message shortly'
                      }
                    </span>
                  </li>
                  <li className="flex items-start gap-2 animate-slide-in-left animation-delay-800">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>
                      {language === 'sr' 
                        ? 'Odgovorićemo vam u roku od 24 sata'
                        : 'We will respond within 24 hours'
                      }
                    </span>
                  </li>
                  <li className="flex items-start gap-2 animate-slide-in-left animation-delay-900">
                    <span className="text-pink-600 font-bold">•</span>
                    <span>
                      {language === 'sr' 
                        ? 'Proverite vaš email inbox'
                        : 'Check your email inbox'
                      }
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center animate-fade-in-up animation-delay-1000">
            <button
              onClick={() => navigate('/')}
              className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-110 hover:shadow-xl animate-pulse-slow"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {language === 'sr' ? 'Početna Stranica' : 'Home Page'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 mt-6 animate-fade-in animation-delay-1200">
          {language === 'sr' 
            ? '💼 AISajt.com - Profesionalna izrada web sajtova'
            : '💼 AISajt.com - Professional web development'
          }
        </p>
      </div>
    </div>
  );
}

