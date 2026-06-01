// Tiny localStorage wrapper. Used by the MVP before Supabase is wired up.
// The hook layer (`use-stored.js`) reads raw strings via `readRaw` so that
// `useSyncExternalStore` always compares primitives, never object identity.

export const STORAGE_KEYS = {
  profile: 'pinpoint:profile',
  checkIns: 'pinpoint:check_ins',
  focusHistory: 'pinpoint:focus_history',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

// Raw read — returns the JSON string from localStorage (or null). Safe to
// hand to `useSyncExternalStore` because strings compare by value.
export function readRaw(key) {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failure — fail silent for the MVP.
  }
}

function readJSON(key, fallback) {
  const raw = readRaw(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Imperative reads — used by event handlers (e.g. `addCheckIn` reads the
// existing list before writing). React subscribers should use the hook.

export function getProfile() {
  return readJSON(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile) {
  writeJSON(STORAGE_KEYS.profile, profile);
  return profile;
}

export function updateProfile(patch) {
  const current = getProfile();
  if (!current) return null;
  const next = { ...current, ...patch };
  writeJSON(STORAGE_KEYS.profile, next);
  return next;
}

export function snoozeExtendedProfile(days = 7) {
  const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  return updateProfile({ extended_dismissed_until: until });
}

export function getCheckIns() {
  return readJSON(STORAGE_KEYS.checkIns, []);
}

export function addCheckIn(checkIn) {
  const all = getCheckIns();
  const entry = {
    ...checkIn,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  writeJSON(STORAGE_KEYS.checkIns, [entry, ...all]);
  return entry;
}

export function getFocusHistory() {
  return readJSON(STORAGE_KEYS.focusHistory, []);
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
  writeJSON(STORAGE_KEYS.focusHistory, [entry, ...history]);
  return entry;
}

export function resetAll() {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
}
