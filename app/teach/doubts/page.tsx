import { EmptyState } from "@/components/dashboard/EmptyState";
import { DoubtCard } from "@/components/teacher/DoubtCard";
import { getAllDoubts, getCurrentTeacherProfile } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function DoubtsPage() {
  const [doubts, teacher] = await Promise.all([getAllDoubts(), getCurrentTeacherProfile()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Discussion &amp; Doubts</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Questions students ask, and your replies.</p>

      <div className="mt-6 rounded-lg border border-gold-300 bg-paper-100 p-4 text-sm text-navy-700 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200">
        <strong>Note:</strong> there's no "Ask a Doubt" button in the student dashboard yet — that entry point wasn't
        part of Module 5. This panel is fully built and ready the moment it's added.
      </div>

      {doubts.length === 0 ? (
        <EmptyState className="mt-8" icon="💬" title="No doubts yet" body="Questions students ask will appear here for you to answer." />
      ) : (
        <div className="mt-8 space-y-4">
          {doubts.map((d: { id: string; question: string; status: string; course_slug: string; profiles: { full_name: string } | null; doubt_replies: { id: string; reply: string }[] }) => (
            <DoubtCard key={d.id} doubt={d} teacherId={teacher?.id ?? ""} />
          ))}
        </div>
      )}
    </div>
  );
}
