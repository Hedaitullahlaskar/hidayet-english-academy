import { ComposeAnnouncementForm } from "@/components/teacher/ComposeAnnouncementForm";
import { getCoursesForTeacher } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function NotificationsPage() {
  const courses = await getCoursesForTeacher();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Notifications</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Publish an announcement to everyone, or to students in a specific course.</p>
      <div className="mt-8 max-w-xl">
        <ComposeAnnouncementForm courses={courses} />
      </div>
    </div>
  );
}
