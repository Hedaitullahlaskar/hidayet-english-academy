import { Flame, Trophy, Calendar } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyAttendance, getMyStreak } from "@/lib/dashboard/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AttendancePage() {
  const [attendance, streak] = await Promise.all([getMyAttendance(), getMyStreak()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Attendance & Streak</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Consistency compounds — here&apos;s your record.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatWidget icon={<Flame className="h-5 w-5" strokeWidth={1.75} />} label="Current Streak" value={streak ? `${streak.current_streak} days` : "0 days"} tone="gold" />
        <StatWidget icon={<Trophy className="h-5 w-5" strokeWidth={1.75} />} label="Longest Streak" value={streak ? `${streak.longest_streak} days` : "0 days"} />
        <StatWidget icon={<Calendar className="h-5 w-5" strokeWidth={1.75} />} label="Classes Attended" value={String(attendance.filter((a: { status: string }) => a.status === "present").length)} />
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-navy-900 dark:text-white">Attendance History</h2>
      {attendance.length === 0 ? (
        <EmptyState className="mt-4" icon={<Calendar className="h-6 w-6" strokeWidth={1.75} />} title="No attendance recorded yet" body="Your attendance at live classes will be tracked here automatically." />
      ) : (
        <ul className="mt-4 space-y-2">
          {attendance.map((a: { id: string; status: string; live_classes: { title: string } | null }) => (
            <li key={a.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
              {a.live_classes?.title ?? "Live class"} — {a.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
