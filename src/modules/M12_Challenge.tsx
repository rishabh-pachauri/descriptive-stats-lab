import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';
import ReflectionBox from '../components/shared/ReflectionBox';
import NumberLine from '../components/charts/NumberLine';
import BoxPlotChart from '../components/charts/BoxPlotChart';
import { mean, median, mode, dataRange, populationVariance, populationSD, fiveNumberSummary, fmt } from '../utils/stats';

const DATASET = [12, 15, 18, 18, 20, 21, 22, 24, 28, 31, 35, 60];

interface Task {
  id: number;
  label: string;
  type: 'number' | 'mcq' | 'reflection' | 'boxplot';
  options?: string[];
  correct?: string | number;
  tolerance?: number;
  hint?: string;
}

const TASKS: Task[] = [
  { id: 1, label: 'Find the Mean', type: 'number', correct: 25.33, tolerance: 0.1, hint: 'Sum all values and divide by 12.' },
  { id: 2, label: 'Find the Median', type: 'number', correct: 21.5, tolerance: 0.1, hint: 'Sort the data and find the average of the 6th and 7th values.' },
  { id: 3, label: 'Find the Mode', type: 'mcq', options: ['18', '21', 'No mode', '60'], correct: '18', hint: '18 appears twice; all other values appear once.' },
  { id: 4, label: 'Find the Range', type: 'number', correct: 48, tolerance: 0, hint: 'Range = Max − Min = 60 − 12.' },
  { id: 5, label: 'Find the Population Variance (σ²)', type: 'number', correct: 148.89, tolerance: 1.0, hint: 'Compute the average of squared deviations from the mean.' },
  { id: 6, label: 'Find the Population Standard Deviation (σ)', type: 'number', correct: 12.20, tolerance: 0.1, hint: 'σ = √σ²' },
  { id: 7, label: 'Describe the distribution shape', type: 'mcq', options: ['Symmetric', 'Right-skewed', 'Left-skewed', 'Uniform'], correct: 'Right-skewed', hint: 'Mean (25.33) > Median (21.5) — the mean is pulled up by 60.' },
  { id: 8, label: 'Is 60 a potential outlier?', type: 'mcq', options: ['Yes, it is beyond the upper fence', 'No, it is within normal range', 'Cannot determine'], correct: 'Yes, it is beyond the upper fence', hint: 'Compute the upper fence using Q3 + 1.5×IQR.' },
  { id: 9, label: 'What does the box plot tell you about the data?', type: 'reflection' },
  { id: 10, label: 'Write a 2-3 sentence conclusion about this dataset.', type: 'reflection' },
];

const GRADED_COUNT = 8;

function isTaskCorrect(task: Task, ans: string): boolean {
  if (task.type === 'number') {
    const num = parseFloat(ans);
    if (isNaN(num)) return false;
    return Math.abs(num - (task.correct as number)) <= (task.tolerance ?? 0);
  }
  if (task.type === 'mcq') return ans === task.correct;
  return true; // reflections always "pass"
}

export default function Challenge() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Pre-compute stats
  const dataMean = useMemo(() => mean(DATASET), []);
  const dataMedian = useMemo(() => median(DATASET), []);
  const dataMode = useMemo(() => mode(DATASET), []);
  const dataRange = useMemo(() => Math.max(...DATASET) - Math.min(...DATASET), []);
  const dataPopVar = useMemo(() => populationVariance(DATASET), []);
  const dataPopSD = useMemo(() => populationSD(DATASET), []);
  const fns = useMemo(() => fiveNumberSummary(DATASET), []);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return TASKS.filter((t) => t.id <= GRADED_COUNT && isTaskCorrect(t, answers[t.id] ?? '')).length;
  }, [submitted, answers]);

  const handleChange = (id: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setShowReport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gradedAnswered = TASKS.filter((t) => t.id <= GRADED_COUNT && answers[t.id] !== undefined && answers[t.id] !== '').length;

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Final Challenge — Be the Data Scientist!</h1>
        <p className="mt-1 text-lg text-gray-500">Apply everything you have learned to a new dataset</p>
        <div className="mt-2">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 12 of 12</span>
        </div>
      </div>

      {/* Score Banner */}
      {submitted && (
        <div className={`animate-scale-in border-2 rounded-xl p-5 text-center ${score >= 6 ? 'bg-green-50 border-green-300 text-green-800' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
          <p className="text-3xl font-bold mb-1">{score} / {GRADED_COUNT}</p>
          <p className="text-lg font-semibold">
            {score >= 6 ? '🏆 Excellent analysis!' : '📖 Good effort — review the hints and try again!'}
          </p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={handleRetake}>
            ↺ Retake Challenge
          </Button>
        </div>
      )}

      {/* Dataset Display */}
      <Card className="animate-slide-up">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Your Dataset</h2>
        <p className="text-sm text-gray-500 mb-3">
          📱 You are analyzing the <strong>daily screen time (hours)</strong> of 12 students.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {DATASET.map((v, i) => (
            <span key={i} className="bg-brand-50 text-brand-700 font-bold text-sm px-3 py-1 rounded-full">{v}</span>
          ))}
        </div>

        <NumberLine
          datasets={[{ name: 'Screen Time (hrs)', values: DATASET, color: '#6366f1' }]}
          showMean
          showMedian
          min={0}
          max={70}
        />
      </Card>

      {/* Tasks */}
      <div className="space-y-4">
        {TASKS.map((task) => {
          const userAns = answers[task.id] ?? '';
          const graded = task.id <= GRADED_COUNT;
          const correct = submitted && graded ? isTaskCorrect(task, userAns) : null;

          return (
            <Card
              key={task.id}
              className={submitted && graded ? (correct ? 'border border-green-300' : 'border border-red-300') : ''}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    submitted && graded
                      ? correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {task.id}
                </span>
                <p className="font-semibold text-gray-800">{task.label}</p>
              </div>

              <div className="pl-10">
                {/* Number input */}
                {task.type === 'number' && (
                  <div>
                    <input
                      type="number"
                      step="any"
                      value={userAns}
                      onChange={(e) => handleChange(task.id, e.target.value)}
                      disabled={submitted}
                      placeholder="Your answer..."
                      className={`border rounded-xl px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                        submitted
                          ? correct
                            ? 'border-green-400 bg-green-50 text-green-800'
                            : 'border-red-400 bg-red-50 text-red-800'
                          : 'border-gray-300'
                      }`}
                    />
                    {submitted && !correct && (
                      <p className="text-xs text-red-600 mt-1">Correct answer: {String(task.correct)} &nbsp;|&nbsp; Hint: {task.hint}</p>
                    )}
                    {submitted && correct && (
                      <p className="text-xs text-green-600 mt-1">✅ Correct!</p>
                    )}
                  </div>
                )}

                {/* MCQ */}
                {task.type === 'mcq' && task.options && (
                  <div className="space-y-2">
                    {task.options.map((opt) => {
                      const selected = userAns === opt;
                      const isCorrectOpt = String(task.correct) === opt;
                      let bg = 'bg-gray-50 border-gray-200 text-gray-700';
                      if (selected && !submitted) bg = 'bg-brand-50 border-brand-400 text-brand-800';
                      if (submitted && selected && correct) bg = 'bg-green-50 border-green-400 text-green-800';
                      if (submitted && selected && !correct) bg = 'bg-red-50 border-red-400 text-red-800';
                      if (submitted && !selected && isCorrectOpt) bg = 'bg-green-50 border-green-300 text-green-700';
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 border rounded-xl px-3 py-2 cursor-pointer transition-colors ${bg} ${submitted ? 'cursor-default' : 'hover:bg-brand-50 hover:border-brand-300'}`}
                        >
                          <input
                            type="radio"
                            name={`task-${task.id}`}
                            value={opt}
                            checked={selected}
                            onChange={() => handleChange(task.id, opt)}
                            disabled={submitted}
                            className="accent-indigo-600"
                          />
                          <span className="text-sm">{opt}</span>
                          {submitted && isCorrectOpt && <span className="ml-auto text-green-600 text-xs font-bold">✓</span>}
                        </label>
                      );
                    })}
                    {submitted && !correct && (
                      <p className="text-xs text-red-600 mt-1">Hint: {task.hint}</p>
                    )}
                  </div>
                )}

                {/* Box Plot task */}
                {task.type === 'reflection' && task.id === 9 && (
                  <div className="space-y-3">
                    <BoxPlotChart datasets={[{ name: 'Screen Time', values: DATASET, color: '#6366f1' }]} showOutliers />
                    <textarea
                      value={userAns}
                      onChange={(e) => handleChange(task.id, e.target.value)}
                      disabled={submitted}
                      rows={3}
                      placeholder="What does the box plot tell you about the data? (Optional — free response)"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                    />
                  </div>
                )}

                {/* Conclusion reflection */}
                {task.type === 'reflection' && task.id === 10 && (
                  <textarea
                    value={userAns}
                    onChange={(e) => handleChange(task.id, e.target.value)}
                    disabled={submitted}
                    rows={4}
                    placeholder="Write your 2-3 sentence conclusion about this dataset..."
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <div className="flex flex-col items-center gap-2">
          <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
            Submit Analysis ({gradedAnswered}/{GRADED_COUNT} graded tasks answered)
          </Button>
          {gradedAnswered < GRADED_COUNT && (
            <p className="text-xs text-gray-400">Answer all {GRADED_COUNT} graded tasks before submitting.</p>
          )}
        </div>
      )}

      {/* Data Scientist Report */}
      {showReport && (
        <Card variant="accent" className="animate-scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">📊 Your Data Scientist Report</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            The dataset has a mean of <strong>{fmt(dataMean, 2)} hours</strong> and a median of <strong>{fmt(dataMedian, 1)} hours</strong>. The mode is <strong>{dataMode.join(', ')} hours</strong> (appears twice). The distribution appears <strong>right-skewed</strong>, as the mean is significantly higher than the median. The standard deviation is approximately <strong>{fmt(dataPopSD, 2)} hours</strong>, indicating moderate spread. Based on the Tukey fence analysis (Upper fence = {fmt(fns.upperFence, 2)}), <strong>60 hours is identified as a potential outlier</strong> — worth investigating whether this is a genuine data point or a recording error.
          </p>

          {answers[10] && (
            <div className="mt-4 border-l-4 border-brand-400 bg-brand-50 rounded-r-xl p-4">
              <p className="text-xs font-semibold text-brand-600 mb-1">Your Conclusion:</p>
              <p className="text-gray-700 text-sm italic">{answers[10]}</p>
            </div>
          )}
        </Card>
      )}

      {/* Completion card */}
      {submitted && score >= 6 && (
        <Card variant="success" className="animate-scale-in text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h2>
          <p className="text-green-700 text-sm">
            You have successfully completed the Descriptive Statistics module. You can now calculate and interpret{' '}
            <strong>mean, median, mode, range, variance, standard deviation, skewness, and box plots</strong> for real datasets!
          </p>
        </Card>
      )}

      {submitted && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleRetake}>↺ Retake Challenge</Button>
        </div>
      )}

      <WhatDidWeLearn
        concept="Descriptive Statistics"
        text="You have now mastered the complete toolkit of Descriptive Statistics: Center (Mean, Median, Mode), Spread (Range, Variance, SD, IQR), Shape (Skewness), and Visualization (Box Plot, Histogram). Well done!"
      />
    </div>
  );
}
