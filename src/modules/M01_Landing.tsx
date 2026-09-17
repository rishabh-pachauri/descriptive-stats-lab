import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NumberLine from '../components/charts/NumberLine';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import { mean } from '../utils/stats';

const classA = [48, 49, 50, 50, 50, 50, 51, 51, 52];
const classB = [20, 35, 42, 48, 50, 52, 65, 72, 86];

type Answer = 'yes' | 'no' | 'notsure' | null;

export default function Landing() {
  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null);

  const meanA = mean(classA);
  const meanB = mean(classB);

  const getFeedback = () => {
    if (selectedAnswer === 'no') {
      return {
        type: 'success',
        text: "Correct! Even though both classes have mean = 50, the data is spread out very differently. Class B has values as low as 20 and as high as 86! The mean alone doesn't tell the full story.",
      };
    }
    if (selectedAnswer === 'yes') {
      return {
        type: 'info',
        text: 'Look more carefully at the number line. Class A values are all clustered between 48 and 52. Class B values spread from 20 to 86. They behave very differently!',
      };
    }
    if (selectedAnswer === 'notsure') {
      return {
        type: 'info',
        text: 'Look at the number line carefully. One class has dots spread wide apart, the other has dots clustered tightly together. What does that tell you?',
      };
    }
    return null;
  };

  const feedback = getFeedback();

  return (
    <div className="module-container">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white animate-fade-in">
        <div className="max-w-3xl">
          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Module 1 of 12
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Can One Number Describe a Dataset?
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 leading-relaxed">
            Explore real-world data and discover how Data Scientists describe datasets using center, spread, distribution and visualizations.
          </p>
        </div>
      </div>

      {/* Number Line Comparison */}
      <Card title="Two Classes, Same Mean?" subtitle="Both Class A and Class B have a mean of 50. Look at how their values are distributed.">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="font-medium text-gray-700">Class A: {classA.join(', ')}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-gray-700">Class B: {classB.join(', ')}</span>
          </div>
          <NumberLine
            datasets={[
              { name: 'Class A', values: classA, color: '#6366f1' },
              { name: 'Class B', values: classB, color: '#10b981' },
            ]}
            showMean={true}
            showMedian={true}
            min={15}
            max={90}
            height={180}
          />
        </div>
      </Card>

      {/* Question Card */}
      <div className="question-box animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤔</span>
          <div>
            <p className="font-semibold text-amber-900 text-lg mb-1">Think about it!</p>
            <p className="text-amber-800 text-base">
              Both classes have the same mean ({meanA}). Are they performing in the same way?
            </p>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="flex flex-wrap gap-3 justify-center animate-slide-up">
        <Button
          variant={selectedAnswer === 'yes' ? 'warning' : 'secondary'}
          size="md"
          onClick={() => setSelectedAnswer('yes')}
        >
          Yes, they perform similarly
        </Button>
        <Button
          variant={selectedAnswer === 'no' ? 'success' : 'secondary'}
          size="md"
          onClick={() => setSelectedAnswer('no')}
        >
          No, they are different
        </Button>
        <Button
          variant={selectedAnswer === 'notsure' ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setSelectedAnswer('notsure')}
        >
          Not sure
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`rounded-xl p-5 border-l-4 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-900'
              : 'bg-blue-50 border-blue-400 text-blue-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{feedback.type === 'success' ? '✅' : '💡'}</span>
            <p className="text-base leading-relaxed">{feedback.text}</p>
          </div>
        </div>
      )}

      {/* Continue Section */}
      {selectedAnswer !== null && (
        <Card variant="accent" className="animate-scale-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-800 text-lg">Ready to go deeper?</p>
              <p className="text-brand-600 text-sm mt-1">
                In the next section, we will learn how to measure the <strong>center</strong> of data.
              </p>
            </div>
            <Button variant="primary" size="lg">
              Continue to next module →
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Comparison Table */}
      <Card title="Side-by-Side Comparison" subtitle="Same mean, very different stories">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-600 border-b border-gray-200">Measure</th>
                <th className="text-center p-3 font-semibold border-b border-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                    Class A
                  </span>
                </th>
                <th className="text-center p-3 font-semibold border-b border-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    Class B
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Mean', a: '50', b: '50' },
                { label: 'Minimum', a: '48', b: '20' },
                { label: 'Maximum', a: '52', b: '86' },
                { label: 'Spread (Max - Min)', a: '4', b: '66' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{row.label}</td>
                  <td className="p-3 text-center text-indigo-700 font-semibold border-b border-gray-100">{row.a}</td>
                  <td className="p-3 text-center text-emerald-700 font-semibold border-b border-gray-100">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Same mean, but the spread differs dramatically — this is why we need more than just the center!
        </p>
      </Card>

      {/* What Did We Learn */}
      <WhatDidWeLearn
        concept="The center is not enough"
        text="Knowing the average alone can be misleading. Two datasets can have the same mean but look completely different. We need to study spread and distribution too."
      />
    </div>
  );
}
