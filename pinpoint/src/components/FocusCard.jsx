import { AREA_LABELS } from '@/lib/focus-library';

export default function FocusCard({ focus }) {
  if (!focus) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        Loading your focus...
      </div>
    );
  }

  const areaLabel = AREA_LABELS[focus.area] || focus.area;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tonight&apos;s focus
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
          {areaLabel}
        </span>
      </div>
      <p className="text-xl leading-relaxed text-zinc-900 sm:text-2xl dark:text-zinc-50">
        {focus.focus_text}
      </p>
    </section>
  );
}
