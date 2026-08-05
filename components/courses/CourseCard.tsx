import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { CourseDetail } from "@/types";

export function CourseCard({ course }: { course: CourseDetail }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-lg border p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        course.featured
          ? "border-gold-400 bg-navy-800 text-white"
          : "border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl" aria-hidden="true">
          {course.icon}
        </span>
        {course.comingSoon ? (
          <Badge tone="gold">Coming Soon</Badge>
        ) : course.featured ? (
          <Badge tone="gold">Flagship</Badge>
        ) : null}
      </div>

      <h3
        className={cn(
          "mt-4 font-display text-lg font-semibold",
          course.featured ? "text-white" : "text-navy-900 dark:text-white"
        )}
      >
        {course.name}
      </h3>
      <p className={cn("mt-1 text-sm", course.featured ? "text-navy-200" : "text-navy-600 dark:text-navy-300")}>
        {course.tagline}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            course.featured ? "bg-white/10 text-gold-300" : "bg-gold-100 text-gold-800 dark:bg-navy-700 dark:text-gold-400"
          )}
        >
          {course.level}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            course.featured ? "bg-white/10 text-navy-100" : "bg-navy-100 text-navy-700 dark:bg-navy-700 dark:text-navy-200"
          )}
        >
          {course.format}
        </span>
      </div>

      <p className={cn("mt-4 text-xs font-semibold", course.featured ? "text-navy-300" : "text-navy-500 dark:text-navy-400")}>
        {course.duration}
      </p>

      <span
        className={cn(
          "mt-5 inline-flex items-center gap-1 text-sm font-semibold",
          course.featured ? "text-gold-400" : "text-gold-800 dark:text-gold-400"
        )}
      >
        View Details
        <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  );
}
