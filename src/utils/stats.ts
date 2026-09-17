/* ============================================================
   Statistics Utility Functions — Mathematically Verified
   ============================================================ */
import { FiveNumberSummary, StatsResult } from '../types';

/** Arithmetic mean */
export function mean(data: number[]): number {
  if (data.length === 0) return 0;
  return data.reduce((s, x) => s + x, 0) / data.length;
}

/** Median (sorts internally, does not mutate) */
export function median(data: number[]): number {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Mode — returns all most-frequent values, empty if all values unique */
export function mode(data: number[]): number[] {
  if (data.length === 0) return [];
  const freq: Record<number, number> = {};
  data.forEach(x => { freq[x] = (freq[x] ?? 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return []; // no repeats → no mode
  return Object.entries(freq)
    .filter(([, f]) => f === maxFreq)
    .map(([v]) => Number(v))
    .sort((a, b) => a - b);
}

/** Range = max − min */
export function dataRange(data: number[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data) - Math.min(...data);
}

/** Population variance: σ² = Σ(x − μ)² / N */
export function populationVariance(data: number[]): number {
  if (data.length === 0) return 0;
  const m = mean(data);
  return data.reduce((s, x) => s + (x - m) ** 2, 0) / data.length;
}

/** Sample variance: s² = Σ(x − x̄)² / (n − 1) */
export function sampleVariance(data: number[]): number {
  if (data.length <= 1) return 0;
  const m = mean(data);
  return data.reduce((s, x) => s + (x - m) ** 2, 0) / (data.length - 1);
}

/** Population standard deviation: σ = √σ² */
export function populationSD(data: number[]): number {
  return Math.sqrt(populationVariance(data));
}

/** Sample standard deviation: s = √s² */
export function sampleSD(data: number[]): number {
  return Math.sqrt(sampleVariance(data));
}

/**
 * Quartiles using the "inclusive" / "median-split" method.
 * Lower half excludes the median for odd-length arrays.
 */
export function quartiles(data: number[]): { q1: number; q2: number; q3: number } {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  if (n === 0) return { q1: 0, q2: 0, q3: 0 };

  const q2 = median(sorted);
  const mid = Math.floor(n / 2);
  const lower = sorted.slice(0, mid);
  const upper = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);

  return { q1: median(lower), q2, q3: median(upper) };
}

/** IQR = Q3 − Q1 */
export function iqr(data: number[]): number {
  const { q1, q3 } = quartiles(data);
  return q3 - q1;
}

/** Tukey fences: lower = Q1 − 1.5·IQR, upper = Q3 + 1.5·IQR */
export function fences(data: number[]): { lower: number; upper: number } {
  const { q1, q3 } = quartiles(data);
  const iqrVal = q3 - q1;
  return { lower: q1 - 1.5 * iqrVal, upper: q3 + 1.5 * iqrVal };
}

/** Data points beyond the Tukey fences */
export function outliers(data: number[]): number[] {
  const { lower, upper } = fences(data);
  return data.filter(x => x < lower || x > upper);
}

/** Build the full five-number summary */
export function fiveNumberSummary(data: number[]): FiveNumberSummary {
  const sorted = [...data].sort((a, b) => a - b);
  const { q1, q2: med, q3 } = quartiles(sorted);
  const iqrVal = q3 - q1;
  const lower = q1 - 1.5 * iqrVal;
  const upper = q3 + 1.5 * iqrVal;
  return {
    min: sorted[0] ?? 0,
    q1,
    median: med,
    q3,
    max: sorted[sorted.length - 1] ?? 0,
    iqr: iqrVal,
    lowerFence: lower,
    upperFence: upper,
    outlierPoints: sorted.filter(x => x < lower || x > upper),
  };
}

/**
 * Pearson's moment coefficient of skewness:
 *   g1 = [n / ((n-1)(n-2))] · Σ[(x − x̄) / s]³
 * Falls back to 0 for n ≤ 2.
 */
export function skewness(data: number[]): number {
  const n = data.length;
  if (n <= 2) return 0;
  const m = mean(data);
  const s = sampleSD(data);
  if (s === 0) return 0;
  const cubedZ = data.reduce((sum, x) => sum + ((x - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * cubedZ;
}

/** Full stats result for a dataset */
export function computeStats(data: number[]): StatsResult {
  const pv = populationVariance(data);
  const sv = sampleVariance(data);
  return {
    mean: mean(data),
    median: median(data),
    mode: mode(data),
    range: dataRange(data),
    populationVariance: pv,
    sampleVariance: sv,
    populationSD: Math.sqrt(pv),
    sampleSD: Math.sqrt(sv),
    fiveNum: fiveNumberSummary(data),
  };
}

/** Round to n decimal places */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Format a number neatly (2 dp unless integer) */
export function fmt(value: number, dp = 2): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(dp);
}

/** Generate histogram bins from raw data */
export function histogramBins(
  data: number[],
  numBins: number
): { x0: number; x1: number; count: number; label: string }[] {
  if (data.length === 0 || numBins <= 0) return [];
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  if (minVal === maxVal) {
    return [{ x0: minVal - 0.5, x1: minVal + 0.5, count: data.length, label: `${minVal}` }];
  }
  const binWidth = (maxVal - minVal) / numBins;
  const bins = Array.from({ length: numBins }, (_, i) => {
    const x0 = minVal + i * binWidth;
    const x1 = x0 + binWidth;
    return { x0, x1, count: 0, label: `${fmt(x0, 1)}–${fmt(x1, 1)}` };
  });
  data.forEach(x => {
    const idx = Math.min(Math.floor((x - minVal) / binWidth), numBins - 1);
    bins[idx].count++;
  });
  return bins;
}
