'use client';

import { useEffect } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { clearLocal, syncFromSupabase } from '@/lib/storage';

// Top-of-tree client component. Listens for auth state changes and runs
// the local↔remote sync at the right moments. Returns no UI.
//
// INITIAL_SESSION fires once on subscribe with the current session (or
// null if signed out), which covers "already signed in on page load."
// SIGNED_IN fires on a fresh sign-in. SIGNED_OUT clears the local cache
// so the next sign-in starts from a clean slate (otherwise we'd merge
// the previous user's local data into the new account).
export default function SupabaseSync() {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabase();
    if (!sb) return;

    let cancelled = false;
    const sync = async () => {
      if (cancelled) return;
      try {
        await syncFromSupabase();
      } catch (err) {
        console.error('[supabase] sync failed', err);
      }
    };

    const { data } = sb.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearLocal();
        return;
      }
      if (
        session &&
        (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')
      ) {
        sync();
      }
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  return null;
}
