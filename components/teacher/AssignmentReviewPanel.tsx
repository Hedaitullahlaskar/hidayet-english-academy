"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getSubmissionsForAssignment, getSubmissionFileUrl, gradeSubmission } from "@/lib/teacher/repository";

interface Assignment {
  id: string;
  title: string;
  max_score: number;
}

interface Submission {
  id: string;
  score: number | null;
  feedback: string | null;
  content_url: string | null;
  text_content: string | null;
  submission_type: "file" | "text";
  is_late: boolean;
  profiles: { full_name: string } | null;
}

export function AssignmentReviewPanel({ assignments }: { assignments: Assignment[] }) {
  const [selectedId, setSelectedId] = useState(assignments[0]?.id ?? "");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    getSubmissionsForAssignment(selectedId).then((data) => {
      setSubmissions(data as Submission[]);
      setLoading(false);
    });
  }, [selectedId]);

  if (assignments.length === 0) {
    return (
      <EmptyState icon="📝" title="No assignments to review yet" body="Create an assignment first — submissions will appear here for grading." />
    );
  }

  return (
    <div>
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
      >
        {assignments.map((a) => (
          <option key={a.id} value={a.id}>{a.title}</option>
        ))}
      </select>

      {loading ? (
        <p className="mt-6 text-sm text-navy-500 dark:text-navy-400">Loading…</p>
      ) : submissions.length === 0 ? (
        <EmptyState className="mt-6" icon="📭" title="No submissions yet" body="Nobody has submitted this assignment yet." />
      ) : (
        <div className="mt-6 space-y-4">
          {submissions.map((s) => (
            <SubmissionRow key={s.id} submission={s} maxScore={assignments.find((a) => a.id === selectedId)?.max_score ?? 100} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionRow({ submission, maxScore }: { submission: Submission; maxScore: number }) {
  const [score, setScore] = useState(submission.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saved, setSaved] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (submission.submission_type === "file" && submission.content_url) {
      getSubmissionFileUrl(submission.content_url).then(setFileUrl);
    }
  }, [submission.content_url, submission.submission_type]);

  async function handleGrade() {
    const numScore = Number(score);
    if (Number.isNaN(numScore) || numScore < 0 || numScore > maxScore) return;
    const result = await gradeSubmission(submission.id, numScore, feedback);
    setSaved(result.success);
  }

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-navy-900 dark:text-white">{submission.profiles?.full_name ?? "Student"}</p>
        {submission.is_late && <Badge tone="outline">Late</Badge>}
      </div>

      {/* What was actually submitted — the whole point of this fix */}
      <div className="mt-2 rounded-lg bg-paper-100 p-3 text-sm dark:bg-navy-900">
        {submission.submission_type === "text" ? (
          <p className="whitespace-pre-wrap text-navy-700 dark:text-navy-200">{submission.text_content}</p>
        ) : fileUrl ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-800 underline dark:text-gold-400">
            📎 View Submitted File →
          </a>
        ) : (
          <p className="text-navy-400 dark:text-navy-500">Loading file…</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-navy-600 dark:text-navy-300">Score (/{maxScore})</label>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={score}
            onChange={(e) => { setScore(e.target.value); setSaved(false); }}
            className="w-24 rounded-lg border border-navy-200 bg-white px-3 py-2 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs font-semibold text-navy-600 dark:text-navy-300">Feedback</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => { setFeedback(e.target.value); setSaved(false); }}
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          />
        </div>
        <Button onClick={handleGrade} size="sm">
          {saved ? "Saved ✓" : "Save Grade"}
        </Button>
      </div>
    </div>
  );
}
