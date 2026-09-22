'use client';

import { useLanguage } from './LanguageProvider';

interface LayerBarsProps {
  layers: {
    label: string;
    score: number;
    color: 'primary' | 'success' | 'warning' | 'danger';
  }[];
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

export function LayerBars({ layers }: LayerBarsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {layers.map((layer, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{layer.label}</span>
            <span className="font-mono text-gray-900">{(layer.score * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClasses[layer.color]} rounded-full transition-all duration-500`}
              style={{ width: `${layer.score * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}