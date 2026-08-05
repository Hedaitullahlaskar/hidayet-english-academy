import { EmptyState } from "@/components/dashboard/EmptyState";
import { StudentManagementTable } from "@/components/admin/StudentManagementTable";
import { getAllStudentsAdmin } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminStudentsPage() {
  const students = await getAllStudentsAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Student Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Every student on the platform — suspend access, review enrollment and progress.</p>
      {students.length === 0 ? (
        <EmptyState className="mt-8" icon="🧑‍🎓" title="No students yet" body="Students who register will appear here, manageable in one place." />
      ) : (
        <div className="mt-8">
          <StudentManagementTable students={students} />
        </div>
      )}
    </div>
  );
}
