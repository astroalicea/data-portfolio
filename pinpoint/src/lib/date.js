// Pure date helpers. All date math uses local time so a "training day"
// matches the user's calendar day, not UTC.

export function startOfLocalDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function todayKey() {
  const d = startOfLocalDay(new Date());
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Streak = count of consecutive distinct local days with at least one check-in,
// counting back from today (or yesterday if no check-in today yet).
export function computeStreak(checkIns) {
  if (!checkIns?.length) return 0;
  const days = new Set(
    checkIns.map((c) => {
      const d = startOfLocalDay(c.created_at);
      return d.getTime();
    }),
  );

  const today = startOfLocalDay(new Date()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  let cursor = days.has(today) ? today : today - oneDay;
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= oneDay;
  }
  return streak;
}

export function daysSince(iso) {
  const then = startOfLocalDay(iso).getTime();
  const now = startOfLocalDay(new Date()).getTime();
  return Math.floor((now - then) / (24 * 60 * 60 * 1000));
}
