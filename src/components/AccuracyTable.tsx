'use client';

import { useLanguage } from './LanguageProvider';
import { AccuracyMetrics } from '@/types';

interface AccuracyTableProps {
  metrics: AccuracyMetrics;
  section: 'overall' | 'perLanguage' | 'perCodec' | 'unseenGenerator';
}

type SimpleMetrics = Record<string, number>;
type NestedMetrics = Record<string, { eer: number; auc: number; f1: number; fprAt95Recall: number }>;

export function AccuracyTable({ metrics, section }: AccuracyTableProps) {
  const { t } = useLanguage();

  const getSectionData = (): SimpleMetrics | NestedMetrics => {
    switch (section) {
      case 'overall':
        return { [t.accuracy.metrics.eer]: metrics.overall.eer, [t.accuracy.metrics.auc]: metrics.overall.auc, [t.accuracy.metrics.f1]: metrics.overall.f1, [t.accuracy.metrics.fpr]: metrics.overall.fprAt95Recall };
      case 'perLanguage':
        return metrics.perLanguage;
      case 'perCodec':
        return metrics.perCodec;
      case 'unseenGenerator':
        return { [t.accuracy.metrics.eer]: metrics.unseenGenerator.eer, [t.accuracy.metrics.auc]: metrics.unseenGenerator.auc, [t.accuracy.metrics.f1]: metrics.unseenGenerator.f1, [t.accuracy.metrics.fpr]: metrics.unseenGenerator.fprAt95Recall };
      default:
        return {};
    }
  };

  const data = getSectionData();
  const isSingleRow = section === 'overall' || section === 'unseenGenerator';

  if (isSingleRow) {
    const simpleData = data as SimpleMetrics;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Metric</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(simpleData).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{key}</td>
                <td className="px-4 py-3 text-right font-mono font-medium text-gray-900">
                  {typeof value === 'number' ? value.toFixed(3) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const nestedData = data as NestedMetrics;
  const keys = Object.keys(nestedData);
  const firstKey = keys[0];
  const metricNames = firstKey ? Object.keys(nestedData[firstKey]) : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left font-medium text-gray-500">{section === 'perLanguage' ? t.accuracy.languages.hindi : t.accuracy.codecs.g711}</th>
            {metricNames.map((metric) => (
              <th key={metric} className="px-4 py-3 text-right font-medium text-gray-500">
                {metric}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700 font-medium">
                {section === 'perLanguage' ? t.accuracy.languages[key as keyof typeof t.accuracy.languages] || key : t.accuracy.codecs[key as keyof typeof t.accuracy.codecs] || key}
              </td>
              {metricNames.map((metric) => (
                <td key={metric} className="px-4 py-3 text-right font-mono text-gray-900">
                  {(nestedData[key] as Record<string, number>)[metric].toFixed(3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}