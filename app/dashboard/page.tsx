import { DashboardOverviewContent } from "@/components/dashboard/DashboardOverviewContent";
import {
  getCurrentProfile,
  getMyEnrollments,
  getContinueLearningCourse,
  getUpcomingLiveClasses,
  getPendingAssignments,
  getUpcomingTests,
  getMyCertificates,
  getMyStreak,
  getAnnouncements,
} from "@/lib/dashboard/repository";
import { getRecentlyViewedLessons } from "@/lib/lessons/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function DashboardOverviewPage() {
  const [profile, enrollments, continueCourse, liveClasses, assignments, tests, certificates, streak, announcements, recentlyViewed] =
    await Promise.all([
      getCurrentProfile(),
      getMyEnrollments(),
      getContinueLearningCourse(),
      getUpcomingLiveClasses(5),
      getPendingAssignments(),
      getUpcomingTests(),
      getMyCertificates(),
      getMyStreak(),
      getAnnouncements(5),
      getRecentlyViewedLessons(5),
    ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <DashboardOverviewContent
      firstName={firstName}
      enrollments={enrollments}
      continueCourse={continueCourse}
      liveClasses={liveClasses}
      assignments={assignments}
      tests={tests}
      certificates={certificates}
      streak={streak}
      announcements={announcements}
      recentlyViewed={recentlyViewed}
    />
  );
}
