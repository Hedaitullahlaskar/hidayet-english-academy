"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { submitHomework } from "@/lib/lessons/repository";

interface LessonHomeworkPanelProps {
  assignmentId: string;
  title: string;
  description: string | null;
  alreadySubmitted: boolean;
  dueAt?: string | null;
}

export function LessonHomeworkPanel({ assignmentId, title, description, alreadySubmitted, dueAt }: LessonHomeworkPanelProps) {
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  const isPastDue = dueAt ? new Date(dueAt) < new Date() : false;

  async function handleSubmit() {
    setError("");

    if (mode === "file" && !file) return setError("Choose a file to submit first.");
    if (mode === "text" && textAnswer.trim().length < 5) return setError("Write your answer first.");

    setStatus("uploading");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus("error");
      setError("You need to be logged in.");
      return;
    }

    let result;
    if (mode === "file" && file) {
      const filePath = `${user.id}/${assignmentId}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("submissions").upload(filePath, file);
      if (uploadError) {
        setStatus("error");
        setError(uploadError.message);
        return;
      }
      result = await submitHomework(assignmentId, { contentUrl: filePath });
    } else {
      result = await submitHomework(assignmentId, { textContent: textAnswer.trim() });
    }

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Submission failed — please try again.");
      return;
    }

    setSubmitted(true);
    setStatus("idle");
  }

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-navy-900 dark:text-white">{title}</p>
        {submitted && <Badge tone="success">Submitted</Badge>}
      </div>
      {description && <p className="mt-1.5 text-sm text-navy-600 dark:text-navy-300">{description}</p>}

      {!submitted && (
        <div className="mt-4">
          {isPastDue && (
            <p className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-xs font-medium text-error">
              This is past the due date — it will be marked as a late submission.
            </p>
          )}

          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${mode === "file" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-600 dark:border-navy-600 dark:text-navy-300"}`}
            >
              📎 File Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${mode === "text" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-600 dark:border-navy-600 dark:text-navy-300"}`}
            >
              ✍️ Type Answer
            </button>
          </div>

          {mode === "file" ? (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
          ) : (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              rows={4}
              placeholder="Type your answer here…"
              className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
          )}

          {error && <p className="mt-2 text-xs font-medium text-error">{error}</p>}
          <Button onClick={handleSubmit} size="sm" className="mt-3" disabled={status === "uploading"}>
            {status === "uploading" ? "Submitting…" : "Submit Homework"}
          </Button>
        </div>
      )}
    </div>
  );
}
