import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AI_MODE_PROMPTS, type AiMode } from "@/lib/ai/prompts";

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Real call to the Anthropic API — not a mock, not a canned response.
 * Throws if ANTHROPIC_API_KEY isn't set; the route handler that calls this
 * is responsible for checking isAiConfigured() first and returning an
 * honest "not configured" response instead of a raw error.
 */
export async function getAiResponse(mode: AiMode, history: ChatMessage[]): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: AI_MODE_PROMPTS[mode],
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}
