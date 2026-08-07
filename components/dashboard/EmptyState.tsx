import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "📭",
  title,
  body,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-navy-200 bg-paper-100 px-8 py-10 text-center dark:border-navy-700 dark:bg-navy-900",
        className
      )}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-card dark:bg-navy-800" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-4 font-display text-base font-semibold text-navy-800 dark:text-navy-100">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-navy-500 dark:text-navy-400">{body}</p>
    </div>
  );
}
