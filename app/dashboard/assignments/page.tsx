import { EmptyState } from "@/components/dashboard/EmptyState";
import { LessonHomeworkPanel } from "@/components/lessons/LessonHomeworkPanel";
import { getPendingAssignments } from "@/lib/dashboard/repository";
import { getMySubmissionForAssignment } from "@/lib/lessons/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AssignmentsPage() {
  const assignments = await getPendingAssignments();
  const submissionEntries = await Promise.all(
    assignments.map(async (a: { id: string }) => [a.id, await getMySubmissionForAssignment(a.id)] as const)
  );
  // Map keyed by assignment id rather than a parallel array indexed by
  // position — see app/admin/teachers/page.tsx for why array[i] breaks
  // the build under this project's noUncheckedIndexedAccess setting.
  const submissionsByAssignmentId = new Map(submissionEntries);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Homework & Assignments</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Purposeful work, tied directly to what you're learning.</p>

      {assignments.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="📝"
          title="No assignments yet"
          body="Your teacher hasn't assigned any homework yet. Check back after your next class."
        />
      ) : (
        <div className="mt-8 space-y-4">
          {assignments.map((a: { id: string; title: string; description: string | null; due_at: string | null }) => (
            <div key={a.id}>
              {a.due_at && (
                <p className="mb-1.5 text-xs font-semibold text-navy-500 dark:text-navy-400">
                  Due {new Date(a.due_at).toLocaleDateString()}
                </p>
              )}
              <LessonHomeworkPanel
                assignmentId={a.id}
                title={a.title}
                description={a.description}
                alreadySubmitted={Boolean(submissionsByAssignmentId.get(a.id))}
                dueAt={a.due_at}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
