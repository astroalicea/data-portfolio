'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfile, saveProfile, syncFromSupabase } from '@/lib/storage';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

const STEPS = [
  {
    key: 'belt_level',
    prompt: "What's your belt?",
    options: [
      { value: 'white', label: 'White' },
      { value: 'blue', label: 'Blue' },
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    key: 'months_training',
    prompt: 'How long have you been training?',
    options: [
      { value: 3, label: '0–6 months' },
      { value: 9, label: '6–12 months' },
      { value: 18, label: '1–2 years' },
      { value: 36, label: '2+ years' },
    ],
  },
  {
    key: 'training_frequency',
    prompt: 'How often do you train?',
    options: [
      { value: '1-2x', label: '1–2x per week' },
      { value: '3-4x', label: '3–4x per week' },
      { value: '5x+', label: '5x+ per week' },
    ],
  },
  {
    key: 'primary_goal',
    prompt: "What's your main goal right now?",
    options: [
      { value: 'survive', label: 'Survive rolling' },
      { value: 'submit', label: 'Submit people' },
      { value: 'compete', label: 'Compete' },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // If a signed-in user lands here without local data (new device), pull
  // their profile from Supabase first. If they already have one remotely,
  // skip the wizard and route home so we don't overwrite their answers.
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabase();
    if (!sb) return;
    let cancelled = false;
    sb.auth.getSession().then(({ data }) => {
      if (!data.session || cancelled) return;
      syncFromSupabase().then(() => {
        if (cancelled) return;
        if (getProfile()) router.replace('/');
      });
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleAnswer(option) {
    const current = STEPS[step];
    const next = { ...answers, [current.key]: option.value };
    if (step + 1 >= STEPS.length) {
      saveProfile({ ...next, created_at: new Date().toISOString() });
      router.replace('/');
      return;
    }
    setAnswers(next);
    setStep(step + 1);
  }

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome to PinPoint
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Four questions so we can give you the right focus.
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
