/* ============================================================
   Shared TypeScript types for Descriptive Statistics Lab
   ============================================================ */

/** Population (divide by N) or Sample (divide by n-1) */
export type VarianceMode = 'population' | 'sample';

/** A named dataset with colour for charts */
export interface DatasetGroup {
  name: string;
  values: number[];
  color: string;
}

/** Five-number summary + derived values */
export interface FiveNumberSummary {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outlierPoints: number[];
}

/** Full descriptive statistics result */
export interface StatsResult {
  mean: number;
  median: number;
  mode: number[];
  range: number;
  populationVariance: number;
  sampleVariance: number;
  populationSD: number;
  sampleSD: number;
  fiveNum: FiveNumberSummary;
}

/** Quiz question definition */
export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'truefalse' | 'numerical' | 'visual-comparison';
  question: string;
  context?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  datasetA?: number[];
  datasetB?: number[];
  hint?: string;
  tolerance?: number; // for numerical answers
}

/** Global app context shape */
export interface AppContextType {
  currentModule: number;
  totalModules: number;
  moduleLabels: string[];
  setCurrentModule: (n: number) => void;
  completedModules: Set<number>;
  markComplete: (n: number) => void;
  goNext: () => void;
  goPrev: () => void;
}
