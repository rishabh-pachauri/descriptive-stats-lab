import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NumberLine from '../components/charts/NumberLine';
import DotPlot from '../components/charts/DotPlot';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';

const DISCOVERY_DATA = [20, 30, 40, 50, 60];
const LIMIT_A = [48, 49, 50, 51, 52];
const LIMIT_B = [10, 49, 50, 51, 90];

export default function Range() {
  const [minVal, setMinVal] = useState(20);
  const [maxVal, setMaxVal] = useState(80);
  const [limitRevealed, setLimitRevealed] = useState(false);

  const effectiveMin = Math.min(minVal, maxVal);
  const effectiveMax = Math.max(minVal, maxVal);
  const liveRange = effectiveMax - effectiveMin;

  const intermediateValues = useMemo(() => {
    const step = (effectiveMax - effectiveMin) / 4;
    return [
      Math.round(effectiveMin + step),
      Math.round(effectiveMin + step * 2),
      Math.round(effectiveMin + step * 3),
    ];
  }, [effectiveMin, effectiveMax]);

  const rangeA = Math.max(...LIMIT_A) - Math.min(...LIMIT_A);
  const rangeB = Math.max(...LIMIT_B) - Math.min(...LIMIT_B);

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
          Module 5 of 12
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Range</h1>
        <p className="text-lg text-gray-500">The simplest measure of spread</p>
      </div>

      {/* Discovery Section */}
      <Card title="Discover the Range" subtitle="Look at this dataset and find the distance from lowest to highest">
        <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
          <p className="text-2xl font-mono font-bold text-gray-800">[{DISCOVERY_DATA.join(', ')}]</p>
        </div>
        <NumberLine
          datasets={[{ name: 'Data', values: DISCOVERY_DATA, color: '#22c55e' }]}
          showMean={false}
          showMedian={false}
          min={10}
          max={70}
          height={120}
        />
        <div className="mt-5 grid sm:grid-cols-3 gap-4 items-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Minimum</p>
            <p className="text-3xl font-bold text-red-600">20</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="bg-gray-900 text-green-400 font-mono text-lg rounded-xl px-4 py-3 animate-scale-in text-center">
              60 - 20 = 40
            </div>
            <p className="text-xs text-gray-500">Animated calculation</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Maximum</p>
            <p className="text-3xl font-bold text-blue-600">60</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-900 text-green-400 font-mono text-base rounded-xl p-4 text-center">
          Range = Maximum - Minimum = 60 - 20 = <span className="text-yellow-300 font-bold">40</span>
        </div>
      </Card>

      {/* Interactive Range Explorer */}
      <Card title="Interactive Range Explorer" subtitle="Move the sliders to explore how range changes">
        <div className="space-y-5">
          {/* Min Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Minimum value</label>
              <span className="bg-red-500 text-white text-sm font-bold w-12 h-8 flex items-center justify-center rounded-lg">
                {minVal}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={minVal}
              onChange={e => setMinVal(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span><span>100</span>
            </div>
          </div>

          {/* Max Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Maximum value</label>
              <span className="bg-blue-500 text-white text-sm font-bold w-12 h-8 flex items-center justify-center rounded-lg">
                {maxVal}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={maxVal}
              onChange={e => setMaxVal(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span><span>200</span>
            </div>
          </div>

          {/* Live Range */}
          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Live Range</p>
            <p className="text-4xl font-bold text-green-700">{liveRange}</p>
            <p className="text-sm text-green-600 mt-1 font-mono">
              {effectiveMax} - {effectiveMin} = {liveRange}
            </p>
          </div>

          {/* Number Line */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Visualization</p>
            <NumberLine
              datasets={[
                { name: 'Min', values: [effectiveMin], color: '#ef4444' },
                { name: 'Intermediate', values: intermediateValues, color: '#6366f1' },
                { name: 'Max', values: [effectiveMax], color: '#3b82f6' },
              ]}
              showMean={false}
              showMedian={false}
              min={0}
              max={210}
              height={120}
            />
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Min ({effectiveMin})</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span> Middle values</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Max ({effectiveMax})</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Limitation of Range */}
      <Card title="The Limitation of Range" subtitle="Can range tell us the whole story?">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <p className="font-semibold text-indigo-800 text-sm mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
              Dataset A
            </p>
            <p className="font-mono text-sm text-indigo-700">[{LIMIT_A.join(', ')}]</p>
            <p className="text-xs text-indigo-500 mt-1">Range = {rangeA}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="font-semibold text-red-800 text-sm mb-1">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              Dataset B
            </p>
            <p className="font-mono text-sm text-red-700">[{LIMIT_B.join(', ')}]</p>
            <p className="text-xs text-red-500 mt-1">Range = {rangeB}</p>
          </div>
        </div>
        <DotPlot
          datasets={[
            { name: 'Dataset A', values: LIMIT_A, color: '#6366f1' },
            { name: 'Dataset B', values: LIMIT_B, color: '#ef4444' },
          ]}
          min={5}
          max={100}
        />

        <div className="question-box mt-4">
          <div className="flex items-start gap-2">
            <span className="text-xl">🤔</span>
            <p className="text-amber-800 text-sm">
              Dataset B has a much larger range ({rangeB}). But does range tell us what is happening to the values{' '}
              <strong>49, 50, 51</strong> in the middle? Those three values in Dataset B are actually clustered just as tightly as Dataset A!
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            variant="primary"
            onClick={() => setLimitRevealed(true)}
            disabled={limitRevealed}
          >
            {limitRevealed ? '✅ Limitation Revealed' : 'Reveal the Limitation'}
          </Button>
        </div>

        {limitRevealed && (
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-900 mb-1">The Range's Blind Spot</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Range only uses the <strong>two extreme values</strong> (minimum and maximum). It completely ignores all
                  values in between. A single outlier can make the range look huge even if most of the data is tightly
                  clustered.
                </p>
                <p className="text-amber-800 text-sm mt-2">
                  📌 In Dataset B: values 49, 50, 51 are packed tightly — but two extreme values (10 and 90) make the
                  range look like {rangeB}!
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* When to Use */}
      <Card title="When to Use Range">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✅</span>
              <h3 className="font-bold text-green-800">Good for</h3>
            </div>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Quick summary of total data span</li>
              <li>• Understanding the extreme values</li>
              <li>• When data has no outliers</li>
              <li>• First-pass exploration of data</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-bold text-red-800">Limitations</h3>
            </div>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Sensitive to outliers</li>
              <li>• Ignores all middle values</li>
              <li>• Can be very misleading</li>
              <li>• Only uses 2 data points</li>
            </ul>
          </div>
        </div>
      </Card>

      <WhatDidWeLearn
        concept="Range"
        text="Range = Maximum - Minimum. It tells us the total span of the data, but it only uses two values and is sensitive to outliers. A single extreme value can make the range look very large even if most data is tightly clustered."
      />
    </div>
  );
}
