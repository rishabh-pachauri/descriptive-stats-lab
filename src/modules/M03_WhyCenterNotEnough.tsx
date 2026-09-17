import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DotPlot from '../components/charts/DotPlot';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import { mean, dataRange, fmt } from '../utils/stats';

const datasetA = [48, 49, 50, 51, 52];
const datasetB = [20, 35, 50, 65, 80];

type SpreadAnswer = 'yes' | 'no' | null;

export default function WhyCenterNotEnough() {
  const [spreadAnswer, setSpreadAnswer] = useState<SpreadAnswer>(null);

  const meanA = mean(datasetA);
  const meanB = mean(datasetB);
  const minA = Math.min(...datasetA);
  const maxA = Math.max(...datasetA);
  const minB = Math.min(...datasetB);
  const maxB = Math.max(...datasetB);
  const rangeA = dataRange(datasetA);
  const rangeB = dataRange(datasetB);

  const getSpreadFeedback = () => {
    if (spreadAnswer === 'yes') {
      return {
        type: 'info',
        text: 'Look again at the dot plot. Dataset A values are all between 48 and 52 — they hug the center. Dataset B values go from 20 to 80 — much more spread out!',
      };
    }
    if (spreadAnswer === 'no') {
      return {
        type: 'success',
        text: 'Exactly right! The dots tell a completely different story, even though the means are identical.',
      };
    }
    return null;
  };

  const spreadFeedback = getSpreadFeedback();

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Module 3 of 12
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Why Center Is Not Enough</h1>
      </div>

      {/* Opening Question Card */}
      <Card variant="question">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">👨‍🏫</span>
          <div>
            <p className="font-semibold text-amber-900 text-lg mb-2">The Professor's Claim</p>
            <p className="text-amber-800 text-base leading-relaxed">
              You have two exam score datasets. A professor says:{' '}
              <em className="font-semibold">"Both classes averaged 50 marks. So they performed equally."</em>
            </p>
            <p className="text-amber-800 font-semibold mt-3 text-lg">Is the professor right? 🤔</p>
          </div>
        </div>
      </Card>

      {/* DotPlot Comparison */}
      <Card title="The Two Datasets" subtitle="Dataset A (indigo) vs Dataset B (red) — both have a mean of exactly 50">
        <div className="grid sm:grid-cols-2 gap-6 mb-4">
          <div className="bg-indigo-50 rounded-xl p-3">
            <p className="font-semibold text-indigo-800 text-sm mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
              Dataset A
            </p>
            <p className="text-indigo-600 font-mono text-sm">[{datasetA.join(', ')}]</p>
            <p className="text-xs text-indigo-500 mt-1">Mean = {meanA}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <p className="font-semibold text-red-800 text-sm mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Dataset B
            </p>
            <p className="text-red-600 font-mono text-sm">[{datasetB.join(', ')}]</p>
            <p className="text-xs text-red-500 mt-1">Mean = {meanB}</p>
          </div>
        </div>
        <DotPlot
          datasets={[
            { name: 'Dataset A', values: datasetA, color: '#6366f1' },
            { name: 'Dataset B', values: datasetB, color: '#ef4444' },
          ]}
          min={10}
          max={90}
        />
      </Card>

      {/* Observation Question */}
      <div className="question-box animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">👀</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-lg mb-3">
              Both means are exactly 50. Do the datasets look the same?
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant={spreadAnswer === 'yes' ? 'warning' : 'secondary'}
                size="sm"
                onClick={() => setSpreadAnswer('yes')}
              >
                Yes, they look the same
              </Button>
              <Button
                variant={spreadAnswer === 'no' ? 'success' : 'secondary'}
                size="sm"
                onClick={() => setSpreadAnswer('no')}
              >
                No, they look very different
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spread Feedback */}
      {spreadFeedback && (
        <div
          className={`rounded-xl p-5 border-l-4 animate-fade-in ${
            spreadFeedback.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-900'
              : 'bg-blue-50 border-blue-400 text-blue-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{spreadFeedback.type === 'success' ? '✅' : '💡'}</span>
            <p className="text-base leading-relaxed">{spreadFeedback.text}</p>
          </div>
        </div>
      )}

      {/* Core Insight */}
      {spreadAnswer !== null && (
        <div className="animate-fade-in space-y-4">
          <Card variant="dark">
            <blockquote className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-4">
                "The center tells us <span className="text-indigo-300">WHERE</span> the data is.
                Spread tells us <span className="text-emerald-300">HOW MUCH</span> the values vary."
              </p>
            </blockquote>
            <p className="text-gray-300 text-center text-sm">
              ✈️ A mean of 50 is like knowing a plane's average altitude — it doesn't tell you how much turbulence there was!
            </p>
          </Card>
        </div>
      )}

      {/* Stats Comparison Table */}
      <Card title="Side-by-Side Statistics">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-600 border-b border-gray-200">Measure</th>
                <th className="text-center p-3 font-semibold text-indigo-700 border-b border-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                    Dataset A
                  </span>
                </th>
                <th className="text-center p-3 font-semibold text-red-700 border-b border-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    Dataset B
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Mean', a: fmt(meanA, 0), b: fmt(meanB, 0) },
                { label: 'Min', a: String(minA), b: String(minB) },
                { label: 'Max', a: String(maxA), b: String(maxB) },
                { label: 'Range', a: String(rangeA), b: String(rangeB) },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{row.label}</td>
                  <td className="p-3 text-center text-indigo-700 font-bold border-b border-gray-100">{row.a}</td>
                  <td className="p-3 text-center text-red-700 font-bold border-b border-gray-100">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Range of Dataset B is {rangeB}× larger than Dataset A's range of {rangeA}
        </p>
      </Card>

      {/* Key Insight Box */}
      <div className="bg-brand-50 border-2 border-brand-200 rounded-xl p-5 animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔑</span>
          <div>
            <p className="font-bold text-brand-800 text-lg mb-1">The Key Takeaway</p>
            <p className="text-brand-700 leading-relaxed">
              Data scientists always look at <strong>BOTH center AND spread</strong>. Reporting only the mean is like
              describing a person using only their age — it's a start, but there is much more to the story.
            </p>
          </div>
        </div>
      </div>

      {/* Teaser */}
      <Card variant="accent">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🚀</span>
          <div>
            <p className="font-bold text-brand-800 text-lg">What's Next?</p>
            <p className="text-brand-600 mt-1">
              In the next modules, we will learn precise ways to measure spread:{' '}
              <strong>Range</strong>, <strong>Variance</strong>, and <strong>Standard Deviation</strong>.
            </p>
          </div>
        </div>
      </Card>

      <WhatDidWeLearn
        concept="Center is not enough"
        text="Two datasets can have identical means but very different spreads. Always examine both center AND spread to understand data properly."
      />
    </div>
  );
}
