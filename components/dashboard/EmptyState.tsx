import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "📭",
  title,
  body,
  className,
}: {
  icon?: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-navy-200 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900",
        className
      )}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-3 font-display font-semibold text-navy-800 dark:text-navy-100">{title}</p>
      <p className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">{body}</p>
    </div>
  );
}
