"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { addStudentNote } from "@/lib/teacher/repository";

interface StudentNoteRow {
  id: string;
  note: string;
  created_at: string;
  profiles: { full_name: string } | { full_name: string }[] | null;
}

export function StudentNotesPanel({ studentId, notes }: { studentId: string; notes: StudentNoteRow[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const result = await addStudentNote(studentId, draft);
    setSaving(false);
    if (!result.success) return setError(result.error ?? "Something went wrong.");
    setDraft("");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800 lg:col-span-3">
      <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Teacher Notes</h2>
      <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
        Private observations, visible only to teachers and admins — never shown to the student.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="new-student-note" className="sr-only">
          New note about this student
        </label>
        <textarea
          id="new-student-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="e.g. Struggles with past-tense questions, made great progress in speaking this month…"
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        {error && <p role="alert" className="mt-1.5 text-xs font-medium text-error">{error}</p>}
        <button
          type="submit"
          disabled={saving || draft.trim().length < 3}
          className="mt-2 rounded-full bg-gold-600 px-4 py-2 text-xs font-semibold text-navy-900 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:bg-gold-500 disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add Note"}
        </button>
      </form>

      <div className="mt-5 border-t border-navy-50 pt-4 dark:border-navy-700">
        {notes.length === 0 ? (
          <EmptyState icon={<NotebookPen className="h-6 w-6" strokeWidth={1.75} />} title="No notes yet" body="Notes you add about this student will appear here, newest first." />
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => {
              const author = Array.isArray(n.profiles) ? n.profiles[0] : n.profiles;
              return (
                <li key={n.id} className="rounded-lg bg-paper-100 p-3 text-sm dark:bg-navy-900">
                  <p className="text-navy-800 dark:text-navy-100">{n.note}</p>
                  <p className="mt-1.5 text-xs text-navy-400 dark:text-navy-500">
                    {author?.full_name ?? "A teacher"} · {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
