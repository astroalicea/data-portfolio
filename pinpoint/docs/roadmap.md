# PinPoint — Build Roadmap

## Philosophy
Ship something real people can use as fast as possible.
Validate before you over-engineer.
Every week should produce something testable.

---

## Phase 0 — Validate Before Building (Now)
**Goal:** Confirm the problem is real before writing one line of code

- [ ] Talk to 3 white/blue belts: "What goes through your head when rolling starts?"
- [ ] Talk to 3 more: "Do you know what you should be working on right now?"
- [ ] Show them the focus library — do they find it useful?
- [ ] Find 5 people who would use a beta version

**Exit criteria:** At least 3 people say "I would use this every time I train"

---

## Phase 1 — MVP (Months 6-9 of your learning roadmap)
**Goal:** Working app, real users, real feedback

**Stack:**
- Next.js + Tailwind (frontend)
- Supabase (auth + database)
- Vercel (hosting)
- No payments yet — free for beta users

**What to build:**
- [ ] Onboarding flow (belt level, months training, frequency, goal)
- [ ] Home screen with focus card
- [ ] 4-tap check-in flow
- [ ] Basic recommendation logic (belt level only first)
- [ ] Simple streak display

**What NOT to build yet:**
- Payments
- Progress charts
- Coach mode
- Anything fancy

**Exit criteria:** 10 real users checking in after real training sessions

---

## Phase 2 — Personalization (Months 9-12)
**Goal:** Make PinPoint actually get smarter

- [ ] Build check-in history into recommendation logic
- [ ] Surface weekly pattern insight
- [ ] Add progress view (where you keep getting tapped)
- [ ] Refine focus library based on user feedback
- [ ] Add Stripe — launch Pro tier at $7.99/month

**Exit criteria:** Users saying the focuses feel personalized to them

---

## Phase 3 — Growth (Months 12-18)
**Goal:** Get PinPoint into gyms

- [ ] Spanish language support
- [ ] Coach mode (professor sets curriculum)
- [ ] Gym/team plans
- [ ] Referral system (bring your training partner)

---

## Database Schema (Supabase)

```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  belt_level text not null, -- white, blue, purple
  months_training int not null,
  training_frequency text not null, -- 1-2x, 3-4x, 5x+
  primary_goal text not null, -- survive, submit, compete
  created_at timestamp default now()
);

-- Check-ins
create table check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  got_tapped boolean not null,
  position_lost text, -- guard, side_control, back, mount, standing
  attempted_focus text not null, -- yes, tried, forgot
  overall_feeling text not null, -- lost, some_moments, felt_decent
  created_at timestamp default now()
);

-- Focus History
create table focus_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  focus_text text not null,
  focus_area text not null,
  belt_level text not null,
  delivered_at timestamp default now()
);
```

---

## Recommendation Engine (Python)

```python
def get_focus_for_user(user, recent_checkins, focus_library):
    """
    Returns the best focus for a user before their next session.
    Uses belt level for cold start, check-in history for personalization.
    """

    # Cold start — no check-in history yet
    if not recent_checkins:
        return get_cold_start_focus(user.belt_level, user.months_training, focus_library)

    # Find where they keep getting tapped
    problem_area = identify_problem_area(recent_checkins)

    # Check if they're actually attempting the focus
    attempt_rate = calculate_attempt_rate(recent_checkins)

    # If they keep forgetting — simplify
    if attempt_rate < 0.5:
        return get_simpler_focus(user.belt_level, problem_area, focus_library)

    # Normal path — target their problem area
    return get_targeted_focus(user.belt_level, problem_area, focus_library)


def identify_problem_area(recent_checkins):
    """Find the position where user gets tapped most in last 10 sessions."""
    positions = [c.position_lost for c in recent_checkins if c.got_tapped]
    if not positions:
        return None
    return max(set(positions), key=positions.count)


def calculate_attempt_rate(recent_checkins):
    """What percentage of sessions did they attempt the focus?"""
    attempts = [c for c in recent_checkins if c.attempted_focus in ['yes', 'tried']]
    return len(attempts) / len(recent_checkins)
```

---

## File Structure
```
pinpoint/
├── .claude/
│   └── CLAUDE.md          ← Agent constitution (this project)
├── docs/
│   ├── PRD.md             ← Product requirements
│   ├── focus-library.md   ← All focus content
│   └── roadmap.md         ← This file
├── src/
│   ├── app/               ← Next.js app router
│   │   ├── page.jsx       ← Home (focus card)
│   │   ├── onboarding/    ← Belt level etc
│   │   └── checkin/       ← 4-tap flow
│   ├── components/
│   │   ├── FocusCard.jsx
│   │   ├── CheckInForm.jsx
│   │   └── StreakDisplay.jsx
│   ├── lib/
│   │   ├── supabase.js    ← DB client
│   │   └── focus.py       ← Recommendation engine
│   └── styles/
│       └── globals.css
├── .env.local             ← Supabase keys (never commit)
└── README.md
```

---

## Your Skills Gap — What to Learn Before Building
Based on your current YUP roadmap:

| Skill | Status | When Ready |
|-------|--------|------------|
| Python basics | In progress | Month 2 |
| SQL / Supabase | Coming soon | Month 3 |
| Git / GitHub | Learning now | Month 1 |
| Next.js / React | Not started | Month 4-5 |
| Stripe integration | Not started | Month 6 |
| Python recommendation logic | Not started | Month 6-9 |

**You can start building Phase 1 around Month 6.**
Use the time before then to validate the idea and build the focus library.
