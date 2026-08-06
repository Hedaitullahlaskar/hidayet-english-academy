"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { cn } from "@/lib/utils";
import { filterOptions } from "@/lib/courses/filterOptions";
import type { CourseAudience, CourseCategory, CourseDetail, CourseLevel } from "@/types";

interface CourseFilterGridProps {
  courses: CourseDetail[];
}

type FilterValue = CourseLevel | CourseAudience | CourseCategory | "All";

function FilterGroup({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("All")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            active === "All"
              ? "border-gold-500 bg-gold-600 text-navy-900"
              : "border-navy-200 bg-white text-navy-700 hover:border-gold-400 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
          )}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active === opt
                ? "border-gold-500 bg-gold-600 text-navy-900"
                : "border-navy-200 bg-white text-navy-700 hover:border-gold-400 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CourseFilterGrid({ courses }: CourseFilterGridProps) {
  const [level, setLevel] = useState<FilterValue>("All");
  const [audience, setAudience] = useState<FilterValue>("All");
  const [category, setCategory] = useState<FilterValue>("All");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (level !== "All" && c.level !== level && c.level !== "All Levels") return false;
      if (audience !== "All" && !c.audience.includes(audience as CourseAudience)) return false;
      if (category !== "All" && !c.category.includes(category as CourseCategory)) return false;
      return true;
    });
  }, [courses, level, audience, category]);

  const hasActiveFilters = level !== "All" || audience !== "All" || category !== "All";

  return (
    <div>
      <div className="grid gap-6 rounded-xl border border-navy-100 bg-paper-100 p-6 dark:border-navy-700 dark:bg-navy-900 sm:grid-cols-3">
        <FilterGroup label="Level" options={filterOptions.levels} active={level} onSelect={(v) => setLevel(v as FilterValue)} />
        <FilterGroup label="Who It's For" options={filterOptions.audiences} active={audience} onSelect={(v) => setAudience(v as FilterValue)} />
        <FilterGroup label="Focus" options={filterOptions.categories} active={category} onSelect={(v) => setCategory(v as FilterValue)} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-navy-600 dark:text-navy-300">
          Showing {filtered.length} of {courses.length} courses
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setLevel("All");
              setAudience("All");
              setCategory("All");
            }}
            className="text-sm font-semibold text-gold-800 underline dark:text-gold-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-navy-200 bg-white p-10 text-center dark:border-navy-700 dark:bg-navy-900">
          <p className="text-navy-600 dark:text-navy-300">
            No courses match that combination yet — try clearing a filter, or{" "}
            <a href="/#contact" className="font-semibold text-gold-800 underline dark:text-gold-400">
              ask us directly
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
