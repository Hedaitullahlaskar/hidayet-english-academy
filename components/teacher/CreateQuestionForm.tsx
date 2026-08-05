"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { coursesData } from "@/content/courses-data";
import { createQuestion } from "@/lib/teacher/repository";

export function CreateQuestionForm() {
  const router = useRouter();
  const [courseSlug, setCourseSlug] = useState(coursesData[0]?.slug ?? "");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"mcq" | "fill_blank" | "short_answer">("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (questionText.trim().length < 5) return setError("Please write out the question.");
    if (!correctAnswer.trim()) return setError("Please specify the correct answer.");

    setStatus("saving");
    const result = await createQuestion({
      course_slug: courseSlug,
      question_text: questionText.trim(),
      question_type: questionType,
      options:
        questionType === "mcq"
          ? options.filter(Boolean).map((text, i) => ({ label: String.fromCharCode(65 + i), text }))
          : undefined,
      correct_answer: correctAnswer.trim(),
      difficulty,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }

    setStatus("done");
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course</label>
          <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {coursesData.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Question Type</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value as typeof questionType)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option value="mcq">Multiple Choice</option>
            <option value="fill_blank">Fill in the Blank</option>
            <option value="short_answer">Short Answer</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Question</label>
          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={2} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>

        {questionType === "mcq" && (
          <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => setOptions((prev) => prev.map((o, idx) => (idx === i ? e.target.value : o)))}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            ))}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Correct Answer</label>
          <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Question added to the bank.</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Add Question"}
      </Button>
    </form>
  );
}
