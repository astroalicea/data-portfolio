'use client';

import Link from 'next/link';
import { useState } from 'react';
import { snoozeExtendedProfile } from '@/lib/storage';

export default function SharpenFocusCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  function handleLater() {
    snoozeExtendedProfile(7);
    setDismissed(true);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Sharpen your focus
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Three quick questions to make tonight&apos;s focus more personal.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          href="/onboarding/extended"
          className="flex-1 rounded-xl bg-zinc-900 px-4 py-3 text-center text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start
        </Link>
        <button
          type="button"
          onClick={handleLater}
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-sm font-medium text-zinc-700 transition active:scale-[0.98] hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:bg-zinc-900"
        >
          Maybe later
        </button>
      </div>
    </section>
  );
}
