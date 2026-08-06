"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export interface MutationResult {
  success: boolean;
  error?: string;
}

export async function getLessonsForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_slug", courseSlug)
      .order("order_index", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getLessonById(lessonId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("lessons").select("*").eq("id", lessonId).single();
    return data;
  }, null);
}

export async function getMyProgressForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("lesson_progress")
      .select("*, lessons!inner(course_slug)")
      .eq("lessons.course_slug", courseSlug);
    return data ?? [];
  }, []);
}

export async function getMyProgressForLesson(lessonId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("lesson_id", lessonId)
      .eq("student_id", user.id)
      .maybeSingle();
    return data;
  }, null);
}

/**
 * Called on every lesson visit — upserts a progress row with a fresh
 * `updated_at`, which is also what powers "Recently Viewed Lessons"
 * (ordering by updated_at) without a separate tracking table.
 */
export async function touchLessonProgress(lessonId: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      { student_id: user.id, lesson_id: lessonId, updated_at: new Date().toISOString() },
      { onConflict: "student_id,lesson_id", ignoreDuplicates: false }
    );
  return error ? { success: false, error: error.message } : { success: true };
}

export async function markLessonComplete(lessonId: string, watchTimeSeconds?: number): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(watchTimeSeconds !== undefined ? { watch_time_seconds: watchTimeSeconds } : {}),
    },
    { onConflict: "student_id,lesson_id" }
  );
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getRecentlyViewedLessons(limit = 5) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("lesson_progress")
      .select("*, lessons(*)")
      .order("updated_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  }, []);
}

/**
 * Picks the lesson "Continue Lesson" should jump to: the most recently
 * viewed lesson in this course that isn't complete yet, or the first
 * lesson if nothing's been started.
 */
export async function getContinueLessonForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data: inProgress } = await supabase
      .from("lesson_progress")
      .select("*, lessons!inner(course_slug, order_index)")
      .eq("lessons.course_slug", courseSlug)
      .is("completed_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (inProgress) return inProgress.lesson_id as string;

    const { data: firstLesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_slug", courseSlug)
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle();

    return firstLesson?.id ?? null;
  }, null);
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export async function isLessonBookmarked(lessonId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("lesson_id", lessonId)
      .eq("student_id", user.id)
      .maybeSingle();
    return Boolean(data);
  }, false);
}

export async function toggleBookmark(lessonId: string, bookmarked: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  if (bookmarked) {
    const { error } = await supabase.from("bookmarks").insert({ student_id: user.id, lesson_id: lessonId });
    return error ? { success: false, error: error.message } : { success: true };
  }
  const { error } = await supabase.from("bookmarks").delete().eq("lesson_id", lessonId).eq("student_id", user.id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getMyBookmarkedLessons() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("bookmarks")
      .select("*, lessons(*)")
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

// ---------------------------------------------------------------------------
// Lesson quiz (tests where lesson_id is set, test_type = 'lesson_quiz')
// ---------------------------------------------------------------------------

export async function getLessonQuiz(lessonId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("tests")
      .select("*, test_questions(*, questions(*))")
      .eq("lesson_id", lessonId)
      .eq("test_type", "lesson_quiz")
      .maybeSingle();
    return data;
  }, null);
}

/**
 * Grades server-side from the real answer key, same reasoning as
 * lib/assessments/repository.ts's submitTestAttempt — the client sends
 * raw answers, never a self-computed score.
 */
export async function submitLessonQuizAttempt(
  testId: string,
  answers: Record<string, string>
): Promise<MutationResult & { score?: number }> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  const { data: test } = await supabase
    .from("tests")
    .select("test_questions(id, marks, questions(id, correct_answer))")
    .eq("id", testId)
    .single();

  if (!test) return { success: false, error: "Quiz not found." };

  let earned = 0;
  const testQuestions = (test as any).test_questions ?? [];
  for (const tq of testQuestions as any[]) {
    const questionId = tq?.questions?.id ?? tq?.questions?.[0]?.id;
    const given = (answers[questionId] ?? "").trim().toLowerCase();
    const correct = ((tq?.questions?.correct_answer ?? tq?.questions?.[0]?.correct_answer) ?? "").trim().toLowerCase();
    if (given === correct) earned += Number(tq.marks) || 0;
  }

  // Written via the service-role client — schema.sql's
  // trg_protect_test_attempt_score trigger rejects any INSERT/UPDATE that
  // sets a score unless it's from staff or the service role. student_id is
  // always this authenticated user's own id, so bypassing RLS here can't
  // be used to touch anyone else's attempt.
  const admin = createAdminClient();
  const { error } = await admin
    .from("test_attempts")
    .upsert(
      { test_id: testId, student_id: user.id, submitted_at: new Date().toISOString(), score: earned },
      { onConflict: "test_id,student_id" }
    );
  return error ? { success: false, error: error.message } : { success: true, score: earned };
}

// ---------------------------------------------------------------------------
// Lesson-linked homework
// ---------------------------------------------------------------------------

export async function getLessonAssignment(lessonId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("assignments").select("*").eq("lesson_id", lessonId).maybeSingle();
    return data;
  }, null);
}

export async function getMySubmissionForAssignment(assignmentId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .maybeSingle();
    return data;
  }, null);
}

export async function submitHomework(
  assignmentId: string,
  input: { contentUrl?: string; textContent?: string }
): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  // Real late-submission detection — compares the actual submit moment
  // against the assignment's due_at, not left as a column nobody sets.
  const { data: assignment } = await supabase.from("assignments").select("due_at, allow_late_submission").eq("id", assignmentId).single();
  const now = new Date();
  const isLate = Boolean(assignment?.due_at && new Date(assignment.due_at) < now);

  if (isLate && assignment?.allow_late_submission === false) {
    return { success: false, error: "The due date has passed and late submissions aren't accepted for this assignment." };
  }

  const { error } = await supabase.from("submissions").upsert(
    {
      assignment_id: assignmentId,
      student_id: user.id,
      content_url: input.contentUrl ?? null,
      text_content: input.textContent ?? null,
      submission_type: input.textContent ? "text" : "file",
      is_late: isLate,
      submitted_at: now.toISOString(),
    },
    { onConflict: "assignment_id,student_id" }
  );
  return error ? { success: false, error: error.message } : { success: true };
}
