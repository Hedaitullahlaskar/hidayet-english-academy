import { FileEdit, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { TeacherApplicationReview, DeletionRequestReview } from "@/components/admin/UserRequestReview";
import { getTeacherApplications, getAccountDeletionRequests } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminUserRequestsPage() {
  const [applications, deletionRequests] = await Promise.all([getTeacherApplications(), getAccountDeletionRequests()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">User Requests</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Teacher applications and account deletion requests — both need a real person to decide.</p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Teacher Applications</h2>
        {applications.length === 0 ? (
          <EmptyState icon={<FileEdit className="h-6 w-6" strokeWidth={1.75} />} title="No applications yet" body="Applications submitted via /register/teacher will appear here." />
        ) : (
          <TeacherApplicationReview applications={applications} />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-error">Account Deletion Requests</h2>
        {deletionRequests.length === 0 ? (
          <EmptyState icon={<Trash2 className="h-6 w-6" strokeWidth={1.75} />} title="No pending deletion requests" body="Requests from any user's Account Security page will appear here." />
        ) : (
          <DeletionRequestReview requests={deletionRequests} />
        )}
      </section>
    </div>
  );
}
