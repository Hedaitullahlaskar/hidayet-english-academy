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

export async function getTestForTaking(testId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("tests")
      .select("*, test_questions(*, questions(*))")
      .eq("id", testId)
      .single();
    return data;
  }, null);
}

export async function getMyAttemptsForTest(testId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("test_id", testId)
      .order("attempt_number", { ascending: false });
    return data ?? [];
  }, []);
}

export async function startTestAttempt(testId: string, attemptNumber: number): Promise<{ attemptId: string } | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("test_attempts")
    .insert({ test_id: testId, student_id: user.id, attempt_number: attemptNumber })
    .select("id")
    .single();

  return error ? null : { attemptId: data.id };
}

/**
 * Grades and submits a test attempt entirely server-side. The client only
 * ever sends the student's raw answers, never a score — correct_answer is
 * fetched fresh here, on the server, and never shipped to the browser (see
 * app/dashboard/tests/[testId]/take/page.tsx, which strips it before
 * passing question data to the client component). Trusting a client-
 * supplied score would let any student grade their own test as 100%; this
 * closes that gap by recomputing the score from the real answer key on
 * every submission.
 *
 * The final write uses the service-role client, not the student's own
 * session — schema.sql's trg_protect_test_attempt_score trigger rejects
 * any score change that isn't from staff or the service role, so this is
 * what makes that DB-level protection actually compatible with a
 * student-initiated submission. Ownership is verified explicitly first
 * since the admin client bypasses RLS.
 */
export async function submitTestAttempt(
  attemptId: string,
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

  if (!test) return { success: false, error: "Test not found." };

  let earned = 0;
  const testQuestions = (test as any).test_questions ?? [];
  for (const tq of testQuestions as any[]) {
    const questionId = tq?.questions?.id ?? tq?.questions?.[0]?.id;
    const given = (answers[questionId] ?? "").trim().toLowerCase();
    const correct = ((tq?.questions?.correct_answer ?? tq?.questions?.[0]?.correct_answer) ?? "").trim().toLowerCase();
    if (given === correct) earned += Number(tq.marks) || 0;
  }

  const admin = createAdminClient();
  const { data: attempt } = await admin
    .from("test_attempts")
    .select("id")
    .eq("id", attemptId)
    .eq("student_id", user.id)
    .maybeSingle();
  if (!attempt) return { success: false, error: "Attempt not found." };

  const { error } = await admin
    .from("test_attempts")
    .update({ score: earned, submitted_at: new Date().toISOString() })
    .eq("id", attemptId);

  return error ? { success: false, error: error.message } : { success: true, score: earned };
}

/**
 * All tests a student can see (via existing enrollment-based RLS), with
 * their own attempt history joined in — this is what makes "score
 * history" and "multiple attempts" visible on /dashboard/tests, not just
 * possible in the database.
 */
export async function getMyTestsWithHistory(testType: "weekly" | "mock") {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data: tests } = await supabase
      .from("tests")
      .select("*")
      .eq("test_type", testType)
      .order("scheduled_at", { ascending: false });

    if (!tests || tests.length === 0) return [];

    const { data: attempts } = await supabase
      .from("test_attempts")
      .select("*")
      .in("test_id", tests.map((t: { id: string }) => t.id));

    return tests.map((test: { id: string }) => ({
      ...test,
      attempts: (attempts ?? []).filter((a: { test_id: string }) => a.test_id === test.id),
    }));
  }, []);
}
