'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { LanguageSelector } from './LanguageSelector';

export function Navbar() {
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/accuracy', label: t.nav.accuracy },
    { href: '/about', label: t.nav.about },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="VaakSuraksha Home">
            <svg className="w-8 h-8 text-primary-600" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 8C11.5817 8 8 11.5817 8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 8C20.4183 8 24 11.5817 24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 16C8 20.4183 11.5817 24 16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M24 16C24 20.4183 20.4183 24 16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="4" fill="currentColor"/>
            </svg>
            <span className="text-xl font-bold text-gray-900">VaakSuraksha</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <LanguageSelector />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}