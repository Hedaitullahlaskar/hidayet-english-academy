import Link from "next/link";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyEnrollments } from "@/lib/dashboard/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function MyCoursesPage() {
  const enrollments = await getMyEnrollments();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">My Courses</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Your enrolled courses and progress through each.</p>

      {enrollments.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="📚"
          title="You're not enrolled in anything yet"
          body="Browse the course catalog and join a free class to get started."
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e: { id: string; course_slug: string }) => (
            <div key={e.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <p className="font-display font-semibold text-navy-900 dark:text-white">{e.course_slug}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-700">
                <div className="h-full rounded-full bg-gold-600" style={{ width: "0%" }} />
              </div>
              <p className="mt-1.5 text-xs text-navy-500 dark:text-navy-400">0% complete</p>
              <Link
                href={`/dashboard/courses/${e.course_slug}/learn`}
                className="mt-4 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400"
              >
                Continue Learning →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/courses" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          Browse the full course catalog →
        </Link>
      </div>
    </div>
  );
}
