import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatWidget({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "default" | "gold";
}) {
  return (
    <div className="group rounded-lg border border-navy-100 bg-white p-5 shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-gold-300/60 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl transition-transform duration-300 ease-premium group-hover:scale-105",
            tone === "gold" ? "bg-gold-100 dark:bg-navy-700" : "bg-navy-100 dark:bg-navy-700"
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">{label}</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-navy-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
