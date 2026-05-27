'use client';

import { useState } from 'react';

const QUESTIONS = [
  {
    key: 'got_tapped',
    prompt: 'Did you get tapped?',
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
  },
  {
    key: 'position_lost',
    prompt: 'Where did it happen?',
    options: [
      { value: 'guard', label: 'Guard' },
      { value: 'side_control', label: 'Side Control' },
      { value: 'back', label: 'Back' },
      { value: 'mount', label: 'Mount' },
      { value: 'standing', label: 'Standing' },
    ],
    // Skip this question if the user wasn't tapped.
    skipIf: (answers) => answers.got_tapped === false,
  },
  {
    key: 'attempted_focus',
    prompt: "Did you attempt tonight's focus?",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'tried', label: 'Tried' },
      { value: 'forgot', label: 'Forgot' },
    ],
  },
  {
    key: 'overall_feeling',
    prompt: 'How did you feel overall?',
    options: [
      { value: 'lost', label: 'Lost the whole time' },
      { value: 'some_moments', label: 'Had some moments' },
      { value: 'felt_decent', label: 'Felt decent' },
    ],
  },
];

export default function CheckInForm({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  function handleAnswer(option) {
    const question = QUESTIONS[step];
    const nextAnswers = { ...answers, [question.key]: option.value };

    // Find the next non-skipped question.
    let next = step + 1;
    while (next < QUESTIONS.length && QUESTIONS[next].skipIf?.(nextAnswers)) {
      nextAnswers[QUESTIONS[next].key] = null;
      next += 1;
    }

    if (next >= QUESTIONS.length) {
      onComplete?.(nextAnswers);
      return;
    }

    setAnswers(nextAnswers);
    setStep(next);
  }

  const question = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-zinc-900 transition-all dark:bg-zinc-50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => handleAnswer(opt)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left text-base font-medium text-zinc-900 transition active:scale-[0.98] hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-50 dark:hover:bg-zinc-900"
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mt-auto text-center text-xs text-zinc-500 dark:text-zinc-400">
        Step {step + 1} of {QUESTIONS.length}
      </p>
    </div>
  );
}
