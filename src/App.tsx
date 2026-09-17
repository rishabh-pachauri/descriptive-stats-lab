import { lazy, Suspense } from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';

/* Lazy-load each module to keep the initial bundle small */
const Landing           = lazy(() => import('./modules/M01_Landing'));
const CenterOfData      = lazy(() => import('./modules/M02_CenterOfData'));
const WhyCenterNotEnough= lazy(() => import('./modules/M03_WhyCenterNotEnough'));
const MeasuringSpread   = lazy(() => import('./modules/M04_MeasuringSpread'));
const Range             = lazy(() => import('./modules/M05_Range'));
const Variance          = lazy(() => import('./modules/M06_Variance'));
const StandardDeviation = lazy(() => import('./modules/M07_StandardDeviation'));
const Distribution      = lazy(() => import('./modules/M08_Distribution'));
const Skewness          = lazy(() => import('./modules/M09_Skewness'));
const BoxPlot           = lazy(() => import('./modules/M10_BoxPlot'));
const Practice          = lazy(() => import('./modules/M11_Practice'));
const Challenge         = lazy(() => import('./modules/M12_Challenge'));

const MODULES = [
  Landing, CenterOfData, WhyCenterNotEnough, MeasuringSpread,
  Range, Variance, StandardDeviation, Distribution,
  Skewness, BoxPlot, Practice, Challenge,
];

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading module…</p>
      </div>
    </div>
  );
}

export default function App() {
  const { currentModule } = useAppContext();
  const ModuleComponent = MODULES[currentModule - 1];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          {ModuleComponent && <ModuleComponent />}
        </Suspense>
      </main>
      <Navigation />
    </div>
  );
}
