"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuestionRenderer } from "@/components/assessments/QuestionRenderer";
import { submitLessonQuizAttempt } from "@/lib/lessons/repository";

interface QuizQuestion {
  id: string;
  marks: number;
  questions: {
    id: string;
    question_text: string;
    question_type: "mcq" | "fill_blank" | "short_answer";
    options: { label: string; text: string }[] | null;
    // No correct_answer — grading happens server-side in
    // submitLessonQuizAttempt, which fetches the real answer key itself.
  };
}

interface LessonQuizProps {
  testId: string;
  totalMarks: number;
  questions: QuizQuestion[];
}

export function LessonQuiz({ testId, totalMarks, questions }: LessonQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    const result = await submitLessonQuizAttempt(testId, answers);
    if (result.success) {
      setScore(result.score ?? 0);
      setSubmitted(true);
    }
    setSaving(false);
  }

  if (submitted && score !== null) {
    return (
      <div className="rounded-lg border border-gold-400 bg-paper-100 p-6 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-2xl">🎯</span>
        <p className="mt-2 font-display text-lg font-semibold text-navy-900 dark:text-white">
          You scored {score} / {totalMarks}
        </p>
        <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">Nice work — your teacher can see this result too.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <QuestionRenderer
          key={q.id}
          question={q.questions}
          index={i}
          value={answers[q.questions.id] ?? ""}
          onChange={(value) => setAnswers((prev) => ({ ...prev, [q.questions.id]: value }))}
          pointsLabel={`${q.marks} pt${q.marks > 1 ? "s" : ""}`}
        />
      ))}

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Submitting…" : "Submit Quiz"}
      </Button>
    </div>
  );
}
