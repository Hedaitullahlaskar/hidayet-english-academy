"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface LiveClassItem {
  id: string;
  title: string;
  scheduled_at: string;
}

export function MiniCalendar({ liveClasses }: { liveClasses: LiveClassItem[] }) {
  const { t } = useLanguage();
  const [cursor, setCursor] = useState(() => new Date());

  const classDates = useMemo(() => {
    const set = new Set<string>();
    liveClasses.forEach((c) => {
      const d = new Date(c.scheduled_at);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
  }, [liveClasses]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const today = new Date();

  const cells: (number | null)[] = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-navy-900 dark:text-white">{monthLabel}</p>
        <div className="flex gap-1">
          <button
            aria-label="Previous month"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-navy-500 hover:bg-navy-100 dark:text-navy-400 dark:hover:bg-navy-700"
          >
            ‹
          </button>
          <button
            aria-label="Next month"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-navy-500 hover:bg-navy-100 dark:text-navy-400 dark:hover:bg-navy-700"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-navy-400 dark:text-navy-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const isToday =
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const hasClass = classDates.has(`${year}-${month}-${day}`);
          return (
            <div
              key={i}
              className={cn(
                "relative flex h-8 items-center justify-center rounded-full text-xs",
                isToday
                  ? "bg-navy-800 font-bold text-gold-300"
                  : "text-navy-700 dark:text-navy-200"
              )}
            >
              {day}
              {hasClass && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-gold-600" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      {liveClasses.length === 0 && (
        <p className="mt-4 text-center text-xs text-navy-500 dark:text-navy-400">{t("noClassesScheduled")}</p>
      )}
    </div>
  );
}
