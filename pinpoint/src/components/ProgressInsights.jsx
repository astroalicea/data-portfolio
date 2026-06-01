'use client';

import { STORAGE_KEYS } from '@/lib/storage';
import { useStoredJSON } from '@/lib/use-stored';
import { attemptRate, recentCheckIns, topTapPosition } from '@/lib/insights';
import { POSITION_LABELS } from '@/lib/focus-library';

const EMPTY_LIST = [];

export default function ProgressInsights() {
  const checkIns = useStoredJSON(STORAGE_KEYS.checkIns, EMPTY_LIST);
  if (!checkIns.length) return null;

  const window = recentCheckIns(checkIns, 30);
  const topPosition = topTapPosition(window);
  const rate = attemptRate(window);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Last 30 days
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <Insight
          label="Got tapped from"
          value={topPosition ? POSITION_LABELS[topPosition] : '—'}
          hint={topPosition ? 'Most often' : 'No taps yet'}
        />
        <Insight
          label="Focus attempt"
          value={rate == null ? '—' : `${Math.round(rate * 100)}%`}
          hint={rate == null ? 'No data yet' : 'Of sessions'}
        />
      </div>
    </section>
  );
}

function Insight({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{hint}</div>
    </div>
  );
}
