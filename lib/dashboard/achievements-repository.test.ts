import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSupabaseClient, type MockResponse } from "../../test-utils/supabaseMock";
import { ZERO_ACTIVITY } from "./achievements-logic";

let tableResponses: Record<string, MockResponse>;
let mockUser: { id: string } | null;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => mockSupabaseClient(tableResponses, mockUser),
}));

const { getMyActivityCounts } = await import("./achievements-repository");

beforeEach(() => {
  tableResponses = {};
  mockUser = { id: "student-42" };
});

describe("getMyActivityCounts", () => {
  it("returns all-zero activity for a signed-out visitor (the early-return guard before any table query)", async () => {
    mockUser = null;
    expect(await getMyActivityCounts()).toEqual(ZERO_ACTIVITY);
  });

  it("counts real rows per table and reads the streak columns directly", async () => {
    tableResponses.lesson_progress = { data: [{ id: "1" }, { id: "2" }, { id: "3" }], error: null };
    tableResponses.test_attempts = { data: [{ id: "1" }], error: null };
    tableResponses.submissions = { data: [{ id: "1" }, { id: "2" }], error: null };
    tableResponses.certificates = { data: [{ id: "1" }], error: null };
    tableResponses.streaks = { data: { current_streak: 4, longest_streak: 12 }, error: null };

    const counts = await getMyActivityCounts();

    expect(counts).toEqual({
      lessonsCompleted: 3,
      testsCompleted: 1,
      assignmentsSubmitted: 2,
      certificatesEarned: 1,
      currentStreak: 4,
      longestStreak: 12,
    });
  });

  it("defaults streak fields to 0 when the student has no streaks row yet (maybeSingle returns null)", async () => {
    tableResponses.streaks = { data: null, error: null };
    const counts = await getMyActivityCounts();
    expect(counts.currentStreak).toBe(0);
    expect(counts.longestStreak).toBe(0);
  });
});
