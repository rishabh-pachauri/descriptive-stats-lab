import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import ReflectionBox from '../components/shared/ReflectionBox';
import HistogramChart from '../components/charts/HistogramChart';
import { mean, median, fmt } from '../utils/stats';

type DatasetKey = 'scores' | 'income' | 'heights' | 'uniform';

const DATASETS: Record<DatasetKey, { label: string; data: number[]; color: string; description: string }> = {
  scores: {
    label: 'Exam Scores',
    color: '#6366f1',
    data: [45, 48, 50, 50, 51, 51, 52, 52, 53, 54, 55, 55, 56, 57, 58, 60],
    description: 'Observations roughly balanced around the center.',
  },
  income: {
    label: 'Income Data',
    color: '#ef4444',
    data: [25000, 28000, 30000, 32000, 35000, 40000, 45000, 55000, 80000, 150000],
    description: 'Most observations concentrated at lower values. Long tail toward higher values.',
  },
  heights: {
    label: 'Heights (cm)',
    color: '#10b981',
    data: [155, 158, 160, 162, 163, 164, 165, 165, 166, 167, 168, 170, 172, 175, 178],
    description: 'Observations roughly balanced around the center.',
  },
  uniform: {
    label: 'Uniform',
    color: '#f59e0b',
    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    description: 'Observations are evenly spread across all values — no clear peak.',
  },
};

const DATASET_KEYS: DatasetKey[] = ['scores', 'income', 'heights', 'uniform'];

export default function Distribution() {
  const [activeDataset, setActiveDataset] = useState<DatasetKey>('scores');
  const [numBins, setNumBins] = useState(6);

  const dataset = DATASETS[activeDataset];
  const dataMean = useMemo(() => mean(dataset.data), [dataset]);
  const dataMedian = useMemo(() => median(dataset.data), [dataset]);

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Understanding Distribution</h1>
        <p className="mt-1 text-lg text-gray-500">How are the values arranged across the dataset?</p>
        <div className="mt-2">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 8 of 12</span>
        </div>
      </div>

      {/* Section 2 — Transition text */}
      <Card className="animate-slide-up">
        <p className="text-gray-700 leading-relaxed">
          We now know the <strong>center</strong> (mean, median) and <strong>spread</strong> (variance, SD). But how are the values
          arranged? Are they clustered in the middle? Are there more low values or high values? This is what <strong>Distribution</strong> describes.
        </p>
      </Card>

      {/* Section 3 — Definition */}
      <Card variant="accent" className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What is a Distribution?</h2>
        <p className="text-gray-700">
          <strong>Distribution</strong> describes how observations are arranged across different values. A{' '}
          <strong>histogram</strong> shows us the distribution visually — each bar represents how many observations fall within a
          range of values.
        </p>
      </Card>

      {/* Section 4 — Interactive Histogram */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Histogram</h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {DATASET_KEYS.map((key) => (
            <Button
              key={key}
              variant={activeDataset === key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveDataset(key)}
            >
              {DATASETS[key].label}
            </Button>
          ))}
        </div>

        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="bg-brand-50 rounded-full px-3 py-1 text-xs font-semibold text-brand-700">
            Mean: {fmt(dataMean, 1)}
          </div>
          <div className="bg-green-50 rounded-full px-3 py-1 text-xs font-semibold text-green-700">
            Median: {fmt(dataMedian, 1)}
          </div>
          <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600">
            n = {dataset.data.length}
          </div>
        </div>

        <HistogramChart data={dataset.data} numBins={numBins} color={dataset.color} label={dataset.label} />

        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 w-24">Bins: {numBins}</span>
            <input
              type="range"
              min={3}
              max={15}
              value={numBins}
              onChange={(e) => setNumBins(Number(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={numBins <= 3} onClick={() => setNumBins((b) => Math.max(3, b - 1))}>
              − Fewer bins
            </Button>
            <Button variant="ghost" size="sm" disabled={numBins >= 15} onClick={() => setNumBins((b) => Math.min(15, b + 1))}>
              + More bins
            </Button>
          </div>
        </div>

        <div className="question-box bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mt-4">
          <p className="font-medium text-amber-900">What changes when you increase the number of bins?</p>
        </div>
      </Card>

      {/* Section 5 — Shape Analysis */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Shape Analysis — {dataset.label}</h2>

        <div className="space-y-3">
          {[
            'Where are most observations concentrated?',
            'Is the distribution balanced or lopsided?',
            'Are there any gaps or spikes?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-gray-700 text-sm">{q}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3">
          <p className="text-sm text-indigo-800">
            <strong>Observation for {dataset.label}:</strong> {dataset.description}
          </p>
        </div>
      </Card>

      {/* Section 6 — Histogram Reading Guide */}
      <Card variant="dark" className="animate-slide-up">
        <h2 className="text-xl font-semibold text-white mb-3">Histogram Reading Guide</h2>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold mt-0.5">↑</span>
            <span><strong className="text-white">Tall bars</strong> → many observations in that range (high frequency)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold mt-0.5">↓</span>
            <span><strong className="text-white">Short bars</strong> → few observations in that range</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-400 font-bold mt-0.5">●</span>
            <span><strong className="text-white">Concentrated</strong> = bars clustered together in a narrow range</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold mt-0.5">↔</span>
            <span><strong className="text-white">Spread</strong> = bars spread across a wide range of values</span>
          </li>
        </ul>
      </Card>

      <ReflectionBox
        prompt="Pick one of the datasets above. Describe in 1-2 sentences where the data is concentrated and whether the distribution looks balanced."
        placeholder="For the Income Data, most observations are concentrated at lower values..."
      />

      <WhatDidWeLearn
        concept="Distribution"
        text="Distribution describes how observations are spread across values. A histogram shows the shape of the distribution — whether data is symmetric, concentrated, or lopsided."
      />
    </div>
  );
}
