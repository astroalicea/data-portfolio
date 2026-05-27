'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { readRaw } from './storage';

// We don't subscribe to cross-tab `storage` events for the MVP — all writes
// go through our own helpers in this tab, so a fresh mount after a navigation
// re-reads the latest value.
function noopSubscribe() {
  return () => {};
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
  const raw = useSyncExternalStore(noopSubscribe, getSnapshot, () => null);

  return useMemo(() => {
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
}
