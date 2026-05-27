// Tiny localStorage wrapper. Used by the MVP before Supabase is wired up.
// All reads are SSR-safe (return defaults on the server) and stable across
// re-renders (cached by raw string) so they're safe to pass to
// `useSyncExternalStore`.

const KEYS = {
  profile: 'pinpoint:profile',
  checkIns: 'pinpoint:check_ins',
  focusHistory: 'pinpoint:focus_history',
};

// Stable empty references — `useSyncExternalStore` compares snapshots by
// identity, so returning a fresh `[]` each call would loop forever.
const EMPTY_ARRAY = Object.freeze([]);

// Cache parsed JSON keyed by raw string. As long as the underlying string
// hasn't changed, callers get the same object reference back.
const parseCache = new Map();

function isBrowser() {
  return typeof window !== 'undefined';
}

function readJSON(key, emptyValue) {
  if (!isBrowser()) return emptyValue;
  let raw;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return emptyValue;
  }
  if (raw == null) return emptyValue;
  const cached = parseCache.get(key);
  if (cached && cached.raw === raw) return cached.parsed;
  try {
    const parsed = JSON.parse(raw);
    parseCache.set(key, { raw, parsed });
    return parsed;
  } catch {
    return emptyValue;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) return;
  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
    parseCache.set(key, { raw, parsed: value });
  } catch {
    // Quota or private-mode failure — fail silent for the MVP.
  }
}

export function getProfile() {
  return readJSON(KEYS.profile, null);
}

export function saveProfile(profile) {
  writeJSON(KEYS.profile, profile);
  return profile;
}

export function getCheckIns() {
  return readJSON(KEYS.checkIns, EMPTY_ARRAY);
}

export function addCheckIn(checkIn) {
  const all = getCheckIns();
  const entry = {
    ...checkIn,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  writeJSON(KEYS.checkIns, [entry, ...all]);
  return entry;
}

export function getFocusHistory() {
  return readJSON(KEYS.focusHistory, EMPTY_ARRAY);
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
  writeJSON(KEYS.focusHistory, [entry, ...history]);
  return entry;
}

export function resetAll() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => {
    window.localStorage.removeItem(k);
    parseCache.delete(k);
  });
}
