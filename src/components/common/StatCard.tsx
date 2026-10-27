import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/70',
      iconBg: 'bg-blue-600 text-white',
      border: 'border-blue-100',
    },
    purple: {
      bg: 'bg-purple-50/70',
      iconBg: 'bg-purple-600 text-white',
      border: 'border-purple-100',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-600 text-white',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-600 text-white',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50/70',
      iconBg: 'bg-rose-600 text-white',
      border: 'border-rose-100',
    },
  };

  const selected = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${selected.border} shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl shadow-xs ${selected.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
