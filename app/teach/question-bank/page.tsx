import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateQuestionForm } from "@/components/teacher/CreateQuestionForm";
import { getQuestionBank } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function QuestionBankPage() {
  const questions = await getQuestionBank();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Question Bank</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Build a reusable pool of questions — Quiz Builder and Mock Test Builder draw from here.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Add a Question</h2>
          <CreateQuestionForm />
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Question Bank ({questions.length})</h2>
          {questions.length === 0 ? (
            <EmptyState icon="🗂️" title="No questions yet" body="Questions you add will be available to attach to any quiz or mock test." />
          ) : (
            <div className="space-y-3">
              {questions.map((q: { id: string; question_text: string; question_type: string; difficulty: string }) => (
                <div key={q.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-navy-800 dark:text-navy-100">{q.question_text}</p>
                    <Badge tone="outline">{q.difficulty}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{q.question_type.replace("_", " ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
