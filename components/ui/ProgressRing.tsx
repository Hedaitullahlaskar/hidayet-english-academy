import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0–100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  tone?: "gold" | "navy" | "success";
  className?: string;
}

const toneStroke: Record<NonNullable<ProgressRingProps["tone"]>, string> = {
  gold: "stroke-gold-600",
  navy: "stroke-navy-700 dark:stroke-navy-300",
  success: "stroke-success",
};

/** Circular progress indicator — used for course completion, quiz averages, and attendance rate visualizations across the student portal. Pure CSS animation, no JS. */
export function ProgressRing({ percent, size = 96, strokeWidth = 8, label, sublabel, tone = "gold", className }: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ? label + ": " : ""}${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-navy-100 dark:stroke-navy-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("animate-ring-progress motion-reduce:animate-none", toneStroke[tone])}
          style={
            {
              "--ring-circumference": circumference,
              "--ring-offset": offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-semibold text-navy-900 dark:text-white">{clamped}%</span>
        {sublabel && <span className="text-[10px] font-medium uppercase tracking-wide text-navy-500 dark:text-navy-400">{sublabel}</span>}
      </div>
    </div>
  );
}
