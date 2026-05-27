# PinPoint — Focus Library

## How This Works
This is the brain of PinPoint. Each focus is:
- Specific (not "work on your guard" — useless)
- Actionable in a single roll
- Written in plain language
- Tied to a belt level and position area

Format:
- belt_level: white | blue | purple
- area: guard_retention | passing | back_defense | mount_escape | side_control_escape | submissions
- difficulty: beginner | intermediate | advanced
- focus_text: what the student reads before rolling

---

## WHITE BELT FOCUSES

### Area: Guard Retention
- "Tonight when someone tries to pass your guard, focus only on keeping
  your knees between you and them. Don't worry about sweeping. Just survive."

- "When you feel your guard opening, immediately bring your knees to your
  chest. One thing tonight: knees in, don't let them flatten you out."

- "If someone is standing in your guard, grab their sleeves or wrists.
  Control their hands before they can pass. Just that tonight."

### Area: Back Defense
- "If someone takes your back tonight, tuck your chin immediately.
  One job: protect your neck. Everything else is secondary."

- "When you feel someone going for your back, drop your weight and
  sit to the side they're attacking from. Just practice that reaction tonight."

### Area: Surviving Pressure
- "Tonight when you're on the bottom, focus on keeping your elbows
  tight to your body. Elbows out = submissions. Elbows in = survive."

- "When someone is in side control, don't just push — turn into them
  and get to your side. Tonight practice that one reaction."

- "If you're mounted tonight, don't bridge randomly. Wait for them
  to post a hand, then bridge into it. Patience is the focus tonight."

### Area: Mount Escape
- "Tonight in mount, focus only on getting your elbow to the mat
  and turning to your side. Don't try to escape fully yet. Just get to your side."

- "When someone mounts you, immediately trap one of their arms by
  hugging it tight. One focus: trap the arm before anything else."

### Area: Side Control Escape
- "From side control tonight, focus on getting your inside elbow
  to their hip. That frame is your first step to everything. Just that."

- "Tonight when you're in side control, don't push with straight arms.
  Bend them and frame on their neck and hip. Practice that one thing."

---

## BLUE BELT FOCUSES

### Area: Guard Passing
- "Tonight when you're trying to pass guard, focus on controlling
  one knee. Pin it to the mat before you move. Don't rush the pass."

- "When passing tonight, keep your hips low and connected.
  The moment your hips rise, the pass fails. One cue: stay heavy."

- "Tonight focus on where your head is when passing. Head on the
  same side as the pass. Practice that positioning every time."

### Area: Back Attacks
- "If you take the back tonight, focus on getting the seatbelt grip
  before anything else. No seatbelt, no back attack. Just that."

- "Tonight from the back, practice switching your choking arm to
  under the chin before squeezing. Placement before pressure."

### Area: Submission Entries
- "Tonight from side control, look for the near arm every time.
  Is it available for a kimura? Practice seeing it, not finishing it."

- "When you have someone in guard, practice setting up the armbar
  position without finishing. Hip angle, arm control, leg position.
  Just get there tonight."

### Area: Guard Sweeps
- "Tonight from guard, focus on breaking their posture first before
  anything else. No broken posture, no sweep. One job: get their head down."

- "When you feel them posturing up in your guard, immediately go to
  your hip and attack the arm. Practice that reaction tonight."

### Area: Pressure and Control
- "Tonight in top positions, focus on keeping your weight on them
  at all times. When you move, one point stays heavy. Practice that."

- "When you have side control tonight, focus on blocking their near
  hip with your knee before doing anything else. Hip blocked = they can't escape."

---

## PURPLE BELT FOCUSES

### Area: Transitions
- "Tonight focus on what happens between positions. The transition
  from side control to mount — practice that one transition every time it's available."

- "When a submission fails tonight, immediately look for the next
  position or submission. Chain two things together. Just two."

### Area: Timing
- "Tonight focus on moving when they move, not before or after.
  Pick one moment per roll where you perfectly matched their movement."

### Area: Weak Side
- "Tonight do everything from your weak side. If you're right-handed,
  attack left. It will be uncomfortable. That's the point."

---

## FOCUS SELECTION LOGIC (for recommendation engine)

### Cold Start (new user, no history)
- White belt 0-6 months → Start with surviving pressure and back defense
- White belt 6-12 months → Add guard retention and mount escape
- Blue belt → Start with guard passing and back attacks

### History-Based Adjustment
- Getting tapped from back repeatedly → Prioritize back defense focuses
- Getting tapped from mount repeatedly → Prioritize mount escape focuses
- Never attempting the focus (answering "Forgot") → Simplify the focus, make it more concrete
- Feeling "Lost the whole time" 3+ sessions → Step back to more basic focus
- Feeling "Felt decent" consistently → Progress to next difficulty level

### Progression Rules
- Same focus area max 3 sessions in a row → rotate to next area
- If focus attempt rate drops below 50% → simplify focus language
- After 30 days → unlock next belt level focuses if check-ins show improvement
