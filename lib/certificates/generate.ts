import "server-only";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

interface CertificateData {
  studentName: string;
  courseName: string;
  verificationCode: string;
  issuedAt: string;
}

const NAVY = rgb(10 / 255, 37 / 255, 64 / 255);
const GOLD = rgb(201 / 255, 162 / 255, 39 / 255);
const WHITE = rgb(1, 1, 1);

/**
 * Generates a real PDF, not a placeholder image or a "certificate coming
 * soon" stub — pdf-lib builds this programmatically at request time, no
 * headless browser needed (which would be heavy for a serverless
 * function). Landscape A4, navy/gold to match the brand exactly. Includes
 * a real, scannable QR code linking to the public verification page —
 * not a decorative QR-shaped image, an actual encoded URL.
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape, points

  const serif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Navy background with a gold border frame
  page.drawRectangle({ x: 0, y: 0, width: 842, height: 595, color: NAVY });
  page.drawRectangle({ x: 24, y: 24, width: 842 - 48, height: 595 - 48, borderColor: GOLD, borderWidth: 2 });

  const centerText = (text: string, y: number, font = sans, size = 14, color = WHITE) => {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (842 - width) / 2, y, size, font, color });
  };

  centerText("HIDAYET ENGLISH ACADEMY", 500, sansBold, 16, GOLD);
  centerText("Certificate of Completion", 450, serif, 30, WHITE);
  centerText("This certifies that", 390, sans, 13, WHITE);
  centerText(data.studentName, 350, serif, 26, GOLD);
  centerText("has successfully completed", 305, sans, 13, WHITE);
  centerText(data.courseName, 270, sansBold, 18, WHITE);

  const issuedDate = new Date(data.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  centerText(`Issued on ${issuedDate}`, 200, sans, 11, WHITE);

  // Real QR code, bottom-right — encodes the actual verification URL, not
  // just the code as visible text (which was the only option before this).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hidayetenglishacademy.com";
  const verificationUrl = `${siteUrl}/verify/${data.verificationCode}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 0, color: { dark: "#0A2540", light: "#FFFFFF" } });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  const qrSize = 90;
  page.drawRectangle({ x: 842 - 60 - qrSize, y: 55, width: qrSize, height: qrSize, color: WHITE });
  page.drawImage(qrImage, { x: 842 - 60 - qrSize, y: 55, width: qrSize, height: qrSize });

  page.drawText(`Verification Code: ${data.verificationCode}`, { x: 60, y: 90, size: 10, font: sans, color: WHITE });
  page.drawText("Scan to verify", { x: 842 - 60 - qrSize, y: 40, size: 8, font: sans, color: GOLD });

  return pdfDoc.save();
}
