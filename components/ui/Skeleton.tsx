import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/** A single shimmering placeholder block. Compose with the presets below for common shapes. */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn("skeleton-shimmer animate-shimmer rounded-lg", className)}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === lines - 1 && lines > 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return <Skeleton className={cn("shrink-0 rounded-full", className)} style={{ width: size, height: size }} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-navy-100/60 bg-white p-6 dark:border-navy-700 dark:bg-navy-800", className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={40} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} className="mt-5" />
    </div>
  );
}

export function SkeletonStatWidget({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-navy-100/60 bg-white p-5 dark:border-navy-700 dark:bg-navy-800", className)}>
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="mt-4 h-3 w-2/3" />
      <Skeleton className="mt-2 h-6 w-1/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-navy-100/60 dark:border-navy-700", className)}>
      <div className="border-b border-navy-100/60 bg-paper-100 p-4 dark:border-navy-700 dark:bg-navy-900">
        <div className="flex gap-6">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-navy-100/60 dark:divide-navy-700">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-6 p-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A full dashboard-shaped placeholder — heading, a stat row, then two content panels. Used by route-level loading.tsx files. */
export function SkeletonDashboard() {
  return (
    <div>
      <Skeleton className="h-7 w-64" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatWidget key={i} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
