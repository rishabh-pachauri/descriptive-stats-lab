import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WhatDidWeLearn from '../components/shared/WhatDidWeLearn';

interface Question {
  id: number;
  type: 'mcq' | 'truefalse' | 'numerical';
  question: string;
  options?: string[];
  correct: string | number;
  tolerance?: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'A dataset contains: 20, 22, 23, 24, 25, 100. Which measure is most representative of the typical value?',
    options: ['Mean', 'Median', 'Range', 'Variance'],
    correct: 'Median',
    explanation: 'The value 100 is an outlier. The mean is pulled up to ~35.7, while the median is 23.5 — much more representative of the typical value.',
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Which dataset has greater variability?\nDataset A: [48, 49, 50, 51, 52] | Dataset B: [30, 40, 50, 60, 70]',
    options: ['Dataset A', 'Dataset B', 'They are the same'],
    correct: 'Dataset B',
    explanation: 'Dataset B has variance = 200 and SD ≈ 14.1, while Dataset A has variance = 2 and SD ≈ 1.41. Dataset B is clearly more variable.',
  },
  {
    id: 3,
    type: 'mcq',
    question: 'A dataset has positive skewness. Which direction does its long tail point?',
    options: ['Left', 'Right', 'Both directions', 'No tail'],
    correct: 'Right',
    explanation: 'Positive skew (right-skewed) means the long tail extends toward higher values — to the right.',
  },
  {
    id: 4,
    type: 'mcq',
    question: 'What does a larger standard deviation indicate?',
    options: [
      'Values are more concentrated around the mean',
      'Values are more spread out around the mean',
      'The median is larger',
      'There are no outliers',
    ],
    correct: 'Values are more spread out around the mean',
    explanation: 'A larger SD means observations deviate more from the mean on average — the data is more spread out.',
  },
  {
    id: 5,
    type: 'truefalse',
    question: 'Two datasets can have the same mean but different standard deviations.',
    options: ['True', 'False'],
    correct: 'True',
    explanation: 'Absolutely! Mean only tells us the center. SD measures spread. Two datasets with mean = 50 can have SD = 1 or SD = 20 depending on how spread out the values are.',
  },
  {
    id: 6,
    type: 'numerical',
    question: 'For the dataset [2, 4, 6, 8, 10], what is the mean?',
    correct: 6,
    tolerance: 0.01,
    explanation: 'Mean = (2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6',
  },
  {
    id: 7,
    type: 'mcq',
    question: 'Which formula correctly represents Population Variance?',
    options: ['σ² = Σ(x−μ)² / N', 's² = Σ(x−x̄)² / (n−1)', 'σ = √[Σ(x−μ)² / N]', 'Σ(x−μ) / N'],
    correct: 'σ² = Σ(x−μ)² / N',
    explanation: 'Population variance divides the sum of squared deviations by N (the total population size).',
  },
  {
    id: 8,
    type: 'mcq',
    question: 'For a left-skewed distribution, which is generally true?',
    options: ['Mean > Median', 'Mean < Median', 'Mean = Median', 'Median = 0'],
    correct: 'Mean < Median',
    explanation: 'In a left-skewed distribution, the tail extends left, pulling the mean toward lower values. So Mean < Median.',
  },
  {
    id: 9,
    type: 'numerical',
    question: 'For dataset [5, 10, 15, 20, 25], what is the Range?',
    correct: 20,
    tolerance: 0,
    explanation: 'Range = Max − Min = 25 − 5 = 20',
  },
  {
    id: 10,
    type: 'mcq',
    question: 'IQR stands for:',
    options: ['Interquartile Range', 'International Quantile Rank', 'Inner Quartile Ratio', 'Inverse Quadratic Range'],
    correct: 'Interquartile Range',
    explanation: 'IQR = Q3 − Q1, which is the range of the middle 50% of the data.',
  },
  {
    id: 11,
    type: 'truefalse',
    question: 'An outlier in a dataset is always a data entry error.',
    options: ['True', 'False'],
    correct: 'False',
    explanation: 'Outliers can be genuine rare events, measurement errors, OR valid unusual observations. Never automatically remove an outlier without investigation.',
  },
  {
    id: 12,
    type: 'mcq',
    question: 'You are asked to compare the spread of two datasets. Which measure would be most informative?',
    options: ['Mean', 'Median', 'Mode', 'Standard Deviation'],
    correct: 'Standard Deviation',
    explanation: 'Standard deviation directly measures how spread out values are around the mean. Mean, Median, and Mode only describe center, not spread.',
  },
  {
    id: 13,
    type: 'mcq',
    question: 'For dataset [4, 4, 6, 8, 8], what best describes the mode?',
    options: ['4 only', '8 only', 'No mode', 'Bimodal (4 and 8)'],
    correct: 'Bimodal (4 and 8)',
    explanation: 'Both 4 and 8 appear twice. This is a bimodal dataset — it has two modes.',
  },
  {
    id: 14,
    type: 'mcq',
    question: 'The Lower Fence for outlier detection using the Tukey method is:',
    options: ['Q1 − 1.5 × IQR', 'Q1 + 1.5 × IQR', 'Q3 − 1.5 × IQR', 'Median − 1.5 × SD'],
    correct: 'Q1 − 1.5 × IQR',
    explanation: 'Tukey fences: Lower = Q1 − 1.5×IQR, Upper = Q3 + 1.5×IQR. Points outside these are potential outliers.',
  },
  {
    id: 15,
    type: 'mcq',
    question: 'A professor reports that the average salary of graduates is $150,000. A student says "But most graduates earn around $60,000". What might explain this discrepancy?',
    options: [
      'The professor is wrong',
      'A few very high earners are pulling the mean up',
      'The median is always wrong',
      'Standard deviation is zero',
    ],
    correct: 'A few very high earners are pulling the mean up',
    explanation: 'In right-skewed distributions (like income), a few very high values pull the mean upward. The median ($60,000) better represents the typical graduate salary.',
  },
];

function isCorrect(q: Question, ans: string): boolean {
  if (q.type === 'numerical') {
    const num = parseFloat(ans);
    if (isNaN(num)) return false;
    return Math.abs(num - (q.correct as number)) <= (q.tolerance ?? 0);
  }
  return ans.trim() === String(q.correct);
}

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 13) return { text: 'Excellent! Outstanding work! 🏆', color: 'text-green-700 bg-green-50 border-green-200' };
  if (score >= 10) return { text: 'Great work! Keep it up! 👏', color: 'text-brand-700 bg-brand-50 border-brand-200' };
  if (score >= 7) return { text: 'Good effort! Review a few concepts. 📖', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { text: 'Review the modules and try again. 💪', color: 'text-red-700 bg-red-50 border-red-200' };
}

export default function Practice() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const score = useMemo(
    () => (submitted ? QUESTIONS.filter((q) => isCorrect(q, answers[q.id] ?? '')).length : 0),
    [submitted, answers]
  );

  const handleAnswer = (id: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setShowExplanations(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { text: scoreText, color: scoreColor } = useMemo(() => scoreLabel(score), [score]);

  return (
    <div className="module-container">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Practice Quiz</h1>
        <p className="mt-1 text-lg text-gray-500">Test your understanding of Descriptive Statistics</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Module 11 of 12</span>
          <span className="text-xs text-gray-400">15 questions</span>
        </div>
      </div>

      {/* Score banner */}
      {submitted && (
        <div className={`animate-scale-in border-2 rounded-xl p-5 text-center ${scoreColor}`}>
          <p className="text-3xl font-bold mb-1">{score} / 15</p>
          <p className="text-lg font-semibold">{scoreText}</p>
          <div className="flex gap-3 justify-center mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowExplanations((v) => !v)}>
              {showExplanations ? 'Hide Explanations' : 'Show Explanations'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRetake}>
              ↺ Retake Quiz
            </Button>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {QUESTIONS.map((q, idx) => {
          const userAns = answers[q.id] ?? '';
          const correct = submitted ? isCorrect(q, userAns) : null;

          return (
            <Card
              key={q.id}
              className={`transition-all ${submitted ? (correct ? 'border border-green-300' : 'border border-red-300') : ''}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    submitted
                      ? correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {idx + 1}
                </span>
                <p className="font-medium text-gray-800 text-sm whitespace-pre-line">{q.question}</p>
              </div>

              {/* MCQ / TrueFalse */}
              {(q.type === 'mcq' || q.type === 'truefalse') && q.options && (
                <div className="space-y-2 pl-10">
                  {q.options.map((opt) => {
                    const selected = userAns === opt;
                    const isCorrectOpt = String(q.correct) === opt;
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
                          name={`q-${q.id}`}
                          value={opt}
                          checked={selected}
                          onChange={() => handleAnswer(q.id, opt)}
                          disabled={submitted}
                          className="accent-indigo-600"
                        />
                        <span className="text-sm">{opt}</span>
                        {submitted && isCorrectOpt && <span className="ml-auto text-green-600 text-xs font-bold">✓ Correct</span>}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Numerical */}
              {q.type === 'numerical' && (
                <div className="pl-10">
                  <input
                    type="number"
                    step="any"
                    value={userAns}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    disabled={submitted}
                    placeholder="Enter your answer..."
                    className={`border rounded-xl px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                      submitted
                        ? correct
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : 'border-red-400 bg-red-50 text-red-800'
                        : 'border-gray-300'
                    }`}
                  />
                  {submitted && !correct && (
                    <p className="text-xs text-red-600 mt-1">Correct answer: {String(q.correct)}</p>
                  )}
                </div>
              )}

              {/* Explanation */}
              {submitted && showExplanations && (
                <div className={`mt-3 ml-10 rounded-xl p-3 text-sm ${correct ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < QUESTIONS.length}
          >
            Submit Quiz ({Object.keys(answers).length}/{QUESTIONS.length} answered)
          </Button>
          {Object.keys(answers).length < QUESTIONS.length && (
            <p className="text-xs text-gray-400">Answer all {QUESTIONS.length} questions to submit.</p>
          )}
        </div>
      )}

      {submitted && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleRetake}>↺ Retake Quiz</Button>
        </div>
      )}

      <WhatDidWeLearn
        concept="Practice Quiz"
        text="You have tested your understanding of descriptive statistics concepts: center, spread, distribution, skewness, box plots, and outlier detection."
      />
    </div>
  );
}
