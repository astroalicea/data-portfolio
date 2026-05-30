'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import FocusCard from '@/components/FocusCard';
import ProgressInsights from '@/components/ProgressInsights';
import SharpenFocusCard from '@/components/SharpenFocusCard';
import StreakDisplay from '@/components/StreakDisplay';
import WeeklyInsight from '@/components/WeeklyInsight';
import { getFocusForUser } from '@/lib/focus';
import { STORAGE_KEYS, recordFocusDelivered } from '@/lib/storage';
import { todayKey } from '@/lib/date';
import { useStoredJSON } from '@/lib/use-stored';

const EMPTY_LIST = [];

export default function HomePage() {
  const router = useRouter();
  const profile = useStoredJSON(STORAGE_KEYS.profile, null);
  const checkIns = useStoredJSON(STORAGE_KEYS.checkIns, EMPTY_LIST);
  const history = useStoredJSON(STORAGE_KEYS.focusHistory, EMPTY_LIST);

  const focus = useMemo(() => {
    if (!profile) return null;
    const today = todayKey();
    const todays = history.find((h) => sameLocalDay(h.delivered_at, today));
    if (todays) {
      return {
        focus_text: todays.focus_text,
        area: todays.focus_area,
        belt_level: todays.belt_level,
      };
    }
    const seed = hashKey(today + profile.belt_level);
    return getFocusForUser(profile, checkIns, seed);
  }, [profile, checkIns, history]);

  useEffect(() => {
    if (profile === null) {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  useEffect(() => {
    if (!profile || !focus) return;
    const today = todayKey();
    const alreadyLogged = history.some((h) => sameLocalDay(h.delivered_at, today));
    if (!alreadyLogged) {
      recordFocusDelivered(focus);
    }
  }, [profile, focus, history]);

  if (!profile) return <Skeleton />;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          PinPoint
        </h1>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span className="text-zinc-500 dark:text-zinc-400">
            {beltLabel(profile.belt_level)} belt
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <Link
            href="/settings"
            className="text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Settings
          </Link>
        </div>
      </header>

      <FocusCard focus={focus} />

      {shouldShowSharpenCard(profile, checkIns) && <SharpenFocusCard />}

      <StreakDisplay />

      <WeeklyInsight />

      <ProgressInsights />

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Link
          href="/checkin"
          className="block w-full rounded-xl bg-zinc-900 px-5 py-4 text-center text-base font-semibold text-white transition active:scale-[0.98] hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          I just finished training
        </Link>
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          Phone away. Train. Come back when you&apos;re done.
        </p>
      </div>
    </main>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function beltLabel(belt) {
  return belt.charAt(0).toUpperCase() + belt.slice(1);
}

function sameLocalDay(iso, key) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` === key;
}

function shouldShowSharpenCard(profile, checkIns) {
  if (!profile) return false;
  if (checkIns.length < 3) return false;
  if (profile.extended_at) return false;
  if (
    profile.extended_dismissed_until &&
    new Date(profile.extended_dismissed_until) > new Date()
  ) {
    return false;
  }
  return true;
}

function hashKey(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
