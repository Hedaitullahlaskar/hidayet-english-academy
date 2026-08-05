"use client";

import { Button } from "@/components/ui/Button";
import { AnimatedProgressBar } from "@/components/dashboard/AnimatedProgressBar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ContinueLearningCardProps {
  courseSlug: string | null;
  courseName?: string;
  progressPercent?: number;
}

export function ContinueLearningCard({
  courseSlug,
  courseName,
  progressPercent = 0,
}: ContinueLearningCardProps) {
  const { t } = useLanguage();

  if (!courseSlug) {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-6 text-center shadow-card dark:border-navy-700 dark:bg-navy-800 sm:p-8">
        <span className="text-3xl" aria-hidden="true">
          🚀
        </span>
        <p className="mt-3 font-display font-semibold text-navy-800 dark:text-navy-100">{t("noCourseYet")}</p>
        <Button href="/courses" size="lg" className="mt-5">
          {t("browseCoursesCta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gold-400 bg-navy-800 p-6 shadow-elevated sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-600/20 blur-2xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-gold-400">{t("continueLearning")}</p>
          <h2 className="mt-1.5 font-display text-xl font-semibold text-white sm:text-2xl">
            {courseName ?? courseSlug}
          </h2>
          <p className="mt-1.5 text-sm text-navy-300">{t("keepGoing")}</p>
          <div className="mt-4 max-w-xs">
            <AnimatedProgressBar percent={progressPercent} />
          </div>
        </div>
        <Button href={`/dashboard/courses/${courseSlug}/learn`} size="lg" className="shrink-0">
          {t("continueLearning")} →
        </Button>
      </div>
    </div>
  );
}
