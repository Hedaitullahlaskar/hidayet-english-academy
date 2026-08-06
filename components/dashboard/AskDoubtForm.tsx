"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { askDoubt } from "@/lib/dashboard/doubts-repository";

export function AskDoubtForm({ courses }: { courses: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (question.trim().length < 5) return setError("Tell us a bit more about what you're stuck on.");

    setStatus("saving");
    const result = await askDoubt(courseSlug, question);
    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    setQuestion("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Which course is this about?</label>
          <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Your Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. Why do we say 'has been' instead of 'have been' here?"
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-3 text-sm font-medium text-success-text dark:text-success">Sent — your teacher will reply here.</p>}
      <Button type="submit" size="sm" className="mt-4" disabled={status === "saving"}>
        {status === "saving" ? "Sending…" : "Ask Your Teacher"}
      </Button>
    </form>
  );
}
