'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, resetAll, updateProfile } from '@/lib/storage';
import { useStoredJSON } from '@/lib/use-stored';

const CORE_FIELDS = [
  {
    key: 'belt_level',
    label: 'Belt',
    options: [
      { value: 'white', label: 'White' },
      { value: 'blue', label: 'Blue' },
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    key: 'months_training',
    label: 'Time training',
    options: [
      { value: 3, label: '0–6 months' },
      { value: 9, label: '6–12 months' },
      { value: 18, label: '1–2 years' },
      { value: 36, label: '2+ years' },
    ],
  },
  {
    key: 'training_frequency',
    label: 'Frequency',
    options: [
      { value: '1-2x', label: '1–2x per week' },
      { value: '3-4x', label: '3–4x per week' },
      { value: '5x+', label: '5x+ per week' },
    ],
  },
  {
    key: 'primary_goal',
    label: 'Main goal',
    options: [
      { value: 'survive', label: 'Survive rolling' },
      { value: 'submit', label: 'Submit people' },
      { value: 'compete', label: 'Compete' },
    ],
  },
];

const EXTENDED_FIELDS = [
  {
    key: 'gi_or_nogi',
    label: 'Gi or no-gi',
    options: [
      { value: 'gi', label: 'Mostly gi' },
      { value: 'nogi', label: 'Mostly no-gi' },
      { value: 'both', label: 'About even' },
    ],
  },
  {
    key: 'top_guard',
    label: 'Guard you play most',
    options: [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
      { value: 'half', label: 'Half' },
      { value: 'no_preference', label: 'No preference' },
    ],
  },
  {
    key: 'body_size',
    label: 'Size vs partners',
    options: [
      { value: 'smaller', label: 'Smaller' },
      { value: 'similar', label: 'Similar' },
      { value: 'bigger', label: 'Bigger' },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const stored = useStoredJSON(STORAGE_KEYS.profile, null);
  const [override, setOverride] = useState(null);
  const profile = override ?? stored;

  useEffect(() => {
    if (stored === null && override === null) {
      router.replace('/onboarding');
    }
  }, [stored, override, router]);

  if (!profile) return <Skeleton />;

  function setField(key, value) {
    setOverride(updateProfile({ [key]: value }));
  }

  function handleReset() {
    const ok = window.confirm(
      'Reset everything? This wipes your check-ins, focus history, and profile. There is no undo.',
    );
    if (!ok) return;
    resetAll();
    router.replace('/onboarding');
  }

  const hasExtended = Boolean(profile.extended_at);

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <Link
          href="/"
          className="text-xs uppercase tracking-wider text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Home
        </Link>
      </header>

      <section className="flex flex-col gap-5">
        {CORE_FIELDS.map((field) => (
          <FieldGroup
            key={field.key}
            field={field}
            value={profile[field.key]}
            onSelect={(v) => setField(field.key, v)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Personalization
        </h2>
        {hasExtended ? (
          EXTENDED_FIELDS.map((field) => (
            <FieldGroup
              key={field.key}
              field={field}
              value={profile[field.key]}
              onSelect={(v) => setField(field.key, v)}
            />
          ))
        ) : (
          <Link
            href="/onboarding/extended"
            className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-700 transition active:scale-[0.98] hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:bg-zinc-900"
          >
            Take the sharpen-your-focus questions
          </Link>
        )}
      </section>

      <button
        type="button"
        onClick={handleReset}
        className="mt-auto rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700 transition active:scale-[0.98] hover:border-red-500 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-950 dark:text-red-400 dark:hover:border-red-700"
      >
        Reset all data
      </button>
    </main>
  );
}

function FieldGroup({ field, value, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {field.label}
      </div>
      <div className="flex flex-wrap gap-2">
        {field.options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={
                active
                  ? 'rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                  : 'rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition active:scale-[0.98] hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-50'
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
