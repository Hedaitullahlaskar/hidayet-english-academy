import Link from "next/link";

interface RecentLessonItem {
  id: string;
  lessons: { id: string; title: string; course_slug: string; lesson_type: "video" | "pdf" | "audio" } | null;
}

const typeIcon = { video: "🎬", pdf: "📄", audio: "🎧" } as const;

export function RecentlyViewedLessons({ items }: { items: RecentLessonItem[] }) {
  const withLesson = items.filter((i) => i.lessons);

  if (withLesson.length === 0) return null;

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <p className="font-display text-sm font-semibold text-navy-900 dark:text-white">Recently Viewed Lessons</p>
      <ul className="mt-3 space-y-2">
        {withLesson.map((item) => (
          <li key={item.id}>
            <Link
              href={`/dashboard/courses/${item.lessons!.course_slug}/learn/${item.lessons!.id}`}
              className="flex items-center gap-2 rounded-lg border border-navy-100 p-2.5 text-sm text-navy-700 hover:border-gold-300 dark:border-navy-700 dark:text-navy-200"
            >
              <span aria-hidden="true">{typeIcon[item.lessons!.lesson_type]}</span>
              {item.lessons!.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
