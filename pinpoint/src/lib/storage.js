// Local-first storage with Supabase sync.
//
// When the user is signed in, Supabase is the canonical store and
// localStorage is a cache that mirrors it. Writes go to both — local
// happens synchronously (UI feels instant), remote happens in the
// background. On app mount and on sign-in we pull remote state and
// merge any local-only items back to Supabase.
//
// When the user is not signed in, this module behaves exactly like the
// localStorage-only MVP it replaced. The hook layer (`use-stored.js`)
// reads raw strings via `readRaw` and subscribes to `pinpoint:storage`
// events so any write here re-renders the components that care.

import { getSupabase } from './supabase';

export const STORAGE_KEYS = {
  profile: 'pinpoint:profile',
  checkIns: 'pinpoint:check_ins',
  focusHistory: 'pinpoint:focus_history',
};

const STORAGE_EVENT = 'pinpoint:storage';

function isBrowser() {
  return typeof window !== 'undefined';
}

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
    window.dispatchEvent(new Event(STORAGE_EVENT));
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

// ─────────────────────────────────────────────────────────────
// Remote helpers
// ─────────────────────────────────────────────────────────────

async function getUserId() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user?.id || null;
}

async function pushProfile(profile) {
  const sb = getSupabase();
  const userId = await getUserId();
  if (!sb || !userId || !profile) return;
  const { error } = await sb.from('profiles').upsert({ ...profile, id: userId });
  if (error) console.error('[supabase] profile upsert failed', error);
}

async function pushCheckIn(entry) {
  const sb = getSupabase();
  const userId = await getUserId();
  if (!sb || !userId) return;
  const { error } = await sb.from('check_ins').insert({ ...entry, user_id: userId });
  if (error) console.error('[supabase] check_in insert failed', error);
}

async function pushFocusHistory(entry) {
  const sb = getSupabase();
  const userId = await getUserId();
  if (!sb || !userId) return;
  const { error } = await sb.from('focus_history').insert({ ...entry, user_id: userId });
  if (error) console.error('[supabase] focus_history insert failed', error);
}

async function clearRemote() {
  const sb = getSupabase();
  const userId = await getUserId();
  if (!sb || !userId) return;
  await Promise.all([
    sb.from('check_ins').delete().eq('user_id', userId),
    sb.from('focus_history').delete().eq('user_id', userId),
    sb.from('profiles').delete().eq('id', userId),
  ]);
}

// Pull remote state, push any local-only items, write the merged result
// back to localStorage. Called on sign-in and on first mount when already
// signed in (see SupabaseSync.jsx).
export async function syncFromSupabase() {
  const sb = getSupabase();
  const userId = await getUserId();
  if (!sb || !userId) return;

  const [profileRes, checkInsRes, historyRes] = await Promise.all([
    sb.from('profiles').select('*').eq('id', userId).maybeSingle(),
    sb
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    sb
      .from('focus_history')
      .select('*')
      .eq('user_id', userId)
      .order('delivered_at', { ascending: false }),
  ]);

  const remoteProfile = profileRes.data || null;
  const remoteCheckIns = checkInsRes.data || [];
  const remoteHistory = historyRes.data || [];

  const localProfile = readJSON(STORAGE_KEYS.profile, null);
  const localCheckIns = readJSON(STORAGE_KEYS.checkIns, []);
  const localHistory = readJSON(STORAGE_KEYS.focusHistory, []);

  // Push local-only check-ins
  const remoteCheckInIds = new Set(remoteCheckIns.map((c) => c.id));
  const newCheckIns = localCheckIns.filter((c) => !remoteCheckInIds.has(c.id));
  if (newCheckIns.length) {
    await sb
      .from('check_ins')
      .insert(newCheckIns.map((c) => ({ ...c, user_id: userId })));
  }

  // Push local-only focus history
  const remoteHistoryIds = new Set(remoteHistory.map((h) => h.id));
  const newHistory = localHistory.filter((h) => !remoteHistoryIds.has(h.id));
  if (newHistory.length) {
    await sb
      .from('focus_history')
      .insert(newHistory.map((h) => ({ ...h, user_id: userId })));
  }

  // Push profile if remote has none. We don't overwrite a remote profile
  // with a local one — multi-device edits would clobber each other without
  // proper timestamps, which is V2 work.
  if (!remoteProfile && localProfile) {
    await sb.from('profiles').insert({ ...localProfile, id: userId });
  }

  const mergedProfile = remoteProfile || localProfile;
  const mergedCheckIns = [...newCheckIns, ...remoteCheckIns];
  const mergedHistory = [...newHistory, ...remoteHistory];

  writeJSON(STORAGE_KEYS.profile, mergedProfile);
  writeJSON(STORAGE_KEYS.checkIns, mergedCheckIns);
  writeJSON(STORAGE_KEYS.focusHistory, mergedHistory);
}

// Clear local cache without touching Supabase. Used on sign-out so the
// next user (or unauthenticated session) starts clean. The previous
// user's data still lives in Supabase under their account.
export function clearLocal() {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

// ─────────────────────────────────────────────────────────────
// Public API — same signatures, dual-writing under the hood
// ─────────────────────────────────────────────────────────────

export function getProfile() {
  return readJSON(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile) {
  writeJSON(STORAGE_KEYS.profile, profile);
  pushProfile(profile);
  return profile;
}

export function updateProfile(patch) {
  const current = getProfile();
  if (!current) return null;
  const next = { ...current, ...patch };
  writeJSON(STORAGE_KEYS.profile, next);
  pushProfile(next);
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
  pushCheckIn(entry);
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
  pushFocusHistory(entry);
  return entry;
}

export function resetAll() {
  clearLocal();
  clearRemote();
}
