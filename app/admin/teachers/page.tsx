import { Avatar } from "@/components/dashboard/Avatar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PromoteTeacherForm, AddTeacherNoteForm } from "@/components/admin/TeacherManagementForms";
import { getAllTeachers, getTeacherNotes } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminTeachersPage() {
  const teachers = await getAllTeachers();
  const notesByTeacher = await Promise.all(teachers.map((t: { id: string }) => getTeacherNotes(t.id)));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Teacher Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Promote accounts to teacher, and keep private notes (salary, performance) per teacher.</p>

      <div className="mt-8 max-w-md">
        <PromoteTeacherForm />
      </div>

      <h2 className="mb-4 mt-10 font-display text-lg font-semibold text-navy-900 dark:text-white">All Teachers</h2>
      {teachers.length === 0 ? (
        <EmptyState icon="👨‍🏫" title="No teachers yet" body="Promote a registered student account to teacher using the form above." />
      ) : (
        <div className="space-y-4">
          {teachers.map((t: { id: string; full_name: string; avatar_url: string | null }, i: number) => (
            <div key={t.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <div className="flex items-center gap-3">
                <Avatar name={t.full_name} avatarUrl={t.avatar_url} size={40} />
                <p className="font-semibold text-navy-900 dark:text-white">{t.full_name}</p>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">
                Private Notes (Admin Only — Salary &amp; Performance)
              </p>
              {notesByTeacher[i].length === 0 ? (
                <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">No notes yet.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {notesByTeacher[i].map((n: { id: string; note: string }) => (
                    <li key={n.id} className="text-sm text-navy-700 dark:text-navy-200">· {n.note}</li>
                  ))}
                </ul>
              )}
              <AddTeacherNoteForm teacherId={t.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
