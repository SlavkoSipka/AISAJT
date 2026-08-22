import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { NavLink, MobileNavLink } from '../navigation/NavLink';
import { translations } from '../../types/language';
import { navigateToSection } from '../../utils/navigation';
import { NAP } from '../../lib/site-config';
import { trackPhoneClick } from '../../utils/analytics';

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isServicesOpenMobile, setIsServicesOpenMobile] = useState(false);
  const [isSideOpen, setIsSideOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  // Hide navbar on funnel page
  if (location.pathname === '/funnel') {
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (guideRef.current && !guideRef.current.contains(event.target as Node)) {
        setIsGuideOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <NavLink href="/portfolio" onClick={() => navigate('/portfolio')}>{t.portfolio}</NavLink>
            <NavLink href="/#video-section" onClick={() => navigateToSection('video-section', navigate, location.pathname)}>{t.aboutUs}</NavLink>
            
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigate('/blog');
              }}
              className="font-medium text-sm uppercase tracking-wider text-gray-900 hover:text-violet-600 transition-colors duration-300"
              aria-label="Blog"
            >
              BLOG
            </a>
            
            {/* Services Dropdown */}
            <div 
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 font-medium text-sm uppercase tracking-wider text-gray-900 hover:text-violet-600 transition-colors duration-300"
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
                <a
                  href="/seo-optimizacija-cena"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/seo-optimizacija-cena');
                    setIsServicesOpen(false);
                  }}
                  className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:bg-violet-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'SEO Optimizacija' : 'SEO Optimization'}
                </a>
                <a
                  href="/izrada-sajta"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/izrada-sajta');
                    setIsServicesOpen(false);
                  }}
                  className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 hover:bg-indigo-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Izrada Sajta' : 'Website Development'}
                </a>
                <a
                  href="/web-dizajn"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/web-dizajn');
                    setIsServicesOpen(false);
                  }}
                  className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-rose-500 hover:to-violet-500 hover:bg-pink-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Web Dizajn' : 'Web Design'}
                </a>
                <a
                  href="/izrada-web-shopa"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/izrada-web-shopa');
                    setIsServicesOpen(false);
                  }}
                  className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 hover:bg-emerald-50 font-bold text-sm transition-all duration-300"
                >
                  {language === 'sr' ? 'Web Prodavnica' : 'Web Shop'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Guide / Počni ovde – dropdown za klijente (resursi, vodič, kviz, audit, blog) */}
              <div
                ref={guideRef}
                className="relative"
                onMouseEnter={() => setIsGuideOpen(true)}
                onMouseLeave={() => setIsGuideOpen(false)}
              >
                <button
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
                  aria-label={language === 'sr' ? 'Vodič i resursi za klijente' : 'Guide and resources for clients'}
                >
                  {language === 'sr' ? 'POČNI OVDE' : 'START HERE'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isGuideOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
                    isGuideOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="px-4 py-2.5 border-b-2 border-gray-200 bg-gray-50/80 cursor-default">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      {language === 'sr' ? 'Sve što vam treba za početak' : 'Everything you need to get started'}
                    </p>
                  </div>
                  <a
                    href="/izrada-sajta-detalji"
                    onClick={(e) => { e.preventDefault(); navigate('/izrada-sajta-detalji'); setIsGuideOpen(false); }}
                    className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 hover:bg-indigo-50 font-bold text-sm transition-all duration-300"
                  >
                    {language === 'sr' ? 'Izrada Sajta Detalji' : 'Website Development Details'}
                  </a>
                  <a
                    href="/seo-optimizacija-detalji"
                    onClick={(e) => { e.preventDefault(); navigate('/seo-optimizacija-detalji'); setIsGuideOpen(false); }}
                    className="block w-full text-left px-6 py-4 text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 hover:bg-violet-50 font-bold text-sm transition-all duration-300"
                  >
                    {language === 'sr' ? 'SEO Optimizacija Detalji' : 'SEO Optimization Details'}
                  </a>
                </div>
              </div>

              <a
                href="/portal/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/portal/login');
                }}
                className="px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide text-violet-600 border-2 border-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300"
                aria-label={language === 'sr' ? 'Prijava na portal' : 'Portal login'}
              >
                {language === 'sr' ? 'PRIJAVA' : 'LOGIN'}
              </a>

              <a
                href="/funnel"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/funnel');
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
          {/* Usluge – dropdown na mobilnom */}
          <div>
            <button
              type="button"
              onClick={() => setIsServicesOpenMobile(!isServicesOpenMobile)}
              className="flex items-center justify-between w-full text-left text-gray-900 py-4 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 touch-feedback text-lg font-medium border border-gray-200"
            >
              {language === 'sr' ? 'Usluge' : 'Services'}
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isServicesOpenMobile ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${isServicesOpenMobile ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
              <a
                href="/seo-optimizacija-cena"
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/seo-optimizacija-cena'); }}
                className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-600 hover:via-indigo-500 hover:to-pink-500 py-3 pl-6 pr-4 rounded-lg hover:bg-violet-50 transition-all duration-300 text-base font-bold"
              >
                {language === 'sr' ? 'SEO OPTIMIZACIJA' : 'SEO OPTIMIZATION'}
              </a>
              <a
                href="/izrada-sajta"
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/izrada-sajta'); }}
                className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:via-blue-500 hover:to-cyan-500 py-3 pl-6 pr-4 rounded-lg hover:bg-indigo-50 transition-all duration-300 text-base font-bold"
              >
                {language === 'sr' ? 'IZRADA SAJTA' : 'WEBSITE DEV'}
              </a>
              <a
                href="/web-dizajn"
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/web-dizajn'); }}
                className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:via-rose-500 hover:to-violet-500 py-3 pl-6 pr-4 rounded-lg hover:bg-pink-50 transition-all duration-300 text-base font-bold"
              >
                {language === 'sr' ? 'WEB DIZAJN' : 'WEB DESIGN'}
              </a>
              <a
                href="/izrada-web-shopa"
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/izrada-web-shopa'); }}
                className="block w-full text-left text-gray-900 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-600 hover:via-teal-500 hover:to-cyan-500 py-3 pl-6 pr-4 rounded-lg hover:bg-emerald-50 transition-all duration-300 text-base font-bold"
              >
                {language === 'sr' ? 'WEB PRODAVNICA' : 'WEB SHOP'}
              </a>
            </div>
          </div>

          {/* Blog */}
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
              navigate('/blog');
            }}
            className="block w-full text-left text-gray-900 hover:text-violet-600 py-4 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 touch-feedback text-lg font-medium"
          >
            BLOG
          </a>
          
          <MobileNavLink href="/portfolio" onClick={() => {
            setIsMenuOpen(false);
            navigate('/portfolio');
          }}>{t.portfolio}</MobileNavLink>
          <MobileNavLink href="/#video-section" onClick={() => {
            setIsMenuOpen(false);
            navigateToSection('video-section', navigate, location.pathname);
          }}>{t.aboutUs}</MobileNavLink>

          {/* Počni ovde – vodič za klijente (mobile) */}
          <div className="border-t border-gray-200 pt-5 mt-4">
            <p className="px-4 pb-3 text-sm font-bold uppercase tracking-wider text-violet-600">
              {language === 'sr' ? 'Počni ovde' : 'Start here'}
            </p>
            <a href="/izrada-sajta-detalji" onClick={(e) => { e.preventDefault(); navigate('/izrada-sajta-detalji'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-900 hover:text-violet-600 hover:bg-violet-50 py-4 px-4 rounded-lg font-bold text-base uppercase tracking-wide transition-colors">
              {language === 'sr' ? 'Izrada Sajta Detalji' : 'Website Development Details'}
            </a>
            <a href="/seo-optimizacija-detalji" onClick={(e) => { e.preventDefault(); navigate('/seo-optimizacija-detalji'); setIsMenuOpen(false); }} className="block w-full text-left text-gray-900 hover:text-violet-600 hover:bg-violet-50 py-4 px-4 rounded-lg font-bold text-base uppercase tracking-wide transition-colors">
              {language === 'sr' ? 'SEO Optimizacija Detalji' : 'SEO Optimization Details'}
            </a>
          </div>
          
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
            href="/portal/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/portal/login');
              setIsMenuOpen(false);
            }}
            className="w-full text-center px-6 py-3 rounded-lg font-semibold text-violet-600 border-2 border-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-300 block"
            aria-label={language === 'sr' ? 'Prijava na portal' : 'Portal login'}
          >
            {language === 'sr' ? 'PRIJAVA' : 'LOGIN'}
          </a>

          <a
            href="/funnel"
            onClick={(e) => {
              e.preventDefault();
              navigate('/funnel');
              setIsMenuOpen(false);
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
              { label: t.portfolio, action: () => navigate('/portfolio') },
              { label: t.aboutUs, action: () => navigateToSection('video-section', navigate, location.pathname) },
              { label: 'Blog', action: () => navigate('/blog') },
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

            <p className="px-4 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {language === 'sr' ? 'Usluge' : 'Services'}
            </p>
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

            <p className="px-4 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {language === 'sr' ? 'Počni ovde' : 'Start here'}
            </p>
            {[
              { label: language === 'sr' ? 'Izrada Sajta Detalji' : 'Website Development Details', to: '/izrada-sajta-detalji' },
              { label: language === 'sr' ? 'SEO Optimizacija Detalji' : 'SEO Optimization Details', to: '/seo-optimizacija-detalji' },
            ].map((item, i) => (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => { e.preventDefault(); setIsSideOpen(false); navigate(item.to); }}
                className={`block w-full px-4 py-2.5 rounded-xl text-gray-700 hover:text-violet-700 hover:bg-violet-50 font-semibold text-[15px] transition-all duration-500 ${
                  isSideOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: isSideOpen ? `${420 + i * 45}ms` : '0ms' }}
              >
                {item.label}
              </a>
            ))}
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
                href="/funnel"
                onClick={(e) => { e.preventDefault(); setIsSideOpen(false); navigate('/funnel'); }}
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

