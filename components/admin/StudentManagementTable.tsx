"use client";

import { useState } from "react";
import { Avatar } from "@/components/dashboard/Avatar";
import { Badge } from "@/components/ui/Badge";
import { suspendStudent } from "@/lib/admin/repository";

interface StudentRow {
  id: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  created_at: string;
}

export function StudentManagementTable({ students }: { students: StudentRow[] }) {
  const [suspended, setSuspended] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  async function toggleSuspend(id: string, currentlySuspended: boolean) {
    setPending(id);
    const result = await suspendStudent(id, !currentlySuspended);
    if (result.success) {
      setSuspended((prev) => {
        const next = new Set(prev);
        currentlySuspended ? next.delete(id) : next.add(id);
        return next;
      });
    }
    setPending(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-navy-100 shadow-card dark:border-navy-700">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-navy-800 text-white">
            <th className="p-4 font-display font-semibold">Student</th>
            <th className="p-4 font-display font-semibold">Country</th>
            <th className="p-4 font-display font-semibold">Status</th>
            <th className="p-4 font-display font-semibold">Joined</th>
            <th className="p-4 font-display font-semibold" />
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => {
            const isSuspended = suspended.has(s.id);
            return (
              <tr key={s.id} className={i % 2 === 0 ? "bg-white dark:bg-navy-900" : "bg-paper-100 dark:bg-navy-800"}>
                <td className="flex items-center gap-3 p-4">
                  <Avatar name={s.full_name} avatarUrl={s.avatar_url} size={32} />
                  <span className="font-medium text-navy-800 dark:text-navy-100">{s.full_name}</span>
                </td>
                <td className="p-4 text-navy-600 dark:text-navy-300">{s.country ?? "—"}</td>
                <td className="p-4">
                  <Badge tone={isSuspended ? "outline" : "success"}>{isSuspended ? "Suspended" : "Active"}</Badge>
                </td>
                <td className="p-4 text-navy-600 dark:text-navy-300">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleSuspend(s.id, isSuspended)}
                    disabled={pending === s.id}
                    className="text-sm font-semibold text-error underline disabled:opacity-50"
                  >
                    {pending === s.id ? "…" : isSuspended ? "Reinstate" : "Suspend"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
