"use client";

import { AI_MODE_LABELS, type AiMode } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

const MODES: AiMode[] = ["grammar", "vocabulary", "conversation", "writing", "reading", "speaking"];

export function AIModeSelector({ activeMode, onSelect }: { activeMode: AiMode; onSelect: (mode: AiMode) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {MODES.map((mode) => {
        const meta = AI_MODE_LABELS[mode];
        const isActive = mode === activeMode;
        return (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors",
              isActive
                ? "border-gold-500 bg-gold-600 text-navy-900"
                : "border-navy-100 bg-white text-navy-700 hover:border-gold-300 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-200"
            )}
          >
            <span className="text-lg" aria-hidden="true">
              {meta.icon}
            </span>
            <span className="text-xs font-semibold leading-tight">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
