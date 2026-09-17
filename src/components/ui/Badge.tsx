import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'brand' | 'green' | 'amber' | 'red' | 'gray' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap: Record<string, string> = {
  brand: 'bg-brand-100 text-brand-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red:   'bg-red-100 text-red-700',
  gray:  'bg-gray-100 text-gray-600',
  blue:  'bg-blue-100 text-blue-700',
};

export default function Badge({ children, color = 'brand', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
