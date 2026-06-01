// PinPoint skill graph — first draft, white-belt-year coverage.
//
// Each skill is an atomic competency the engine tries to grow in a user.
// One skill can be addressed by many focus_text variants in
// focus-library.js — the engine picks the variant that fits the user's
// belt, gear, body size, and prior attempts.
//
// FIELDS
//   id              kebab_snake_case_string, used as foreign key from
//                   focus-library entries and (later) the skill_mastery
//                   and focus_attempts tables
//   label           short human-readable title
//   position        the position cluster this skill lives in
//   belt_floor      earliest belt where this skill becomes a focus
//   belt_ceiling    latest belt where it remains active (null = forever)
//   base_difficulty 1 (orientation) — 5 (high-level finesse)
//   prerequisites   skill ids that should be mastered first
//   progressions    skill ids this skill unlocks
//   confidence      'high' | 'medium' | 'low' — how confident I am in
//                   this skill's framing as drafted; review the
//                   'medium' / 'low' ones first
//   notes           caveats, debates, or coaching choices that matter
//
// THIS IS A FIRST DRAFT.
// The skill graph is the engine's coaching IP — every other piece of the
// system is replaceable; this one isn't. Review with a coach's eye.
// Things that especially want your judgment:
//   • Are the prerequisite chains correct for how *you* teach?
//   • Is the difficulty calibrated for white-belt-3-months?
//   • Are skills that should be split currently fused (or vice versa)?
//   • Did I drop something that belongs in the white-belt year?

export const POSITIONS = {
  meta: 'Meta / habit',
  closed_guard_bottom: 'Closed guard (bottom)',
  open_guard_bottom: 'Open guard (bottom)',
  half_guard_bottom: 'Half guard (bottom)',
  mount_bottom: 'Mount (bottom)',
  side_control_bottom: 'Side control (bottom)',
  back_bottom: 'Back (taken)',
  bottom_general: 'Bottom (general)',
  passing: 'Guard passing (top)',
  side_control_top: 'Side control (top)',
  back_top: 'Back (attacking)',
  sweeps: 'Sweeps from guard',
};

export const skills = [
  // ─── Meta ──────────────────────────────────────────
  {
    id: 'training_loop_compliance',
    label: 'Show up, attempt the focus, log the check-in',
    position: 'meta',
    belt_floor: 'white',
    belt_ceiling: null,
    base_difficulty: 1,
    prerequisites: [],
    progressions: [],
    confidence: 'medium',
    notes:
      'Compliance gate. If attempt_rate < 0.5, the engine returns a focus targeting this skill regardless of any position signal — you cannot teach skills the user is not trying.',
  },

  // ─── Closed guard (bottom) ─────────────────────────
  {
    id: 'closed_guard_break_posture',
    label: 'Break their posture before anything else',
    position: 'closed_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['closed_guard_basic_armbar_setup', 'sweep_break_posture_first'],
    confidence: 'high',
  },
  {
    id: 'closed_guard_basic_armbar_setup',
    label: 'Reach the armbar position from closed guard — not the finish',
    position: 'closed_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 3,
    prerequisites: ['closed_guard_break_posture'],
    progressions: [],
    confidence: 'high',
  },
  {
    id: 'closed_guard_against_standing',
    label: 'Control hands when they stand in your guard',
    position: 'closed_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: [],
    progressions: [],
    confidence: 'high',
  },

  // ─── Open guard (bottom) ───────────────────────────
  {
    id: 'open_guard_hip_connection',
    label: 'Feet or knees on hips — maintain distance',
    position: 'open_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 1,
    prerequisites: [],
    progressions: ['open_guard_frame_on_pass'],
    confidence: 'high',
  },
  {
    id: 'open_guard_frame_on_pass',
    label: 'Frame on the closest knee, hip-escape on pass attempt',
    position: 'open_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['open_guard_hip_connection'],
    progressions: ['open_guard_sleeve_ankle_control'],
    confidence: 'high',
  },
  {
    id: 'open_guard_sleeve_ankle_control',
    label: 'Two grips (sleeve + ankle, or wrist + ankle) before action',
    position: 'open_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['open_guard_hip_connection'],
    progressions: [],
    confidence: 'medium',
    notes:
      'Phrasing is gi-leaning. No-gi students would use wrist + ankle or wrist + collar-tie. The skill is the same; the grips differ.',
  },

  // ─── Half guard (bottom) ───────────────────────────
  {
    id: 'half_guard_underhook_priority',
    label: 'Fight for the underhook first — nothing else works without it',
    position: 'half_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['half_guard_turn_to_side', 'half_guard_far_knee_hook'],
    confidence: 'high',
  },
  {
    id: 'half_guard_turn_to_side',
    label: 'Turn to your side, hide head behind their arm',
    position: 'half_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['half_guard_underhook_priority'],
    progressions: ['half_guard_far_knee_hook'],
    confidence: 'high',
  },
  {
    id: 'half_guard_far_knee_hook',
    label: 'Free foot hooks the far knee — sweep setup',
    position: 'half_guard_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 3,
    prerequisites: ['half_guard_underhook_priority', 'half_guard_turn_to_side'],
    progressions: ['half_guard_elbow_up_before_sweep'],
    confidence: 'high',
  },
  {
    id: 'half_guard_elbow_up_before_sweep',
    label: 'Come up to your elbow before chasing the sweep',
    position: 'half_guard_bottom',
    belt_floor: 'blue',
    belt_ceiling: 'blue',
    base_difficulty: 3,
    prerequisites: ['half_guard_far_knee_hook'],
    progressions: [],
    confidence: 'high',
  },

  // ─── Mount escape ──────────────────────────────────
  {
    id: 'mount_elbow_to_mat',
    label: 'First job: elbow to the mat, turn to your side',
    position: 'mount_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 1,
    prerequisites: [],
    progressions: ['mount_trap_arm_for_bridge'],
    confidence: 'high',
  },
  {
    id: 'mount_trap_arm_for_bridge',
    label: 'Trap one of their arms before bridging',
    position: 'mount_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['mount_elbow_to_mat'],
    progressions: [],
    confidence: 'high',
  },

  // ─── Side control escape ───────────────────────────
  {
    id: 'side_control_frame_to_hip',
    label: 'Inside elbow to their hip — the first frame',
    position: 'side_control_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 1,
    prerequisites: [],
    progressions: ['side_control_recover_to_knees'],
    confidence: 'high',
  },
  {
    id: 'side_control_recover_to_knees',
    label: 'Turn into them, recover to knees',
    position: 'side_control_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['side_control_frame_to_hip'],
    progressions: [],
    confidence: 'medium',
    notes:
      "Some curricula teach 'turn away to recover guard' as the first escape; others teach 'turn toward them, get to knees.' Pick the one your gym teaches; the other can be a sibling skill later.",
  },

  // ─── Side control top ──────────────────────────────
  {
    id: 'side_control_block_near_hip',
    label: 'Block their near hip with your knee — first thing',
    position: 'side_control_top',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['side_control_keep_weight_distributed'],
    confidence: 'high',
  },
  {
    id: 'side_control_keep_weight_distributed',
    label: 'Weight on them at all times — one point heavy when moving',
    position: 'side_control_top',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['side_control_block_near_hip'],
    progressions: [],
    confidence: 'high',
  },
  {
    id: 'side_control_kimura_recognize',
    label: 'See the near-arm kimura when it appears — recognize, do not force',
    position: 'side_control_top',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['side_control_block_near_hip'],
    progressions: [],
    confidence: 'high',
  },

  // ─── Back defense ──────────────────────────────────
  {
    id: 'back_protect_neck_chin_tuck',
    label: 'Chin tuck first — protect the neck before anything else',
    position: 'back_bottom',
    belt_floor: 'white',
    belt_ceiling: null,
    base_difficulty: 1,
    prerequisites: [],
    progressions: ['back_kill_choking_arm'],
    confidence: 'high',
  },
  {
    id: 'back_kill_choking_arm',
    label: 'Two-on-one on the choking arm — kill the choke, then escape',
    position: 'back_bottom',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: ['back_protect_neck_chin_tuck'],
    progressions: [],
    confidence: 'high',
  },

  // ─── Back attacks ──────────────────────────────────
  {
    id: 'back_seatbelt_grip',
    label: 'Seatbelt grip first — no seatbelt, no back attack',
    position: 'back_top',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['back_choke_arm_placement'],
    confidence: 'high',
  },
  {
    id: 'back_choke_arm_placement',
    label: 'Switch the choking arm under the chin before squeezing',
    position: 'back_top',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['back_seatbelt_grip'],
    progressions: [],
    confidence: 'high',
  },

  // ─── Bottom fundamentals (cross-position) ──────────
  {
    id: 'bottom_keep_elbows_tight',
    label: 'Elbows tight to the body — deny submissions',
    position: 'bottom_general',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 1,
    prerequisites: [],
    progressions: [],
    confidence: 'high',
  },
  {
    id: 'bottom_never_stop_moving',
    label: 'Never stop moving when pressure lands',
    position: 'bottom_general',
    belt_floor: 'white',
    belt_ceiling: 'blue',
    base_difficulty: 2,
    prerequisites: [],
    progressions: [],
    confidence: 'medium',
    notes:
      'Cuts against the "patience under pressure" teaching some schools favor. Especially valuable for smaller students — engine should weight this higher when body_size = smaller.',
  },

  // ─── Passing (top) ─────────────────────────────────
  {
    id: 'passing_control_one_knee',
    label: 'Pin one knee before moving',
    position: 'passing',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['passing_stay_heavy', 'passing_head_position'],
    confidence: 'high',
  },
  {
    id: 'passing_stay_heavy',
    label: 'Hips low and connected — stay heavy through the pass',
    position: 'passing',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['passing_control_one_knee'],
    progressions: [],
    confidence: 'high',
  },
  {
    id: 'passing_head_position',
    label: 'Head on the same side as the pass',
    position: 'passing',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['passing_control_one_knee'],
    progressions: [],
    confidence: 'high',
  },
  {
    id: 'passing_gi_grip_strip',
    label: 'Strip their grips first when passing in the gi',
    position: 'passing',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 2,
    prerequisites: [],
    progressions: ['passing_control_one_knee'],
    confidence: 'high',
    notes: 'Gi-only. Filtered out for no-gi users via the requires_gi flag on the focus entry.',
  },

  // ─── Sweeps from guard ─────────────────────────────
  {
    id: 'sweep_break_posture_first',
    label: 'No broken posture, no sweep — get their head down',
    position: 'sweeps',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 2,
    prerequisites: ['closed_guard_break_posture'],
    progressions: ['sweep_attack_arm_when_postured'],
    confidence: 'high',
  },
  {
    id: 'sweep_attack_arm_when_postured',
    label: 'When they posture up, attack the arm to your hip',
    position: 'sweeps',
    belt_floor: 'blue',
    belt_ceiling: null,
    base_difficulty: 3,
    prerequisites: ['sweep_break_posture_first'],
    progressions: [],
    confidence: 'high',
  },
];

// ─── Lookup helpers used by the (future) engine ─────────────
export const skillsById = Object.fromEntries(skills.map((s) => [s.id, s]));

export function prerequisitesMet(skillId, mastery = {}) {
  const skill = skillsById[skillId];
  if (!skill) return false;
  return skill.prerequisites.every((p) => (mastery[p]?.level || 0) >= 0.5);
}
