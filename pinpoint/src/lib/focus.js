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

function getColdStartFocus(beltLevel, monthsTraining, seed) {
  const buckets = COLD_START_AREAS[beltLevel] || COLD_START_AREAS.white;
  const pool = monthsTraining < 6 ? buckets.early : [...buckets.early, ...buckets.later];
  const area = pickOne(pool, seed);
  const candidates = filterByLevelAndArea(beltLevel, area, 'beginner');
  if (candidates.length) return pickOne(candidates, seed);
  return pickOne(filterByLevelAndArea(beltLevel, area), seed);
}

function getSimplerFocus(beltLevel, area, seed) {
  const candidates = filterByLevelAndArea(beltLevel, area, 'beginner');
  if (candidates.length) return pickOne(candidates, seed);
  return pickOne(filterByLevelAndArea(beltLevel, area), seed);
}

function getTargetedFocus(beltLevel, area, difficulty, seed) {
  const matches = filterByLevelAndArea(beltLevel, area, difficulty);
  if (matches.length) return pickOne(matches, seed);
  // Fall back to any difficulty in this area at this belt level.
  const anyDifficulty = filterByLevelAndArea(beltLevel, area);
  if (anyDifficulty.length) return pickOne(anyDifficulty, seed);
  // Last resort: cold start.
  return getColdStartFocus(beltLevel, 12, seed);
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
    return getColdStartFocus(profile.belt_level, profile.months_training, seed);
  }

  const problemArea = identifyProblemArea(window);
  const attemptRate = calculateAttemptRate(window);
  const feeling = dominantFeeling(window);

  if (attemptRate < 0.5) {
    return getSimplerFocus(
      profile.belt_level,
      problemArea || COLD_START_AREAS[profile.belt_level]?.early[0],
      seed,
    );
  }

  const difficultyBias = FEELING_TO_DIFFICULTY_BIAS[feeling];
  const area = problemArea || pickOne(COLD_START_AREAS[profile.belt_level]?.early || [], seed);
  return getTargetedFocus(profile.belt_level, area, difficultyBias, seed);
}

export const _internal = {
  identifyProblemArea,
  calculateAttemptRate,
  dominantFeeling,
  getColdStartFocus,
  getSimplerFocus,
  getTargetedFocus,
};
