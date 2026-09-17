import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import DeviationChart from '../components/charts/DeviationChart';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import { populationVariance, sampleVariance, fmt } from '../utils/stats';

const PRIMARY_DATA = [48, 49, 50, 51, 52];
const MEAN_PRIMARY = 50;

const DATASET_A = [48, 49, 50, 51, 52];
const DATASET_B = [40, 45, 50, 55, 60];

type DeviationRow = { value: number; deviation: number; squared: number };

const buildRows = (data: number[], m: number): DeviationRow[] =>
  data.map(v => ({ value: v, deviation: v - m, squared: (v - m) ** 2 }));

const primaryRows = buildRows(PRIMARY_DATA, MEAN_PRIMARY);
const sumSquared = primaryRows.reduce((s, r) => s + r.squared, 0);

type MCOption = 'add1' | 'abs' | 'square' | 'ignore' | null;
type CompAnswer = 'A' | 'B' | null;
type QuizAnswer = 'population' | 'sample' | null;

const MC_OPTIONS: { id: MCOption; label: string; correct: boolean; feedback: string }[] = [
  {
    id: 'add1',
    label: 'Add 1 to each deviation',
    correct: false,
    feedback: 'This would change the values arbitrarily and has no mathematical basis.',
  },
  {
    id: 'abs',
    label: 'Take the absolute value of each deviation',
    correct: false,
    feedback: 'This works! This gives us Mean Absolute Deviation (MAD). However, squares have nicer mathematical properties and are used in Variance.',
  },
  {
    id: 'square',
    label: 'Square each deviation',
    correct: true,
    feedback: 'Exactly! Squaring makes all values positive AND gives extra weight to large deviations. This is the key idea behind Variance!',
  },
  {
    id: 'ignore',
    label: 'Ignore negative values',
    correct: false,
    feedback: 'We would lose important information about how spread out the data is.',
  },
];

export default function Variance() {
  const [revealedRows, setRevealedRows] = useState(0);
  const [mcChoice, setMcChoice] = useState<MCOption>(null);
  const [varianceMode, setVarianceMode] = useState<'left' | 'right'>('left');
  const [compAnswer, setCompAnswer] = useState<CompAnswer>(null);
  const [quizAnswer, setQuizAnswer] = useState<QuizAnswer>(null);

  const isPopulation = varianceMode === 'left';
  const varianceValue = isPopulation ? (sumSquared / PRIMARY_DATA.length) : (sumSquared / (PRIMARY_DATA.length - 1));

  const varA_pop = populationVariance(DATASET_A);
  const varB_pop = populationVariance(DATASET_B);

  const handleRevealNext = () => {
    if (revealedRows < primaryRows.length) setRevealedRows(r => r + 1);
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Module 6 of 12
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Variance</h1>
        <p className="text-lg text-gray-500">Measuring how far each value is from the mean</p>
      </div>

      {/* Starting Problem */}
      <Card variant="question">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="font-semibold text-amber-900 text-lg mb-2">Building a Better Measure</p>
            <p className="text-amber-800 mb-2">
              Dataset: <span className="font-mono font-bold">[{PRIMARY_DATA.join(', ')}]</span> · Mean = {MEAN_PRIMARY}
            </p>
            <p className="text-amber-800 mb-1">We know Range only uses 2 values. Can we create a measure that considers <strong>ALL values</strong>?</p>
            <p className="text-amber-700 text-sm mt-2 italic">
              Idea: What if we measured how far each value is from the mean, and found the average of those distances?
            </p>
          </div>
        </div>
      </Card>

      {/* Deviation Table */}
      <Card title="Step 1: Calculate Deviations" subtitle="How far is each value from the mean?">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-center p-3 font-semibold text-gray-600 border-b border-gray-200">Value (x)</th>
                <th className="text-center p-3 font-semibold text-gray-600 border-b border-gray-200">Deviation (x - μ)</th>
              </tr>
            </thead>
            <tbody>
              {primaryRows.map((row, i) => (
                <tr
                  key={i}
                  className={`transition-all duration-300 ${
                    i < revealedRows ? 'opacity-100' : 'opacity-0 pointer-events-none h-0'
                  } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-3 text-center font-mono font-bold text-gray-800 border-b border-gray-100">{row.value}</td>
                  <td className={`p-3 text-center font-mono font-bold border-b border-gray-100 ${
                    row.deviation < 0 ? 'text-red-600' : row.deviation > 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {row.value} - {MEAN_PRIMARY} = {row.deviation > 0 ? '+' : ''}{row.deviation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {revealedRows < primaryRows.length ? (
          <div className="flex justify-center">
            <Button variant="primary" size="sm" onClick={handleRevealNext}>
              Reveal next row ({revealedRows}/{primaryRows.length})
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center animate-fade-in">
            <p className="text-green-800 font-semibold text-sm">All {primaryRows.length} rows revealed! ✅</p>
          </div>
        )}

        {revealedRows > 0 && (
          <div className="mt-4 animate-fade-in">
            <DeviationChart
              data={PRIMARY_DATA.slice(0, revealedRows)}
              mean={MEAN_PRIMARY}
              color="#6366f1"
              animate={true}
              showSquared={false}
            />
          </div>
        )}
      </Card>

      {/* Cancellation Problem */}
      {revealedRows === primaryRows.length && (
        <div className="animate-fade-in">
          <Card variant="warning" title="Step 2: The Cancellation Problem">
            <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-4 text-center text-base mb-4">
              (-2) + (-1) + 0 + (+1) + (+2) = <span className="text-yellow-300 font-bold text-xl">0</span>
            </div>
            <div className="question-box">
              <div className="flex items-start gap-2">
                <span className="text-xl">🤔</span>
                <p className="text-amber-800">
                  If we add up the deviations, we get <strong>0</strong>! This always happens — positive and negative deviations
                  cancel each other out. How can we fix this?
                </p>
              </div>
            </div>
          </Card>

          {/* Multiple Choice */}
          <Card title="Step 3: Make Deviations Positive" subtitle="How can we make all deviations positive so they don't cancel?">
            <div className="space-y-3">
              {MC_OPTIONS.map(opt => {
                const isSelected = mcChoice === opt.id;
                const showFeedback = isSelected;
                return (
                  <button
                    key={opt.id as string}
                    onClick={() => setMcChoice(opt.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? opt.correct
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? opt.correct
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {isSelected ? (opt.correct ? '✓' : '✗') : ''}
                      </span>
                      <span className={`font-medium ${isSelected ? (opt.correct ? 'text-green-800' : 'text-red-800') : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                    </div>
                    {showFeedback && (
                      <p className={`text-sm mt-2 ml-8 ${opt.correct ? 'text-green-700' : 'text-red-700'}`}>
                        {opt.feedback}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Squared Deviation Table */}
      {mcChoice !== null && (
        <div className="animate-fade-in">
          <Card title="Step 4: Squared Deviations" subtitle="Square each deviation to make them all positive">
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-center p-3 font-semibold text-gray-600 border-b border-gray-200">Value</th>
                    <th className="text-center p-3 font-semibold text-gray-600 border-b border-gray-200">Deviation</th>
                    <th className="text-center p-3 font-semibold text-brand-700 border-b border-gray-200">Squared Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {primaryRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-center font-mono font-bold text-gray-800 border-b border-gray-100">{row.value}</td>
                      <td className={`p-3 text-center font-mono border-b border-gray-100 ${row.deviation < 0 ? 'text-red-600' : row.deviation > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        {row.deviation > 0 ? '+' : ''}{row.deviation}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-brand-700 border-b border-gray-100">{row.squared}</td>
                    </tr>
                  ))}
                  <tr className="bg-brand-50 border-t-2 border-brand-200">
                    <td className="p-3 text-center font-bold text-gray-700" colSpan={2}>Sum of Squared Deviations</td>
                    <td className="p-3 text-center font-bold text-brand-800 text-lg">{sumSquared}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <DeviationChart
              data={PRIMARY_DATA}
              mean={MEAN_PRIMARY}
              color="#6366f1"
              animate={true}
              showSquared={true}
            />
          </Card>

          {/* Population vs Sample Toggle */}
          <Card title="Step 5: Population vs Sample Variance">
            <div className="flex justify-center mb-6">
              <Toggle
                leftLabel="Population (÷N)"
                rightLabel="Sample (÷n-1)"
                value={varianceMode}
                onChange={setVarianceMode}
              />
            </div>

            <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-5 mb-4 text-center">
              {isPopulation ? (
                <>
                  <p className="text-green-300 text-sm mb-2">Population Variance Formula</p>
                  <p className="text-lg">σ² = Σ(x - μ)² / N</p>
                  <p className="text-yellow-300 font-bold text-2xl mt-2">
                    σ² = {sumSquared} / {PRIMARY_DATA.length} = {fmt(varianceValue, 2)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-green-300 text-sm mb-2">Sample Variance Formula</p>
                  <p className="text-lg">s² = Σ(x - x̄)² / (n - 1)</p>
                  <p className="text-yellow-300 font-bold text-2xl mt-2">
                    s² = {sumSquared} / {PRIMARY_DATA.length - 1} = {fmt(varianceValue, 2)}
                  </p>
                </>
              )}
            </div>

            <div className={`rounded-xl p-4 border-l-4 ${
              isPopulation
                ? 'bg-brand-50 border-brand-400 text-brand-800'
                : 'bg-purple-50 border-purple-400 text-purple-800'
            }`}>
              <p className="font-semibold mb-1">{isPopulation ? '📊 Population Mode' : '🔬 Sample Mode'}</p>
              <p className="text-sm leading-relaxed">
                {isPopulation
                  ? 'Use Population Variance when you have data for the ENTIRE group you are studying. Divide by N (the total count).'
                  : 'Use Sample Variance when your data is a subset used to estimate the full population. Divide by n-1 (Bessel\'s correction) to correct for bias.'}
              </p>
            </div>
          </Card>

          {/* Mini Quiz */}
          <Card variant="question" title="Quick Check!">
            <p className="text-amber-800 font-medium mb-4">
              You surveyed <strong>200 students</strong> from a university of <strong>15,000 students</strong>.
              Is this a population or a sample?
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant={quizAnswer === 'population' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => setQuizAnswer('population')}
              >
                Population
              </Button>
              <Button
                variant={quizAnswer === 'sample' ? 'success' : 'secondary'}
                size="sm"
                onClick={() => setQuizAnswer('sample')}
              >
                Sample
              </Button>
            </div>
            {quizAnswer === 'sample' && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 animate-fade-in">
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <p className="text-green-800 text-sm">
                    Yes! 200 students is a <strong>sample</strong> from the full university population of 15,000. Use n-1 (sample variance).
                  </p>
                </div>
              </div>
            )}
            {quizAnswer === 'population' && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-fade-in">
                <div className="flex items-start gap-2">
                  <span>❌</span>
                  <p className="text-red-800 text-sm">
                    Not quite. 200 students is only a portion of the 15,000 total students. That makes it a <strong>sample</strong>. Use n-1.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Variance Comparison */}
          <Card title="Variance Comparison" subtitle="Two datasets, same mean — which has greater variability?">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                <p className="font-semibold text-indigo-800 text-sm mb-1">Dataset A</p>
                <p className="font-mono text-indigo-700 text-sm">[{DATASET_A.join(', ')}]</p>
                <p className="text-xs text-indigo-500 mt-1">Mean = 50 · Variance = {fmt(varA_pop, 1)}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="font-semibold text-red-800 text-sm mb-1">Dataset B</p>
                <p className="font-mono text-red-700 text-sm">[{DATASET_B.join(', ')}]</p>
                <p className="text-xs text-red-500 mt-1">Mean = 50 · Variance = {fmt(varB_pop, 1)}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600 mb-1">Dataset A</p>
                <DeviationChart data={DATASET_A} mean={50} color="#6366f1" showSquared={false} />
              </div>
              <div>
                <p className="text-xs font-semibold text-red-600 mb-1">Dataset B</p>
                <DeviationChart data={DATASET_B} mean={50} color="#ef4444" showSquared={false} />
              </div>
            </div>

            <div className="question-box">
              <div className="flex items-start gap-3">
                <span className="text-xl">🤔</span>
                <div className="flex-1">
                  <p className="text-amber-900 font-medium mb-3">Which dataset has greater variability?</p>
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant={compAnswer === 'A' ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={() => setCompAnswer('A')}
                    >
                      Dataset A (Variance = {fmt(varA_pop, 0)})
                    </Button>
                    <Button
                      variant={compAnswer === 'B' ? 'success' : 'secondary'}
                      size="sm"
                      onClick={() => setCompAnswer('B')}
                    >
                      Dataset B (Variance = {fmt(varB_pop, 0)})
                    </Button>
                  </div>
                  {compAnswer === 'B' && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 animate-fade-in">
                      <p className="text-green-800 text-sm">
                        ✅ Correct! Dataset B has variance = {fmt(varB_pop, 0)} vs Dataset A variance = {fmt(varA_pop, 0)}.
                        Dataset B values deviate much more from the mean.
                      </p>
                    </div>
                  )}
                  {compAnswer === 'A' && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-fade-in">
                      <p className="text-red-800 text-sm">
                        ❌ Look at the deviations again. Dataset B has variance = {fmt(varB_pop, 0)}, which is much larger
                        than Dataset A's variance of {fmt(varA_pop, 0)}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <WhatDidWeLearn
        concept="Variance"
        text="Variance measures the average squared deviation from the mean. It considers ALL values, unlike Range. Population variance divides by N; Sample variance divides by n-1 to correct for bias."
      />
    </div>
  );
}
