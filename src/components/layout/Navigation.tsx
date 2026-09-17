import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Navigation() {
  const { currentModule, totalModules, moduleLabels, goNext, goPrev, setCurrentModule } = useAppContext();

  return (
    <nav className="sticky bottom-0 z-40 bg-white border-t border-gray-100 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Previous */}
        <button
          onClick={goPrev}
          disabled={currentModule === 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
                     text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Centre info */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentModule(1)}
              title="Go to start"
              className="p-1 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-brand-600">
              {currentModule} / {totalModules}
            </span>
          </div>
          <span className="text-xs text-gray-400 max-w-[180px] sm:max-w-none truncate text-center">
            {moduleLabels[currentModule - 1]}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          disabled={currentModule === totalModules}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                     text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-30
                     disabled:cursor-not-allowed transition-all duration-150 active:scale-95 shadow-sm"
        >
          <span className="hidden sm:inline">
            {currentModule === totalModules ? 'Complete!' : 'Next'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
