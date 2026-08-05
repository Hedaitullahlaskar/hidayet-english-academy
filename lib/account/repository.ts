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

export async function getMyLoginHistory(limit = 10) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("login_history").select("*").order("created_at", { ascending: false }).limit(limit);
    return data ?? [];
  }, []);
}

export async function getMySessions() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("user_sessions").select("*").is("revoked_at", null).order("last_active_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function revokeSession(sessionId: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("user_sessions").update({ revoked_at: new Date().toISOString() }).eq("id", sessionId);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function requestAccountDeletion(reason: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not logged in." };

  const { error } = await supabase.from("account_deletion_requests").insert({ user_id: user.id, reason });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getMyDeletionRequest() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("account_deletion_requests")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }, null);
}
