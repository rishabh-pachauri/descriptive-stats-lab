import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'dark' | 'success' | 'warning' | 'question';
  title?: string;
  subtitle?: string;
}

const variants: Record<string, string> = {
  default:  'bg-white border border-gray-100 shadow-sm',
  accent:   'bg-brand-50 border border-brand-100',
  dark:     'bg-gray-900 text-white border border-gray-700',
  success:  'bg-green-50 border border-green-200',
  warning:  'bg-amber-50 border border-amber-200',
  question: 'bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl',
};

export default function Card({ children, className, variant = 'default', title, subtitle }: CardProps) {
  return (
    <div className={clsx('rounded-2xl p-6', variants[variant], className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="font-semibold text-lg text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
