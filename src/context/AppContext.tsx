import React, { createContext, useContext, useCallback } from 'react';
import { AppContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TOTAL_MODULES = 12;

export const MODULE_LABELS: string[] = [
  'Real-World Problem',
  'Center of Data',
  'Why Center Is Not Enough',
  'Measuring Spread',
  'Range',
  'Variance',
  'Standard Deviation',
  'Distribution',
  'Skewness',
  'Box Plot',
  'Practice Quiz',
  'Final Challenge',
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentModule, setCurrentModuleRaw] = useLocalStorage<number>('ds-lab-module', 1);
  const [completedArr, setCompletedArr] = useLocalStorage<number[]>('ds-lab-completed', []);

  const completedModules = new Set(completedArr);

  const setCurrentModule = useCallback(
    (n: number) => {
      if (n >= 1 && n <= TOTAL_MODULES) {
        setCurrentModuleRaw(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [setCurrentModuleRaw]
  );

  const markComplete = useCallback(
    (n: number) => {
      setCompletedArr(prev => (prev.includes(n) ? prev : [...prev, n]));
    },
    [setCompletedArr]
  );

  const goNext = useCallback(() => {
    markComplete(currentModule);
    setCurrentModule(currentModule + 1);
  }, [currentModule, markComplete, setCurrentModule]);

  const goPrev = useCallback(() => {
    setCurrentModule(currentModule - 1);
  }, [currentModule, setCurrentModule]);

  return (
    <AppContext.Provider
      value={{
        currentModule,
        totalModules: TOTAL_MODULES,
        moduleLabels: MODULE_LABELS,
        setCurrentModule,
        completedModules,
        markComplete,
        goNext,
        goPrev,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
