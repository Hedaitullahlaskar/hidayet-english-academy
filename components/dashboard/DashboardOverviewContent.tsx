"use client";

import Link from "next/link";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { AnimatedProgressBar } from "@/components/dashboard/AnimatedProgressBar";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { RecentAnnouncements } from "@/components/dashboard/RecentAnnouncements";
import { RecentlyViewedLessons } from "@/components/dashboard/RecentlyViewedLessons";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DashboardOverviewContentProps {
  firstName: string;
  enrollments: { id: string; course_slug: string }[];
  continueCourse: { id: string; course_slug: string } | null;
  liveClasses: { id: string; title: string; scheduled_at: string; meeting_url: string | null }[];
  assignments: unknown[];
  tests: unknown[];
  certificates: unknown[];
  streak: { current_streak: number } | null;
  announcements: { id: string; title: string; body: string; published_at: string }[];
  recentlyViewed: { id: string; lessons: { id: string; title: string; course_slug: string; lesson_type: "video" | "pdf" | "audio" } | null }[];
}

export function DashboardOverviewContent({
  firstName,
  enrollments,
  continueCourse,
  liveClasses,
  assignments,
  tests,
  certificates,
  streak,
  announcements,
  recentlyViewed,
}: DashboardOverviewContentProps) {
  const { t } = useLanguage();
  const nextClass = liveClasses[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">
        {t("welcomeBack")}, {firstName} 👋
      </h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">{t("todaySummary")}</p>

      {/* Continue Learning — large, prominent */}
      <div className="mt-6">
        <ContinueLearningCard courseSlug={continueCourse?.course_slug ?? null} progressPercent={0} />
      </div>

      {/* Stat widgets */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget icon="📚" label={t("activeCourses")} value={String(enrollments.length)} />
        <StatWidget icon="⏱️" label={t("timeThisWeek")} value="0h" />
        <StatWidget icon="📝" label={t("pendingHomework")} value={String(assignments.length)} />
        <StatWidget icon="✅" label={t("upcomingTests")} value={String(tests.length)} />
        <StatWidget icon="🎓" label={t("certificatesEarned")} value={String(certificates.length)} tone="gold" />
        <StatWidget icon="🔥" label={t("dailyStreak")} value={streak ? `${streak.current_streak} ${t("days")}` : `0 ${t("days")}`} tone="gold" />
        <StatWidget icon="📈" label={t("overallProgress")} value={enrollments.length > 0 ? "0%" : "—"} />
        <StatWidget
          icon="📅"
          label={t("nextLiveClass")}
          value={nextClass ? new Date(nextClass.scheduled_at).toLocaleDateString() : "—"}
        />
      </div>

      {/* Quick Links */}
      <div className="mt-6 rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <QuickLinks nextClassUrl={nextClass?.meeting_url ?? undefined} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Current courses with animated progress */}
        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">{t("currentCourses")}</h2>
          {enrollments.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon="📚"
              title={t("noCourseYet")}
              body="Once you enroll in a course, it'll show up here with your progress."
            />
          ) : (
            <div className="mt-4 space-y-5">
              {enrollments.map((e) => (
                <div key={e.id}>
                  <AnimatedProgressBar percent={0} label={e.course_slug} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">
            {t("upcomingClasses")}
          </p>
          <MiniCalendar liveClasses={liveClasses} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">{t("recommendedNext")}</h2>
          <EmptyState
            className="mt-4"
            icon="✨"
            title="Nothing recommended yet"
            body="Enroll in a course and complete your first lesson — we'll start recommending what's next after that."
          />
        </div>

        <RecentAnnouncements announcements={announcements} />
      </div>

      {recentlyViewed.length > 0 && (
        <div className="mt-6">
          <RecentlyViewedLessons items={recentlyViewed} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/assignments" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          View Assignments →
        </Link>
        <Link href="/dashboard/tests" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          View Tests →
        </Link>
        <Link href="/dashboard/certificates" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          View Certificates →
        </Link>
      </div>
    </div>
  );
}
