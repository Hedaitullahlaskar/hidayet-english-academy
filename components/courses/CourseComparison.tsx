"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CourseDetail } from "@/types";

const MAX_COMPARE = 3;

export function CourseComparison({ courses }: { courses: CourseDetail[] }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    courses[0]?.slug ?? "",
    courses[1]?.slug ?? "",
  ]);

  function toggle(slug: string) {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }

  const selected = selectedSlugs
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is CourseDetail => Boolean(c));

  const rows: { label: string; render: (c: CourseDetail) => string }[] = [
    { label: "Level", render: (c) => c.level },
    { label: "Format", render: (c) => c.format },
    { label: "Duration", render: (c) => c.duration },
    { label: "Language", render: (c) => c.language },
    { label: "Best For", render: (c) => c.audience.join(", ") },
    { label: "Focus Areas", render: (c) => c.category.join(", ") },
    { label: "Certificate", render: (c) => (c.certificateStatus === "available" ? "Available" : "Coming Soon") },
  ];

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-navy-600 dark:text-navy-300">
        Select up to {MAX_COMPARE} courses to compare side by side ({selected.length}/{MAX_COMPARE} selected):
      </p>
      <div className="flex flex-wrap gap-2">
        {courses.map((c) => {
          const isSelected = selectedSlugs.includes(c.slug);
          const disabled = !isSelected && selectedSlugs.length >= MAX_COMPARE;
          return (
            <button
              key={c.slug}
              onClick={() => toggle(c.slug)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                isSelected
                  ? "border-gold-500 bg-gold-600 text-navy-900"
                  : "border-navy-200 bg-white text-navy-700 hover:border-gold-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200"
              )}
            >
              <span aria-hidden="true">{c.icon}</span>
              {c.name}
            </button>
          );
        })}
      </div>

      {selected.length >= 2 ? (
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy-100 shadow-card dark:border-navy-700">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-navy-800">
                <th className="p-4 font-display font-semibold text-white">Compare</th>
                {selected.map((c) => (
                  <th key={c.slug} className="p-4 font-display font-semibold text-white">
                    <span className="mr-1.5" aria-hidden="true">
                      {c.icon}
                    </span>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn(i % 2 === 0 ? "bg-white dark:bg-navy-900" : "bg-paper-100 dark:bg-navy-800")}
                >
                  <td className="p-4 font-semibold text-navy-700 dark:text-navy-200">{row.label}</td>
                  {selected.map((c) => (
                    <td key={c.slug} className="p-4 text-navy-600 dark:text-navy-300">
                      {row.render(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-sm text-navy-500 dark:text-navy-400">
          Select at least 2 courses above to see the comparison table.
        </p>
      )}
    </div>
  );
}
