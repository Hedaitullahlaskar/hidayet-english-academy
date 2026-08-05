"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { updateUserRole } from "@/lib/admin/repository";

interface UserRow {
  id: string;
  full_name: string;
  role: "student" | "teacher" | "admin";
}

export function RoleManagementTable({ users, currentAdminId }: { users: UserRow[]; currentAdminId: string }) {
  const [roles, setRoles] = useState(Object.fromEntries(users.map((u) => [u.id, u.role])));
  const [pending, setPending] = useState<string | null>(null);

  async function handleChange(userId: string, role: "student" | "teacher" | "admin") {
    setPending(userId);
    const result = await updateUserRole(userId, role);
    if (result.success) setRoles((prev) => ({ ...prev, [userId]: role }));
    setPending(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-navy-100 shadow-card dark:border-navy-700">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-navy-800 text-white">
            <th className="p-4 font-display font-semibold">User</th>
            <th className="p-4 font-display font-semibold">Current Role</th>
            <th className="p-4 font-display font-semibold">Change To</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => {
            const isSelf = u.id === currentAdminId;
            return (
              <tr key={u.id} className={i % 2 === 0 ? "bg-white dark:bg-navy-900" : "bg-paper-100 dark:bg-navy-800"}>
                <td className="p-4 font-medium text-navy-800 dark:text-navy-100">
                  {u.full_name} {isSelf && <span className="text-xs text-navy-400">(you)</span>}
                </td>
                <td className="p-4">
                  <Badge tone={roles[u.id] === "admin" ? "gold" : roles[u.id] === "teacher" ? "navy" : "outline"}>{roles[u.id]}</Badge>
                </td>
                <td className="p-4">
                  {isSelf ? (
                    <span className="text-xs text-navy-400">Can't change your own role here</span>
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
        </tbody>
      </table>
    </div>
  );
}
