"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { coursesData } from "@/content/courses-data";
import { createClient } from "@/lib/supabase/client";
import { createLesson } from "@/lib/teacher/repository";

const typeConfig = {
  video: { icon: "🎬", label: "Video", accept: "video/*" },
  pdf: { icon: "📄", label: "PDF", accept: "application/pdf" },
  audio: { icon: "🎧", label: "Audio", accept: "audio/*" },
} as const;

export function UploadLessonForm() {
  const router = useRouter();
  const [lessonType, setLessonType] = useState<keyof typeof typeConfig>("video");
  const [courseSlug, setCourseSlug] = useState(coursesData[0]?.slug ?? "");
  const [moduleTitle, setModuleTitle] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) return setError("Please give the lesson a title.");
    if (moduleTitle.trim().length < 2) return setError("Please name the module this lesson belongs to.");
    if (!file) return setError(`Please choose a ${typeConfig[lessonType].label.toLowerCase()} file.`);

    setStatus("uploading");
    const supabase = createClient();

    const filePath = `${courseSlug}/${lessonType}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("lesson-content").upload(filePath, file);

    if (uploadError) {
      setStatus("error");
      setError(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("lesson-content").getPublicUrl(filePath);

    const result = await createLesson({
      course_slug: courseSlug,
      module_title: moduleTitle.trim(),
      title: title.trim(),
      lesson_type: lessonType,
      content_url: publicUrlData.publicUrl,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Upload succeeded but saving the lesson failed — please try again.");
      return;
    }

    setStatus("done");
    setTitle("");
    setModuleTitle("");
    setFile(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex gap-2">
        {(Object.keys(typeConfig) as (keyof typeof typeConfig)[]).map((type) => (
          <button
            key={type}
            onClick={() => { setLessonType(type); setFile(null); }}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              lessonType === type
                ? "border-gold-500 bg-gold-600 text-navy-900"
                : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"
            )}
          >
            <span aria-hidden="true">{typeConfig[type].icon}</span>
            {typeConfig[type].label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course</label>
          <select
            value={courseSlug}
            onChange={(e) => setCourseSlug(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          >
            {coursesData.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Module</label>
          <input
            type="text"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="e.g. Module 1: Foundations"
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Present Perfect Tense — Formula & Examples"
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            {typeConfig[lessonType].label} File
          </label>
          <input
            type="file"
            accept={typeConfig[lessonType].accept}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>

        {error && <p role="alert" className="text-sm font-medium text-error sm:col-span-2">{error}</p>}
        {status === "done" && <p className="text-sm font-medium text-success-text dark:text-success sm:col-span-2">Lesson uploaded and published.</p>}

        <Button type="submit" size="lg" className="sm:col-span-2" disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading…" : `Upload ${typeConfig[lessonType].label} Lesson`}
        </Button>
      </form>
    </div>
  );
}
