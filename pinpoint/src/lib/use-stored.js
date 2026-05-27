'use client';

import { useSyncExternalStore } from 'react';

// localStorage is treated as an external mutable source. We only write through
// our own helpers, so we don't need to subscribe to cross-tab changes for the
// MVP — a no-op subscribe is fine.
function noopSubscribe() {
  return () => {};
}

/**
 * Read a value from an external source (typically localStorage) in an
 * SSR-safe way. The server-rendered HTML uses `serverFallback`; the client
 * rehydrates with the real value after mount.
 */
export function useStoredValue(getSnapshot, serverFallback) {
  return useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    () => serverFallback,
  );
}
