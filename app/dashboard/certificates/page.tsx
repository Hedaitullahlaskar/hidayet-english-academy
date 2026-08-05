import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyCertificates } from "@/lib/dashboard/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function CertificatesPage() {
  const certificates = await getMyCertificates();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Certificates</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Verifiable, shareable proof of what you've completed.</p>

      {certificates.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="🎓"
          title="No certificates yet"
          body="Complete a course to earn your first certificate — each one comes with a public verification link."
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c: { id: string; course_slug: string; issued_at: string; verification_code: string }) => (
            <div key={c.id} className="rounded-lg border border-gold-400 bg-navy-800 p-5 text-white shadow-elevated">
              <span className="text-2xl">🎓</span>
              <p className="mt-3 font-display font-semibold">{c.course_slug}</p>
              <p className="mt-1 text-xs text-navy-300">Issued {new Date(c.issued_at).toLocaleDateString()}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={`/api/certificates/${c.verification_code}/pdf`} className="text-xs font-semibold text-gold-300 underline">
                  Download PDF →
                </a>
                <a href={`/verify/${c.verification_code}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gold-300 underline">
                  Verification Link →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
