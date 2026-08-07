import Link from "next/link";
import { notFound } from "next/navigation";
import { Video, FileText, Headphones, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getCourseBySlug } from "@/lib/courses/repository";
import { getUpcomingLiveClasses, getClassReplaysForCourse, getCurrentProfile } from "@/lib/dashboard/repository";
import {
  getLessonsForCourse,
  getMyProgressForCourse,
  getContinueLessonForCourse,
} from "@/lib/lessons/repository";
import { formatInTimezone } from "@/lib/utils/timezone";

export const metadata = { robots: { index: false, follow: false } };

interface Lesson {
  id: string;
  module_title: string;
  title: string;
  lesson_type: "video" | "pdf" | "audio";
  order_index: number;
}

export default async function CourseLessonListPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const [lessons, progress, continueLessonId, liveClasses, replays, profile] = await Promise.all([
    getLessonsForCourse(params.slug),
    getMyProgressForCourse(params.slug),
    getContinueLessonForCourse(params.slug),
    getUpcomingLiveClasses(1),
    getClassReplaysForCourse(params.slug),
    getCurrentProfile(),
  ]);

  const completedIds = new Set(
    (progress as { lesson_id: string; completed_at: string | null }[])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id)
  );

  const moduleGroups = new Map<string, Lesson[]>();
  (lessons as Lesson[]).forEach((lesson) => {
    const group = moduleGroups.get(lesson.module_title) ?? [];
    group.push(lesson);
    moduleGroups.set(lesson.module_title, group);
  });

  const totalCount = lessons.length;
  const completedCount = completedIds.size;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextClass = liveClasses[0];
  const studentTimezone = profile?.timezone ?? "Asia/Kolkata";
  const typeIcon = { video: Video, pdf: FileText, audio: Headphones } as const;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{course.icon}</span>
        <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">{course.name}</h1>
      </div>

      {totalCount === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Video className="h-6 w-6" strokeWidth={1.75} />}
          title="No lessons uploaded yet"
          body="Your teacher hasn't added video, PDF, or audio content for this course yet — check back soon."
        />
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gold-400 bg-navy-800 p-5 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold-400">Your Progress</p>
              <p className="mt-1 font-display text-lg font-semibold">{completedCount} of {totalCount} lessons complete ({percent}%)</p>
            </div>
            {continueLessonId && (
              <Button href={`/dashboard/courses/${params.slug}/learn/${continueLessonId}`} size="lg">
                Continue Lesson →
              </Button>
            )}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-8">
              {Array.from(moduleGroups.entries()).map(([moduleTitle, moduleLessons]) => (
                <div key={moduleTitle}>
                  <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">{moduleTitle}</h2>
                  <div className="mt-3 space-y-2">
                    {moduleLessons.map((lesson) => {
                      const LessonIcon = typeIcon[lesson.lesson_type];
                      return (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/courses/${params.slug}/learn/${lesson.id}`}
                        className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-4 shadow-card transition-colors hover:border-gold-300 dark:border-navy-700 dark:bg-navy-800"
                      >
                        <div className="flex items-center gap-3">
                          <LessonIcon className="h-4 w-4 text-navy-500 dark:text-navy-400" strokeWidth={1.75} aria-hidden="true" />
                          <span className="text-sm font-medium text-navy-800 dark:text-navy-100">{lesson.title}</span>
                        </div>
                        {completedIds.has(lesson.id) ? (
                          <Badge tone="success">✓ Done</Badge>
                        ) : (
                          <span className="text-xs font-semibold text-gold-800 dark:text-gold-400">Start →</span>
                        )}
                      </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border border-gold-300 bg-paper-100 p-5 dark:border-navy-700 dark:bg-navy-900">
                <p className="text-xs font-bold uppercase tracking-wide text-gold-800 dark:text-gold-400">Next Live Class</p>
                {nextClass ? (
                  <>
                    <p className="mt-2 font-semibold text-navy-900 dark:text-white">{nextClass.title}</p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
                      {formatInTimezone(nextClass.scheduled_at, studentTimezone)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={nextClass.meeting_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-gold-600 px-4 py-2 text-sm font-semibold text-navy-900">
                        Join Class ({nextClass.platform === "zoom" ? "Zoom" : "Google Meet"}) →
                      </a>
                      <a href={`/api/live-classes/${nextClass.id}/calendar`} className="inline-flex items-center gap-1 rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 dark:border-navy-600 dark:text-navy-200">
                        <Calendar className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Add to Calendar
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">No live class currently scheduled.</p>
                )}
              </div>

              {replays.length > 0 && (
                <div className="rounded-lg border border-navy-100 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
                  <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Past Classes &amp; Replays</p>
                  <div className="mt-3 space-y-2">
                    {replays.map((r: { id: string; title: string; scheduled_at: string; recording_url: string }) => (
                      <a
                        key={r.id}
                        href={r.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-navy-100 p-3 text-sm hover:border-gold-300 dark:border-navy-700"
                      >
                        <p className="font-medium text-navy-800 dark:text-navy-100">▶ {r.title}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{formatInTimezone(r.scheduled_at, studentTimezone, { timeStyle: undefined, dateStyle: "medium" })}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
