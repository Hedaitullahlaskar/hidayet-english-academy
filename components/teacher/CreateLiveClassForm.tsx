"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { coursesData } from "@/content/courses-data";
import { createLiveClass } from "@/lib/teacher/repository";

export function CreateLiveClassForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState(coursesData[0]?.slug ?? "");
  const [platform, setPlatform] = useState<"google_meet" | "zoom">("google_meet");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) return setError("Please give the class a title.");
    if (meetingUrl.trim().length > 0 && !meetingUrl.startsWith("http")) return setError("That doesn't look like a valid URL — leave it blank to auto-generate one instead, if Google Meet/Zoom is connected.");
    if (!scheduledAt) return setError("Please choose a date and time.");

    setStatus("saving");
    const result = await createLiveClass({
      course_slug: courseSlug,
      title: title.trim(),
      platform,
      meeting_url: meetingUrl.trim(),
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_minutes: duration,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong — please try again.");
      return;
    }

    setStatus("idle");
    setTitle("");
    setMeetingUrl("");
    setScheduledAt("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Class Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grammar Live Session — Present Perfect"
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
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
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as "google_meet" | "zoom")}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          >
            <option value="google_meet">Google Meet</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Meeting URL <span className="font-normal text-navy-400">(optional — auto-generated if Google Meet/Zoom is connected)</span>
          </label>
          <input
            type="url"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            placeholder="https://meet.google.com/..."
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Duration (minutes)</label>
          <input
            type="number"
            min={15}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Scheduling…" : "Schedule Class"}
      </Button>
    </form>
  );
}
