import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import HistogramChart from '../components/charts/HistogramChart';
import { mean, median, fmt } from '../utils/stats';

const SYMMETRIC_DATA = [45, 46, 47, 48, 48, 49, 50, 50, 50, 51, 51, 52, 52, 53, 54, 55];
const RIGHT_SKEWED_DATA = [5, 8, 10, 12, 14, 16, 20, 25, 45, 80];
const LEFT_SKEWED_DATA = [20, 50, 65, 70, 75, 78, 80, 82, 85];

const CLASSIFY_DATASETS = {
  A: { data: [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 50, 80], answer: 'Right-Skewed' as const },
  B: { data: [45, 47, 49, 50, 50, 51, 51, 52, 53, 55], answer: 'Symmetric' as const },
  C: { data: [5, 20, 60, 65, 70, 72, 75, 78, 80], answer: 'Left-Skewed' as const },
};

type SkewLabel = 'Symmetric' | 'Right-Skewed' | 'Left-Skewed';
type ClassifyKey = 'A' | 'B' | 'C';

interface ClassifyAnswers {
  A: SkewLabel | null;
  B: SkewLabel | null;
  C: SkewLabel | null;
}

function StatPills({ data }: { data: number[] }) {
  const m = mean(data);
  const med = median(data);
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">Mean = {fmt(m, 2)}</span>
      <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Median = {fmt(med, 2)}</span>
    </div>
  );
}

const SKEW_OPTIONS: SkewLabel[] = ['Symmetric', 'Right-Skewed', 'Left-Skewed'];

export default function Skewness() {
  const [classifyAnswers, setClassifyAnswers] = useState<ClassifyAnswers>({ A: null, B: null, C: null });
  const [checksShown, setChecksShown] = useState(false);
  const [kurtosisOpen, setKurtosisOpen] = useState(false);

  const allAnswered = (Object.values(classifyAnswers) as (SkewLabel | null)[]).every(Boolean);

  const handleClassify = (key: ClassifyKey, label: SkewLabel) => {
    if (checksShown) return;
    setClassifyAnswers((prev) => ({ ...prev, [key]: label }));
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Skewness</h1>
        <p className="mt-1 text-lg text-gray-500">Describing the asymmetry of a distribution</p>
        <div className="mt-2">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 9 of 12</span>
        </div>
      </div>

      {/* Opening question */}
      <div className="question-box bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 animate-slide-up">
        <p className="font-medium text-amber-900">
          We know a distribution can be balanced or lopsided. But how do we describe <em>which direction</em> it leans?
        </p>
      </div>

      {/* Symmetric */}
      <Card className="animate-slide-up">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">Symmetric</span>
          <span className="text-gray-400 text-sm">Zero skew</span>
        </div>
        <HistogramChart data={SYMMETRIC_DATA} numBins={6} color="#6366f1" label="Symmetric Distribution" />
        <StatPills data={SYMMETRIC_DATA} />
        <p className="mt-3 text-gray-700 text-sm">
          Left and right sides are roughly balanced. <strong>Mean ≈ Median.</strong> The distribution looks like a hill with both sides
          mirroring each other.
        </p>
      </Card>

      {/* Right-Skewed */}
      <Card className="animate-slide-up">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">Right-Skewed</span>
          <span className="text-gray-400 text-sm">Positive Skew</span>
        </div>
        <HistogramChart data={RIGHT_SKEWED_DATA} numBins={6} color="#ef4444" label="Right-Skewed Distribution" />
        <StatPills data={RIGHT_SKEWED_DATA} />
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gradient-to-r from-red-300 to-red-50 rounded" />
          <span className="text-red-500 font-bold text-sm">Long tail →</span>
        </div>
        <p className="mt-2 text-gray-700 text-sm">
          Most observations are on the <strong>left</strong>. Long tail extends toward the <strong>right</strong>.{' '}
          <strong>Mean &gt; Median</strong> (mean is pulled right by extreme values).
        </p>
      </Card>

      {/* Left-Skewed */}
      <Card className="animate-slide-up">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">Left-Skewed</span>
          <span className="text-gray-400 text-sm">Negative Skew</span>
        </div>
        <HistogramChart data={LEFT_SKEWED_DATA} numBins={6} color="#f59e0b" label="Left-Skewed Distribution" />
        <StatPills data={LEFT_SKEWED_DATA} />
        <div className="mt-3 flex items-center gap-2">
          <span className="text-amber-500 font-bold text-sm">← Long tail</span>
          <div className="flex-1 h-2 bg-gradient-to-l from-amber-300 to-amber-50 rounded" />
        </div>
        <p className="mt-2 text-gray-700 text-sm">
          Most observations are on the <strong>right</strong>. Long tail extends toward the <strong>left</strong>.{' '}
          <strong>Mean &lt; Median</strong> (mean is pulled left by extreme values).
        </p>
      </Card>

      {/* Direction Guide */}
      <Card variant="accent" className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">The Tail Tells You the Direction</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-3 bg-red-50 rounded-xl p-3">
            <span className="text-red-500 font-bold text-lg">→</span>
            <span><strong>Tail points RIGHT</strong> → Positive skew (right-skewed)</span>
          </div>
          <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
            <span className="text-amber-500 font-bold text-lg">←</span>
            <span><strong>Tail points LEFT</strong> → Negative skew (left-skewed)</span>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-3">
            <span className="text-indigo-500 font-bold text-lg">⇔</span>
            <span><strong>Balanced</strong> → Zero skew (symmetric)</span>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
          <strong>Generally:</strong> Right-skewed → Mean &gt; Median &nbsp;|&nbsp; Left-skewed → Mean &lt; Median
        </div>
      </Card>

      {/* Classification Activity */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Classify the Distribution</h2>
        <p className="text-sm text-gray-500 mb-5">
          Examine each histogram and choose the correct skewness type. Reveal answers when you are done!
        </p>

        <div className="space-y-8">
          {(Object.keys(CLASSIFY_DATASETS) as ClassifyKey[]).map((key) => {
            const { data, answer } = CLASSIFY_DATASETS[key];
            const chosen = classifyAnswers[key];
            const correct = chosen === answer;
            const colors: Record<ClassifyKey, string> = { A: '#ef4444', B: '#6366f1', C: '#f59e0b' };
            return (
              <div key={key}>
                <p className="font-semibold text-gray-700 mb-2">Distribution {key}</p>
                <HistogramChart data={data} numBins={6} color={colors[key]} label={`Distribution ${key}`} />
                <StatPills data={data} />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {SKEW_OPTIONS.map((opt) => {
                    const isChosen = chosen === opt;
                    let variant: 'primary' | 'success' | 'danger' | 'secondary' = 'secondary';
                    if (isChosen && !checksShown) variant = 'primary';
                    if (checksShown && isChosen && correct) variant = 'success';
                    if (checksShown && isChosen && !correct) variant = 'danger';
                    return (
                      <Button key={opt} variant={variant} size="sm" onClick={() => handleClassify(key, opt)}>
                        {opt}
                      </Button>
                    );
                  })}
                </div>
                {checksShown && chosen && (
                  <div
                    className={`mt-2 text-sm rounded-xl p-3 ${
                      correct
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {correct
                      ? `✅ Correct! Distribution ${key} is ${answer}.`
                      : `❌ Not quite. Distribution ${key} is ${answer}. ${
                          answer === 'Right-Skewed'
                            ? 'Notice the long tail extending right and a few very high values.'
                            : answer === 'Left-Skewed'
                            ? 'Notice the long tail extending left with most observations on the right.'
                            : 'The mean and median are close and the distribution is roughly balanced.'
                        }`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          {!checksShown && (
            <Button variant="primary" disabled={!allAnswered} onClick={() => setChecksShown(true)}>
              Check Answers
            </Button>
          )}
          {checksShown && (
            <Button
              variant="ghost"
              onClick={() => {
                setClassifyAnswers({ A: null, B: null, C: null });
                setChecksShown(false);
              }}
            >
              ↺ Try Again
            </Button>
          )}
        </div>
        {!allAnswered && !checksShown && (
          <p className="text-xs text-gray-400 mt-2">Classify all 3 distributions to enable Check Answers.</p>
        )}
      </Card>

      {/* Kurtosis Collapsible */}
      <Card className="animate-slide-up">
        <button className="w-full flex items-center justify-between text-left" onClick={() => setKurtosisOpen((o) => !o)}>
          <span className="font-semibold text-gray-700">Explore More: Beyond Skewness →</span>
          <span className="text-brand-600 text-lg">{kurtosisOpen ? '▲' : '▼'}</span>
        </button>

        {kurtosisOpen && (
          <div className="mt-4 animate-fade-in space-y-3">
            <p className="text-gray-700 text-sm">
              <strong>Kurtosis</strong> is related to the heaviness of the tails and how sharp the peak of the distribution is.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Platykurtic', emoji: '〰', desc: 'Thin tails, flat peak — data spread more uniformly.' },
                { label: 'Mesokurtic', emoji: '🔔', desc: 'Moderate tails and peak — like a normal distribution.' },
                { label: 'Leptokurtic', emoji: '🗻', desc: 'Heavy tails, sharp peak — extreme values are more common.' },
              ].map(({ label, emoji, desc }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="font-semibold text-sm text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
              This is an advanced topic. <strong>Skewness is what matters most for now.</strong>
            </p>
          </div>
        )}
      </Card>

      <WhatDidWeLearn
        concept="Skewness"
        text="Skewness describes the asymmetry of a distribution. The tail direction tells you the skew direction. Right-skewed has a long right tail (Mean > Median). Left-skewed has a long left tail (Mean < Median)."
      />
    </div>
  );
}
