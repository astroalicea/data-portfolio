"""PinPoint recommendation engine — Python reference implementation.

This mirrors the JS engine in `src/lib/focus.js`. It exists so the same
logic can be used for offline analysis, batch jobs, or a future Python
service. The JS version is the one shipped in the app today.

Rules (per CLAUDE.md): functions return values, never print.
"""

from collections import Counter
from dataclasses import dataclass
from typing import Iterable, Optional

POSITION_TO_AREA = {
    "guard": "guard_retention",
    "side_control": "side_control_escape",
    "back": "back_defense",
    "mount": "mount_escape",
    "standing": "guard_retention",
}

COLD_START_AREAS = {
    "white": {
        "early": ["surviving_pressure", "back_defense"],
        "later": ["guard_retention", "mount_escape", "side_control_escape"],
    },
    "blue": {
        "early": ["passing", "back_attacks"],
        "later": ["sweeps", "submissions", "pressure_control"],
    },
    "purple": {
        "early": ["transitions", "timing"],
        "later": ["weak_side"],
    },
}

FEELING_TO_DIFFICULTY_BIAS = {
    "lost": "beginner",
    "some_moments": "intermediate",
    "felt_decent": None,
}


@dataclass
class CheckIn:
    got_tapped: bool
    position_lost: Optional[str]
    attempted_focus: str  # yes | tried | forgot
    overall_feeling: str  # lost | some_moments | felt_decent


@dataclass
class User:
    belt_level: str
    months_training: int


def identify_problem_area(recent_checkins: Iterable[CheckIn]) -> Optional[str]:
    positions = [c.position_lost for c in recent_checkins if c.got_tapped and c.position_lost]
    if not positions:
        return None
    most_common_position, _ = Counter(positions).most_common(1)[0]
    return POSITION_TO_AREA.get(most_common_position)


def calculate_attempt_rate(recent_checkins: list[CheckIn]) -> float:
    if not recent_checkins:
        return 1.0
    attempts = [c for c in recent_checkins if c.attempted_focus in ("yes", "tried")]
    return len(attempts) / len(recent_checkins)


def dominant_feeling(recent_checkins: Iterable[CheckIn]) -> Optional[str]:
    feelings = [c.overall_feeling for c in recent_checkins]
    if not feelings:
        return None
    return Counter(feelings).most_common(1)[0][0]


def _filter_library(focus_library, belt_level, area=None, difficulty=None):
    matches = [f for f in focus_library if f["belt_level"] == belt_level]
    if area:
        matches = [f for f in matches if f["area"] == area]
    if difficulty:
        matches = [f for f in matches if f["difficulty"] == difficulty]
    return matches


def _pick_one(items, seed):
    if not items:
        return None
    return items[abs(int(seed)) % len(items)]


def get_cold_start_focus(belt_level, months_training, focus_library, seed=0):
    buckets = COLD_START_AREAS.get(belt_level, COLD_START_AREAS["white"])
    pool = buckets["early"] if months_training < 6 else buckets["early"] + buckets["later"]
    area = _pick_one(pool, seed)
    beginner_match = _filter_library(focus_library, belt_level, area, "beginner")
    return _pick_one(beginner_match or _filter_library(focus_library, belt_level, area), seed)


def get_simpler_focus(belt_level, area, focus_library, seed=0):
    beginner = _filter_library(focus_library, belt_level, area, "beginner")
    return _pick_one(beginner or _filter_library(focus_library, belt_level, area), seed)


def get_targeted_focus(belt_level, area, difficulty, focus_library, seed=0):
    matches = _filter_library(focus_library, belt_level, area, difficulty)
    if matches:
        return _pick_one(matches, seed)
    any_difficulty = _filter_library(focus_library, belt_level, area)
    if any_difficulty:
        return _pick_one(any_difficulty, seed)
    return get_cold_start_focus(belt_level, 12, focus_library, seed)


def get_focus_for_user(user: User, recent_checkins: list[CheckIn], focus_library, seed=0):
    """Pick the next focus for a user.

    Cold-start uses belt level. Once history exists, the focus targets the
    position the user is most often tapped from, simplifying when the user
    keeps forgetting to attempt the focus.
    """
    window = recent_checkins[:10]
    if not window:
        return get_cold_start_focus(user.belt_level, user.months_training, focus_library, seed)

    problem_area = identify_problem_area(window)
    attempt_rate = calculate_attempt_rate(window)
    feeling = dominant_feeling(window)

    if attempt_rate < 0.5:
        area = problem_area or COLD_START_AREAS.get(user.belt_level, {}).get("early", [None])[0]
        return get_simpler_focus(user.belt_level, area, focus_library, seed)

    difficulty_bias = FEELING_TO_DIFFICULTY_BIAS.get(feeling)
    area = problem_area or _pick_one(
        COLD_START_AREAS.get(user.belt_level, {}).get("early", []), seed
    )
    return get_targeted_focus(user.belt_level, area, difficulty_bias, focus_library, seed)
