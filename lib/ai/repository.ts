import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AiMode } from "@/lib/ai/prompts";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getConversationsByMode(mode: AiMode) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("mode", mode)
      .order("updated_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getConversationMessages(conversationId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("ai_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function createConversation(studentId: string, mode: AiMode, title: string): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({ student_id: studentId, mode, title })
    .select("id")
    .single();
  return error ? null : data.id;
}

export async function appendMessage(conversationId: string, role: "user" | "assistant", content: string) {
  const supabase = createServerSupabaseClient();
  await Promise.all([
    supabase.from("ai_messages").insert({ conversation_id: conversationId, role, content }),
    supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId),
  ]);
}
