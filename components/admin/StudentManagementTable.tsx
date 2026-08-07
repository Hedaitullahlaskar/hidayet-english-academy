"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/dashboard/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { suspendStudent } from "@/lib/admin/repository";

interface StudentRow {
  id: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  created_at: string;
}

type StatusFilter = "all" | "active" | "suspended";

export function StudentManagementTable({ students }: { students: StudentRow[] }) {
  const [suspended, setSuspended] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const isSuspended = suspended.has(s.id);
      if (statusFilter === "active" && isSuspended) return false;
      if (statusFilter === "suspended" && !isSuspended) return false;
      if (!q) return true;
      return s.full_name.toLowerCase().includes(q) || (s.country ?? "").toLowerCase().includes(q);
    });
  }, [students, suspended, query, statusFilter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name or country…" className="max-w-xs" />
        <div className="flex gap-1.5">
          {(["all", "active", "suspended"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={
                "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors " +
                (statusFilter === f
                  ? "bg-navy-800 text-white dark:bg-gold-500 dark:text-navy-900"
                  : "bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300 dark:hover:bg-navy-700")
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-navy-100 shadow-soft dark:border-navy-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900/60">
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Student</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Country</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Joined</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const isSuspended = suspended.has(s.id);
                return (
                  <tr key={s.id} className="border-b border-navy-50 bg-white transition-colors last:border-b-0 hover:bg-paper-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-white/[0.03]">
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-navy-500 dark:text-navy-400">
                    No students match &quot;{query}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
