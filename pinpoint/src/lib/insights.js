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
