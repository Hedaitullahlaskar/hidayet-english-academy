import { UploadLessonForm } from "@/components/teacher/UploadLessonForm";
import { getCoursesForTeacher } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function UploadLessonsPage() {
  const courses = await getCoursesForTeacher();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Upload Lessons</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Add video, PDF, or audio content to any course — it&apos;s available to enrolled students the moment it&apos;s uploaded.
      </p>
      <div className="mt-8 max-w-2xl">
        <UploadLessonForm courses={courses} />
      </div>
    </div>
  );
}
