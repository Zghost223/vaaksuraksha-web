'use client';

import { useLanguage } from './LanguageProvider';

interface RiskMeterProps {
  score: number;
  status: 'green' | 'amber' | 'red';
  label?: string;
}

export function RiskMeter({ score, status, label }: RiskMeterProps) {
  const { t } = useLanguage();

  const statusConfig = {
    green: { bg: 'bg-success-500', bgLight: 'bg-success-50', border: 'border-success-200', text: 'text-success-700', label: t.dashboard.status.green },
    amber: { bg: 'bg-warning-500', bgLight: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-700', label: t.dashboard.status.amber },
    red: { bg: 'bg-danger-500', bgLight: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-700', label: t.dashboard.status.red },
  };

  const config = statusConfig[status];
  const percentage = Math.round(score * 100);

  return (
    <div className={`p-6 rounded-xl border ${config.border} ${config.bgLight}`}>
      {label && <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>}
      
      <div className="relative h-32 md:h-40 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={status === 'green' ? '#22c55e' : status === 'amber' ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.83} 283`}
            strokeDashoffset="0"
            className="transition-all duration-500 ease-out"
            style={{ strokeDasharray: `${percentage * 2.83} 283` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl md:text-4xl font-bold ${config.text}`}>{percentage}%</span>
          <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.bg} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}