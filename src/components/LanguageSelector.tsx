'use client';

import { useLanguage } from './LanguageProvider';

export function LanguageSelector() {
  const { locale, setLocale, locales, localeNames } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => document.getElementById('lang-menu')?.classList.toggle('hidden')}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Select language"
        aria-expanded="false"
        aria-haspopup="listbox"
      >
        <span className="text-base">{localeNames[locale]}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id="lang-menu"
        className="hidden absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
        role="listbox"
        aria-label="Available languages"
      >
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`w-full text-left px-4 py-2 text-sm ${
              locale === loc
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            role="option"
            aria-selected={locale === loc}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}