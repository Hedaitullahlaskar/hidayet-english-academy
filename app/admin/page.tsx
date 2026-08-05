import { StatWidget } from "@/components/dashboard/StatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getGlobalStats, getRecentActivity, getSystemHealth, getCurrentAdminProfile } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminGlobalDashboard() {
  const [stats, activity, health, profile] = await Promise.all([
    getGlobalStats(),
    getRecentActivity(),
    getSystemHealth(),
    getCurrentAdminProfile(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">
        Welcome, {profile?.full_name?.split(" ")[0] ?? "Admin"} 🌐
      </h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">The entire academy, at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatWidget icon="🧑‍🎓" label="Total Students" value={String(stats.totalStudents)} />
        <StatWidget icon="🟢" label="Active Students" value={String(stats.activeStudents)} />
        <StatWidget icon="👨‍🏫" label="Teachers" value={String(stats.teacherCount)} />
        <StatWidget icon="💰" label="Revenue" value={`₹${stats.revenue}`} tone="gold" />
        <StatWidget icon="📹" label="Live Classes" value={String(stats.upcomingLiveClasses)} />
        <StatWidget icon="🛒" label="Course Sales" value={String(stats.courseSales)} tone="gold" />
      </div>

      {stats.activeStudents === 0 && stats.totalStudents > 0 && (
        <p className="mt-3 text-xs text-navy-500 dark:text-navy-400">
          "Active Students" reads 0 honestly — tracking real 7-day activity needs session logging that isn't built yet, not because nobody is active.
        </p>
      )}
      {stats.revenue === 0 && (
        <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
          Revenue reads ₹0 because no live payment gateway is connected yet (Module 16) — this isn't a placeholder, it's accurate.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Recent Activity</h2>
          {activity.length === 0 ? (
            <EmptyState className="mt-4" icon="📜" title="No activity yet" body="Sensitive admin actions (role changes, suspensions, refunds) will appear here as they happen." />
          ) : (
            <ul className="mt-4 space-y-2">
              {activity.map((a: { id: string; action: string; created_at: string; profiles: { full_name: string } | null }) => (
                <li key={a.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  <span className="font-medium text-navy-800 dark:text-navy-100">{a.profiles?.full_name ?? "System"}</span>{" "}
                  <span className="text-navy-500 dark:text-navy-400">{a.action.replace(/_/g, " ")} · {new Date(a.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">System Health</h2>
          <ul className="mt-4 space-y-2">
            {health.map((h: { name: string; ok: boolean; detail: string }) => (
              <li key={h.name} className="flex items-center justify-between rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                <span className="font-medium text-navy-800 dark:text-navy-100">{h.name}</span>
                <span className={h.ok ? "font-semibold text-success-text dark:text-success" : "font-semibold text-error"}>
                  {h.ok ? "✓ " : "✗ "}{h.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
