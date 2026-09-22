'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { AccuracyMetrics } from '@/types';

export function AccuracyPageClient() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<AccuracyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/accuracy');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load accuracy metrics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading accuracy metrics...</p>
        </div>
      </section>
    );
  }

  if (error || !metrics) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-danger-600">Failed to load accuracy metrics. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.accuracy.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.accuracy.subtitle}</p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.accuracy.overall}</h2>
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">{JSON.stringify(metrics.overall, null, 2)}</pre>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.accuracy.unseenGenerator}</h2>
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">{JSON.stringify(metrics.unseenGenerator, null, 2)}</pre>
            </article>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.accuracy.perLanguage}</h2>
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">{JSON.stringify(metrics.perLanguage, null, 2)}</pre>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.accuracy.perCodec}</h2>
              <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">{JSON.stringify(metrics.perCodec, null, 2)}</pre>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}