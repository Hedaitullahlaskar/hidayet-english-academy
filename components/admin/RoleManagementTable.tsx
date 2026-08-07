"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { updateUserRole } from "@/lib/admin/repository";

interface UserRow {
  id: string;
  full_name: string;
  role: "student" | "teacher" | "admin";
}

export function RoleManagementTable({ users, currentAdminId }: { users: UserRow[]; currentAdminId: string }) {
  const [roles, setRoles] = useState(Object.fromEntries(users.map((u) => [u.id, u.role])));
  const [pending, setPending] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function handleChange(userId: string, role: "student" | "teacher" | "admin") {
    setPending(userId);
    const result = await updateUserRole(userId, role);
    if (result.success) setRoles((prev) => ({ ...prev, [userId]: role }));
    setPending(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? users.filter((u) => u.full_name.toLowerCase().includes(q)) : users;
  }, [users, query]);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} placeholder="Search by name…" className="max-w-xs" />

      <div className="mt-4 overflow-hidden rounded-lg border border-navy-100 shadow-soft dark:border-navy-700">
        <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900/60">
            <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">User</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Current Role</th>
            <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Change To</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => {
            const isSelf = u.id === currentAdminId;
            return (
              <tr key={u.id} className="border-b border-navy-50 bg-white transition-colors last:border-b-0 hover:bg-paper-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-white/[0.03]">
                <td className="p-4 font-medium text-navy-800 dark:text-navy-100">
                  {u.full_name} {isSelf && <span className="text-xs text-navy-400">(you)</span>}
                </td>
                <td className="p-4">
                  <Badge tone={roles[u.id] === "admin" ? "gold" : roles[u.id] === "teacher" ? "navy" : "outline"}>{roles[u.id]}</Badge>
                </td>
                <td className="p-4">
                  {isSelf ? (
                    <span className="text-xs text-navy-400">Can&apos;t change your own role here</span>
                  ) : (
                    <select
                      value={roles[u.id]}
                      onChange={(e) => handleChange(u.id, e.target.value as "student" | "teacher" | "admin")}
                      disabled={pending === u.id}
                      className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={3} className="p-8 text-center text-sm text-navy-500 dark:text-navy-400">
                No users match &quot;{query}&quot;.
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
