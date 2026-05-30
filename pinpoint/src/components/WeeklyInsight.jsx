'use client';

import { STORAGE_KEYS } from '@/lib/storage';
import { useStoredJSON } from '@/lib/use-stored';
import { weeklyInsight } from '@/lib/insights';
import { POSITION_LABELS } from '@/lib/focus-library';

const EMPTY_LIST = [];

export default function WeeklyInsight() {
  const checkIns = useStoredJSON(STORAGE_KEYS.checkIns, EMPTY_LIST);
  const insight = weeklyInsight(checkIns, POSITION_LABELS);
  if (!insight) return null;

  return (
    <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-snug text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      <span className="mr-1 font-semibold uppercase tracking-wider text-[10px] text-zinc-500 dark:text-zinc-400">
        This week
      </span>
      {insight.text}
    </p>
  );
}
