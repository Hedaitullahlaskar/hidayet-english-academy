import { notFound } from "next/navigation";
import { BookOpen, ClipboardList, Calendar, CheckSquare, AlertTriangle } from "lucide-react";
import { Avatar } from "@/components/dashboard/Avatar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { StudentNotesPanel } from "@/components/teacher/StudentNotesPanel";
import {
  getStudentById,
  getStudentEnrollments,
  getStudentSubmissions,
  getStudentAttendance,
  getStudentTestAttempts,
  getStudentWeakAreas,
  getStudentNotes,
} from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id);
  if (!student) notFound();

  const [enrollments, submissions, attendance, testAttempts, weakAreas, notes] = await Promise.all([
    getStudentEnrollments(params.id),
    getStudentSubmissions(params.id),
    getStudentAttendance(params.id),
    getStudentTestAttempts(params.id),
    getStudentWeakAreas(params.id),
    getStudentNotes(params.id),
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

      {weakAreas.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-navy-900 dark:text-white">Weak areas identified</p>
            <p className="mt-0.5 text-sm text-navy-700 dark:text-navy-200">
              Averaging below the pass mark, across 2+ scored tests each:{" "}
              {weakAreas.map((w) => `${w.courseSlug} (${w.avgPercent}%, ${w.attemptCount} attempts)`).join(", ")}.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Enrollments</h2>
          {enrollments.length === 0 ? (
            <EmptyState className="mt-3" icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} />} title="Not enrolled yet" body="No course enrollments on record." />
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
            <EmptyState className="mt-3" icon={<ClipboardList className="h-6 w-6" strokeWidth={1.75} />} title="No submissions yet" body="Homework submissions will appear here." />
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
            <EmptyState className="mt-3" icon={<Calendar className="h-6 w-6" strokeWidth={1.75} />} title="No attendance recorded" body="Live class attendance will appear here." />
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

        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Test Scores</h2>
          {testAttempts.length === 0 ? (
            <EmptyState className="mt-3" icon={<CheckSquare className="h-6 w-6" strokeWidth={1.75} />} title="No tests taken yet" body="Scored test attempts will appear here." />
          ) : (
            <ul className="mt-3 space-y-2">
              {testAttempts.map((a: { id: string; score: number | null; tests: { title: string; total_marks: number } | { title: string; total_marks: number }[] | null }) => {
                const test = Array.isArray(a.tests) ? a.tests[0] : a.tests;
                return (
                  <li key={a.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                    <span className="text-navy-800 dark:text-navy-100">{test?.title ?? "Test"}</span>
                    <Badge tone={a.score !== null && test && a.score / test.total_marks >= 0.6 ? "success" : "outline"}>
                      {a.score !== null && test ? `${a.score}/${test.total_marks}` : "Not graded"}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <StudentNotesPanel studentId={params.id} notes={notes} />
      </div>
    </div>
  );
}
