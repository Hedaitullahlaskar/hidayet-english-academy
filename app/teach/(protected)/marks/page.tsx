import { Hash, Inbox } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getAllTests } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function MarksEntryPage() {
  const tests = await getAllTests();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Marks Entry</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Enter or adjust scores for any test attempt.</p>

      {tests.length === 0 ? (
        <EmptyState className="mt-8" icon={<Hash className="h-6 w-6" strokeWidth={1.75} />} title="No tests yet" body="Create a test first — student attempts and scores will appear here once they take it." />
      ) : (
        <div className="mt-8 space-y-3">
          {tests.map((t: { id: string; title: string }) => (
            <div key={t.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <p className="font-semibold text-navy-900 dark:text-white">{t.title}</p>
              <EmptyState className="mt-3" icon={<Inbox className="h-6 w-6" strokeWidth={1.75} />} title="No attempts yet" body="Once students take this test, their attempts will appear here for you to review and mark." />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
