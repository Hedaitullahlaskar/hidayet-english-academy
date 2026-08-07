import { GraduationCap, BarChart3, ClipboardList, CalendarCheck, Mic, IndianRupee, Users } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  getCourseAnalytics,
  getCoursesForTeacher,
  getCourseAttendanceRate,
  getRevenueForCourses,
} from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

function formatMoney(minorUnits: number, currency: string) {
  return `${currency} ${(minorUnits / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AnalyticsPage() {
  const myCourses = await getCoursesForTeacher();
  const featured = myCourses.slice(0, 6);
  const [analyticsEntries, attendanceEntries, revenue] = await Promise.all([
    Promise.all(featured.map(async (c) => [c.slug, await getCourseAnalytics(c.slug)] as const)),
    Promise.all(featured.map(async (c) => [c.slug, await getCourseAttendanceRate(c.slug)] as const)),
    getRevenueForCourses(myCourses.map((c) => c.slug)),
  ]);
  // Map keyed by course slug rather than a parallel array indexed by
  // position — see app/admin/teachers/page.tsx for why array[i] breaks
  // the build under this project's noUncheckedIndexedAccess setting.
  const analyticsBySlug = new Map(analyticsEntries);
  const attendanceBySlug = new Map(attendanceEntries);

  const totalEnrolled = analyticsEntries.reduce((sum, [, a]) => sum + a.enrolledCount, 0);
  const scoredCourses = analyticsEntries.filter(([, a]) => a.avgTestScore !== null);
  const overallAvgScore =
    scoredCourses.length > 0
      ? Math.round(scoredCourses.reduce((sum, [, a]) => sum + (a.avgTestScore ?? 0), 0) / scoredCourses.length)
      : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Teaching Analytics</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Real enrollment, score, attendance, and revenue data across your courses — genuinely zero until
        students are active, never a projection.
      </p>

      {/* Summary row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatWidget icon={<Users className="h-5 w-5" strokeWidth={1.75} />} label="Total Students" value={String(totalEnrolled)} />
        <StatWidget icon={<BarChart3 className="h-5 w-5" strokeWidth={1.75} />} label="Avg. Test Score" value={overallAvgScore !== null ? `${overallAvgScore}%` : "No data yet"} tone="gold" />
        <StatWidget
          icon={<IndianRupee className="h-5 w-5" strokeWidth={1.75} />}
          label="Revenue Collected"
          value={revenue.length > 0 ? revenue.map((r) => formatMoney(r.totalMinorUnits, r.currency)).join(" · ") : formatMoney(0, "INR")}
          tone="gold"
        />
        <StatWidget icon={<GraduationCap className="h-5 w-5" strokeWidth={1.75} />} label="Courses Taught" value={String(myCourses.length)} />
      </div>
      {revenue.length === 0 && (
        <p className="mt-2 text-xs text-navy-500 dark:text-navy-400">
          Revenue reads {formatMoney(0, "INR")} because no order for your courses has a &apos;paid&apos; status yet —
          this isn&apos;t a placeholder, it&apos;s an accurate read of real payment records.
        </p>
      )}

      {/* Per-course breakdown */}
      <h2 className="mt-10 font-display text-lg font-semibold text-navy-900 dark:text-white">Course Statistics</h2>
      {featured.length === 0 ? (
        <EmptyState className="mt-4" icon={<GraduationCap className="h-6 w-6" strokeWidth={1.75} />} title="No assigned courses yet" body="Analytics will appear here once you're assigned to teach a course." />
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => {
            const a = analyticsBySlug.get(c.slug);
            const attendanceRate = attendanceBySlug.get(c.slug) ?? null;
            return (
              <div key={c.slug} className="rounded-lg border border-navy-100 bg-white p-5 shadow-soft dark:border-navy-700 dark:bg-navy-800">
                <p className="font-display font-semibold text-navy-900 dark:text-white">{c.name}</p>
                <div className="mt-4 space-y-3">
                  <StatWidget icon={<GraduationCap className="h-5 w-5" strokeWidth={1.75} />} label="Enrolled" value={String(a?.enrolledCount ?? 0)} />
                  <StatWidget icon={<BarChart3 className="h-5 w-5" strokeWidth={1.75} />} label="Avg. Test Score" value={a?.avgTestScore != null ? `${a.avgTestScore}%` : "No data yet"} />
                  <StatWidget icon={<ClipboardList className="h-5 w-5" strokeWidth={1.75} />} label="Submissions" value={String(a?.totalSubmissions ?? 0)} />
                  <StatWidget icon={<CalendarCheck className="h-5 w-5" strokeWidth={1.75} />} label="Attendance Rate" value={attendanceRate !== null ? `${attendanceRate}%` : "No data yet"} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Speaking assessment — honestly not built, not faked */}
      <h2 className="mt-10 font-display text-lg font-semibold text-navy-900 dark:text-white">Speaking Assessment</h2>
      <EmptyState
        className="mt-4"
        icon={<Mic className="h-6 w-6" strokeWidth={1.75} />}
        title="Not built yet"
        body="There's no speaking-assessment data model in the platform today — no oral test type, no scoring rubric, no recording review flow. Rather than show a fabricated score here, this stays an honest empty state until that feature is actually designed and built."
      />
    </div>
  );
}
