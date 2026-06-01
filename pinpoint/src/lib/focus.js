import { focusLibrary, POSITION_TO_AREA } from './focus-library';

const COLD_START_AREAS = {
  white: {
    early: ['surviving_pressure', 'back_defense'],
    later: ['guard_retention', 'mount_escape', 'side_control_escape'],
  },
  blue: {
    early: ['passing', 'back_attacks'],
    later: ['sweeps', 'submissions', 'pressure_control'],
  },
  purple: {
    early: ['transitions', 'timing'],
    later: ['weak_side'],
  },
};

const FEELING_TO_DIFFICULTY_BIAS = {
  lost: 'beginner',
  some_moments: 'intermediate',
  felt_decent: null,
};

function pickOne(list, seed = Date.now()) {
  if (!list.length) return null;
  const index = Math.abs(Math.floor(seed)) % list.length;
  return list[index];
}

function filterByLevelAndArea(beltLevel, area, difficulty) {
  return focusLibrary.filter((f) => {
    if (f.belt_level !== beltLevel) return false;
    if (area && f.area !== area) return false;
    if (difficulty && f.difficulty !== difficulty) return false;
    return true;
  });
}

// Hard compatibility: only filters when the entry explicitly demands gi or
// no-gi AND the user has answered. Untagged entries are universally compatible.
function compatibleWithProfile(focus, profile) {
  if (!profile) return true;
  if (focus.requires_gi && profile.gi_or_nogi === 'nogi') return false;
  if (focus.requires_nogi && profile.gi_or_nogi === 'gi') return false;
  return true;
}

// Soft preference. Entries without these tags score 0, so users who haven't
// completed the extended onboarding see the same behavior as before.
function softScore(focus, profile) {
  if (!profile) return 0;
  let score = 0;
  if (
    focus.guard_type &&
    profile.top_guard &&
    profile.top_guard !== 'no_preference' &&
    focus.guard_type === profile.top_guard
  ) {
    score += 2;
  }
  if (focus.body_size_bias && profile.body_size && focus.body_size_bias === profile.body_size) {
    score += 2;
  }
  return score;
}

// Filter candidates by hard constraints, then pick deterministically from the
// highest-scoring tier using the seed. Falls back to the unfiltered list if
// the gi filter empties the pool — preferring an off-tag focus over nothing.
function pickForProfile(candidates, profile, seed) {
  if (!candidates.length) return null;
  let pool = candidates.filter((f) => compatibleWithProfile(f, profile));
  if (!pool.length) pool = candidates;
  const scored = pool.map((f) => ({ focus: f, score: softScore(f, profile) }));
  const top = scored.reduce((max, s) => (s.score > max ? s.score : max), 0);
  const best = scored.filter((s) => s.score === top).map((s) => s.focus);
  return pickOne(best, seed);
}

function identifyProblemArea(recentCheckIns) {
  const positions = recentCheckIns
    .filter((c) => c.got_tapped && c.position_lost)
    .map((c) => c.position_lost);
  if (!positions.length) return null;
  const counts = positions.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return POSITION_TO_AREA[top[0]] || null;
}

function calculateAttemptRate(recentCheckIns) {
  if (!recentCheckIns.length) return 1;
  const attempts = recentCheckIns.filter(
    (c) => c.attempted_focus === 'yes' || c.attempted_focus === 'tried',
  );
  return attempts.length / recentCheckIns.length;
}

function dominantFeeling(recentCheckIns) {
  if (!recentCheckIns.length) return null;
  const counts = recentCheckIns.reduce((acc, c) => {
    acc[c.overall_feeling] = (acc[c.overall_feeling] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top[0];
}

function getColdStartFocus(profile, seed) {
  const beltLevel = profile.belt_level;
  const buckets = COLD_START_AREAS[beltLevel] || COLD_START_AREAS.white;
  const pool = profile.months_training < 6 ? buckets.early : [...buckets.early, ...buckets.later];
  const area = pickOne(pool, seed);
  const candidates = filterByLevelAndArea(beltLevel, area, 'beginner');
  if (candidates.length) return pickForProfile(candidates, profile, seed);
  return pickForProfile(filterByLevelAndArea(beltLevel, area), profile, seed);
}

function getSimplerFocus(profile, area, seed) {
  const beltLevel = profile.belt_level;
  const candidates = filterByLevelAndArea(beltLevel, area, 'beginner');
  if (candidates.length) return pickForProfile(candidates, profile, seed);
  return pickForProfile(filterByLevelAndArea(beltLevel, area), profile, seed);
}

function getTargetedFocus(profile, area, difficulty, seed) {
  const beltLevel = profile.belt_level;
  const matches = filterByLevelAndArea(beltLevel, area, difficulty);
  if (matches.length) return pickForProfile(matches, profile, seed);
  const anyDifficulty = filterByLevelAndArea(beltLevel, area);
  if (anyDifficulty.length) return pickForProfile(anyDifficulty, profile, seed);
  return getColdStartFocus(profile, seed);
}

/**
 * Pick the next focus for a user.
 * profile: { belt_level, months_training, ... }
 * recentCheckIns: most recent first; we look at the last 10.
 * seed: numeric, so the same day returns the same focus.
 */
export function getFocusForUser(profile, recentCheckIns = [], seed = Date.now()) {
  const window = recentCheckIns.slice(0, 10);

  if (!window.length) {
    return getColdStartFocus(profile, seed);
  }

  const problemArea = identifyProblemArea(window);
  const attemptRate = calculateAttemptRate(window);
  const feeling = dominantFeeling(window);

  if (attemptRate < 0.5) {
    return getSimplerFocus(
      profile,
      problemArea || COLD_START_AREAS[profile.belt_level]?.early[0],
      seed,
    );
  }

  const difficultyBias = FEELING_TO_DIFFICULTY_BIAS[feeling];
  const area = problemArea || pickOne(COLD_START_AREAS[profile.belt_level]?.early || [], seed);
  return getTargetedFocus(profile, area, difficultyBias, seed);
}

export const _internal = {
  identifyProblemArea,
  calculateAttemptRate,
  dominantFeeling,
  getColdStartFocus,
  getSimplerFocus,
  getTargetedFocus,
  compatibleWithProfile,
  softScore,
  pickForProfile,
};
