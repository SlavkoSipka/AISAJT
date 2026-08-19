import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types/language';
import { trackEvent } from '../utils/analytics';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR/prerender-safe: initial render always starts as Serbian (localStorage
  // doesn't exist in the Node prerender environment, and this also matches
  // the default every first-time visitor/crawler already saw). Any saved
  // preference is applied client-side after mount, below.
  const [language, setLanguageState] = useState<Language>('sr');

  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'sr') {
      setLanguageState(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Sačuvaj u localStorage
    localStorage.setItem('language', language);

    // Postavi HTML lang atribut
    document.documentElement.lang = language;

    document.body.setAttribute('data-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'sr' ? 'en' : 'sr';
    setLanguage(newLang);
    
    // Track language change
    trackEvent('language_change', {
      from_language: language,
      to_language: newLang
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

