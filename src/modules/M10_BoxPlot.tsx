import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import BoxPlotChart from '../components/charts/BoxPlotChart';
import HistogramChart from '../components/charts/HistogramChart';
import { mean, median, fiveNumberSummary, populationVariance, populationSD, dataRange, fmt } from '../utils/stats';

const CONSTRUCTION_DATA = [5, 15, 20, 25, 30, 35, 40, 45, 50, 60];
const OUTLIER_DATA = [10, 20, 25, 30, 32, 35, 38, 40, 42, 90];
const INITIAL_EDITOR = [15, 20, 25, 30, 35, 40, 45, 50, 55, 80];
const CLASS_A = [72, 75, 78, 80, 82, 84, 85, 88, 90, 95];
const CLASS_B = [40, 55, 60, 65, 70, 75, 80, 85, 90, 95];
const CASE_DATA = [25, 30, 30, 35, 35, 40, 40, 45, 45, 50, 55, 60, 65, 70, 150];

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold text-brand-700">{value}</span>
    </div>
  );
}

export default function BoxPlot() {
  const [step, setStep] = useState(0);
  const [editorData, setEditorData] = useState<number[]>([...INITIAL_EDITOR]);
  const [revealedQs, setRevealedQs] = useState<Set<number>>(new Set());
  const [caseStep, setCaseStep] = useState(0);

  // Construction dataset stats
  const consFns = useMemo(() => fiveNumberSummary(CONSTRUCTION_DATA), []);

  // Outlier dataset stats
  const outFns = useMemo(() => fiveNumberSummary(OUTLIER_DATA), []);

  // Editor dataset stats
  const edFns = useMemo(() => fiveNumberSummary(editorData), [editorData]);

  // Comparison stats
  const classAFns = useMemo(() => fiveNumberSummary(CLASS_A), []);
  const classBFns = useMemo(() => fiveNumberSummary(CLASS_B), []);

  // Case study stats
  const caseMean = useMemo(() => mean(CASE_DATA), []);
  const caseMedian = useMemo(() => median(CASE_DATA), []);
  const caseRange = useMemo(() => dataRange(CASE_DATA), []);
  const casePopVar = useMemo(() => populationVariance(CASE_DATA), []);
  const casePopSD = useMemo(() => populationSD(CASE_DATA), []);
  const caseFns = useMemo(() => fiveNumberSummary(CASE_DATA), []);

  const handleEditorSlider = (i: number, v: number) => {
    const next = [...editorData];
    next[i] = v;
    setEditorData(next);
  };

  const toggleReveal = (i: number) => {
    setRevealedQs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const comparisonQs = [
    {
      q: 'Which class has the higher median?',
      a: `Class A (Median = ${fmt(classAFns.median)}) vs Class B (Median = ${fmt(classBFns.median)}). Class A has the higher median.`,
    },
    {
      q: 'Which class has greater overall spread (Range)?',
      a: `Class A Range = ${fmt(classAFns.max - classAFns.min)} | Class B Range = ${fmt(classBFns.max - classBFns.min)}. Class B has greater overall spread.`,
    },
    {
      q: 'Which class has a larger IQR?',
      a: `Class A IQR = ${fmt(classAFns.iqr)} | Class B IQR = ${fmt(classBFns.iqr)}. Class B has the larger IQR.`,
    },
    {
      q: 'Are there potential outliers in either class?',
      a: `Class A — Lower fence: ${fmt(classAFns.lowerFence)}, Upper fence: ${fmt(classAFns.upperFence)}. No outliers. Class B — Lower fence: ${fmt(classBFns.lowerFence)}, Upper fence: ${fmt(classBFns.upperFence)}. No outliers.`,
    },
    {
      q: 'Which class appears more consistent (less variable)?',
      a: `Class A has a smaller IQR (${fmt(classAFns.iqr)}) compared to Class B (${fmt(classBFns.iqr)}), indicating Class A is more consistent.`,
    },
  ];

  const CASE_STEPS = [
    { title: 'What is the typical travel time?', body: 'Think: should we use Mean or Median here? Is there any extreme value that might distort the mean?' },
    { title: 'Mean', body: `Mean = ${fmt(caseMean, 2)} minutes. Is this a good representation of the typical student?` },
    { title: 'Median', body: `Median = ${fmt(caseMedian)} minutes. This is the middle value when sorted.` },
    { title: 'Range', body: `Range = Max − Min = 150 − 25 = ${fmt(caseRange)} minutes. Very large range!` },
    { title: 'Population Variance', body: `σ² = ${fmt(casePopVar, 2)} minutes²` },
    { title: 'Standard Deviation', body: `σ = ${fmt(casePopSD, 2)} minutes` },
    { title: 'Distribution shape', body: 'Use the histogram below to observe the shape — is it symmetric or skewed?' },
    { title: 'Is 150 an unusual value?', body: `Upper fence = Q3 + 1.5×IQR = ${fmt(caseFns.upperFence, 2)}. Since 150 > ${fmt(caseFns.upperFence, 2)}, 150 IS a potential outlier!` },
    { title: 'Box Plot', body: 'The box plot clearly shows the outlier at 150.' },
    {
      title: 'Conclusion',
      body: `The typical student takes about ${fmt(caseMedian)} minutes (median). While the average appears higher (${fmt(caseMean, 2)} min) due to one student with a 150 min commute. This is a right-skewed distribution. 150 is a potential outlier worth investigating.`,
    },
  ];

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Box Plot</h1>
        <p className="mt-1 text-lg text-gray-500">Summarizing center, spread, and outliers in one powerful visual</p>
        <div className="mt-2">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 10 of 12</span>
        </div>
      </div>

      {/* Intro + Five Number Summary */}
      <Card className="animate-slide-up">
        <p className="text-gray-700 mb-4">
          We now know the center and spread of data. Can we visualize all the important characteristics in one diagram?
        </p>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">The Five-Number Summary</h2>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { label: 'Minimum', color: 'bg-blue-100 text-blue-700' },
            { label: 'Q1', color: 'bg-indigo-100 text-indigo-700' },
            { label: 'Median (Q2)', color: 'bg-green-100 text-green-700' },
            { label: 'Q3', color: 'bg-amber-100 text-amber-700' },
            { label: 'Maximum', color: 'bg-red-100 text-red-700' },
          ].map(({ label, color }) => (
            <div key={label} className={`rounded-xl p-2 ${color}`}>
              <p className="text-xs font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Step-by-step Construction */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Step-by-Step Box Plot Construction</h2>
        <p className="text-sm text-gray-500 mb-4">Dataset: [5, 15, 20, 25, 30, 35, 40, 45, 50, 60]</p>

        <div className="flex items-center gap-2 mb-4">
          {[0, 1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-brand-500' : 'bg-gray-200'}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">Step {step + 1}/5</span>
        </div>

        {step === 0 && (
          <div className="animate-fade-in">
            <p className="font-medium text-gray-700 mb-2">Sorted data values:</p>
            <div className="flex gap-2 flex-wrap">
              {CONSTRUCTION_DATA.map((v, i) => (
                <span key={i} className="bg-brand-50 text-brand-700 text-sm font-bold px-3 py-1 rounded-full">{v}</span>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <p className="font-medium text-gray-700 mb-3">Five-Number Summary:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {[
                { label: 'Min', value: fmt(consFns.min) },
                { label: 'Q1', value: fmt(consFns.q1) },
                { label: 'Median', value: fmt(consFns.median) },
                { label: 'Q3', value: fmt(consFns.q3) },
                { label: 'Max', value: fmt(consFns.max) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-lg font-bold text-brand-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <p className="font-medium text-gray-700 mb-3">Drawing the whiskers: Min → Q1 and Q3 → Max</p>
            <div className="relative h-12 bg-gray-50 rounded-xl border border-gray-200 flex items-center px-6">
              <div className="w-2 h-6 bg-blue-400 rounded" style={{ position: 'absolute', left: '8%' }} />
              <div className="h-0.5 bg-blue-300" style={{ position: 'absolute', left: '8%', right: '73%' }} />
              <div className="h-0.5 bg-blue-300" style={{ position: 'absolute', left: '46%', right: '8%' }} />
              <div className="w-2 h-6 bg-red-400 rounded" style={{ position: 'absolute', right: '8%' }} />
              <div className="absolute bottom-1 left-[8%] text-xs text-gray-400">Min={fmt(consFns.min)}</div>
              <div className="absolute bottom-1 right-[8%] text-xs text-gray-400">Max={fmt(consFns.max)}</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">The whiskers extend from Q1 to the minimum and from Q3 to the maximum.</p>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <p className="font-medium text-gray-700 mb-3">Drawing the box: Q1 to Q3</p>
            <div className="relative h-16 bg-gray-50 rounded-xl border border-gray-200 flex items-center px-6">
              <div className="h-0.5 bg-blue-300" style={{ position: 'absolute', left: '8%', right: '73%', top: '50%' }} />
              <div className="h-8 bg-brand-200 border-2 border-brand-400 rounded" style={{ position: 'absolute', left: '27%', right: '46%', top: '25%' }} />
              <div className="h-0.5 bg-blue-300" style={{ position: 'absolute', left: '54%', right: '8%', top: '50%' }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">The box spans from Q1 ({fmt(consFns.q1)}) to Q3 ({fmt(consFns.q3)}), covering the middle 50% of the data.</p>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in space-y-3">
            <p className="font-medium text-gray-700">Complete box plot with median line:</p>
            <BoxPlotChart datasets={[{ name: 'Dataset', values: CONSTRUCTION_DATA, color: '#6366f1' }]} />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-blue-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">Whiskers</p>
                <p className="font-semibold text-blue-700">{fmt(consFns.min)} to {fmt(consFns.max)}</p>
              </div>
              <div className="bg-brand-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">Box (IQR)</p>
                <p className="font-semibold text-brand-700">{fmt(consFns.q1)} to {fmt(consFns.q3)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-2">
                <p className="text-xs text-gray-400">Median</p>
                <p className="font-semibold text-green-700">{fmt(consFns.median)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {step > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>← Previous</Button>
          )}
          {step < 4 && (
            <Button variant="primary" size="sm" onClick={() => setStep((s) => s + 1)}>Next Step →</Button>
          )}
        </div>
      </Card>

      {/* IQR Section */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Interquartile Range (IQR)</h2>
        <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-4 text-sm mb-4">
          <div>IQR = Q3 − Q1</div>
          <div className="text-yellow-300 mt-1">IQR = {fmt(consFns.q3)} − {fmt(consFns.q1)} = {fmt(consFns.iqr)}</div>
        </div>
        <p className="text-gray-700 text-sm">
          The IQR is the range of the <strong>middle 50%</strong> of the data. It is resistant to outliers because it ignores the top 25% and bottom 25% of values.
        </p>
      </Card>

      {/* Outlier Detection */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Outlier Detection (Tukey Fences)</h2>
        <div className="bg-gray-900 text-green-400 font-mono rounded-xl p-4 text-sm mb-4">
          <div>Lower Fence = Q1 − 1.5 × IQR</div>
          <div>Upper Fence = Q3 + 1.5 × IQR</div>
          <div className="text-gray-400 mt-1">Values outside these fences are potential outliers.</div>
        </div>

        <p className="text-sm text-gray-500 mb-3">Example dataset: [10, 20, 25, 30, 32, 35, 38, 40, 42, 90]</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Q1', value: fmt(outFns.q1) },
            { label: 'Q3', value: fmt(outFns.q3) },
            { label: 'IQR', value: fmt(outFns.iqr) },
            { label: 'Lower Fence', value: fmt(outFns.lowerFence) },
            { label: 'Upper Fence', value: fmt(outFns.upperFence) },
            { label: 'Outliers', value: outFns.outlierPoints.length > 0 ? outFns.outlierPoints.join(', ') : 'None' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-200">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-bold text-brand-700">{value}</p>
            </div>
          ))}
        </div>

        <BoxPlotChart datasets={[{ name: 'Outlier Example', values: OUTLIER_DATA, color: '#ef4444' }]} showOutliers />

        <Card variant="warning" className="mt-4">
          <p className="font-semibold text-amber-800 mb-2">⚠ Important: Outlier ≠ Error</p>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• A genuine rare event (a student who studied for 20 hours)</li>
            <li>• A data entry error (typed 900 instead of 90)</li>
            <li>• An unusual but valid observation</li>
          </ul>
          <p className="text-sm text-amber-700 mt-2 font-medium">Always investigate outliers before removing them!</p>
        </Card>
      </Card>

      {/* Interactive Box Plot Editor */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Build Your Own Box Plot</h2>
        <p className="text-sm text-gray-500 mb-4">Drag the sliders to modify the dataset and see the box plot update live.</p>

        <div className="space-y-2 mb-5">
          {editorData.map((val, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 w-6">x{i + 1}</span>
              <input
                type="range"
                min={1}
                max={150}
                value={val}
                onChange={(e) => handleEditorSlider(i, Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="w-10 text-right text-sm font-bold text-gray-800">{val}</span>
            </div>
          ))}
        </div>

        <BoxPlotChart datasets={[{ name: 'Your Dataset', values: editorData, color: '#6366f1' }]} showOutliers />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[
            { label: 'Min', value: fmt(edFns.min) },
            { label: 'Q1', value: fmt(edFns.q1) },
            { label: 'Median', value: fmt(edFns.median) },
            { label: 'Q3', value: fmt(edFns.q3) },
            { label: 'Max', value: fmt(edFns.max) },
            { label: 'IQR', value: fmt(edFns.iqr) },
            { label: 'Lower Fence', value: fmt(edFns.lowerFence) },
            { label: 'Upper Fence', value: fmt(edFns.upperFence) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-200">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-bold text-brand-700">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Outliers detected: <span className="font-bold text-red-600">{edFns.outlierPoints.length > 0 ? edFns.outlierPoints.join(', ') : 'None'}</span>
          </p>
        </div>

        <Button variant="ghost" size="sm" className="mt-3" onClick={() => setEditorData([...INITIAL_EDITOR])}>
          ↺ Reset
        </Button>
      </Card>

      {/* Box Plot Comparison */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Box Plot Comparison — Class A vs Class B</h2>
        <div className="flex gap-3 mb-4 flex-wrap">
          <span className="text-xs text-gray-500">Class A: {CLASS_A.join(', ')}</span>
          <span className="text-xs text-gray-500">Class B: {CLASS_B.join(', ')}</span>
        </div>

        <BoxPlotChart
          datasets={[
            { name: 'Class A', values: CLASS_A, color: '#6366f1' },
            { name: 'Class B', values: CLASS_B, color: '#ef4444' },
          ]}
          showOutliers
        />

        <div className="mt-5 space-y-3">
          {comparisonQs.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <p className="text-sm font-medium text-gray-700">Q{i + 1}: {item.q}</p>
                <Button variant="ghost" size="sm" onClick={() => toggleReveal(i)}>
                  {revealedQs.has(i) ? 'Hide' : 'Reveal Answer'}
                </Button>
              </div>
              {revealedQs.has(i) && (
                <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                  <p className="text-sm text-green-800">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Real-World Case Study */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Case Study: Student Travel Time to College</h2>
        <p className="text-sm text-gray-500 mb-1">Dataset (minutes): {CASE_DATA.join(', ')}</p>
        <div className="flex items-center gap-2 mb-4">
          {CASE_STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= caseStep ? 'bg-brand-500' : 'bg-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">{caseStep + 1}/{CASE_STEPS.length}</span>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
          <p className="font-semibold text-indigo-800 mb-1">Step {caseStep + 1}: {CASE_STEPS[caseStep].title}</p>
          <p className="text-indigo-700 text-sm">{CASE_STEPS[caseStep].body}</p>

          {caseStep === 6 && (
            <div className="mt-3">
              <HistogramChart data={CASE_DATA} numBins={7} color="#6366f1" label="Travel Time" />
            </div>
          )}
          {caseStep === 8 && (
            <div className="mt-3">
              <BoxPlotChart datasets={[{ name: 'Travel Time', values: CASE_DATA, color: '#6366f1' }]} showOutliers />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {caseStep > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setCaseStep((s) => s - 1)}>← Back</Button>
          )}
          {caseStep < CASE_STEPS.length - 1 && (
            <Button variant="primary" size="sm" onClick={() => setCaseStep((s) => s + 1)}>Next Step →</Button>
          )}
        </div>
      </Card>

      <WhatDidWeLearn
        concept="Box Plot"
        text="A box plot shows the five-number summary visually: Min, Q1, Median, Q3, Max. IQR = Q3 − Q1 measures the spread of the middle 50%. Points beyond the fences are potential outliers."
      />
    </div>
  );
}
