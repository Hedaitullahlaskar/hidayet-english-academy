import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  tone?: "white" | "paper" | "navy";
}

const tones = {
  white: "bg-white",
  paper: "bg-paper-100",
  navy: "bg-navy-800 text-white",
};

export function Card({
  className,
  hoverLift = false,
  tone = "white",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-navy-100/60 p-6 shadow-card",
        tones[tone],
        hoverLift &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
