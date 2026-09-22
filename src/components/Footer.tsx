'use client';

import { useLanguage } from './LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-primary-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 8C11.5817 8 8 11.5817 8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 8C20.4183 8 24 11.5817 24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 16C8 20.4183 11.5817 24 16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M24 16C24 20.4183 20.4183 24 16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="4" fill="currentColor"/>
              </svg>
              <span className="text-xl font-bold text-white">VaakSuraksha</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.about.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.about.problemStatement}</h3>
            <p className="text-sm text-gray-400">{t.about.organization}</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.privacy}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Edge inference only</li>
              <li>RAM-only audio buffers</li>
              <li>Feature-only logs</li>
              <li>Hash-chained audit trail</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.opensource}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>REST + WebSocket API</li>
              <li>OpenAPI documentation</li>
              <li>Policy-as-code configuration</li>
              <li>gRPC gateway (planned)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}