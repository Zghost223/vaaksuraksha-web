'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-primary-50 via-white to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Smart India Hackathon 2026 · PS 26104
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            {t.hero.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          <p className="text-base md:text-lg text-primary-600 font-medium mb-8">
            {t.hero.tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t.hero.cta}
            </Link>
            <Link
              href="/accuracy"
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}