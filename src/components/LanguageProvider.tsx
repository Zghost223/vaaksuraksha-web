'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, locales, getLocaleStrings, localeNames } from '@/locales';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getLocaleStrings>;
  locales: Locale[];
  localeNames: Record<Locale, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('vaaksuraksha-locale') as Locale | null;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    } else {
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('vaaksuraksha-locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getLocaleStrings(locale), locales, localeNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}