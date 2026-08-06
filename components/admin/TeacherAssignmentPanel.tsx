"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignTeacherToCourse, unassignTeacherFromCourse } from "@/lib/admin/repository";

interface Assignment {
  id: string;
  teacher_id: string;
  // Supabase's nested-select typing can't tell a many-to-one embed from a
  // one-to-many one without generated DB types (not used anywhere in this
  // codebase) — loosely typed here rather than fighting that inference.
  profiles: { full_name: string } | { full_name: string }[] | null;
}

interface TeacherOption {
  id: string;
  full_name: string;
}

export function TeacherAssignmentPanel({
  courseSlug,
  assignments,
  allTeachers,
}: {
  courseSlug: string;
  assignments: Assignment[];
  allTeachers: TeacherOption[];
}) {
  const router = useRouter();
  const assignedIds = new Set(assignments.map((a) => a.teacher_id));
  const availableTeachers = allTeachers.filter((t) => !assignedIds.has(t.id));
  const [selectedTeacherId, setSelectedTeacherId] = useState(availableTeachers[0]?.id ?? "");
  const [busy, setBusy] = useState(false);

  async function handleAssign() {
    if (!selectedTeacherId) return;
    setBusy(true);
    const result = await assignTeacherToCourse(selectedTeacherId, courseSlug);
    setBusy(false);
    if (result.success) router.refresh();
  }

  async function handleUnassign(assignmentId: string) {
    setBusy(true);
    const result = await unassignTeacherFromCourse(assignmentId);
    setBusy(false);
    if (result.success) router.refresh();
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Assigned Teachers</h2>
      <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
        Only assigned teachers (and admins) can manage this course&apos;s lessons, tests, live classes, and other content.
      </p>

      {assignments.length === 0 ? (
        <p className="mt-4 text-sm text-navy-500 dark:text-navy-400">No teacher assigned yet — only admins can manage this course&apos;s content.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {assignments.map((a) => {
            const profile = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
            return (
              <li key={a.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-3 text-sm dark:border-navy-700">
                <span className="text-navy-800 dark:text-navy-100">{profile?.full_name ?? "Unknown teacher"}</span>
                <button disabled={busy} onClick={() => handleUnassign(a.id)} className="text-xs font-semibold text-error underline">
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {availableTeachers.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
          >
            {availableTeachers.map((t) => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </select>
          <button
            disabled={busy}
            onClick={handleAssign}
            className="rounded-lg border border-gold-500 bg-gold-600 px-4 py-2 text-sm font-semibold text-navy-900 disabled:opacity-60"
          >
            Assign
          </button>
        </div>
      )}
    </div>
  );
}
