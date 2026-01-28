import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesOpenVertical, setIsServicesOpenVertical] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesVerticalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (servicesVerticalRef.current && !servicesVerticalRef.current.contains(event.target as Node)) {
        setIsServicesOpenVertical(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Horizontal Navbar - Top (hides on scroll for desktop, always visible on mobile) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'md:opacity-0 md:pointer-events-none md:-translate-y-full opacity-100 pointer-events-auto translate-y-0 bg-white/95 shadow-sm backdrop-blur-sm' 
          : 'opacity-100 bg-white/95 shadow-sm backdrop-blur-sm'
      }`}>
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
              className="h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink onClick={() => navigateToSection('portfolio', navigate, location.pathname)}>{t.portfolio}</NavLink>
            <NavLink onClick={() => navigateToSection('video-section', navigate, location.pathname)}>{t.aboutUs}</NavLink>
            
            <button
              onClick={() => navigate('/blog')}
              className="font-black text-sm uppercase tracking-wider text-gray-900 hover:text-violet-600 transition-colors duration-300"
              aria-label="Blog"
            >
              BLOG
            </button>
            
            {/* Services Dropdown */}
            <div 
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 font-black text-sm uppercase tracking-wider text-gray-900 hover:text-violet-600 transition-colors duration-300"
                aria-label="Usluge"
              >
                {language === 'sr' ? 'USLUGE' : 'SERVICES'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
                  isServicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <button
                  onClick={() => {
                    navigate('/seo-optimizacija-cena');
                    setIsServicesOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:bg-violet-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                </button>
                <button
                  onClick={() => {
                    navigate('/izrada-sajta-cena');
                    setIsServicesOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 hover:bg-indigo-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Izrada Sajta' : 'Website Development'}
                </button>
                <button
                  onClick={() => {
                    navigate('/web-dizajn');
                    setIsServicesOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-rose-500 hover:to-violet-500 hover:bg-pink-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </button>
                <button
                  onClick={() => {
                    navigate('/izrada-web-shopa');
                    setIsServicesOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 hover:bg-emerald-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Web Prodavnica' : 'Web Shop'}
                </button>
              </div>
            </div>
            
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
          {/* SEO - First on mobile menu */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/seo');
            }}
            className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 py-4 px-4 rounded-lg hover:bg-violet-50 transition-all duration-300 touch-feedback text-lg font-bold"
          >
            {language === 'sr' ? 'SEO OPTIMIZACIJA' : 'SEO OPTIMIZATION'}
          </button>

          {/* Izrada Sajta - Second on mobile menu */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/izrada-sajta-cena');
            }}
            className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 py-4 px-4 rounded-lg hover:bg-indigo-50 transition-all duration-300 touch-feedback text-lg font-bold"
          >
            {language === 'sr' ? 'IZRADA SAJTA' : 'WEBSITE DEV'}
          </button>

          {/* Web Dizajn - Third on mobile menu */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/web-dizajn');
            }}
            className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-rose-500 hover:to-violet-500 py-4 px-4 rounded-lg hover:bg-pink-50 transition-all duration-300 touch-feedback text-lg font-bold"
          >
            {language === 'sr' ? 'WEB DIZAJN' : 'WEB DESIGN'}
          </button>

          {/* Web Prodavnica - Fourth on mobile menu */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/izrada-web-shopa');
            }}
            className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 py-4 px-4 rounded-lg hover:bg-emerald-50 transition-all duration-300 touch-feedback text-lg font-bold"
          >
            {language === 'sr' ? 'WEB PRODAVNICA' : 'WEB SHOP'}
          </button>
          
          {/* Blog */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/blog');
            }}
            className="block w-full text-left text-gray-900 hover:text-violet-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 touch-feedback text-lg font-bold"
          >
            BLOG
          </button>
          
          <MobileNavLink onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('portfolio', navigate, location.pathname);
          }}>{t.portfolio}</MobileNavLink>
          <MobileNavLink onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('video-section', navigate, location.pathname);
          }}>{t.aboutUs}</MobileNavLink>
          
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

      {/* Vertical Sidebar Navbar - Left Side on Scroll (Hidden on Mobile) */}
      <nav className={`hidden md:block fixed left-0 top-0 h-full z-50 bg-white shadow-2xl transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'translate-x-0 opacity-100' 
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full py-4 px-4 w-52 border-r border-gray-200">
          {/* Logo at Top - Smaller & Closer to Top */}
          <Link 
            to="/" 
            className="flex items-center justify-center mb-6 group"
            aria-label="AI Sajt - Početna stranica"
          >
            <img 
              src="/images/providna3.png" 
              alt="AiSajt Logo" 
              className="w-3/4 h-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Horizontal Navigation Buttons - Minimal Design with Site Colors */}
          <div className="flex flex-col space-y-1 flex-1">
            <button
              onClick={() => navigateToSection('portfolio', navigate, location.pathname)}
              className="w-full text-left px-4 py-3.5 text-gray-800 hover:text-violet-600 font-semibold text-[15px] transition-colors duration-300 border-l-2 border-transparent hover:border-violet-600"
            >
              {t.portfolio}
            </button>
            <button
              onClick={() => navigateToSection('video-section', navigate, location.pathname)}
              className="w-full text-left px-4 py-3.5 text-gray-800 hover:text-violet-600 font-semibold text-[15px] transition-colors duration-300 border-l-2 border-transparent hover:border-violet-600"
            >
              {t.aboutUs}
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="w-full text-left px-4 py-3.5 text-gray-900 hover:text-violet-600 font-black text-[15px] transition-colors duration-300 border-l-2 border-transparent hover:border-violet-600"
            >
              Blog
            </button>
            
            {/* Services Dropdown - Vertical */}
            <div 
              ref={servicesVerticalRef}
              className="relative"
            >
              <button
                onClick={() => setIsServicesOpenVertical(!isServicesOpenVertical)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-gray-900 hover:text-violet-600 font-black text-[15px] transition-all duration-300 border-l-2 border-transparent hover:border-violet-600"
                aria-label="Usluge"
              >
                <span>{language === 'sr' ? 'Usluge' : 'Services'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpenVertical ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu - Vertical */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  isServicesOpenVertical ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <button
                  onClick={() => {
                    navigate('/seo-optimizacija-cena');
                    setIsServicesOpenVertical(false);
                  }}
                  className="w-full text-left px-8 py-3 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:bg-violet-50 font-semibold text-sm transition-all duration-300 border-l-2 border-transparent hover:border-violet-600"
                >
                  {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                </button>
                <button
                  onClick={() => {
                    navigate('/izrada-sajta-cena');
                    setIsServicesOpenVertical(false);
                  }}
                  className="w-full text-left px-8 py-3 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 hover:bg-indigo-50 font-semibold text-sm transition-all duration-300 border-l-2 border-transparent hover:border-indigo-600"
                >
                  {language === 'sr' ? 'Izrada Sajta' : 'Website Dev'}
                </button>
                <button
                  onClick={() => {
                    navigate('/web-dizajn');
                    setIsServicesOpenVertical(false);
                  }}
                  className="w-full text-left px-8 py-3 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-rose-500 hover:to-violet-500 hover:bg-pink-50 font-semibold text-sm transition-all duration-300 border-l-2 border-transparent hover:border-pink-600"
                >
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </button>
                <button
                  onClick={() => {
                    navigate('/izrada-web-shopa');
                    setIsServicesOpenVertical(false);
                  }}
                  className="w-full text-left px-8 py-3 text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 hover:bg-emerald-50 font-semibold text-sm transition-all duration-300 border-l-2 border-transparent hover:border-emerald-600"
                >
                  {language === 'sr' ? 'Web Prodavnica' : 'Web Shop'}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Button at Bottom - Same as Horizontal Navbar */}
          <button
            onClick={() => navigate('/contact')}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm uppercase tracking-wide"
            aria-label="Kontaktirajte nas"
          >
            {t.contact}
          </button>
          
          {/* Language Switcher at Bottom */}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              onClick={() => setLanguage('sr')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                language === 'sr'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              SR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                language === 'en'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

