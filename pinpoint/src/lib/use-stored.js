'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { readRaw } from './storage';

// Subscribe to in-tab writes via the custom event dispatched by storage.js
// after every write (local or post-sync). This is what makes a click that
// updates localStorage cause the rendered tree to re-derive its state.
function subscribe(onStoreChange) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('pinpoint:storage', onStoreChange);
  return () => window.removeEventListener('pinpoint:storage', onStoreChange);
}

/**
 * Read a JSON value from localStorage in an SSR-safe way.
 *
 * `useSyncExternalStore` receives the raw string from localStorage (a
 * primitive, always stable under Object.is), and the parsed value is
 * memoized so we only re-allocate when the underlying string actually
 * changes. `fallback` is used both on the server and when storage is empty
 * or unparseable.
 */
export function useStoredJSON(key, fallback) {
  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return useMemo(() => {
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
}
