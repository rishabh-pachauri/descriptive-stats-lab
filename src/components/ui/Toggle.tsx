import clsx from 'clsx';

interface ToggleProps {
  leftLabel: string;
  rightLabel: string;
  value: 'left' | 'right';
  onChange: (v: 'left' | 'right') => void;
  className?: string;
}

export default function Toggle({ leftLabel, rightLabel, value, onChange, className }: ToggleProps) {
  return (
    <div
      className={clsx('inline-flex rounded-xl overflow-hidden border border-brand-200 shadow-sm', className)}
      role="group"
      aria-label="Toggle option"
    >
      <button
        onClick={() => onChange('left')}
        className={clsx(
          'px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none',
          value === 'left'
            ? 'bg-brand-600 text-white'
            : 'bg-white text-gray-600 hover:bg-brand-50'
        )}
      >
        {leftLabel}
      </button>
      <button
        onClick={() => onChange('right')}
        className={clsx(
          'px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none',
          value === 'right'
            ? 'bg-brand-600 text-white'
            : 'bg-white text-gray-600 hover:bg-brand-50'
        )}
      >
        {rightLabel}
      </button>
    </div>
  );
}
