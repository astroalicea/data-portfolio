'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, updateProfile } from '@/lib/storage';
import { useStoredJSON } from '@/lib/use-stored';

const STEPS = [
  {
    key: 'gi_or_nogi',
    prompt: 'Gi or no-gi?',
    options: [
      { value: 'gi', label: 'Mostly gi' },
      { value: 'nogi', label: 'Mostly no-gi' },
      { value: 'both', label: 'About even' },
    ],
  },
  {
    key: 'top_guard',
    prompt: 'Which guard do you play most?',
    options: [
      { value: 'open', label: 'Open guard' },
      { value: 'closed', label: 'Closed guard' },
      { value: 'half', label: 'Half guard' },
      { value: 'no_preference', label: 'No preference yet' },
    ],
  },
  {
    key: 'body_size',
    prompt: 'Compared to your usual training partners, you are…',
    options: [
      { value: 'smaller', label: 'Smaller than most' },
      { value: 'similar', label: 'About the same size' },
      { value: 'bigger', label: 'Bigger than most' },
    ],
  },
];

export default function ExtendedOnboardingPage() {
  const router = useRouter();
  const profile = useStoredJSON(STORAGE_KEYS.profile, null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (profile === null) {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  function handleAnswer(option) {
    const current = STEPS[step];
    const next = { ...answers, [current.key]: option.value };
    if (step + 1 >= STEPS.length) {
      updateProfile({ ...next, extended_at: new Date().toISOString() });
      router.replace('/');
      return;
    }
    setAnswers(next);
    setStep(step + 1);
  }

  if (!profile) return null;

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sharpen your focus
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Three quick taps to make tonight&apos;s focus more personal.
        </p>
      </header>

      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-zinc-900 transition-all dark:bg-zinc-50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {current.prompt}
      </h2>

      <div className="flex flex-col gap-3">
        {current.options.map((opt) => (
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
        Step {step + 1} of {STEPS.length}
      </p>
    </main>
  );
}
