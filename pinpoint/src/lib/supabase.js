// Supabase client — placeholder for Phase 2.
//
// The MVP runs entirely on localStorage (see ./storage.js). When you're
// ready to wire up auth + a real DB, drop your keys in .env.local:
//
//   NEXT_PUBLIC_SUPABASE_URL=...
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
//
// Then `npm install @supabase/supabase-js` and replace the body of
// `getSupabase()` with `createClient(url, anonKey)`.

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  // Intentionally not creating a client yet — Phase 1 ships on localStorage.
  return null;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
