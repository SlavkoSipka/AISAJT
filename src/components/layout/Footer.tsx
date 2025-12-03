import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="relative text-gray-900 py-12 md:py-16 border-t border-violet-200/30">
      {/* Smooth layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-violet-50/35 to-pink-50/40"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-50/20 via-transparent to-indigo-50/25"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link 
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
            >
              <img 
                src="/images/providna2.png" 
                alt="AiSajt Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-600">
              {t.footerDesc}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.services}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{language === 'sr' ? 'Web Dizajn' : 'Web Design'}</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{language === 'sr' ? 'Baze Podataka' : 'Database Management'}</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{language === 'sr' ? 'Online Marketing' : 'Online Marketing'}</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{language === 'sr' ? 'E-commerce' : 'E-commerce'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{t.aboutUs}</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{t.portfolio}</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{language === 'sr' ? 'Resursi' : 'Resources'}</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{t.contact}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-600" aria-hidden="true" />
                <a 
                  href="mailto:office@aisajt.com"
                  className="text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label="Pošaljite email na office@aisajt.com"
                >
                  office@aisajt.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <a 
                  href="tel:+381613091583"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  aria-label="Pozovite na broj +381 61 3091583"
                >
                  +381 61 3091583
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-600" aria-hidden="true" />
                <span className="text-gray-600">{language === 'sr' ? 'Beograd, Srbija' : 'Belgrade, Serbia'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-violet-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} AiSajt.com | {language === 'sr' ? 'Profesionalna izrada web sajtova' : 'Professional web development'}
            </p>
            <div className="flex gap-6">
              <Link 
                to="/privacy" 
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                aria-label={language === 'sr' ? 'Politika privatnosti' : 'Privacy Policy'}
              >
                {language === 'sr' ? 'Privatnost' : 'Privacy'}
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-600 hover:text-violet-600 transition-colors duration-300"
                aria-label={language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
              >
                {language === 'sr' ? 'Uslovi korišćenja' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

