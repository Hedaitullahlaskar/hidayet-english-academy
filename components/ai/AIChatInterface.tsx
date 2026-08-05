"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AI_MODE_LABELS, type AiMode } from "@/lib/ai/prompts";
import { SpeakingPracticeMicButton } from "@/components/ai/SpeakingPracticeMicButton";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AIChatInterface({ mode, aiConfigured }: { mode: AiMode; aiConfigured: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const meta = AI_MODE_LABELS[mode];

  // Switching modes starts a fresh thread — mixing a Grammar conversation
  // into Writing Correction would confuse the system prompt's context.
  useEffect(() => {
    setMessages([]);
    setConversationId(null);
    setError("");
  }, [mode]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError("");
    const userMessage: ChatMessage = { id: `local-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, message: trimmed, conversationId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong.");
        setSending(false);
        return;
      }

      setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { id: `local-${Date.now()}-r`, role: "assistant", content: data.reply }]);
    } catch {
      setError("Couldn't reach the AI assistant — check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (!aiConfigured) {
    return (
      <div className="rounded-lg border border-dashed border-navy-200 bg-paper-100 p-10 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-3xl" aria-hidden="true">
          🤖
        </span>
        <p className="mt-3 font-display font-semibold text-navy-800 dark:text-navy-100">AI Assistant Not Connected Yet</p>
        <p className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">
          This feature is fully built and ready — it just needs <code>ANTHROPIC_API_KEY</code> set in the
          environment to go live. See AI_LESSON_PLAYER_README.md.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[560px] flex-col rounded-lg border border-navy-100 bg-white shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="text-3xl" aria-hidden="true">
              {meta.icon}
            </span>
            <p className="mt-3 max-w-xs text-sm text-navy-500 dark:text-navy-400">{meta.description}</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-gold-600 text-navy-900"
                    : "bg-paper-100 text-navy-800 dark:bg-navy-900 dark:text-navy-100"
                )}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-paper-100 px-4 py-2.5 text-sm text-navy-500 dark:bg-navy-900 dark:text-navy-400">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {error && <p className="border-t border-navy-100 px-5 py-2 text-xs font-medium text-error dark:border-navy-700">{error}</p>}

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-navy-100 p-4 dark:border-navy-700">
        {mode === "speaking" && <SpeakingPracticeMicButton />}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={mode === "writing" ? 3 : 1}
          placeholder={meta.placeholder}
          className="flex-1 resize-none rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-600 text-navy-900 disabled:opacity-40"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}
