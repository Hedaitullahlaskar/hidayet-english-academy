"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuestionRenderer } from "@/components/assessments/QuestionRenderer";
import { submitTestAttempt } from "@/lib/assessments/repository";
import { shuffleQuestions } from "@/lib/assessments/shuffle";

interface TestQuestion {
  id: string;
  marks: number;
  section_title: string | null;
  questions: {
    id: string;
    question_text: string;
    question_type: "mcq" | "fill_blank" | "short_answer";
    options: { label: string; text: string }[] | null;
    correct_answer: string;
  };
}

interface TestTakingInterfaceProps {
  attemptId: string;
  totalMarks: number;
  passPercentage: number;
  durationMinutes: number;
  shuffleEnabled: boolean;
  questions: TestQuestion[];
}

export function TestTakingInterface({
  attemptId,
  totalMarks,
  passPercentage,
  durationMinutes,
  shuffleEnabled,
  questions,
}: TestTakingInterfaceProps) {
  const router = useRouter();
  const orderedQuestions = useMemo(() => (shuffleEnabled ? shuffleQuestions(questions) : questions), [questions, shuffleEnabled]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting || result) return;
    setSubmitting(true);

    let earned = 0;
    questions.forEach((q) => {
      const given = (answers[q.questions.id] ?? "").trim().toLowerCase();
      const correct = q.questions.correct_answer.trim().toLowerCase();
      if (given === correct) earned += q.marks;
    });

    const percentage = totalMarks > 0 ? (earned / totalMarks) * 100 : 0;
    await submitTestAttempt(attemptId, earned);
    setResult({ score: earned, passed: percentage >= passPercentage });
    setSubmitting(false);
  }

  // Real countdown, auto-submits at zero rather than leaving a stalled UI.
  useEffect(() => {
    if (result) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const lowOnTime = secondsLeft <= 60;

  // Group by section for display, preserving the (possibly shuffled) order.
  const sections = new Map<string, TestQuestion[]>();
  orderedQuestions.forEach((q) => {
    const key = q.section_title ?? "Questions";
    const group = sections.get(key) ?? [];
    group.push(q);
    sections.set(key, group);
  });

  if (result) {
    const percentage = totalMarks > 0 ? Math.round((result.score / totalMarks) * 100) : 0;
    return (
      <div className="rounded-xl border border-gold-400 bg-navy-800 p-8 text-center text-white shadow-elevated">
        <span className="text-3xl">{result.passed ? "🎉" : "📚"}</span>
        <p className="mt-3 font-display text-2xl font-semibold">
          {result.score} / {totalMarks} ({percentage}%)
        </p>
        <Badge tone={result.passed ? "success" : "outline"} className="mt-3">
          {result.passed ? "Passed" : "Not Passed"}
        </Badge>
        <p className="mt-3 text-sm text-navy-300">
          {result.passed
            ? "Well done — your teacher can see this result too."
            : `You needed ${passPercentage}% to pass. Keep practicing — you can review this with your teacher.`}
        </p>
        <Button href="/dashboard/tests" variant="outline" size="sm" className="mt-5 border-white/30 text-white hover:bg-white hover:text-navy-900">
          Back to Tests
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{questions.length} questions · {totalMarks} marks</p>
        <span className={`font-display text-lg font-semibold ${lowOnTime ? "text-error" : "text-navy-900 dark:text-white"}`}>
          ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-8">
        {Array.from(sections.entries()).map(([sectionTitle, sectionQuestions]) => (
          <div key={sectionTitle}>
            {sections.size > 1 && (
              <h2 className="mb-3 font-display text-base font-semibold text-navy-900 dark:text-white">{sectionTitle}</h2>
            )}
            <div className="space-y-4">
              {sectionQuestions.map((q, i) => (
                <QuestionRenderer
                  key={q.id}
                  question={q.questions}
                  index={i}
                  value={answers[q.questions.id] ?? ""}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [q.questions.id]: value }))}
                  pointsLabel={`${q.marks} pt${q.marks > 1 ? "s" : ""}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} size="lg" className="mt-6" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Test"}
      </Button>
    </div>
  );
}
