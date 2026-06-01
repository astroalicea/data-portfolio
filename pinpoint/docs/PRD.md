# PinPoint — Product Requirements Document (PRD)

## The One-Line Pitch
PinPoint gives BJJ students one thing to focus on before they roll —
so they stop freezing under pressure and start improving with intention.

---

## The Problem
White and blue belts learn techniques in class but can't access them during rolling.
When rolling starts, cognitive overload kicks in and students revert to survival mode.

**Root causes:**
- Too much information, no clear priority
- No bridge between drilling and live rolling
- No feedback loop to identify what's actually breaking down

**Current solutions are broken:**
- Logging apps require too much effort — most students quit
- Technique libraries give more information, which makes overload worse
- Coaches can only reach one student at a time

---

## The Solution
A pre-roll focus delivery system with a post-roll feedback loop.

**Before class:** One focus. Specific. Actionable. Based on belt level and history.
**After class:** Four taps. No typing. Done in 20 seconds.
**Over time:** PinPoint gets smarter. Focus gets more personalized.

---

## Target User
**Primary:** White and blue belts training 2-4x per week
**Pain:** Feeling lost during rolling, not knowing what to work on
**Behavior:** Won't log religiously, but will tap 4 times after class
**Goal:** Improve faster, feel less lost, see real progress

**Secondary:** Purple belts returning from injury or plateau

**Not our user (yet):** Brown and black belts — they can self-diagnose

---

## Core Features — V1

### 1. Onboarding
- Belt level selection (White / Blue / Purple)
- Months training (0-6 / 6-12 / 1-2 years / 2+ years)
- Training frequency (1-2x / 3-4x / 5x+ per week)
- Primary goal (Survive rolling / Submit people / Compete)

### 2. Focus Delivery
- Single focus card on home screen
- Delivered fresh each training day
- Based on belt level (cold start) → check-in history (personalized)
- Written in plain language, no jargon overload
- Example: "Tonight when someone passes your guard, immediately frame
  on their hip and recover. Just that. Nothing else."

### 3. Four-Tap Check-In
- Triggered after class (user initiated)
- Question 1: Did you get tapped? Yes / No
- Question 2: Where? Guard / Side Control / Back / Mount / Standing
- Question 3: Did you attempt your focus? Yes / Tried / Forgot
- Question 4: How did you feel? Lost / Some moments / Felt decent
- Total time: under 20 seconds

### 4. Progress View
- Simple streak tracker (days trained)
- Most common position where tapped (last 30 days)
- Focus attempt rate (are they trying it?)
- One insight surfaced per week

### 5. Progressive Profiling
After a user has completed 3+ check-ins (they're engaged but not overwhelmed),
the home screen surfaces an optional "Sharpen your focus" card with three
extra questions:
- Gi or no-gi (or both)
- Most-trained guard (open / closed / half / no preference)
- Body size vs typical partners (smaller / similar / bigger)

Still tap-only. "Maybe later" snoozes the prompt for 7 days; completing it
hides the card permanently. Answers softly bias focus selection: gi/no-gi
acts as a hard filter on tagged entries, while top guard and body size add
preference points within the existing candidate pool. Users who skip the
prompt see no change in behavior.

---

## Core Features — V2 (future)
- Coach mode: professor sets curriculum, PinPoint delivers it to students
- Gym partnerships: gyms pay for team access
- Competition prep mode: focused 8-week program
- Spanish language support (Latino BJJ market is huge and underserved)

---

## What We Are NOT Building (V1)
- Technique video library
- Social features / community feed
- Belt promotion tracking
- Nutrition or conditioning tools
- Anything that requires typing

---

## Monetization
**Free tier:**
- Basic focus delivery (generic, belt-level only)
- 4-tap check-in
- 7-day history

**PinPoint Pro — $7.99/month or $59.99/year:**
- Personalized focus based on full check-in history
- 30-day progress insights
- Weekly pattern report
- Priority focus areas

**Future:**
- Gym/team plans for coaches
- White-label for academies

---

## Success Metrics
- Day 7 retention: did they check in at least 3 times?
- Day 30 retention: are they still opening the app?
- Focus attempt rate: are they actually trying the focus during rolling?
- Tap pattern shift: are they getting caught in fewer of the same spots over 60 days?

---

## The Insight That Drives Everything
Good coaches give students one thing to focus on per session.
PinPoint scales that to every student, every session,
even when the coach isn't watching.
