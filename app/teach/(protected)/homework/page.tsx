import { CreateAssignmentForm } from "@/components/teacher/CreateAssignmentForm";
import { AssignmentReviewPanel } from "@/components/teacher/AssignmentReviewPanel";
import { getAllAssignments, getCoursesForTeacher } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function HomeworkPage() {
  const [assignments, courses] = await Promise.all([getAllAssignments(), getCoursesForTeacher()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Homework Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Create assignments and review what students submit.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Create Assignment</h2>
          <CreateAssignmentForm courses={courses} />
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Review Submissions</h2>
          <AssignmentReviewPanel assignments={assignments} />
        </div>
      </div>
    </div>
  );
}
