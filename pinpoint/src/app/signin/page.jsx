'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setStatus('sending');
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (err) {
      setError(err.message);
      setStatus('idle');
    } else {
      setStatus('sent');
    }
  }

  async function handleSignOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sign in
        </h1>
        <Link
          href="/"
          className="text-xs uppercase tracking-wider text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Home
        </Link>
      </header>

      {!configured ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <p className="mb-2 font-semibold">Auth not configured yet.</p>
          <p className="text-zinc-500 dark:text-zinc-400">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment to
            enable sign-in. PinPoint keeps working locally without them.
          </p>
        </div>
      ) : session ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Signed in as <strong>{session.user.email}</strong>
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition active:scale-[0.98] hover:border-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-50"
          >
            Sign out
          </button>
        </div>
      ) : status === 'sent' ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <p className="mb-2 font-semibold">Check your inbox.</p>
          <p className="text-zinc-500 dark:text-zinc-400">
            We sent a magic link to <strong>{email}</strong>. Tap it on this
            device to finish signing in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Email
          </label>
          <input
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-50"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-xl bg-zinc-900 px-5 py-4 text-base font-semibold text-white transition active:scale-[0.98] hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {status === 'sending' ? 'Sending…' : 'Send magic link'}
          </button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            No passwords. We email a one-tap link.
          </p>
        </form>
      )}
    </main>
  );
}
