import { describe, it, expect } from "vitest";
import { computeBadges, computeXp, computeLevel, ZERO_ACTIVITY, type ActivityCounts } from "./achievements-logic";

function counts(overrides: Partial<ActivityCounts>): ActivityCounts {
  return { ...ZERO_ACTIVITY, ...overrides };
}

describe("computeBadges", () => {
  it("earns nothing for a brand-new student", () => {
    const badges = computeBadges(ZERO_ACTIVITY);
    expect(badges.every((b) => !b.earned)).toBe(true);
  });

  it("earns First Steps at exactly 1 completed lesson, not before", () => {
    expect(computeBadges(counts({ lessonsCompleted: 0 })).find((b) => b.id === "first-lesson")?.earned).toBe(false);
    expect(computeBadges(counts({ lessonsCompleted: 1 })).find((b) => b.id === "first-lesson")?.earned).toBe(true);
  });

  it("earns Week Warrior from the longest streak, not the current one — a broken streak shouldn't un-earn a past achievement", () => {
    const badges = computeBadges(counts({ currentStreak: 0, longestStreak: 7 }));
    expect(badges.find((b) => b.id === "week-streak")?.earned).toBe(true);
  });

  it("does not earn Month Master on a 7-day streak", () => {
    const badges = computeBadges(counts({ longestStreak: 7 }));
    expect(badges.find((b) => b.id === "month-streak")?.earned).toBe(false);
  });

  it("earns Triple Crown only at 3+ certificates, not 1 or 2", () => {
    expect(computeBadges(counts({ certificatesEarned: 2 })).find((b) => b.id === "three-certificates")?.earned).toBe(false);
    expect(computeBadges(counts({ certificatesEarned: 3 })).find((b) => b.id === "three-certificates")?.earned).toBe(true);
  });
});

describe("computeXp", () => {
  it("is zero for zero activity", () => {
    expect(computeXp(ZERO_ACTIVITY)).toBe(0);
  });

  it("weighs a certificate (100pts) far above a single lesson (10pts) — reflects real effort, not fabricated", () => {
    const lessonOnly = computeXp(counts({ lessonsCompleted: 1 }));
    const certificateOnly = computeXp(counts({ certificatesEarned: 1 }));
    expect(certificateOnly).toBeGreaterThan(lessonOnly * 5);
  });

  it("sums every activity type according to the documented formula", () => {
    const xp = computeXp({
      lessonsCompleted: 2,
      testsCompleted: 1,
      assignmentsSubmitted: 3,
      certificatesEarned: 1,
      currentStreak: 0,
      longestStreak: 5,
    });
    // 2*10 + 1*15 + 3*10 + 1*100 + 5*2 = 20+15+30+100+10 = 175
    expect(xp).toBe(175);
  });
});

describe("computeLevel", () => {
  it("starts everyone at Level 1", () => {
    expect(computeLevel(0).level).toBe(1);
  });

  it("advances to Level 2 at exactly the 100xp threshold, not one point before", () => {
    expect(computeLevel(99).level).toBe(1);
    expect(computeLevel(100).level).toBe(2);
  });

  it("reports 0% progress right at a level's floor and rises toward 100% approaching the next", () => {
    const atFloor = computeLevel(100);
    expect(atFloor.progressPercent).toBe(0);
    const almostNext = computeLevel(249);
    expect(almostNext.level).toBe(2);
    expect(almostNext.progressPercent).toBeGreaterThan(90);
  });

  it("caps at the top of the level table without throwing, reporting 100% progress and no next level", () => {
    const maxed = computeLevel(999999);
    expect(maxed.xpForNextLevel).toBeNull();
    expect(maxed.progressPercent).toBe(100);
  });
});
