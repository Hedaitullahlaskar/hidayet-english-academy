"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedProgressBar({
  percent,
  label,
  className,
}: {
  percent: number;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const clamped = Math.max(0, Math.min(100, percent));

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setWidth(clamped);
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setWidth(clamped);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay so the fill is visibly a fill, not an instant jump.
          requestAnimationFrame(() => setWidth(clamped));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [clamped]);

  return (
    <div ref={ref} className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-navy-600 dark:text-navy-300">{label}</span>
          <span className="font-semibold text-navy-800 dark:text-navy-100">{clamped}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 transition-[width] duration-1000 ease-out"
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
