import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { AnimatedProgressBar } from "@/components/dashboard/AnimatedProgressBar";
import { getMyOverallPerformance } from "@/lib/dashboard/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function ProgressReportsPage() {
  const performance = await getMyOverallPerformance();

  if (!performance || performance.enrolledCourseCount === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Progress Reports</h1>
        <p className="mt-1 text-navy-600 dark:text-navy-300">Your overall performance across every course, once you're enrolled in one.</p>
        <EmptyState className="mt-8" icon="📊" title="No performance data yet" body="Enroll in a course to start building a real performance picture here." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Progress Reports</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Your overall performance, genuinely computed from real activity — not a projection.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget icon="📚" label="Active Courses" value={String(performance.enrolledCourseCount)} />
        <StatWidget icon="✅" label="Lessons Completed" value={String(performance.totalLessonsCompleted)} />
        <StatWidget
          icon="📅"
          label="Attendance"
          value={performance.attendancePercent !== null ? `${performance.attendancePercent}%` : "No data yet"}
        />
        <StatWidget
          icon="🎯"
          label="Avg. Quiz Score"
          value={performance.avgQuizPercent !== null ? `${performance.avgQuizPercent}%` : "No data yet"}
          tone="gold"
        />
      </div>

      <div className="mt-8 max-w-lg space-y-6 rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <AnimatedProgressBar percent={performance.courseCompletionPercent} label="Course Completion" />
        {performance.attendancePercent !== null && <AnimatedProgressBar percent={performance.attendancePercent} label="Attendance" />}
        {performance.avgQuizPercent !== null && <AnimatedProgressBar percent={performance.avgQuizPercent} label="Average Quiz Score" />}
        {performance.avgAssignmentPercent !== null && <AnimatedProgressBar percent={performance.avgAssignmentPercent} label="Average Assignment Score" />}
      </div>

      <p className="mt-4 text-xs text-navy-400 dark:text-navy-500">
        A metric shows "No data yet" rather than 0% when nothing has happened yet — an honest zero looks the same as
        a discouraging failing score otherwise.
      </p>
    </div>
  );
}
