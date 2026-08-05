import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAiResponse, isAiConfigured } from "@/lib/ai/client";
import { createConversation, appendMessage, getConversationMessages } from "@/lib/ai/repository";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import type { AiMode } from "@/lib/ai/prompts";

const VALID_MODES: AiMode[] = ["grammar", "vocabulary", "conversation", "writing", "reading", "speaking"];

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "The AI assistant isn't connected yet — ANTHROPIC_API_KEY isn't set." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { mode?: string; message?: string; conversationId?: string | null };
  const { mode, message, conversationId } = body;

  if (!mode || !VALID_MODES.includes(mode as AiMode) || !message || message.trim().length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message is too long (4000 character limit)." }, { status: 400 });
  }

  const rateLimit = await checkRateLimit(user.id, "ai_message", 30, 15);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: `Too many messages — please wait ${rateLimit.retryAfterMinutes} minutes.` },
      { status: 429 }
    );
  }

  let activeConversationId = conversationId ?? null;
  if (!activeConversationId) {
    activeConversationId = await createConversation(user.id, mode as AiMode, message.slice(0, 60));
    if (!activeConversationId) {
      return NextResponse.json({ error: "Couldn't start a conversation. Please try again." }, { status: 500 });
    }
  }

  await appendMessage(activeConversationId, "user", message.trim());

  const history = await getConversationMessages(activeConversationId);
  const formattedHistory = history.map((m: { role: "user" | "assistant"; content: string }) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const reply = await getAiResponse(mode as AiMode, formattedHistory);
    await appendMessage(activeConversationId, "assistant", reply);
    return NextResponse.json({ conversationId: activeConversationId, reply });
  } catch {
    return NextResponse.json(
      { error: "ai_error", message: "The AI assistant couldn't respond just now — please try again." },
      { status: 502 }
    );
  }
}
