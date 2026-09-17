import React, { useState } from 'react';
import Card from '../components/ui/Card';
import NumberLine from '../components/charts/NumberLine';
import DotPlot from '../components/charts/DotPlot';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import { mean, fmt } from '../utils/stats';

const dataA = [48, 49, 50, 51, 52];
const dataB = [20, 35, 50, 65, 80];
const exampleData = [10, 10, 50, 90, 90];

type ThoughtOption = 'range' | 'variance' | 'iqr' | null;

const THOUGHT_OPTIONS: { id: ThoughtOption; label: string; measure: string; color: string; titleColor: string; badge: string; desc: string }[] = [
  {
    id: 'range',
    label: 'The distance between the largest and smallest value',
    measure: 'Range',
    color: 'border-green-400 bg-green-50',
    titleColor: 'text-green-800',
    badge: 'bg-green-100 text-green-800',
    desc: 'This is the Range! It gives you the total span of the data. Simple to compute — just Max minus Min.',
  },
  {
    id: 'variance',
    label: 'How far each value is from the mean, on average',
    measure: 'Variance / SD',
    color: 'border-brand-400 bg-brand-50',
    titleColor: 'text-brand-800',
    badge: 'bg-brand-100 text-brand-800',
    desc: 'This leads to Variance and Standard Deviation! These measures use every single value in the dataset to quantify spread.',
  },
  {
    id: 'iqr',
    label: 'Where the middle 50% of values fall',
    measure: 'IQR',
    color: 'border-purple-400 bg-purple-50',
    titleColor: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-800',
    desc: 'This is the Interquartile Range (IQR)! It focuses on the middle half of the data, ignoring extreme values.',
  },
];

export default function MeasuringSpread() {
  const [thoughtChoice, setThoughtChoice] = useState<ThoughtOption>(null);

  const meanExample = mean(exampleData);

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Module 4 of 12
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Measuring Spread</h1>
        <p className="text-lg text-gray-500">
          We know the center. But how do we measure how spread out the data is?
        </p>
      </div>

      {/* Recall Card */}
      <Card title="Quick Recap" subtitle="Remember our two datasets with the same mean?">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
            <p className="text-xs font-semibold text-indigo-500 uppercase mb-1">Dataset A (tightly grouped)</p>
            <p className="font-mono text-indigo-800 font-semibold">[{dataA.join(', ')}]</p>
            <p className="text-xs text-indigo-500 mt-1">Mean = {mean(dataA)} · Range = {Math.max(...dataA) - Math.min(...dataA)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs font-semibold text-red-500 uppercase mb-1">Dataset B (widely spread)</p>
            <p className="font-mono text-red-800 font-semibold">[{dataB.join(', ')}]</p>
            <p className="text-xs text-red-500 mt-1">Mean = {mean(dataB)} · Range = {Math.max(...dataB) - Math.min(...dataB)}</p>
          </div>
        </div>
        <DotPlot
          datasets={[
            { name: 'Dataset A', values: dataA, color: '#6366f1' },
            { name: 'Dataset B', values: dataB, color: '#ef4444' },
          ]}
          min={10}
          max={90}
        />
        <p className="text-center text-sm text-gray-500 mt-3">
          Both have mean = 50. But look how differently they spread out!
        </p>
      </Card>

      {/* Big Question Thought Experiment */}
      <div className="question-box animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💭</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-lg mb-4">
              If you had to describe how spread out a dataset is using just <em>one number</em>, what would you measure?
            </p>
            <div className="space-y-3">
              {THOUGHT_OPTIONS.map(option => (
                <button
                  key={option.id as string}
                  onClick={() => setThoughtChoice(option.id)}
                  className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                    thoughtChoice === option.id
                      ? option.color
                      : 'border-amber-200 bg-white/70 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium ${thoughtChoice === option.id ? option.titleColor : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                    {thoughtChoice === option.id && (
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${option.badge}`}>
                        → {option.measure}
                      </span>
                    )}
                  </div>
                  {thoughtChoice === option.id && (
                    <p className={`text-sm mt-2 ${option.titleColor}`}>{option.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Your Toolkit for Measuring Spread</h2>
        <p className="text-gray-500 mb-4">Three powerful measures — each tells a different part of the story.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: '📏',
              title: 'Range',
              desc: 'The simplest measure. Maximum minus Minimum. Fast to compute, but ignores all middle values.',
              color: 'border-green-300 bg-green-50',
              titleColor: 'text-green-800',
              badge: 'Step 1',
              badgeColor: 'bg-green-100 text-green-800',
            },
            {
              icon: '📐',
              title: 'Variance & SD',
              desc: 'Measures how far each value is from the mean. Uses ALL values in the dataset.',
              color: 'border-brand-300 bg-brand-50',
              titleColor: 'text-brand-800',
              badge: 'Step 2',
              badgeColor: 'bg-brand-100 text-brand-800',
            },
            {
              icon: '📦',
              title: 'IQR',
              desc: 'Interquartile Range — the spread of the middle 50% of data. Resistant to outliers.',
              color: 'border-purple-300 bg-purple-50',
              titleColor: 'text-purple-800',
              badge: 'Step 3',
              badgeColor: 'bg-purple-100 text-purple-800',
            },
          ].map(card => (
            <div key={card.title} className={`border-2 ${card.color} rounded-xl p-5`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{card.icon}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.badgeColor}`}>{card.badge}</span>
              </div>
              <h3 className={`text-lg font-bold ${card.titleColor} mb-2`}>{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivating Example */}
      <Card title="A Motivating Example" subtitle="Can you describe how spread out this data is?">
        <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
          <p className="text-2xl font-mono font-bold text-gray-800">[10, 10, 50, 90, 90]</p>
          <p className="text-sm text-gray-500 mt-1">Mean = {fmt(meanExample, 0)}</p>
        </div>
        <NumberLine
          datasets={[{ name: 'Example Data', values: exampleData, color: '#6366f1' }]}
          showMean={true}
          min={0}
          max={100}
          height={130}
        />
        <div className="question-box mt-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">🤔</span>
            <p className="text-amber-800">
              Can you describe how spread out this data is using just <strong>one number</strong>?
              The values are clustered at both extremes — let us explore the tools for measuring that!
            </p>
          </div>
        </div>
      </Card>

      {/* Journey Preview */}
      <Card title="Your Learning Journey">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {[
            { label: 'Range', cls: 'bg-green-100 text-green-800 border border-green-300 px-3 py-1.5 rounded-full text-sm font-semibold' },
            { label: '→', cls: 'text-gray-400 text-lg font-bold' },
            { label: 'Variance', cls: 'bg-brand-100 text-brand-800 border border-brand-300 px-3 py-1.5 rounded-full text-sm font-semibold' },
            { label: '→', cls: 'text-gray-400 text-lg font-bold' },
            { label: 'Standard Deviation', cls: 'bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1.5 rounded-full text-sm font-semibold' },
            { label: '→', cls: 'text-gray-400 text-lg font-bold' },
            { label: 'IQR', cls: 'bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-full text-sm font-semibold' },
            { label: '→', cls: 'text-gray-400 text-lg font-bold' },
            { label: 'Box Plot', cls: 'bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-full text-sm font-semibold' },
          ].map((item, i) => (
            <span key={i} className={item.cls}>{item.label}</span>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Each step builds on the previous one. By the end, you will have a complete toolkit for understanding data distributions.
        </p>
      </Card>

      <WhatDidWeLearn
        concept="Measures of Spread"
        text="Spread tells us how much variation exists in the data. We will learn Range, Variance, Standard Deviation, and IQR — each giving us different insights into how the data is distributed."
      />
    </div>
  );
}
