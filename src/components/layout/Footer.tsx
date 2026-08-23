import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../types/language';
import { NAP } from '../../lib/site-config';

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="relative bg-white text-gray-900 py-12 md:py-16 border-t border-gray-200">
      <div className="container mx-auto px-4 md:pl-56 md:pr-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div>
            <Link 
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-300 group mb-4"
            >
              <img 
                src="/images/providna2.png" width={1024} height={336} 
                alt="AiSajt Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
            <p className="text-gray-600">
              {t.footerDesc}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.services}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/seo-optimizacija-cena" className="text-gray-600 hover:text-violet-600 transition-colors duration-300">{language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}</Link></li>
              <li><Link to="/izrada-sajta" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{language === 'sr' ? 'Izrada Sajta' : 'Website Development'}</Link></li>
              <li><Link to="/web-dizajn" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{language === 'sr' ? 'Web Dizajn' : 'Web Design'}</Link></li>
              <li><Link to="/izrada-web-shopa" className="text-gray-600 hover:text-emerald-600 transition-colors duration-300">{language === 'sr' ? 'Web Prodavnica' : 'Web Shop'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/izrada-sajta-detalji" className="text-gray-600 hover:text-violet-600 transition-colors duration-300 text-left">{t.aboutUs}</Link></li>
              <li><Link to="/izrada-sajta-detalji#case-study" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">{t.portfolio}</Link></li>
              <li><Link to="/izrada-sajta-detalji#booking-form" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{t.contact}</Link></li>
              <li><Link to="/izrada-sajta-detalji" className="text-gray-600 hover:text-pink-600 transition-colors duration-300">{language === 'sr' ? 'Pogledaj Ponudu' : 'See Our Offer'}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-violet-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${NAP.email}`}
                  className="text-gray-600 hover:text-violet-600 transition-colors duration-300"
                  aria-label={`Pošaljite email na ${NAP.email}`}
                >
                  {NAP.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${NAP.phone.tel}`}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  aria-label={`Pozovite na broj ${NAP.phone.display}`}
                >
                  {NAP.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pink-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-600">{language === 'sr' ? NAP.address.display : NAP.address.displayEn}</span>
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
              <a
                href="/portal/login"
                className="text-sm text-gray-500 hover:text-violet-600 transition-colors duration-300"
                aria-label={language === 'sr' ? 'Prijava na portal' : 'Portal login'}
              >
                {language === 'sr' ? 'Prijava' : 'Login'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

