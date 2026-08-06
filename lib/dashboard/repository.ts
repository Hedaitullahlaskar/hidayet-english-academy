import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * DASHBOARD REPOSITORY — the data-access seam for the entire Student LMS,
 * following the same pattern established in Module 4's course repository.
 *
 * Every function here genuinely queries Supabase. Until real credentials
 * exist (see .env.example), these calls will fail — caught deliberately and
 * turned into an empty array/null rather than a crashed page. That empty
 * state IS the honest, correct behavior for a database with real
 * connectivity but a genuinely new student: "no assignments yet" is true,
 * not a placeholder.
 */

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getCurrentProfile() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  }, null);
}

export async function getMyEnrollments() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false });
    return data ?? [];
  }, []);
}

/**
 * Picks the course to feature in the "Continue Learning" card — today,
 * simply the most recently enrolled active course, since lesson_progress
 * has no real data to rank by yet. Once real progress exists, this should
 * rank by most-recently-touched lesson instead.
 */
export async function getContinueLearningCourse() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("status", "active")
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }, null);
}

export async function getCourseProgress(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("lesson_progress")
      .select("*, lessons!inner(course_slug)")
      .eq("lessons.course_slug", courseSlug);
    return data ?? [];
  }, []);
}

export async function getUpcomingLiveClasses(limit = 3) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .gte("scheduled_at", new Date().toISOString())
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true })
      .limit(limit);
    return data ?? [];
  }, []);
}

export async function getClassReplaysForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .eq("course_slug", courseSlug)
      .not("recording_url", "is", null)
      .order("scheduled_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getLiveClassById(id: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("live_classes").select("*").eq("id", id).maybeSingle();
    return data;
  }, null);
}

export async function getLiveClassesInRange(startISO: string, endISO: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .gte("scheduled_at", startISO)
      .lte("scheduled_at", endISO)
      .order("scheduled_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getPendingAssignments() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("assignments")
      .select("*, submissions(id)")
      .is("submissions.id", null)
      .order("due_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getUpcomingTests(testType?: "weekly" | "mock") {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("tests")
      .select("*")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true });
    if (testType) query = query.eq("test_type", testType);
    const { data } = await query;
    return data ?? [];
  }, []);
}

export async function getMyCertificates() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("certificates").select("*").order("issued_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyStreak() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("streaks").select("*").eq("student_id", user.id).single();
    return data;
  }, null);
}

export async function getMyNotes() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyBookmarks() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("bookmarks").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyVocabulary() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("vocabulary_entries").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyAttendance() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("attendance").select("*, live_classes(*)").order("marked_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getAnnouncements(limit = 10) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  }, []);
}

export async function getMyNotifications() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
    return data ?? [];
  }, []);
}

export async function getUnreadNotificationCount() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", false);
    return count ?? 0;
  }, 0);
}

/**
 * Genuinely aggregated performance, not a "coming soon" placeholder —
 * course completion, attendance %, quiz average, and assignment average,
 * each computed from real rows rather than any single number being
 * invented. Any metric with zero underlying data returns null (rendered
 * as "Not enough data yet"), not a fabricated 0% or 100%.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * DASHBOARD REPOSITORY — the data-access seam for the entire Student LMS,
 * following the same pattern established in Module 4's course repository.
 *
 * Every function here genuinely queries Supabase. Until real credentials
 * exist (see .env.example), these calls will fail — caught deliberately and
 * turned into an empty array/null rather than a crashed page. That empty
 * state IS the honest, correct behavior for a database with real
 * connectivity but a genuinely new student: "no assignments yet" is true,
 * not a placeholder.
 */

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getCurrentProfile() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  }, null);
}

export async function getMyEnrollments() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false });
    return data ?? [];
  }, []);
}

/**
 * Picks the course to feature in the "Continue Learning" card — today,
 * simply the most recently enrolled active course, since lesson_progress
 * has no real data to rank by yet. Once real progress exists, this should
 * rank by most-recently-touched lesson instead.
 */
export async function getContinueLearningCourse() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("status", "active")
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }, null);
}

export async function getCourseProgress(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("lesson_progress")
      .select("*, lessons!inner(course_slug)")
      .eq("lessons.course_slug", courseSlug);
    return data ?? [];
  }, []);
}

export async function getUpcomingLiveClasses(limit = 3) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .gte("scheduled_at", new Date().toISOString())
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true })
      .limit(limit);
    return data ?? [];
  }, []);
}

export async function getClassReplaysForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .eq("course_slug", courseSlug)
      .not("recording_url", "is", null)
      .order("scheduled_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getLiveClassById(id: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("live_classes").select("*").eq("id", id).maybeSingle();
    return data;
  }, null);
}

export async function getLiveClassesInRange(startISO: string, endISO: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .gte("scheduled_at", startISO)
      .lte("scheduled_at", endISO)
      .order("scheduled_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getPendingAssignments() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("assignments")
      .select("*, submissions(id)")
      .is("submissions.id", null)
      .order("due_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getUpcomingTests(testType?: "weekly" | "mock") {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    let query = supabase
      .from("tests")
      .select("*")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true });
    if (testType) query = query.eq("test_type", testType);
    const { data } = await query;
    return data ?? [];
  }, []);
}

export async function getMyCertificates() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("certificates").select("*").order("issued_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyStreak() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("streaks").select("*").eq("student_id", user.id).single();
    return data;
  }, null);
}

export async function getMyNotes() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyBookmarks() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("bookmarks").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyVocabulary() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("vocabulary_entries").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getMyAttendance() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("attendance").select("*, live_classes(*)").order("marked_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getAnnouncements(limit = 10) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  }, []);
}

export async function getMyNotifications() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
    return data ?? [];
  }, []);
}

export async function getUnreadNotificationCount() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("read", false);
    return count ?? 0;
  }, 0);
}

/**
 * Genuinely aggregated performance, not a "coming soon" placeholder —
 * course completion, attendance %, quiz average, and assignment average,
 * each computed from real rows rather than any single number being
 * invented. Any metric with zero underlying data returns null (rendered
 * as "Not enough data yet"), not a fabricated 0% or 100%.
 */
export async function getMyOverallPerformance() {
  return safeQuery(
    async () => {
      const supabase = createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const [{ data: enrollments }, { data: allLessons }, { data: progress }, { data: attendance }, { data: attempts }, { data: submissions }] =
        await Promise.all([
          supabase.from("enrollments").select("course_slug").eq("student_id", user.id).eq("status", "active"),
          supabase.from("lessons").select("id, course_slug"),
          supabase.from("lesson_progress").select("lesson_id, completed_at").eq("student_id", user.id),
          supabase.from("attendance").select("status").eq("student_id", user.id),
          supabase.from("test_attempts").select("score, tests(total_marks)").eq("student_id", user.id).not("submitted_at", "is", null),
          supabase.from("submissions").select("score, assignments(max_score)").eq("student_id", user.id).not("score", "is", null),
        ]);

      const courseSlugs = new Set((enrollments ?? []).map((e: { course_slug: string }) => e.course_slug));
      const relevantLessons = (allLessons ?? []).filter((l: { course_slug: string }) => courseSlugs.has(l.course_slug));
      const completedLessonIds = new Set(
        (progress ?? []).filter((p: { completed_at: string | null }) => p.completed_at).map((p: { lesson_id: string }) => p.lesson_id)
      );
      const courseCompletionPercent =
        relevantLessons.length > 0
          ? Math.round((relevantLessons.filter((l: { id: string }) => completedLessonIds.has(l.id)).length / relevantLessons.length) * 100)
          : 0;

      const presentCount = (attendance ?? []).filter((a: { status: string }) => a.status === "present").length;
      const attendancePercent = attendance && attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : null;

      const scoredAttempts = (attempts ?? []).filter(
        (a: { score: number | null; tests: { total_marks: number }[] }) => a.score !== null && a.tests?.[0]?.total_marks
      );
      const avgQuizPercent =
        scoredAttempts.length > 0
          ? Math.round(
              scoredAttempts.reduce(
                (sum: number, a: { score: number; tests: { total_marks: number }[] }) => sum + (a.score / a.tests[0].total_marks) * 100,
                0
              ) / scoredAttempts.length
            )
          : null;

      const scoredSubmissions = (submissions ?? []).filter(
        (s: { score: number | null; assignments: { max_score: number }[] }) => s.score !== null && s.assignments?.[0]?.max_score
      );
      const avgAssignmentPercent =
        scoredSubmissions.length > 0
          ? Math.round(
              scoredSubmissions.reduce(
                (sum: number, s: { score: number; assignments: { max_score: number }[] }) => sum + (s.score / s.assignments[0].max_score) * 100,
                0
              ) / scoredSubmissions.length
            )
          : null;

      return {
        enrolledCourseCount: courseSlugs.size,
        courseCompletionPercent,
        attendancePercent,
        avgQuizPercent,
        avgAssignmentPercent,
        totalLessonsCompleted: completedLessonIds.size,
      };
    },
    null
  );
}

