# Supabase setup (phone-friendly)

PinPoint runs on localStorage by default — every device is its own
island. Wiring up Supabase gives you auth, multi-device sync, and the
foundation for real beta users.

This guide is written to be done from a phone in ~10 minutes.

## 1. Create a Supabase project

1. Open **supabase.com** → **Sign in with GitHub**
2. Tap **New project**
3. Name it `pinpoint` (or anything you want)
4. Pick a region close to you
5. Generate a strong database password and **save it somewhere** (you
   won't need it for the app, but it's painful to recover later)
6. Tap **Create new project**

Wait ~2 minutes for the project to spin up.

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor** (left sidebar)
2. Tap **New query**
3. Open `supabase/schema.sql` in the GitHub mobile app or web
4. Copy the entire file contents
5. Paste into the SQL Editor and tap **Run**

You should see a green "Success. No rows returned" notice. If it
complains about anything existing, the `if not exists` clauses make
re-running safe.

## 3. Configure auth redirect

The magic-link emails need to redirect users back to your live app.

1. Open **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL (e.g. `https://pinpoint-xxxx.vercel.app`)
3. Add the same URL to **Redirect URLs** (one per line if you want to
   support multiple — e.g. preview deploys)
4. Tap **Save**

## 4. Copy your project credentials

1. Open **Project Settings** → **API**
2. Copy **Project URL**
3. Copy **anon public** key (the long one labeled `anon` — NOT
   `service_role`, never paste that into the frontend)

## 5. Add the credentials to Vercel

1. Open **vercel.com** → your **pinpoint** project
2. Tap **Settings** → **Environment Variables**
3. Add two variables (both apply to **Production, Preview, Development**):
   - Name: `NEXT_PUBLIC_SUPABASE_URL` &nbsp; Value: *the Project URL*
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` &nbsp; Value: *the anon key*
4. Tap **Save**

## 6. Trigger a redeploy

Vercel only picks up new env vars on a fresh build.

1. **Deployments** tab → tap the latest deployment
2. Tap **⋯** → **Redeploy** → **Redeploy** again to confirm
3. Wait ~1 minute

## 7. Try signing in

1. Open your live app on your phone
2. Tap the **Sign in** link in the header (it appears once the env vars
   are picked up)
3. Enter your email → **Send magic link**
4. Open the email → tap the link → it bounces you back to PinPoint
   signed in. Your email shows in the header.

That's it for setup. Once you're signed in:

- Your profile, check-ins, and focus history are pushed to Supabase
  in the background.
- Open the app on a second device, sign in with the same email, and
  your data appears.
- localStorage still acts as a fast local cache that mirrors Supabase
  — reads stay instant, writes update both stores.

## Troubleshooting

**"Sign in" link doesn't appear after redeploy**
Hard-refresh (close tab, reopen). The client reads env vars at build
time, so the page must come from the new deploy.

**Magic-link email lands in spam**
Normal for Supabase's default email sender. For real users you'll want
to configure a custom SMTP provider in
**Authentication** → **Email Templates**.

**Link gives "OTP expired" error**
Default expiry is 1 hour. Tap **Send magic link** again from the
sign-in page.

**Link opens but doesn't sign you in**
The Site URL or Redirect URLs in Supabase Auth settings don't match
where the app is actually running. Double-check step 3.
