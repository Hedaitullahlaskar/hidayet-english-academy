import { notFound, redirect } from "next/navigation";
import { TestTakingInterface } from "@/components/assessments/TestTakingInterface";
import { getTestForTaking, getMyAttemptsForTest, startTestAttempt } from "@/lib/assessments/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function TakeTestPage({ params }: { params: { testId: string } }) {
  const test = await getTestForTaking(params.testId);
  if (!test) notFound();

  const attempts = await getMyAttemptsForTest(params.testId);
  const completedAttempts = attempts.filter((a: { submitted_at: string | null }) => a.submitted_at);

  if (completedAttempts.length >= test.max_attempts) {
    redirect("/dashboard/tests");
  }

  const attemptResult = await startTestAttempt(params.testId, completedAttempts.length + 1);
  if (!attemptResult) {
    redirect("/dashboard/tests");
  }

  // Strip correct_answer before this ever becomes a client-component prop —
  // grading happens server-side in submitTestAttempt, so the answer key
  // has no legitimate reason to reach the browser while a test is live.
  const questionsForClient = (test.test_questions ?? []).map(
    (tq: { questions: Record<string, unknown>; [key: string]: unknown }) => {
      const { correct_answer, ...safeQuestion } = tq.questions;
      return { ...tq, questions: safeQuestion };
    }
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">{test.title}</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Attempt {completedAttempts.length + 1} of {test.max_attempts} · You need {test.pass_percentage}% to pass.
      </p>

      <div className="mt-6">
        <TestTakingInterface
          attemptId={attemptResult.attemptId}
          testId={params.testId}
          totalMarks={test.total_marks}
          passPercentage={test.pass_percentage}
          durationMinutes={test.duration_minutes}
          shuffleEnabled={test.shuffle_questions}
          questions={questionsForClient}
        />
      </div>
    </div>
  );
}
