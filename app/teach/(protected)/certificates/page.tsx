import { IssueCertificateForm } from "@/components/teacher/IssueCertificateForm";
import { getAllStudents } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function IssueCertificatesPage() {
  const students = await getAllStudents();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Issue Certificates</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Each certificate gets a unique, publicly verifiable code the moment it&apos;s issued.
      </p>
      <div className="mt-8 max-w-xl">
        <IssueCertificateForm students={students} />
      </div>
    </div>
  );
}
