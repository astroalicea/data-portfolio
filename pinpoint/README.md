# PinPoint 🎯

> One focus. Every session. Stop freezing under pressure.

A BJJ training focus app for white and blue belts. PinPoint gives you **one thing to focus on** before you roll, captures a 4-tap check-in after, and gets smarter over time.

This repo is the **Phase 1 MVP** scaffold: Next.js + Tailwind, with a localStorage-backed data layer so you can run it end-to-end before wiring up Supabase.

---

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000. First load drops you into onboarding; after that you'll land on the home screen with today's focus.

### Reset your local state
Open the browser console and run:
```js
localStorage.clear()
```

---

## What's in the box

### Routes
- `/` — Home. Shows today's focus card + streak. Redirects to `/onboarding` if no profile.
- `/onboarding` — 4 questions (belt, months training, frequency, primary goal).
- `/checkin` — The 4-tap check-in (tap → position → attempted focus → feeling).

### Components — `src/components/`
- `FocusCard.jsx` — Renders today's focus.
- `CheckInForm.jsx` — The 4-tap state machine. Skips Q2 if not tapped.
- `StreakDisplay.jsx` — Day streak + total check-ins.

### Library — `src/lib/`
- `focus-library.js` — All focuses as structured data (belt × area × difficulty).
- `focus.js` — Recommendation engine (cold start + history-based personalization).
- `focus.py` — Python mirror of the engine for offline analysis.
- `storage.js` — localStorage adapter (profile, check-ins, focus history).
- `supabase.js` — Stub for Phase 2.
- `date.js` — Streak math + local-day helpers.

### Docs — `docs/`
- `PRD.md`, `focus-library.md`, `roadmap.md` — Product spec, content, build phases.

### Agent constitution — `.claude/CLAUDE.md`
The non-negotiable rules for anyone (human or AI) working on this codebase.

---

## How focus selection works

1. **No history yet** → Cold start by belt + months training (white belts <6mo get survival/back-defense; blue belts get passing/back attacks; etc.).
2. **Has history** → Look at the last 10 check-ins:
   - Where do they keep getting tapped? → Pick a focus targeting that area.
   - Are they attempting the focus? If attempt rate < 50%, simplify (beginner difficulty).
   - How do they feel? "Lost" → beginner. "Some moments" → intermediate. "Felt decent" → no difficulty bias.
3. **Same day** → Same focus. We hash today's date + belt level so the focus card is stable through the day.

Full logic lives in `src/lib/focus.js` (and `focus.py`).

---

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind v4**
- **localStorage** for V1 data persistence — swap for **Supabase** in Phase 2
- **Vercel** for hosting (deploy from `pinpoint/` subdirectory)

---

## Next steps (Phase 2)

1. Add `@supabase/supabase-js`, drop keys into `.env.local`, implement `src/lib/supabase.js`.
2. Replace the localStorage calls in `storage.js` with Supabase queries (same interface).
3. Build a `/progress` route surfacing the weekly insight + most common tap position.
4. Add Stripe for the Pro tier.

See `docs/roadmap.md` for the full plan.

---

## Project status

🟡 **Phase 1 MVP — scaffold complete.** Ready for local testing and user feedback before validating with real users.
