"use client";

import { useEffect, useState } from "react";
import { AIModeSelector } from "@/components/ai/AIModeSelector";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { AI_MODE_LABELS, type AiMode } from "@/lib/ai/prompts";

// AI configuration status is fetched client-side from a tiny status
// endpoint rather than passed as a server prop, since this page has no
// other server-rendered data — keeping it a client component makes mode
// switching instant with no page reload.
export function AIAssistantView() {
  const [mode, setMode] = useState<AiMode>("grammar");
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((data) => setAiConfigured(data.configured))
      .catch(() => setAiConfigured(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">AI Study Assistant</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">{AI_MODE_LABELS[mode].description}</p>

      <div className="mt-6">
        <AIModeSelector activeMode={mode} onSelect={setMode} />
      </div>

      <div className="mt-6">
        {aiConfigured === null ? (
          <div className="h-[560px] animate-pulse rounded-lg border border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900" />
        ) : (
          <AIChatInterface mode={mode} aiConfigured={aiConfigured} />
        )}
      </div>
    </div>
  );
}
