import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NavLink, MobileNavLink } from '../navigation/NavLink';
import { translations } from '../../types/language';
import { navigateToBooking, navigateToDetaljiSection } from '../../utils/navigation';
import { NAP } from '../../lib/site-config';
import { trackPhoneClick } from '../../utils/analytics';

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideOpen, setIsSideOpen] = useState(false);

  // Navbar se ne prikazuje na glavnoj prodajnoj stranici
  if (location.pathname === '/izrada-sajta-detalji') {
    return null;
  }

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

  // Escape zatvara bočni meni
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSideOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
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
              src="/images/providna2.png" width={1024} height={336}
              alt="AiSajt Logo"
              className="h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" loading="eager" {...{ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink href="/izrada-sajta-detalji#case-study" onClick={() => navigateToDetaljiSection('case-study', navigate, location.pathname)}>{t.portfolio}</NavLink>
            <NavLink href="/izrada-sajta-detalji" onClick={() => navigate('/izrada-sajta-detalji')}>{t.aboutUs}</NavLink>
            
            {/* Usluge — vizuelno skriveno na zahtev, ali ostaje u DOM-u da
                Google i dalje prati ove SEO stranice (sr-only, ne display:none). */}
            <div className="sr-only">
              <span>{language === 'sr' ? 'Usluge' : 'Services'}</span>
              <Link to="/seo-optimizacija-cena">{language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}</Link>
              <Link to="/izrada-sajta">{language === 'sr' ? 'Izrada Sajta' : 'Website Development'}</Link>
              <Link to="/web-dizajn">{language === 'sr' ? 'Web Dizajn' : 'Web Design'}</Link>
              <Link to="/izrada-web-shopa">{language === 'sr' ? 'Web Prodavnica' : 'Web Shop'}</Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Nekadašnji "Počni ovde" dropdown — razbijen na dva vidljiva dugmeta */}
              <a
                href="/izrada-sajta-detalji"
                onClick={(e) => { e.preventDefault(); navigate('/izrada-sajta-detalji'); }}
                className="px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                {language === 'sr' ? 'IZRADA SAJTA' : 'WEB DEVELOPMENT'}
              </a>
              <a
                href="/seo-optimizacija-detalji"
                onClick={(e) => { e.preventDefault(); navigate('/seo-optimizacija-detalji'); }}
                className="px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                SEO
              </a>

              <a
                href="/izrada-sajta-detalji#booking-form"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToBooking(navigate, location.pathname);
                }}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 text-sm uppercase tracking-wide"
                aria-label="Kontaktirajte nas"
              >
                {t.contact}
              </a>
            </div>
            
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
          <MobileNavLink href="/izrada-sajta-detalji" onClick={() => {
            setIsMenuOpen(false);
            navigate('/izrada-sajta-detalji');
          }}>{language === 'sr' ? 'IZRADA SAJTA' : 'WEB DEVELOPMENT'}</MobileNavLink>
          <MobileNavLink href="/seo-optimizacija-detalji" onClick={() => {
            setIsMenuOpen(false);
            navigate('/seo-optimizacija-detalji');
          }}>SEO</MobileNavLink>

          <MobileNavLink href="/izrada-sajta-detalji#case-study" onClick={() => {
            setIsMenuOpen(false);
            navigateToDetaljiSection('case-study', navigate, location.pathname);
          }}>{t.portfolio}</MobileNavLink>
          <MobileNavLink href="/izrada-sajta-detalji" onClick={() => {
            setIsMenuOpen(false);
            navigate('/izrada-sajta-detalji');
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
          
          <a
            href="/izrada-sajta-detalji#booking-form"
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              navigateToBooking(navigate, location.pathname);
            }}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 block"
            aria-label="Kontaktirajte nas - Mobilni meni"
          >
            {t.contact}
          </a>
        </div>
      </div>
    </nav>

      {/* ═══ Mini rail trigger — pilula sa leve strane, pojavljuje se na skrol ═══ */}
      <div
        className={`hidden md:block fixed left-5 top-1/2 -translate-y-1/2 z-[60] transition-all duration-500 ease-out ${
          isScrolled && !isSideOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-16 pointer-events-none'
        }`}
        onMouseEnter={() => { if (isScrolled) setIsSideOpen(true); }}
      >
        <button
          onClick={() => setIsSideOpen(true)}
          aria-label={language === 'sr' ? 'Otvori meni' : 'Open menu'}
          aria-expanded={isSideOpen}
          className="group flex flex-col items-center gap-3.5 px-2.5 py-5 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl ring-1 ring-gray-200/80 hover:ring-violet-300 hover:shadow-violet-300/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <img
            src="/images/aisajt close up.png" width={304} height={304}
            alt="AiSajt Logo"
            className="w-9 h-9 object-contain"
            loading="lazy"
          />
          <span className="flex flex-col items-center gap-[5px]" aria-hidden="true">
            <span className="w-5 h-[2px] bg-gray-900 rounded-full transition-all duration-300 group-hover:w-6 group-hover:bg-violet-600"></span>
            <span className="w-6 h-[2px] bg-gray-900 rounded-full transition-all duration-300 group-hover:bg-violet-600"></span>
            <span className="w-4 h-[2px] bg-gray-900 rounded-full transition-all duration-300 group-hover:w-6 group-hover:bg-violet-600"></span>
          </span>
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold tracking-[0.3em] uppercase text-gray-600 group-hover:text-violet-600 transition-colors duration-300">
            {language === 'sr' ? 'Meni' : 'Menu'}
          </span>
        </button>
      </div>

      {/* Backdrop iza bočnog panela */}
      <div
        className={`hidden md:block fixed inset-0 z-[55] bg-gray-950/25 backdrop-blur-[2px] transition-opacity duration-500 ${
          isSideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSideOpen(false)}
        aria-hidden="true"
      ></div>

      {/* ═══ Bočni slide-in panel ═══ */}
      <nav
        className={`hidden md:flex fixed left-0 top-0 bottom-0 z-[60] w-[320px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          isSideOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
        onMouseLeave={() => setIsSideOpen(false)}
        aria-label={language === 'sr' ? 'Bočni meni' : 'Side menu'}
      >
        <div className="m-4 flex-1 flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-gray-200/70 overflow-hidden">
          {/* Gradient akcenat na vrhu */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 flex-shrink-0"></div>

          {/* Header: logo + zatvori */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
            <Link
              to="/"
              onClick={() => setIsSideOpen(false)}
              aria-label="AI Sajt - Početna stranica"
              className="block w-32"
            >
              <img
                src="/images/aisajt nav.png" width={1024} height={336}
                alt="AiSajt Logo"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </Link>
            <button
              onClick={() => setIsSideOpen(false)}
              aria-label={language === 'sr' ? 'Zatvori meni' : 'Close menu'}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Navigacija */}
          <div className="flex-1 overflow-y-auto px-3 pb-2">
            {[
              { label: language === 'sr' ? 'Izrada Sajta' : 'Web Development', href: '/izrada-sajta-detalji', action: () => navigate('/izrada-sajta-detalji') },
              { label: 'SEO', href: '/seo-optimizacija-detalji', action: () => navigate('/seo-optimizacija-detalji') },
              { label: t.portfolio, href: '/izrada-sajta-detalji#case-study', action: () => navigateToDetaljiSection('case-study', navigate, location.pathname) },
              { label: t.aboutUs, href: '/izrada-sajta-detalji', action: () => navigate('/izrada-sajta-detalji') },
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={() => { setIsSideOpen(false); item.action(); }}
                className={`group flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-gray-900 hover:bg-violet-50 font-bold text-base transition-all duration-500 ${
                  isSideOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: isSideOpen ? `${80 + i * 45}ms` : '0ms' }}
              >
                {item.label}
                <ArrowRight className="w-4 h-4 text-violet-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            ))}

            {/* Usluge — vizuelno skrivene na zahtev, ali ostaju u DOM-u da
                Google i dalje prati ove SEO stranice (sr-only, ne display:none). */}
            <div className="sr-only">
            <p>{language === 'sr' ? 'Usluge' : 'Services'}</p>
            {[
              { label: language === 'sr' ? 'Izrada Sajta' : 'Website Dev', to: '/izrada-sajta', dot: 'bg-violet-500' },
              { label: language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization', to: '/seo-optimizacija-cena', dot: 'bg-indigo-500' },
              { label: language === 'sr' ? 'Web Dizajn' : 'Web Design', to: '/web-dizajn', dot: 'bg-pink-500' },
              { label: language === 'sr' ? 'Web Prodavnica' : 'Web Shop', to: '/izrada-web-shopa', dot: 'bg-emerald-500' },
            ].map((item, i) => (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => { e.preventDefault(); setIsSideOpen(false); navigate(item.to); }}
                className={`group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-violet-50 font-semibold text-[15px] transition-all duration-500 ${
                  isSideOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: isSideOpen ? `${230 + i * 45}ms` : '0ms' }}
              >
                <span className={`w-2 h-2 rounded-full ${item.dot} group-hover:scale-125 transition-transform duration-300`} aria-hidden="true"></span>
                {item.label}
              </a>
            ))}
            </div>

          </div>

          {/* Footer: telefon + CTA + jezik */}
          <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
            <a
              href={`tel:${NAP.phone.tel}`}
              onClick={() => trackPhoneClick(NAP.phone.tel, 'side_menu', language)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
            >
              <span className="lg-phone-ring inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 flex-shrink-0">
                <Phone className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                  {language === 'sr' ? 'Pozovite nas' : 'Call us'}
                </span>
                <span className="block font-bold text-gray-900 text-sm">{NAP.phone.display}</span>
              </span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="/portal/login"
                onClick={(e) => { e.preventDefault(); setIsSideOpen(false); navigate('/portal/login'); }}
                className="text-center px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide text-violet-600 border-2 border-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300"
                aria-label={language === 'sr' ? 'Prijava na portal' : 'Portal login'}
              >
                {language === 'sr' ? 'Prijava' : 'Login'}
              </a>
              <a
                href="/izrada-sajta-detalji#booking-form"
                onClick={(e) => { e.preventDefault(); setIsSideOpen(false); navigateToBooking(navigate, location.pathname); }}
                className="lg-btn-primary text-center px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide text-white"
                aria-label="Kontaktirajte nas"
              >
                {t.contact}
              </a>
            </div>

            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setLanguage('sr')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  language === 'sr'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                SR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

