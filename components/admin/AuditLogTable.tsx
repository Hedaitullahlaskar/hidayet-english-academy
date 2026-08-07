"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

interface LogRow {
  id: string;
  action: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

export function AuditLogTable({ logs }: { logs: LogRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) => l.action.toLowerCase().includes(q) || (l.profiles?.full_name ?? "system").toLowerCase().includes(q)
    );
  }, [logs, query]);

  return (
    <div className="mt-8">
      <SearchInput value={query} onChange={setQuery} placeholder="Search by action or admin name…" className="max-w-xs" />

      <div className="mt-4 overflow-hidden rounded-lg border border-navy-100 shadow-soft dark:border-navy-700">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900/60">
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Action</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">By</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-navy-50 bg-white transition-colors last:border-b-0 hover:bg-paper-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-white/[0.03]">
                  <td className="p-4 font-medium text-navy-800 dark:text-navy-100">{l.action.replace(/_/g, " ")}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{l.profiles?.full_name ?? "System"}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-sm text-navy-500 dark:text-navy-400">
                    No audit events match &quot;{query}&quot;.
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
