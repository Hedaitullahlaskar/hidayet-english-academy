"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { replyToDoubt, markDoubtResolved } from "@/lib/teacher/repository";

interface Doubt {
  id: string;
  question: string;
  status: string;
  course_slug: string;
  profiles: { full_name: string } | null;
  doubt_replies: { id: string; reply: string }[];
}

export function DoubtCard({ doubt, teacherId }: { doubt: Doubt; teacherId: string }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [localReplies, setLocalReplies] = useState(doubt.doubt_replies);
  const [resolved, setResolved] = useState(doubt.status === "resolved");

  async function handleReply() {
    if (reply.trim().length < 2) return;
    setSending(true);
    const result = await replyToDoubt(doubt.id, teacherId, reply.trim());
    if (result.success) {
      setLocalReplies((prev) => [...prev, { id: `local-${Date.now()}`, reply: reply.trim() }]);
      setReply("");
    }
    setSending(false);
  }

  async function handleResolve() {
    const result = await markDoubtResolved(doubt.id);
    if (result.success) setResolved(true);
  }

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-navy-900 dark:text-white">{doubt.profiles?.full_name ?? "Student"}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">{doubt.course_slug}</p>
        </div>
        <Badge tone={resolved ? "success" : "gold"}>{resolved ? "Resolved" : "Open"}</Badge>
      </div>
      <p className="mt-3 text-navy-700 dark:text-navy-200">{doubt.question}</p>

      {localReplies.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-navy-50 pt-3 dark:border-navy-700">
          {localReplies.map((r) => (
            <p key={r.id} className="rounded-lg bg-paper-100 p-3 text-sm text-navy-700 dark:bg-navy-900 dark:text-navy-200">
              {r.reply}
            </p>
          ))}
        </div>
      )}

      {!resolved && (
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            className="min-w-[200px] flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
          <Button onClick={handleReply} size="sm" disabled={sending}>
            {sending ? "Sending…" : "Reply"}
          </Button>
          <Button onClick={handleResolve} variant="outline" size="sm">
            Mark Resolved
          </Button>
        </div>
      )}
    </div>
  );
}
