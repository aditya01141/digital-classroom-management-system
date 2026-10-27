import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'slate' | 'outline' | 'rose' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    rose: 'bg-rose-100 text-rose-800 border-rose-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
