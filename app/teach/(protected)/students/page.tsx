import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Avatar } from "@/components/dashboard/Avatar";
import { getAllStudents } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentListPage() {
  const students = await getAllStudents();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Students</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Every registered student, in one place.</p>

      {students.length === 0 ? (
        <EmptyState className="mt-8" icon={<GraduationCap className="h-6 w-6" strokeWidth={1.75} />} title="No students yet" body="Students who register on the site will appear here automatically." />
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-navy-100 shadow-soft dark:border-navy-700">
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900/60">
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Student</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Country</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Joined</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {students.map((s: { id: string; full_name: string; avatar_url: string | null; country: string | null; created_at: string }) => (
                <tr key={s.id} className="border-b border-navy-50 bg-white transition-colors last:border-b-0 hover:bg-paper-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-white/[0.03]">
                  <td className="flex items-center gap-3 p-4">
                    <Avatar name={s.full_name} avatarUrl={s.avatar_url} size={32} />
                    <span className="font-medium text-navy-800 dark:text-navy-100">{s.full_name}</span>
                  </td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{s.country ?? "—"}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Link href={`/teach/students/${s.id}`} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
