"use client";

import { useState } from "react";
import { Avatar } from "@/components/dashboard/Avatar";
import { cn } from "@/lib/utils";
import { markAttendance } from "@/lib/teacher/repository";

interface StudentAttendanceRow {
  studentId: string;
  fullName: string;
  avatarUrl: string | null;
  currentStatus: "present" | "absent" | "excused" | null;
}

export function AttendanceMarkingList({ liveClassId, students }: { liveClassId: string; students: StudentAttendanceRow[] }) {
  const [statusMap, setStatusMap] = useState<Record<string, string | null>>(
    Object.fromEntries(students.map((s) => [s.studentId, s.currentStatus]))
  );
  const [saving, setSaving] = useState<string | null>(null);

  async function handleMark(studentId: string, status: "present" | "absent" | "excused") {
    setSaving(studentId);
    const result = await markAttendance(liveClassId, studentId, status);
    if (result.success) setStatusMap((prev) => ({ ...prev, [studentId]: status }));
    setSaving(null);
  }

  const options: { value: "present" | "absent" | "excused"; label: string }[] = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "excused", label: "Excused" },
  ];

  return (
    <div className="space-y-2">
      {students.map((s) => (
        <div key={s.studentId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-100 p-3 dark:border-navy-700">
          <div className="flex items-center gap-3">
            <Avatar name={s.fullName} avatarUrl={s.avatarUrl} size={32} />
            <span className="text-sm font-medium text-navy-800 dark:text-navy-100">{s.fullName}</span>
          </div>
          <div className="flex gap-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleMark(s.studentId, opt.value)}
                disabled={saving === s.studentId}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50",
                  statusMap[s.studentId] === opt.value
                    ? opt.value === "present"
                      ? "border-success bg-success/10 text-success-text dark:text-success"
                      : opt.value === "absent"
                        ? "border-error bg-error/10 text-error"
                        : "border-gold-500 bg-gold-600 text-navy-900"
                    : "border-navy-200 text-navy-500 dark:border-navy-600 dark:text-navy-400"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
