import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSupabaseClient, type MockResponse } from "../../test-utils/supabaseMock";

// Mutable per-test fixture — the mock factory below closes over it, and
// vi.mock is hoisted above these imports by Vitest, so this pattern (set
// the fixture in each test, then import the module under test) is what
// lets every test configure its own Supabase responses.
let tableResponses: Record<string, MockResponse> = {};

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => mockSupabaseClient(tableResponses),
}));

// Everything else this file transitively imports (email client, live-class
// providers) is real production code gated by real env vars/API keys, not
// relevant to the two pure-aggregation functions under test here — no
// need to mock those modules individually.
const { getStudentWeakAreas, getRevenueForCourses } = await import("./repository");

beforeEach(() => {
  tableResponses = {};
});

describe("getStudentWeakAreas", () => {
  it("flags a course only when the average sits below its own pass_percentage", async () => {
    tableResponses.test_attempts = {
      data: [
        { score: 40, tests: { course_slug: "grammar-basics", total_marks: 100, pass_percentage: 60 } },
        { score: 45, tests: { course_slug: "grammar-basics", total_marks: 100, pass_percentage: 60 } },
        { score: 90, tests: { course_slug: "vocabulary", total_marks: 100, pass_percentage: 60 } },
        { score: 85, tests: { course_slug: "vocabulary", total_marks: 100, pass_percentage: 60 } },
      ],
      error: null,
    };

    const result = await getStudentWeakAreas("student-1");

    expect(result).toEqual([{ courseSlug: "grammar-basics", avgPercent: 43, attemptCount: 2 }]);
  });

  it("requires 2+ scored attempts before flagging a course — one bad day isn't a pattern", async () => {
    tableResponses.test_attempts = {
      data: [{ score: 10, tests: { course_slug: "grammar-basics", total_marks: 100, pass_percentage: 60 } }],
      error: null,
    };

    expect(await getStudentWeakAreas("student-1")).toEqual([]);
  });

  it("sorts multiple weak areas worst-first", async () => {
    tableResponses.test_attempts = {
      data: [
        { score: 55, tests: { course_slug: "course-a", total_marks: 100, pass_percentage: 60 } },
        { score: 55, tests: { course_slug: "course-a", total_marks: 100, pass_percentage: 60 } },
        { score: 20, tests: { course_slug: "course-b", total_marks: 100, pass_percentage: 60 } },
        { score: 20, tests: { course_slug: "course-b", total_marks: 100, pass_percentage: 60 } },
      ],
      error: null,
    };

    const result = await getStudentWeakAreas("student-1");
    expect(result.map((w) => w.courseSlug)).toEqual(["course-b", "course-a"]);
  });

  it("returns [] (not a throw) when the query errors — safeQuery's honest-fallback contract", async () => {
    tableResponses.test_attempts = { data: null, error: { message: "connection lost" } };
    // A null `data` with a real Supabase client would still resolve, not
    // throw — this file's safeQuery wrapper only catches actual
    // exceptions, so this also proves `(data ?? [])` guards a null response.
    expect(await getStudentWeakAreas("student-1")).toEqual([]);
  });
});

describe("getRevenueForCourses", () => {
  it("returns [] without querying when given no course slugs", async () => {
    expect(await getRevenueForCourses([])).toEqual([]);
  });

  it("groups revenue by currency instead of summing incompatible currencies together", async () => {
    tableResponses.orders = {
      data: [
        { amount_minor_units: 50000, currency: "INR", admin_courses: { slug: "spoken-english" } },
        { amount_minor_units: 30000, currency: "INR", admin_courses: { slug: "spoken-english" } },
        { amount_minor_units: 2000, currency: "USD", admin_courses: { slug: "spoken-english" } },
      ],
      error: null,
    };

    const result = await getRevenueForCourses(["spoken-english"]);

    expect(result).toContainEqual({ currency: "INR", totalMinorUnits: 80000 });
    expect(result).toContainEqual({ currency: "USD", totalMinorUnits: 2000 });
    expect(result).toHaveLength(2);
  });
});
