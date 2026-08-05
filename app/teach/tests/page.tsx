import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateTestForm } from "@/components/teacher/CreateTestForm";
import { getAllTests } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function TestsPage() {
  const tests = await getAllTests();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Tests & Quizzes</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Build weekly tests and mock exams from your Question Bank.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Create a Test</h2>
          <CreateTestForm />
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">All Tests</h2>
          {tests.length === 0 ? (
            <EmptyState icon="✅" title="No tests created yet" body="Weekly tests and mock exams you create will appear here." />
          ) : (
            <div className="space-y-3">
              {tests.map((t: { id: string; title: string; test_type: string; course_slug: string }) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
                  <div>
                    <p className="font-semibold text-navy-900 dark:text-white">{t.title}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{t.course_slug}</p>
                  </div>
                  <Badge tone={t.test_type === "mock" ? "navy" : "gold"}>{t.test_type}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
