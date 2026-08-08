import type { Metadata } from "next";
import QRCode from "qrcode";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { getCertificateByCode } from "@/lib/certificates/repository";

export const metadata: Metadata = {
  title: "Certificate Verification",
  robots: { index: false, follow: false },
};

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hidayetenglishacademy.com";
  const qrDataUrl = certificate
    ? await QRCode.toDataURL(`${siteUrl}/verify/${code}`, { margin: 1, width: 160 })
    : null;

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-paper-100 py-20 dark:bg-navy-900">
      <Container className="max-w-md text-center">
        {certificate ? (
          <>
            <span className="text-4xl" aria-hidden="true">✅</span>
            <Badge tone="success" className="mt-4">Verified</Badge>
            <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">
              Genuine Hidayet English Academy Certificate
            </h1>
            <div className="mt-6 rounded-lg border border-navy-100 bg-white p-6 text-left shadow-card dark:border-navy-700 dark:bg-navy-800">
              <p className="text-sm text-navy-500 dark:text-navy-400">Awarded to</p>
              <p className="font-display text-lg font-semibold text-navy-900 dark:text-white">{certificate.profiles?.full_name ?? "Student"}</p>
              <p className="mt-3 text-sm text-navy-500 dark:text-navy-400">Course</p>
              <p className="font-semibold text-navy-800 dark:text-navy-100">{certificate.course_slug}</p>
              <p className="mt-3 text-sm text-navy-500 dark:text-navy-400">Issued</p>
              <p className="font-semibold text-navy-800 dark:text-navy-100">{new Date(certificate.issued_at).toLocaleDateString()}</p>
            </div>
            <a
              href={`/api/certificates/${code}/pdf`}
              className="mt-6 inline-block rounded-full bg-gold-600 px-6 py-3 text-sm font-semibold text-navy-900"
            >
              Download PDF →
            </a>
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR code linking to this verification page" className="mx-auto mt-6 rounded-lg border border-navy-100 dark:border-navy-700" width={120} height={120} />
            )}
          </>
        ) : (
          <>
            <span className="text-4xl" aria-hidden="true">❌</span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">Certificate Not Found</h1>
            <p className="mt-2 text-navy-600 dark:text-navy-300">
              No certificate matches this verification code. Double-check the link, or contact the academy if you
              believe this is an error.
            </p>
          </>
        )}
      </Container>
    </section>
  );
}
