import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateCourseForm, CourseListWithPublishToggle } from "@/components/admin/CourseManagementForms";
import { getAdminCourses } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Course Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Create and publish courses through this admin table — separate from the public catalog&apos;s static file until the two are wired together (see README).
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Create a Course</h2>
          <CreateCourseForm />
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">All Courses ({courses.length})</h2>
          {courses.length === 0 ? (
            <EmptyState icon="📚" title="No admin-managed courses yet" body="Courses you create here are draft by default — publish when ready." />
          ) : (
            <CourseListWithPublishToggle courses={courses} />
          )}
        </div>
      </div>
    </div>
  );
}
