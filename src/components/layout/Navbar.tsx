import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NavLink, MobileNavLink } from '../navigation/NavLink';
import { translations } from '../../types/language';
import { navigateToSection } from '../../utils/navigation';

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/98 shadow-md backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link 
            to="/" 
            className="flex items-center group py-2"
            aria-label="AI Sajt - Početna stranica"
          >
            <img 
              src="/images/providna2.png" 
              alt="AiSajt Logo" 
              className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink onClick={() => navigateToSection('services', navigate, location.pathname)}>{t.services}</NavLink>
            <NavLink onClick={() => navigateToSection('why-us', navigate, location.pathname)}>{t.portfolio}</NavLink>
            <NavLink onClick={() => navigateToSection('video-section', navigate, location.pathname)}>{t.aboutUs}</NavLink>
            <NavLink onClick={() => navigate('/resources')}>{language === 'sr' ? 'Resursi' : 'Resources'}</NavLink>
            
            <button
              onClick={() => navigate('/contact')}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm uppercase tracking-wide"
              aria-label="Kontaktirajte nas"
            >
              {t.contact}
            </button>
            
            {/* Language Switcher Toggle */}
            <div className="flex gap-1 border-2 border-gray-900 rounded-full p-1">
              <button
                onClick={() => setLanguage('sr')}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                  language === 'sr'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                SR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <MobileNavLink onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('services', navigate, location.pathname);
          }}>{t.services}</MobileNavLink>
          <MobileNavLink onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('why-us', navigate, location.pathname);
          }}>{t.portfolio}</MobileNavLink>
          <MobileNavLink onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('video-section', navigate, location.pathname);
          }}>{t.aboutUs}</MobileNavLink>
          <MobileNavLink onClick={() => {
            navigate('/resources');
            setIsMenuOpen(false);
          }}>{language === 'sr' ? 'Resursi' : 'Resources'}</MobileNavLink>
          
          {/* Language Switcher Toggle - Mobile */}
          <div className="px-4 py-2 flex justify-center">
            <div className="flex gap-1 bg-gray-700 rounded-full p-1">
              <button
                onClick={() => setLanguage('sr')}
                className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                  language === 'sr'
                    ? 'bg-white text-gray-700 shadow-md'
                    : 'bg-transparent text-gray-300 hover:text-white'
                }`}
              >
                SR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-white text-gray-700 shadow-md'
                    : 'bg-transparent text-gray-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              navigate('/contact');
              setIsMenuOpen(false);
            }}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300"
            aria-label="Kontaktirajte nas - Mobilni meni"
          >
            {t.contact}
          </button>
        </div>
      </div>
    </nav>
  );
}

