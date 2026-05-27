'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CheckInForm from '@/components/CheckInForm';
import { addCheckIn, getProfile } from '@/lib/storage';
import { useStoredValue } from '@/lib/use-stored';

export default function CheckInPage() {
  const router = useRouter();
  const profile = useStoredValue(getProfile, null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (profile === null) {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  function handleComplete(answers) {
    addCheckIn(answers);
    setDone(true);
  }

  if (!profile) return null;

  if (done) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="text-4xl">✓</div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Logged. Rest up.
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your next focus will be ready before your next session.
        </p>
        <Link
          href="/"
          className="mt-4 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Check-in
        </h1>
        <Link
          href="/"
          className="text-xs text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Cancel
        </Link>
      </header>
      <CheckInForm onComplete={handleComplete} />
    </main>
  );
}
