"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { attachRecording } from "@/lib/teacher/repository";

export function AttachRecordingForm({ liveClassId, existingUrl }: { liveClassId: string; existingUrl: string | null }) {
  const router = useRouter();
  const [url, setUrl] = useState(existingUrl ?? "");
  const [editing, setEditing] = useState(!existingUrl);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim().startsWith("http")) return;
    setSaving(true);
    const result = await attachRecording(liveClassId, url.trim());
    setSaving(false);
    if (result.success) {
      setEditing(false);
      router.refresh();
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
        ✓ Recording attached — edit link
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste the recording link (Drive, YouTube unlisted, etc.)"
        className="min-w-[220px] flex-1 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
      />
      <button type="submit" disabled={saving} className="rounded-full bg-gold-600 px-3 py-1.5 text-xs font-semibold text-navy-900 disabled:opacity-50">
        {saving ? "Saving…" : "Attach"}
      </button>
    </form>
  );
}
