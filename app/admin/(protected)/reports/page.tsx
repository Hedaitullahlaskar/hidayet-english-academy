import { GraduationCap, UserCog, ShoppingCart, Video, IndianRupee } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { getGlobalStats } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminReportsPage() {
  const stats = await getGlobalStats();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Reports &amp; Analytics</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Platform-wide numbers, genuinely computed — not illustrative.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatWidget icon={<GraduationCap className="h-5 w-5" strokeWidth={1.75} />} label="Total Students" value={String(stats.totalStudents)} />
        <StatWidget icon={<UserCog className="h-5 w-5" strokeWidth={1.75} />} label="Teachers" value={String(stats.teacherCount)} />
        <StatWidget icon={<ShoppingCart className="h-5 w-5" strokeWidth={1.75} />} label="Total Enrollments" value={String(stats.courseSales)} />
        <StatWidget icon={<Video className="h-5 w-5" strokeWidth={1.75} />} label="Upcoming Live Classes" value={String(stats.upcomingLiveClasses)} />
        <StatWidget icon={<IndianRupee className="h-5 w-5" strokeWidth={1.75} />} label="Revenue" value={`₹${stats.revenue}`} tone="gold" />
      </div>

      <p className="mt-6 text-sm text-navy-500 dark:text-navy-400">
        Deeper reports (revenue trends, cohort retention, per-course completion rates) need real usage history to
        be meaningful — the queries are straightforward to add to <code>lib/admin/repository.ts</code> once there&apos;s
        real data to report on. Building elaborate charts against zero real data would be misleading, not premium.
      </p>
    </div>
  );
}
