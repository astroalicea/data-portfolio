'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// Tiny header chip: "Sign in" link when signed out, the user's email
// (truncated) when signed in. Renders nothing if Supabase isn't
// configured yet — keeps the localStorage-only UX uncluttered.
export default function AuthStatus() {
  const [session, setSession] = useState(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  if (!configured) return null;

  const email = session?.user?.email || '';
  const display = !session
    ? 'Sign in'
    : email.length > 16
      ? `${email.slice(0, 14)}…`
      : email;

  return (
    <>
      <span className="text-zinc-300 dark:text-zinc-700">·</span>
      <Link
        href="/signin"
        className="text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
        title={email || undefined}
      >
        {display}
      </Link>
    </>
  );
}
