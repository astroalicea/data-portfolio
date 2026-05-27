// Tiny localStorage wrapper. Used by the MVP before Supabase is wired up.
// All reads are SSR-safe (return defaults on the server).

const KEYS = {
  profile: 'pinpoint:profile',
  checkIns: 'pinpoint:check_ins',
  focusHistory: 'pinpoint:focus_history',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function read(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failure — fail silent for the MVP.
  }
}

export function getProfile() {
  return read(KEYS.profile, null);
}

export function saveProfile(profile) {
  write(KEYS.profile, profile);
  return profile;
}

export function getCheckIns() {
  return read(KEYS.checkIns, []);
}

export function addCheckIn(checkIn) {
  const all = getCheckIns();
  const next = [{ ...checkIn, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...all];
  write(KEYS.checkIns, next);
  return next[0];
}

export function getFocusHistory() {
  return read(KEYS.focusHistory, []);
}

export function recordFocusDelivered(focus) {
  const history = getFocusHistory();
  const entry = {
    id: crypto.randomUUID(),
    focus_text: focus.focus_text,
    focus_area: focus.area,
    belt_level: focus.belt_level,
    delivered_at: new Date().toISOString(),
  };
  write(KEYS.focusHistory, [entry, ...history]);
  return entry;
}

export function resetAll() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
