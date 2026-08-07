import { Award } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getAllCertificatesAdmin } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCertificatesPage() {
  const certificates = await getAllCertificatesAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Certificate Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Every certificate ever issued, across every teacher. Issuing happens in the Teacher Dashboard.</p>

      {certificates.length === 0 ? (
        <EmptyState className="mt-8" icon={<Award className="h-6 w-6" strokeWidth={1.75} />} title="No certificates issued yet" body="Certificates issued by any teacher will appear here, searchable by verification code." />
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-navy-100 shadow-soft dark:border-navy-700">
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900/60">
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Student</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Course</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Issued</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Verification Code</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c: { id: string; course_slug: string; issued_at: string; verification_code: string; profiles: { full_name: string } | null }) => (
                <tr key={c.id} className="border-b border-navy-50 bg-white transition-colors last:border-b-0 hover:bg-paper-50 dark:border-navy-800 dark:bg-navy-900 dark:hover:bg-white/[0.03]">
                  <td className="p-4 text-navy-800 dark:text-navy-100">{c.profiles?.full_name ?? "Student"}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{c.course_slug}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{new Date(c.issued_at).toLocaleDateString()}</td>
                  <td className="p-4 font-mono text-xs text-navy-500 dark:text-navy-400">{c.verification_code}</td>
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
