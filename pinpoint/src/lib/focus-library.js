export const BELT_LEVELS = ['white', 'blue', 'purple'];

export const POSITIONS = ['guard', 'side_control', 'back', 'mount', 'standing'];

export const POSITION_LABELS = {
  guard: 'Guard',
  side_control: 'Side Control',
  back: 'Back',
  mount: 'Mount',
  standing: 'Standing',
};

export const AREA_LABELS = {
  guard_retention: 'Guard Retention',
  back_defense: 'Back Defense',
  surviving_pressure: 'Surviving Pressure',
  mount_escape: 'Mount Escape',
  side_control_escape: 'Side Control Escape',
  passing: 'Guard Passing',
  back_attacks: 'Back Attacks',
  submissions: 'Submission Entries',
  sweeps: 'Guard Sweeps',
  pressure_control: 'Pressure and Control',
  transitions: 'Transitions',
  timing: 'Timing',
  weak_side: 'Weak Side',
};

// When a user gets tapped from POSITION_X, recommend focuses in this AREA next time.
export const POSITION_TO_AREA = {
  guard: 'guard_retention',
  side_control: 'side_control_escape',
  back: 'back_defense',
  mount: 'mount_escape',
  standing: 'guard_retention',
};

export const focusLibrary = [
  // ───── White Belt ─────
  {
    belt_level: 'white',
    area: 'guard_retention',
    difficulty: 'beginner',
    focus_text:
      "Tonight when someone tries to pass your guard, focus only on keeping your knees between you and them. Don't worry about sweeping. Just survive.",
  },
  {
    belt_level: 'white',
    area: 'guard_retention',
    difficulty: 'beginner',
    focus_text:
      "When you feel your guard opening, immediately bring your knees to your chest. One thing tonight: knees in, don't let them flatten you out.",
  },
  {
    belt_level: 'white',
    area: 'guard_retention',
    difficulty: 'intermediate',
    focus_text:
      'If someone is standing in your guard, grab their sleeves or wrists. Control their hands before they can pass. Just that tonight.',
  },
  {
    belt_level: 'white',
    area: 'back_defense',
    difficulty: 'beginner',
    focus_text:
      'If someone takes your back tonight, tuck your chin immediately. One job: protect your neck. Everything else is secondary.',
  },
  {
    belt_level: 'white',
    area: 'back_defense',
    difficulty: 'intermediate',
    focus_text:
      "When you feel someone going for your back, drop your weight and sit to the side they're attacking from. Just practice that reaction tonight.",
  },
  {
    belt_level: 'white',
    area: 'surviving_pressure',
    difficulty: 'beginner',
    focus_text:
      "Tonight when you're on the bottom, focus on keeping your elbows tight to your body. Elbows out = submissions. Elbows in = survive.",
  },
  {
    belt_level: 'white',
    area: 'surviving_pressure',
    difficulty: 'beginner',
    focus_text:
      "When someone is in side control, don't just push — turn into them and get to your side. Tonight practice that one reaction.",
  },
  {
    belt_level: 'white',
    area: 'surviving_pressure',
    difficulty: 'intermediate',
    focus_text:
      "If you're mounted tonight, don't bridge randomly. Wait for them to post a hand, then bridge into it. Patience is the focus tonight.",
  },
  {
    belt_level: 'white',
    area: 'mount_escape',
    difficulty: 'beginner',
    focus_text:
      "Tonight in mount, focus only on getting your elbow to the mat and turning to your side. Don't try to escape fully yet. Just get to your side.",
  },
  {
    belt_level: 'white',
    area: 'mount_escape',
    difficulty: 'intermediate',
    focus_text:
      'When someone mounts you, immediately trap one of their arms by hugging it tight. One focus: trap the arm before anything else.',
  },
  {
    belt_level: 'white',
    area: 'side_control_escape',
    difficulty: 'beginner',
    focus_text:
      'From side control tonight, focus on getting your inside elbow to their hip. That frame is your first step to everything. Just that.',
  },
  {
    belt_level: 'white',
    area: 'side_control_escape',
    difficulty: 'intermediate',
    focus_text:
      "Tonight when you're in side control, don't push with straight arms. Bend them and frame on their neck and hip. Practice that one thing.",
  },

  // ───── Blue Belt ─────
  {
    belt_level: 'blue',
    area: 'passing',
    difficulty: 'beginner',
    focus_text:
      "Tonight when you're trying to pass guard, focus on controlling one knee. Pin it to the mat before you move. Don't rush the pass.",
  },
  {
    belt_level: 'blue',
    area: 'passing',
    difficulty: 'intermediate',
    body_size_bias: 'bigger',
    focus_text:
      'When passing tonight, keep your hips low and connected. The moment your hips rise, the pass fails. One cue: stay heavy.',
  },
  {
    belt_level: 'blue',
    area: 'passing',
    difficulty: 'intermediate',
    focus_text:
      'Tonight focus on where your head is when passing. Head on the same side as the pass. Practice that positioning every time.',
  },
  {
    belt_level: 'blue',
    area: 'back_attacks',
    difficulty: 'beginner',
    focus_text:
      'If you take the back tonight, focus on getting the seatbelt grip before anything else. No seatbelt, no back attack. Just that.',
  },
  {
    belt_level: 'blue',
    area: 'back_attacks',
    difficulty: 'intermediate',
    focus_text:
      'Tonight from the back, practice switching your choking arm to under the chin before squeezing. Placement before pressure.',
  },
  {
    belt_level: 'blue',
    area: 'submissions',
    difficulty: 'intermediate',
    focus_text:
      'Tonight from side control, look for the near arm every time. Is it available for a kimura? Practice seeing it, not finishing it.',
  },
  {
    belt_level: 'blue',
    area: 'submissions',
    difficulty: 'intermediate',
    guard_type: 'closed',
    focus_text:
      'When you have someone in guard, practice setting up the armbar position without finishing. Hip angle, arm control, leg position. Just get there tonight.',
  },
  {
    belt_level: 'blue',
    area: 'sweeps',
    difficulty: 'beginner',
    guard_type: 'closed',
    focus_text:
      'Tonight from guard, focus on breaking their posture first before anything else. No broken posture, no sweep. One job: get their head down.',
  },
  {
    belt_level: 'blue',
    area: 'sweeps',
    difficulty: 'intermediate',
    focus_text:
      'When you feel them posturing up in your guard, immediately go to your hip and attack the arm. Practice that reaction tonight.',
  },
  {
    belt_level: 'blue',
    area: 'pressure_control',
    difficulty: 'intermediate',
    body_size_bias: 'bigger',
    focus_text:
      'Tonight in top positions, focus on keeping your weight on them at all times. When you move, one point stays heavy. Practice that.',
  },
  {
    belt_level: 'blue',
    area: 'pressure_control',
    difficulty: 'intermediate',
    focus_text:
      'When you have side control tonight, focus on blocking their near hip with your knee before doing anything else. Hip blocked = they can’t escape.',
  },

  // ───── Purple Belt ─────
  {
    belt_level: 'purple',
    area: 'transitions',
    difficulty: 'advanced',
    focus_text:
      'Tonight focus on what happens between positions. The transition from side control to mount — practice that one transition every time it’s available.',
  },
  {
    belt_level: 'purple',
    area: 'transitions',
    difficulty: 'advanced',
    focus_text:
      'When a submission fails tonight, immediately look for the next position or submission. Chain two things together. Just two.',
  },
  {
    belt_level: 'purple',
    area: 'timing',
    difficulty: 'advanced',
    focus_text:
      'Tonight focus on moving when they move, not before or after. Pick one moment per roll where you perfectly matched their movement.',
  },
  {
    belt_level: 'purple',
    area: 'weak_side',
    difficulty: 'advanced',
    focus_text:
      "Tonight do everything from your weak side. If you're right-handed, attack left. It will be uncomfortable. That's the point.",
  },
];
