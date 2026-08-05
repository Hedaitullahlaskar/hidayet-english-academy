"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { markLessonComplete } from "@/lib/lessons/repository";

interface LessonMediaPlayerProps {
  lessonId: string;
  lessonType: "video" | "pdf" | "audio";
  contentUrl: string | null;
  notesUrl: string | null;
  initiallyCompleted: boolean;
}

export function LessonMediaPlayer({ lessonId, lessonType, contentUrl, notesUrl, initiallyCompleted }: LessonMediaPlayerProps) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [saving, setSaving] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  async function handleComplete(watchTimeSeconds?: number) {
    if (completed) return;
    setSaving(true);
    const result = await markLessonComplete(lessonId, watchTimeSeconds);
    if (result.success) setCompleted(true);
    setSaving(false);
  }

  if (!contentUrl) {
    return (
      <div className="rounded-lg border border-dashed border-navy-200 bg-paper-100 p-10 text-center dark:border-navy-700 dark:bg-navy-900">
        <p className="text-navy-500 dark:text-navy-400">No content file uploaded for this lesson yet.</p>
      </div>
    );
  }

  return (
    <div>
      {lessonType === "video" && (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={contentUrl}
          controls
          className="w-full rounded-lg bg-black"
          onEnded={() => handleComplete(Math.round((mediaRef.current as HTMLVideoElement)?.duration ?? 0))}
        />
      )}

      {lessonType === "audio" && (
        <div className="rounded-lg border border-navy-100 bg-paper-100 p-6 dark:border-navy-700 dark:bg-navy-900">
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={contentUrl}
            controls
            className="w-full"
            onEnded={() => handleComplete(Math.round((mediaRef.current as HTMLAudioElement)?.duration ?? 0))}
          />
        </div>
      )}

      {lessonType === "pdf" && (
        <div className="overflow-hidden rounded-lg border border-navy-100 dark:border-navy-700">
          <iframe src={contentUrl} title="Lesson PDF" className="h-[500px] w-full bg-white" />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {completed ? (
          <Badge tone="success">✓ Completed</Badge>
        ) : (
          <Button
            onClick={() => handleComplete()}
            size="sm"
            variant="outline"
            disabled={saving}
          >
            {saving ? "Saving…" : lessonType === "pdf" ? "Mark as Read" : "Mark as Complete"}
          </Button>
        )}
        {notesUrl && (
          <a
            href={notesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gold-800 underline dark:text-gold-400"
          >
            📥 Download Notes
          </a>
        )}
      </div>

      {lessonType !== "pdf" && (
        <p className="mt-2 text-xs text-navy-400 dark:text-navy-500">
          Marked complete automatically when you finish watching/listening — or mark it yourself any time.
        </p>
      )}
    </div>
  );
}
