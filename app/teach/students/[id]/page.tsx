import { notFound } from "next/navigation";
import { Avatar } from "@/components/dashboard/Avatar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import {
  getStudentById,
  getStudentEnrollments,
  getStudentSubmissions,
  getStudentAttendance,
} from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id);
  if (!student) notFound();

  const [enrollments, submissions, attendance] = await Promise.all([
    getStudentEnrollments(params.id),
    getStudentSubmissions(params.id),
    getStudentAttendance(params.id),
  ]);

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar name={student.full_name} avatarUrl={student.avatar_url} size={56} />
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">{student.full_name}</h1>
          <p className="text-sm text-navy-500 dark:text-navy-400">{student.phone ?? "No phone on file"} · {student.country ?? "Unknown location"}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Enrollments</h2>
          {enrollments.length === 0 ? (
            <EmptyState className="mt-3" icon="📚" title="Not enrolled yet" body="No course enrollments on record." />
          ) : (
            <ul className="mt-3 space-y-2">
              {enrollments.map((e: { id: string; course_slug: string; status: string }) => (
                <li key={e.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  {e.course_slug} <Badge tone="success">{e.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Submissions</h2>
          {submissions.length === 0 ? (
            <EmptyState className="mt-3" icon="📝" title="No submissions yet" body="Homework submissions will appear here." />
          ) : (
            <ul className="mt-3 space-y-2">
              {submissions.map((s: { id: string; score: number | null; assignments: { title: string } | null }) => (
                <li key={s.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  {s.assignments?.title ?? "Assignment"} — {s.score ?? "Not graded"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Attendance</h2>
          {attendance.length === 0 ? (
            <EmptyState className="mt-3" icon="📅" title="No attendance recorded" body="Live class attendance will appear here." />
          ) : (
            <ul className="mt-3 space-y-2">
              {attendance.map((a: { id: string; status: string; live_classes: { title: string } | null }) => (
                <li key={a.id} className="rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                  {a.live_classes?.title ?? "Class"} — {a.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
