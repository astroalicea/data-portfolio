# PinPoint — CLAUDE.md

## What This Project Is
PinPoint is a BJJ training focus app for white and blue belts.
It solves one problem: students can't retain technique or think clearly under rolling pressure.

The core mechanic is simple:
- Deliver ONE focus before class based on belt level + history
- Capture a 4-tap check-in after rolling
- Get smarter every session without requiring effort from the user

PinPoint is NOT a logging app. NOT a technique library. NOT a gym management tool.
It is a coaching intelligence tool that scales the most valuable thing a coach does —
giving a student one thing to focus on so they don't freeze during rolling.

---

## Who Builds This
**Luis Alicea** — BJJ brown belt instructor, data engineering student, indie hacker.
- Background: facility operations, BJJ instruction, data analytics (Year Up United)
- Stack preference: Python, SQL, Next.js, Supabase, Stripe
- Style: clean, minimal, no unnecessary complexity

---

## Architecture Rules
- Always use `return` not `print` in functions (non-negotiable)
- Keep components small and single-purpose
- Mobile first — this is a phone app experience
- Every feature must serve the core loop: Focus → Roll → Check-in → Repeat
- No feature gets added unless it makes the core loop better

---

## Naming Conventions
- Components: PascalCase (FocusCard, CheckInForm)
- Functions: camelCase (getUserFocus, submitCheckIn)
- Database tables: snake_case (user_profiles, check_ins, focus_history)
- Files: kebab-case (focus-card.jsx, check-in-form.jsx)

---

## The Core Loop (never lose sight of this)
1. User opens app before class → receives ONE focus
2. User goes to class (no phone on mats)
3. User opens app after class → 4-tap check-in
4. PinPoint adjusts next focus based on responses
5. Repeat

---

## Focus Recommendation Logic
Two inputs drive the focus recommendation:

**Belt Level (cold start)**
- White belt: guard retention, surviving pressure, not giving up back
- Blue belt: passing guard, back attacks, submission chains

**Check-in History (personalization)**
- Where they keep getting tapped → becomes next focus area
- Whether they attempted the focus → tells us if recommendation was right level
- Overall feeling → adjusts difficulty of next focus

---

## The 4-Tap Check-In (exact questions, exact order)
1. Did you get tapped? → Yes / No
2. Where did it happen? → Guard / Side Control / Back / Mount / Standing
3. Did you attempt tonight's focus? → Yes / Tried / Forgot
4. How did you feel overall? → Lost the whole time / Had some moments / Felt decent

---

## Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend/Auth: Supabase
- Payments: Stripe
- Hosting: Vercel
- Language: Python (data/recommendation logic), JavaScript (frontend)

---

## Database Tables (planned)
- `users` — id, email, belt_level, months_training, created_at
- `check_ins` — id, user_id, tapped, position_lost, attempted_focus, feeling, created_at
- `focus_history` — id, user_id, focus_text, focus_area, delivered_at
- `focus_library` — id, belt_level, position, focus_text, difficulty

---

## What Success Looks Like
A white belt opens PinPoint before class, reads their focus, goes and trains,
comes back after class, taps 4 times, and over 30 days starts to notice
they're getting caught in fewer of the same spots.

That's the product. Everything else is noise.
