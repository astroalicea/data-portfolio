// Display-layer analytics over the check-in stream.
// Kept separate from `focus.js` (which is for selection logic) so the
// home-screen insights can evolve without coupling to the engine.

const DAY_MS = 24 * 60 * 60 * 1000;

function withinDays(iso, days) {
  if (!iso) return false;
  const cutoff = Date.now() - days * DAY_MS;
  return new Date(iso).getTime() >= cutoff;
}

export function recentCheckIns(checkIns, days = 30) {
  return checkIns.filter((c) => withinDays(c.created_at, days));
}

// Most common position the user got tapped from in the window.
// Returns the raw position key (e.g. 'guard') or null if no taps recorded.
export function topTapPosition(checkIns) {
  const positions = checkIns
    .filter((c) => c.got_tapped && c.position_lost)
    .map((c) => c.position_lost);
  if (!positions.length) return null;
  const counts = positions.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// Fraction of check-ins where the user attempted the focus (yes or tried).
// Returns null when there are no check-ins to score.
export function attemptRate(checkIns) {
  if (!checkIns.length) return null;
  const attempts = checkIns.filter(
    (c) => c.attempted_focus === 'yes' || c.attempted_focus === 'tried',
  );
  return attempts.length / checkIns.length;
}

// One short observation about the user's last 7 days. Priority cascade:
// praise consistent attempt → nudge low attempt → surface a tap pattern →
// celebrate sessions logged. Returns null when no check-ins this week.
//
// `positionLabels` is injected so this module stays free of UI imports;
// callers pass POSITION_LABELS from focus-library.
export function weeklyInsight(checkIns, positionLabels = {}) {
  const window = recentCheckIns(checkIns, 7);
  const n = window.length;
  if (n === 0) return null;

  const attempts = window.filter(
    (c) => c.attempted_focus === 'yes' || c.attempted_focus === 'tried',
  ).length;
  const rate = attempts / n;

  const tapCounts = window
    .filter((c) => c.got_tapped && c.position_lost)
    .reduce((acc, c) => {
      acc[c.position_lost] = (acc[c.position_lost] || 0) + 1;
      return acc;
    }, {});
  const topTap = Object.entries(tapCounts).sort((a, b) => b[1] - a[1])[0];

  if (rate >= 0.75 && n >= 3) {
    return {
      tone: 'praise',
      text: `You attempted the focus ${attempts} of ${n} sessions this week. That's the habit.`,
    };
  }
  if (rate < 0.5 && n >= 2) {
    return {
      tone: 'nudge',
      text: `You attempted the focus ${attempts} of ${n} sessions. Try to keep it in mind tonight.`,
    };
  }
  if (topTap && topTap[1] >= 2) {
    const [pos, count] = topTap;
    const label = positionLabels[pos] || pos;
    return {
      tone: 'pattern',
      text: `You got tapped from ${label} ${count} times this week. That's where to focus.`,
    };
  }
  if (n >= 3) {
    return {
      tone: 'streak',
      text: `${n} sessions logged this week. Consistency is the engine.`,
    };
  }
  return {
    tone: 'streak',
    text: `${n} ${n === 1 ? 'session' : 'sessions'} this week. Show up again.`,
  };
}
