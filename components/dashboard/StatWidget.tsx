import { cn } from "@/lib/utils";

export function StatWidget({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: string;
  label: string;
  value: string;
  tone?: "default" | "gold";
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-xl",
            tone === "gold" ? "bg-gold-100 dark:bg-navy-700" : "bg-navy-100 dark:bg-navy-700"
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">{label}</p>
          <p className="mt-0.5 font-display text-lg font-semibold text-navy-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
