import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import NumberLine from '../components/charts/NumberLine';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import { mean, median, mode, fmt } from '../utils/stats';

const DEFAULT_DATA = [48, 50, 50, 51, 52, 55, 100];
const SLIDER_LABELS = ['Value 1', 'Value 2', 'Value 3', 'Value 4', 'Value 5', 'Value 6', 'Value 7'];
const SLIDER_COLORS = [
  'bg-indigo-500', 'bg-purple-500', 'bg-blue-500',
  'bg-teal-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500',
];

export default function CenterOfData() {
  const [editableData, setEditableData] = useState<number[]>(DEFAULT_DATA);

  const currentMean = useMemo(() => mean(editableData), [editableData]);
  const currentMedian = useMemo(() => median(editableData), [editableData]);
  const currentMode = useMemo(() => mode(editableData), [editableData]);

  const handleSliderChange = (index: number, value: number) => {
    const updated = [...editableData];
    updated[index] = value;
    setEditableData(updated);
  };

  const modeDisplay =
    currentMode.length === 0
      ? 'No mode (all unique)'
      : currentMode.length > 2
      ? `${currentMode.slice(0, 2).join(', ')} ... (${currentMode.length} modes)`
      : currentMode.join(', ');

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Module 2 of 12
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Center of Data</h1>
        <p className="text-lg text-gray-500">
          Mean, Median, and Mode — three ways to find the typical value
        </p>
      </div>

      {/* Interactive Dataset Editor */}
      <Card title="Interactive Data Editor" subtitle="Drag the sliders to change each value and watch the statistics update live">
        <div className="space-y-4">
          {editableData.map((val, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium text-gray-600 shrink-0">{SLIDER_LABELS[i]}</span>
              <input
                type="range"
                min={1}
                max={200}
                step={1}
                value={val}
                onChange={e => handleSliderChange(i, Number(e.target.value))}
                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span
                className={`${SLIDER_COLORS[i]} text-white text-sm font-bold w-12 h-8 flex items-center justify-center rounded-lg shrink-0`}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Live Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Mean', value: fmt(currentMean, 2), color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
            { label: 'Median', value: fmt(currentMedian, 1), color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
            { label: 'Mode', value: modeDisplay, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-3 text-center`}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Number Line */}
        <div className="mt-4">
          <NumberLine
            datasets={[{ name: 'Your Data', values: editableData, color: '#6366f1' }]}
            showMean={true}
            showMedian={true}
            min={0}
            max={210}
            height={140}
          />
        </div>
      </Card>

      {/* Observation Question */}
      <div className="question-box animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧪</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-lg mb-2">
              What happens to the Mean when you move one value very far away?
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white/70 rounded-lg p-3 text-center border border-amber-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Current Mean</p>
                <p className="text-3xl font-bold text-indigo-700">{fmt(currentMean, 2)}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center border border-amber-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Current Median</p>
                <p className="text-3xl font-bold text-purple-700">{fmt(currentMedian, 1)}</p>
              </div>
            </div>
            <p className="text-amber-700 text-sm mt-3">
              💡 Try moving the last slider (currently <strong>{editableData[6]}</strong>) to 200... then to 1. Watch how Mean and Median react differently!
            </p>
          </div>
        </div>
      </div>

      {/* Insight Box */}
      <Card variant="accent" title="Key Insight: Sensitivity to Outliers">
        <div className="space-y-3">
          {[
            {
              icon: '📊',
              title: 'Mean is sensitive to extreme values (outliers).',
              desc: 'Moving one value far away changes the mean dramatically. The mean "follows" extreme values.',
            },
            {
              icon: '🛡️',
              title: 'Median is resistant to extreme values.',
              desc: 'Even if one value changes a lot, the median may barely move. It only depends on the middle position.',
            },
            {
              icon: '🎯',
              title: 'This is why data scientists sometimes prefer the median.',
              desc: 'When data has outliers (like income data), the median gives a more representative "typical" value.',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-brand-800">{item.title}</p>
                <p className="text-brand-600 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Formal Definitions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Formal Definitions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Mean',
              icon: '➕',
              color: 'border-indigo-300 bg-indigo-50',
              titleColor: 'text-indigo-800',
              body: 'Sum of all values divided by the number of values.',
              formula: 'mu = Sigma(x) / N',
            },
            {
              title: 'Median',
              icon: '↕️',
              color: 'border-purple-300 bg-purple-50',
              titleColor: 'text-purple-800',
              body: 'The middle value when data is sorted. For even n: average of the two middle values.',
              formula: 'Middle of sorted data',
            },
            {
              title: 'Mode',
              icon: '🔁',
              color: 'border-teal-300 bg-teal-50',
              titleColor: 'text-teal-800',
              body: 'The most frequently occurring value. A dataset can have multiple modes or no mode.',
              formula: 'Most frequent value',
            },
          ].map(def => (
            <div key={def.title} className={`border-2 ${def.color} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{def.icon}</span>
                <h3 className={`text-lg font-bold ${def.titleColor}`}>{def.title}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">{def.body}</p>
              <div className="bg-gray-900 text-green-400 font-mono text-sm rounded-lg px-3 py-2">
                {def.formula}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Explanation */}
      <Card title="Mode in Your Data">
        <p className="text-gray-600 mb-3">
          Mode is the value that appears most often. Some datasets have <strong>no mode</strong> (all values unique),
          some have <strong>one mode</strong>, and some have <strong>multiple modes</strong>.
        </p>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-3xl">🔁</span>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Mode</p>
            <p className="text-2xl font-bold text-teal-700">{modeDisplay}</p>
            <p className="text-xs text-gray-500 mt-1">from data: [{editableData.join(', ')}]</p>
          </div>
        </div>
      </Card>

      {/* When to Use Table */}
      <Card title="Which Measure Should You Use?">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-600 border-b border-gray-200">Measure</th>
                <th className="text-left p-3 font-semibold text-gray-600 border-b border-gray-200">Best Used When...</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  measure: '📊 Mean',
                  when: 'Data is symmetric, has no extreme values, and all values contribute equally.',
                },
                {
                  measure: '↕️ Median',
                  when: 'Data has outliers, income/salary data, or a skewed distribution.',
                },
                {
                  measure: '🔁 Mode',
                  when: 'Working with categorical data, or when the most common value matters most.',
                },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-semibold text-gray-800 border-b border-gray-100">{row.measure}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <WhatDidWeLearn
        concept="Center of Data"
        text="Mean tells us the arithmetic average. Median tells us the middle value. Mode tells us the most frequent value. Each has its place depending on the nature of the data."
      />
    </div>
  );
}
