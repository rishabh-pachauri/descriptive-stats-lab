import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import ReflectionBox from '../components/shared/ReflectionBox';
import NumberLine from '../components/charts/NumberLine';
import {
  mean,
  median,
  populationVariance,
  sampleVariance,
  populationSD,
  sampleSD,
  fmt,
} from '../utils/stats';

const DATASET_A = [48, 49, 50, 51, 52];
const DATASET_B = [40, 45, 50, 55, 60];
const INITIAL_SANDBOX = [45, 47, 50, 53, 55];

export default function StandardDeviation() {
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [varianceMode, setVarianceMode] = useState<'left' | 'right'>('left');
  const [sdAnswer, setSdAnswer] = useState<'A' | 'B' | null>(null);
  const [sandboxData, setSandboxData] = useState<number[]>([...INITIAL_SANDBOX]);

  const popSD_B = useMemo(() => populationSD(DATASET_B), []);
  const sampSD_B = useMemo(() => sampleSD(DATASET_B), []);

  const sandboxMean = useMemo(() => mean(sandboxData), [sandboxData]);
  const sandboxMedian = useMemo(() => median(sandboxData), [sandboxData]);
  const sandboxRange = useMemo(() => Math.max(...sandboxData) - Math.min(...sandboxData), [sandboxData]);
  const sandboxPopVar = useMemo(() => populationVariance(sandboxData), [sandboxData]);
  const sandboxPopSD = useMemo(() => populationSD(sandboxData), [sandboxData]);
  const sandboxSampSD = useMemo(() => sampleSD(sandboxData), [sandboxData]);

  const handleSlider = (index: number, value: number) => {
    const next = [...sandboxData];
    next[index] = value;
    setSandboxData(next);
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Standard Deviation</h1>
        <p className="mt-1 text-lg text-gray-500">Bringing the measure back to the original unit</p>
        <div className="mt-2">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 7 of 12</span>
        </div>
      </div>

      {/* Section 2 — The Unit Problem */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">The Unit Problem</h2>
        <div className="question-box bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mb-4">
          <p className="font-medium text-amber-900">
            Variance of Dataset B = 50 marks². Does <span className="italic">marks²</span> feel like a natural unit to interpret?
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center mb-4">
          <p className="text-2xl font-bold text-red-500">50 marks²</p>
          <p className="text-gray-500 mt-1 text-sm">What does that even mean in reality?</p>
        </div>

        {!solutionRevealed ? (
          <Button variant="primary" onClick={() => setSolutionRevealed(true)}>
            Show the Solution
          </Button>
        ) : (
          <div className="animate-scale-in bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 font-medium">
              ✅ We take the <strong>square root</strong> of the variance! This brings us back to the original unit (<em>marks</em>).
            </p>
            <p className="mt-2 text-green-700 text-sm">
              √50 ≈ <strong>7.07 marks</strong> — now that is interpretable!
            </p>
          </div>
        )}
      </Card>

      {/* Section 3 — Formula Reveal */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">The Formula</h2>
        <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-4 text-sm leading-relaxed">
          <div>Population SD: σ = √σ² = √(Σ(x − μ)² / N)</div>
          <div className="mt-1">Sample SD:     s = √s² = √(Σ(x − x̄)² / (n−1))</div>
          <div className="mt-3 text-yellow-300">Example: σ = √50 ≈ 7.07 marks</div>
        </div>
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-indigo-800 text-sm font-medium">
          📐 Standard deviation is always in the <strong>same unit</strong> as the original data.
        </div>
      </Card>

      {/* Section 4 — Population vs Sample Toggle */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Population vs Sample SD</h2>
        <p className="text-sm text-gray-500 mb-4">Dataset B: [40, 45, 50, 55, 60]</p>

        <div className="flex justify-center mb-6">
          <Toggle
            leftLabel="Population (σ)"
            rightLabel="Sample (s)"
            value={varianceMode}
            onChange={setVarianceMode}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl p-4 text-center border-2 ${varianceMode === 'left' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-1">Population SD (σ)</p>
            <p className="text-3xl font-bold text-brand-600">{fmt(popSD_B)}</p>
            <p className="text-xs text-gray-400 mt-1">Divide by N = 5</p>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${varianceMode === 'right' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-gray-50'}`}>
            <p className="text-xs text-gray-500 mb-1">Sample SD (s)</p>
            <p className="text-3xl font-bold text-brand-600">{fmt(sampSD_B)}</p>
            <p className="text-xs text-gray-400 mt-1">Divide by n−1 = 4</p>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm">
          <strong>Note:</strong> Sample SD is slightly larger than Population SD because we divide by a smaller number (n−1) to correct for bias when estimating the population from a sample.
        </div>
      </Card>

      {/* Section 5 — SD Comparison */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">SD Comparison</h2>
        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-indigo-50 rounded-xl p-3">
            <p className="font-semibold text-indigo-700">Dataset A</p>
            <p className="text-xs text-gray-500">[48, 49, 50, 51, 52]</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">SD = 1.41</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <p className="font-semibold text-red-700">Dataset B</p>
            <p className="text-xs text-gray-500">[40, 45, 50, 55, 60]</p>
            <p className="text-2xl font-bold text-red-600 mt-1">SD = 7.07</p>
          </div>
        </div>

        <NumberLine
          datasets={[
            { name: 'Dataset A', values: DATASET_A, color: '#6366f1' },
            { name: 'Dataset B', values: DATASET_B, color: '#ef4444' },
          ]}
          showMean
          min={35}
          max={65}
        />

        <div className="question-box bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mt-4 mb-4">
          <p className="font-medium text-amber-900">Which dataset is more consistent (less variable)?</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            variant={sdAnswer === 'A' ? 'success' : 'secondary'}
            onClick={() => setSdAnswer('A')}
          >
            Dataset A (SD = 1.41)
          </Button>
          <Button
            variant={sdAnswer === 'B' ? 'danger' : 'secondary'}
            onClick={() => setSdAnswer('B')}
          >
            Dataset B (SD = 7.07)
          </Button>
        </div>

        {sdAnswer === 'A' && (
          <div className="animate-scale-in mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 text-sm">
            ✅ <strong>Correct!</strong> Smaller SD = values more tightly clustered around the mean = more consistent.
          </div>
        )}
        {sdAnswer === 'B' && (
          <div className="animate-scale-in mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">
            ❌ <strong>Not quite.</strong> Smaller SD means more consistency. Dataset A has SD = 1.41 — values are very close to the mean.
          </div>
        )}
      </Card>

      {/* Section 6 — Interpretation Guide */}
      <Card variant="accent" className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Interpretation Guide</h2>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-brand-600 font-bold mt-0.5">•</span>
            <span><strong>Smaller SD</strong> → values are more closely clustered around the mean</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-600 font-bold mt-0.5">•</span>
            <span><strong>Larger SD</strong> → values are more spread out around the mean</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">•</span>
            <span><strong>SD = 0</strong> → all values are identical</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold mt-0.5">⚠</span>
            <span><strong>SD does NOT mean</strong> every observation is exactly SD away from the mean — it is an average deviation.</span>
          </li>
        </ul>
      </Card>

      {/* Section 7 — Move the Data Sandbox */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Experiment: Move the Data</h2>
        <p className="text-sm text-gray-500 mb-4">Drag the sliders to change values. Watch how the statistics respond!</p>

        <div className="question-box bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mb-4">
          <p className="font-medium text-amber-900">Move one slider far to the right (towards 150). What changes the most?</p>
        </div>

        <div className="space-y-3 mb-6">
          {sandboxData.map((val, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 w-6">x{i + 1}</span>
              <input
                type="range"
                min={1}
                max={150}
                value={val}
                onChange={(e) => handleSlider(i, Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="w-10 text-right text-sm font-bold text-gray-800">{val}</span>
            </div>
          ))}
        </div>

        <NumberLine
          datasets={[{ name: 'Sandbox Data', values: sandboxData, color: '#6366f1' }]}
          showMean
          min={0}
          max={155}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Mean', value: fmt(sandboxMean) },
            { label: 'Median', value: fmt(sandboxMedian) },
            { label: 'Range', value: fmt(sandboxRange) },
            { label: 'Pop. Variance', value: fmt(sandboxPopVar) },
            { label: 'Pop. SD', value: fmt(sandboxPopSD) },
            { label: 'Sample SD', value: fmt(sandboxSampSD) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-bold text-brand-700">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={() => setSandboxData([...INITIAL_SANDBOX])}>
            ↺ Reset to original
          </Button>
        </div>
      </Card>

      <ReflectionBox
        prompt="What happened to the Mean, Median, and Standard Deviation when you moved one value to an extreme position?"
        placeholder="I noticed that when I moved a value to an extreme..."
      />

      <WhatDidWeLearn
        concept="Standard Deviation"
        text="Standard deviation = √Variance. It expresses spread in the original units of measurement. Smaller SD = more consistent data. Larger SD = more variable data."
      />
    </div>
  );
}
