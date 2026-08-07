/**
 * Pure, synchronous gamification logic — deliberately separate from
 * achievements-repository.ts's "use server" data fetching, since a
 * "use server" file may only export async functions. Everything here is
 * a plain computation over real activity counts already read from the
 * database; nothing here invents data.
 */

export interface ActivityCounts {
  lessonsCompleted: number;
  testsCompleted: number;
  assignmentsSubmitted: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
}

export const ZERO_ACTIVITY: ActivityCounts = {
  lessonsCompleted: 0,
  testsCompleted: 0,
  assignmentsSubmitted: 0,
  certificatesEarned: 0,
  currentStreak: 0,
  longestStreak: 0,
};

export type BadgeIcon = "sprout" | "book" | "flame" | "target" | "star" | "award" | "crown" | "graduation-cap";

export interface Badge {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  icon: BadgeIcon;
}

/** Every badge is a threshold on a real, already-computed count — no badge here is stored; all are recomputed from current activity every time this runs. */
export function computeBadges(counts: ActivityCounts): Badge[] {
  return [
    { id: "first-lesson", label: "First Steps", description: "Complete your first lesson", earned: counts.lessonsCompleted >= 1, icon: "sprout" },
    { id: "ten-lessons", label: "Bookworm", description: "Complete 10 lessons", earned: counts.lessonsCompleted >= 10, icon: "book" },
    { id: "week-streak", label: "Week Warrior", description: "Reach a 7-day learning streak", earned: counts.longestStreak >= 7, icon: "flame" },
    { id: "month-streak", label: "Month Master", description: "Reach a 30-day learning streak", earned: counts.longestStreak >= 30, icon: "flame" },
    { id: "first-test", label: "Test Taker", description: "Complete your first test", earned: counts.testsCompleted >= 1, icon: "target" },
    { id: "five-homework", label: "Homework Hero", description: "Submit 5 assignments", earned: counts.assignmentsSubmitted >= 5, icon: "star" },
    { id: "first-certificate", label: "Certified", description: "Earn your first certificate", earned: counts.certificatesEarned >= 1, icon: "award" },
    { id: "three-certificates", label: "Triple Crown", description: "Earn 3 certificates", earned: counts.certificatesEarned >= 3, icon: "crown" },
    { id: "twentyfive-lessons", label: "Dedicated Learner", description: "Complete 25 lessons", earned: counts.lessonsCompleted >= 25, icon: "graduation-cap" },
  ];
}

/**
 * XP is a transparent, documented formula over real counts — never a
 * stored, independently-editable number. Weighting reflects real effort:
 * a certificate (100pts) represents far more work than a single lesson
 * (10pts).
 */
export function computeXp(counts: ActivityCounts): number {
  return (
    counts.lessonsCompleted * 10 +
    counts.testsCompleted * 15 +
    counts.assignmentsSubmitted * 10 +
    counts.certificatesEarned * 100 +
    counts.longestStreak * 2
  );
}

// Cumulative XP required to REACH each level (index 0 = Level 1's floor).
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000];

export interface LevelInfo {
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  progressPercent: number;
}

export function computeLevel(xp: number): LevelInfo {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const ceiling = LEVEL_THRESHOLDS[level] ?? null;
  const xpIntoLevel = xp - floor;
  const xpForNextLevel = ceiling !== null ? ceiling - floor : null;
  return {
    level,
    xp,
    xpIntoLevel,
    xpForNextLevel,
    progressPercent: xpForNextLevel ? Math.round((xpIntoLevel / xpForNextLevel) * 100) : 100,
  };
}
