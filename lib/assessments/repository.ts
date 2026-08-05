"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

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

export async function submitTestAttempt(attemptId: string, score: number): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("test_attempts")
    .update({ score, submitted_at: new Date().toISOString() })
    .eq("id", attemptId);
  return error ? { success: false, error: error.message } : { success: true };
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
