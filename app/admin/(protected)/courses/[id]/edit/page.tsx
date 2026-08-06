import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/CourseManagementForms";
import { TeacherAssignmentPanel } from "@/components/admin/TeacherAssignmentPanel";
import { getAdminCourseById, getTeacherAssignmentsForCourse, getAllTeachers } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

interface PageProps {
  params: { id: string };
}

export default async function EditCoursePage({ params }: PageProps) {
  const course = await getAdminCourseById(params.id);
  if (!course) notFound();

  const [assignments, allTeachers] = await Promise.all([
    getTeacherAssignmentsForCourse(course.slug),
    getAllTeachers(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Edit Course</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">{course.name}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CourseForm existing={course} />
        <TeacherAssignmentPanel courseSlug={course.slug} assignments={assignments} allTeachers={allTeachers} />
      </div>
    </div>
  );
}
