import { BarChart2, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import clsx from 'clsx';

export default function Header() {
  const { currentModule, totalModules, moduleLabels, completedModules, setCurrentModule } = useAppContext();
  const pct = ((currentModule - 1) / (totalModules - 1)) * 100;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo + title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-none">DataSci Lab</div>
            <div className="text-xs text-gray-400 leading-none mt-0.5">Descriptive Statistics</div>
          </div>
        </div>

        {/* Module label + counter */}
        <div className="flex-1 text-center hidden sm:block">
          <div className="text-xs font-medium text-brand-600 uppercase tracking-wide mb-0.5">
            Module {currentModule} of {totalModules}
          </div>
          <div className="text-sm font-semibold text-gray-800 truncate">
            {moduleLabels[currentModule - 1]}
          </div>
        </div>

        {/* Completed badge */}
        <div className="shrink-0 flex items-center gap-1 text-xs text-green-600 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">{completedModules.size} / {totalModules} done</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Module dots — scrollable on mobile */}
      <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          {moduleLabels.map((label, i) => {
            const num = i + 1;
            const isCurrent = num === currentModule;
            const isDone = completedModules.has(num);
            return (
              <button
                key={num}
                onClick={() => setCurrentModule(num)}
                title={`${num}. ${label}`}
                aria-label={`Go to module ${num}: ${label}`}
                className={clsx(
                  'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-200',
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-md scale-110'
                    : isDone
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {isDone && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : num}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
