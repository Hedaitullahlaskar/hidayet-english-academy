import { EmptyState } from "@/components/dashboard/EmptyState";
import { AttendanceMarkingList } from "@/components/teacher/AttendanceMarkingList";
import { getTodaysLiveClasses, getEnrolledStudentsForClass } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AttendancePage() {
  const classes = await getTodaysLiveClasses();
  const rosterEntries = await Promise.all(
    classes.map(async (c: { id: string }) => [c.id, await getEnrolledStudentsForClass(c.id)] as const)
  );
  // Map keyed by class id rather than a parallel array indexed by
  // position — see app/admin/teachers/page.tsx for why array[i] breaks
  // the build under this project's noUncheckedIndexedAccess setting.
  const rostersByClassId = new Map(rosterEntries);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Attendance</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Mark attendance for today's live classes.</p>

      {classes.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="📅"
          title="No classes scheduled today"
          body="Once a live class is scheduled for today, you'll be able to mark attendance for it here."
        />
      ) : (
        <div className="mt-8 space-y-6">
          {classes.map((c: { id: string; title: string; scheduled_at: string }) => {
            const roster = rostersByClassId.get(c.id) ?? [];
            return (
              <div key={c.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
                <p className="font-semibold text-navy-900 dark:text-white">{c.title}</p>
                <p className="text-sm text-navy-500 dark:text-navy-400">{new Date(c.scheduled_at).toLocaleString()}</p>
                {roster.length === 0 ? (
                  <EmptyState
                    className="mt-4"
                    icon="🧑‍🎓"
                    title="No enrolled students yet"
                    body="Once students enroll in this course, they'll appear here to mark present/absent."
                  />
                ) : (
                  <div className="mt-4">
                    <AttendanceMarkingList liveClassId={c.id} students={roster} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
