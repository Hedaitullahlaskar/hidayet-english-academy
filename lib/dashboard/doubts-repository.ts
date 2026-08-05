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

export async function getMyDoubts() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("doubts")
      .select("*, doubt_replies(*)")
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function askDoubt(courseSlug: string, question: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  const { error } = await supabase.from("doubts").insert({ student_id: user.id, course_slug: courseSlug, question: question.trim() });
  return error ? { success: false, error: error.message } : { success: true };
}
