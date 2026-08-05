import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "gold" | "navy" | "success" | "outline";

const tones: Record<Tone, string> = {
  gold: "bg-gold-100 text-gold-800 border border-gold-300",
  navy: "bg-navy-800 text-white",
  success: "bg-success/10 text-success-text border border-success/30 dark:bg-success/15 dark:text-emerald-400 dark:border-success/40",
  outline: "bg-transparent text-navy-700 border border-navy-300 dark:text-navy-200 dark:border-navy-600",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "gold", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
