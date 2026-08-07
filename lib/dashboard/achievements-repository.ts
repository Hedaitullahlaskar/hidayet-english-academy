"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ZERO_ACTIVITY, type ActivityCounts } from "@/lib/dashboard/achievements-logic";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getMyActivityCounts(): Promise<ActivityCounts> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return ZERO_ACTIVITY;

    const [{ data: progress }, { data: attempts }, { data: submissions }, { data: certificates }, { data: streak }] = await Promise.all([
      supabase.from("lesson_progress").select("id").eq("student_id", user.id).not("completed_at", "is", null),
      supabase.from("test_attempts").select("id").eq("student_id", user.id).not("submitted_at", "is", null),
      supabase.from("submissions").select("id").eq("student_id", user.id),
      supabase.from("certificates").select("id").eq("student_id", user.id),
      supabase.from("streaks").select("current_streak, longest_streak").eq("student_id", user.id).maybeSingle(),
    ]);

    return {
      lessonsCompleted: (progress ?? []).length,
      testsCompleted: (attempts ?? []).length,
      assignmentsSubmitted: (submissions ?? []).length,
      certificatesEarned: (certificates ?? []).length,
      currentStreak: streak?.current_streak ?? 0,
      longestStreak: streak?.longest_streak ?? 0,
    };
  }, ZERO_ACTIVITY);
}

export type TimelineEventType = "lesson" | "test" | "certificate";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  date: string;
}

/** A real, merged, chronological feed — three separate tables, sorted together client-side after fetch since there's no single "activity log" table to query. */
export async function getMyActivityTimeline(limit = 15): Promise<TimelineEvent[]> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const [{ data: progress }, { data: attempts }, { data: certificates }] = await Promise.all([
      supabase
        .from("lesson_progress")
        .select("completed_at, lessons(title)")
        .eq("student_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(limit),
      supabase
        .from("test_attempts")
        .select("submitted_at, score, tests(title)")
        .eq("student_id", user.id)
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false })
        .limit(limit),
      supabase.from("certificates").select("issued_at, course_slug").eq("student_id", user.id).order("issued_at", { ascending: false }).limit(limit),
    ]);

    const lessonEvents: TimelineEvent[] = (progress ?? []).map((p: { completed_at: string; lessons: { title: string } | { title: string }[] | null }) => {
      const lesson = Array.isArray(p.lessons) ? p.lessons[0] : p.lessons;
      return {
        id: `lesson-${p.completed_at}`,
        type: "lesson",
        title: `Completed "${lesson?.title ?? "a lesson"}"`,
        date: p.completed_at,
      };
    });

    const testEvents: TimelineEvent[] = (attempts ?? []).map((a: { submitted_at: string; score: number | null; tests: { title: string } | { title: string }[] | null }) => {
      const test = Array.isArray(a.tests) ? a.tests[0] : a.tests;
      return {
        id: `test-${a.submitted_at}`,
        type: "test",
        title: `Took "${test?.title ?? "a test"}"${a.score !== null ? ` — scored ${a.score}` : ""}`,
        date: a.submitted_at,
      };
    });

    const certificateEvents: TimelineEvent[] = (certificates ?? []).map((c: { issued_at: string; course_slug: string }) => ({
      id: `certificate-${c.issued_at}`,
      type: "certificate",
      title: `Earned a certificate for ${c.course_slug}`,
      date: c.issued_at,
    }));

    return [...lessonEvents, ...testEvents, ...certificateEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, []);
}
