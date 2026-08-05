import Link from "next/link";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  getCurrentTeacherProfile,
  getAllStudents,
  getTodaysLiveClasses,
  getPendingSubmissionsCount,
  getPendingAssessmentsBreakdown,
  getCompletedReviewsCount,
  getOpenDoubtsCount,
} from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function TeacherHomePage() {
  const [profile, students, todaysClasses, pendingCount, pendingBreakdown, completedReviewsCount, doubtsCount] = await Promise.all([
    getCurrentTeacherProfile(),
    getAllStudents(),
    getTodaysLiveClasses(),
    getPendingSubmissionsCount(),
    getPendingAssessmentsBreakdown(),
    getCompletedReviewsCount(),
    getOpenDoubtsCount(),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const quickActions = [
    { icon: "📹", label: "Schedule a Live Class", href: "/teach/live-classes" },
    { icon: "⬆️", label: "Upload a Lesson", href: "/teach/lessons/upload" },
    { icon: "📝", label: "Create Homework", href: "/teach/homework" },
    { icon: "🎓", label: "Issue a Certificate", href: "/teach/certificates" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">
        Welcome back, {firstName} 👋
      </h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Here's what's happening across the academy today.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget icon="🧑‍🎓" label="Total Students" value={String(students.length)} />
        <StatWidget icon="📹" label="Classes Today" value={String(todaysClasses.length)} />
        <StatWidget icon="📝" label="Pending Reviews" value={String(pendingCount)} tone="gold" />
        <StatWidget icon="💬" label="Open Doubts" value={String(doubtsCount)} tone="gold" />
      </div>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Quick Actions</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-center rounded-lg border border-navy-100 bg-white p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800"
            >
              <span className="text-2xl" aria-hidden="true">{a.icon}</span>
              <span className="mt-2 text-xs font-semibold text-navy-800 dark:text-navy-100">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Evaluation Dashboard</h2>
          <span className="text-xs font-semibold text-navy-500 dark:text-navy-400">{completedReviewsCount} reviews completed all-time</span>
        </div>
        {pendingBreakdown.assignments.length === 0 && pendingBreakdown.tests.length === 0 ? (
          <EmptyState className="mt-4" icon="✅" title="Nothing pending" body="Every submission and test attempt has been reviewed." />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {pendingBreakdown.assignments.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold-800 dark:text-gold-400">
                  {pendingBreakdown.assignments.length} Homework Submission{pendingBreakdown.assignments.length > 1 ? "s" : ""} Awaiting Review
                </p>
                <Link href="/teach/homework" className="mt-2 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                  Review Now →
                </Link>
              </div>
            )}
            {pendingBreakdown.tests.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold-800 dark:text-gold-400">
                  {pendingBreakdown.tests.length} Test Attempt{pendingBreakdown.tests.length > 1 ? "s" : ""} Awaiting Review
                </p>
                <Link href="/teach/marks" className="mt-2 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                  Review Now →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Today's Classes</h2>
          {todaysClasses.length === 0 ? (
            <EmptyState className="mt-4" icon="📹" title="Nothing scheduled today" body="Classes you schedule will appear here." />
          ) : (
            <ul className="mt-4 space-y-3">
              {todaysClasses.map((c: { id: string; title: string; scheduled_at: string }) => (
                <li key={c.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  {c.title} — {new Date(c.scheduled_at).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Recently Joined Students</h2>
          {students.length === 0 ? (
            <EmptyState className="mt-4" icon="🧑‍🎓" title="No students yet" body="Students who register will appear here." />
          ) : (
            <ul className="mt-4 space-y-2">
              {students.slice(0, 5).map((s: { id: string; full_name: string }) => (
                <li key={s.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  <Link href={`/teach/students/${s.id}`} className="font-medium text-navy-800 hover:text-gold-800 dark:text-navy-100">
                    {s.full_name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
