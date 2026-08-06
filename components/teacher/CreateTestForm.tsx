"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createTest } from "@/lib/teacher/repository";

export function CreateTestForm({ courses }: { courses: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [testType, setTestType] = useState<"weekly" | "mock">("weekly");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(100);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 3) return setError("Please give the test a title.");

    setStatus("saving");
    const result = await createTest({
      course_slug: courseSlug,
      title: title.trim(),
      test_type: testType,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : "",
      duration_minutes: duration,
      total_marks: totalMarks,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }

    setStatus("done");
    setTitle("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex gap-2">
        <button type="button" onClick={() => setTestType("weekly")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${testType === "weekly" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
          ✅ Weekly Test
        </button>
        <button type="button" onClick={() => setTestType("mock")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${testType === "mock" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
          📋 Mock Exam
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grammar Quiz — Tenses" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course</label>
          <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Scheduled For</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Duration (minutes)</label>
          <input type="number" min={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Total Marks</label>
          <input type="number" min={1} value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Test created. Add questions to it from the Question Bank.</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Creating…" : `Create ${testType === "weekly" ? "Weekly Test" : "Mock Exam"}`}
      </Button>
    </form>
  );
}
