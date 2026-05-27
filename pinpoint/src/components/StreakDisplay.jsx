'use client';

import { getCheckIns } from '@/lib/storage';
import { useStoredValue } from '@/lib/use-stored';
import { computeStreak } from '@/lib/date';

const EMPTY = [];

export default function StreakDisplay() {
  const checkIns = useStoredValue(getCheckIns, EMPTY);
  const streak = computeStreak(checkIns);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Stat label="Day streak" value={streak} />
      <Stat label="Total check-ins" value={checkIns.length} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
    </div>
  );
}
