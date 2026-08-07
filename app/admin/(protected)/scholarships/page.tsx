import { Award } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ScholarshipReviewList } from "@/components/admin/ScholarshipReviewList";
import { getScholarshipApplications } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminScholarshipsPage() {
  const applications = await getScholarshipApplications();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Scholarship Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Review and decide on Merit Scholarship and financial aid applications.</p>

      <div className="mt-6 rounded-lg border border-gold-300 bg-paper-100 p-4 text-sm text-navy-700 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200">
        <strong>Note:</strong> the public Scholarship page now writes a real application here on submit, in
        addition to opening WhatsApp — so a review shows up even if the applicant closes WhatsApp without sending.
      </div>

      {applications.length === 0 ? (
        <EmptyState className="mt-8" icon={<Award className="h-6 w-6" strokeWidth={1.75} />} title="No applications yet" body="Scholarship applications will appear here for review." />
      ) : (
        <div className="mt-8">
          <ScholarshipReviewList applications={applications} />
        </div>
      )}
    </div>
  );
}
