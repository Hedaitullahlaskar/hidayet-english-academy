"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { coursesData } from "@/content/courses-data";
import { createAnnouncement } from "@/lib/teacher/repository";

export function ComposeAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "course">("all");
  const [courseSlug, setCourseSlug] = useState(coursesData[0]?.slug ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 3) return setError("Please give the announcement a title.");
    if (body.trim().length < 5) return setError("Please write the announcement body.");

    setStatus("sending");
    const result = await createAnnouncement({
      title: title.trim(),
      body: body.trim(),
      audience,
      course_slug: audience === "course" ? courseSlug : undefined,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }

    setStatus("done");
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex gap-2">
        <button type="button" onClick={() => setAudience("all")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${audience === "all" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
          🌍 Everyone
        </button>
        <button type="button" onClick={() => setAudience("course")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${audience === "course" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
          🎯 Specific Course
        </button>
      </div>

      {audience === "course" && (
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course</label>
          <select value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {coursesData.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      )}

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      </div>
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Announcement published — students will see it immediately.</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "sending"}>
        {status === "sending" ? "Publishing…" : "Publish Announcement"}
      </Button>
    </form>
  );
}
