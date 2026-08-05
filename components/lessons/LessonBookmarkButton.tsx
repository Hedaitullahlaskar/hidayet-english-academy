"use client";

import { useState } from "react";
import { toggleBookmark } from "@/lib/lessons/repository";
import { cn } from "@/lib/utils";

export function LessonBookmarkButton({ lessonId, initiallyBookmarked }: { lessonId: string; initiallyBookmarked: boolean }) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    setSaving(true);
    const next = !bookmarked;
    const result = await toggleBookmark(lessonId, next);
    if (result.success) setBookmarked(next);
    setSaving(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
        bookmarked
          ? "border-gold-500 bg-gold-600 text-navy-900"
          : "border-navy-200 text-navy-700 hover:border-gold-400 dark:border-navy-600 dark:text-navy-200"
      )}
      aria-pressed={bookmarked}
    >
      {bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
    </button>
  );
}
