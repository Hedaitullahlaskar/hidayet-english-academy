"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { broadcastNotification } from "@/lib/admin/repository";

export function NotificationBroadcastView() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < 3) return setError("Please add a title.");
    setStatus("sending");
    const result = await broadcastNotification(title.trim(), body.trim());
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
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Notification Center</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Broadcast a notification to every registered student at once.</p>
      <form onSubmit={handleSubmit} className="mt-8 max-w-xl rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        <label className="mb-1.5 mt-4 block text-sm font-semibold text-navy-800 dark:text-navy-100">Message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
        {status === "done" && <p className="mt-3 text-sm font-medium text-success-text dark:text-success">Sent to every registered student.</p>}
        <Button type="submit" size="lg" className="mt-5" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Broadcast to All Students"}
        </Button>
      </form>
    </div>
  );
}
