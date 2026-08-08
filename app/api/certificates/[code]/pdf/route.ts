import { NextResponse } from "next/server";
import { getCertificateByCode } from "@/lib/certificates/repository";
import { generateCertificatePdf } from "@/lib/certificates/generate";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const certificate = await getCertificateByCode(code);
  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  }

  const pdfBytes = await generateCertificatePdf({
    studentName: certificate.profiles?.full_name ?? "Student",
    courseName: certificate.course_slug,
    verificationCode: certificate.verification_code,
    issuedAt: certificate.issued_at,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="HEA-Certificate-${code}.pdf"`,
    },
  });
}
