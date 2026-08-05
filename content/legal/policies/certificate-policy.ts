import type { PolicyDocument } from "@/content/legal/types";

export const certificatePolicy: PolicyDocument = {
  slug: "certificate-policy",
  title: "Certificate Policy",
  shortDescription: "How certificates are earned, issued, verified, and what they represent.",
  category: "Academic",
  lastUpdated: "2026-08-01",
  icon: "🏅",
  blocks: [
    {
      type: "paragraph",
      text: "A HEA certificate is a real record of real work — this Policy explains how one is earned, how it's generated, and how anyone can verify it's genuine.",
    },
    { type: "heading", text: "1. Types of Certificates" },
    {
      type: "list",
      items: [
        "Completion certificates: issued when you finish a course, meeting any assessment requirements the course specifies.",
        "Achievement certificates: issued for specific accomplishments outside standard completion — for example, perfect attendance or an outstanding project — at your teacher's discretion.",
      ],
    },
    { type: "heading", text: "2. Eligibility for a Completion Certificate" },
    {
      type: "paragraph",
      text: "Requirements vary by course and are stated on the course page before you enroll — typically, completing all required lessons and, where applicable, achieving the course's pass mark on its final assessment. Your teacher issues the certificate once these are genuinely met, not automatically on a calendar date.",
    },
    { type: "heading", text: "3. How Certificates Are Generated" },
    {
      type: "paragraph",
      text: "Each certificate is generated as a real PDF document at the moment of issuance, carrying your name, the course, the issue date, and a unique verification code with an embedded QR code.",
    },
    { type: "heading", text: "4. Verifying a Certificate" },
    {
      type: "callout",
      text: "Every certificate can be verified by anyone — an employer, an institution, or you yourself — at hidayetenglishacademy.com/verify/[code], or by scanning the QR code printed on the certificate. No login is required to verify.",
    },
    { type: "heading", text: "5. What a Certificate Represents" },
    {
      type: "paragraph",
      text: "A HEA certificate confirms that you completed a specific course with us, to the standard that course requires. It is not a government-issued qualification, a university credential, or a professional license, and its acceptance for any specific external purpose is at the discretion of whoever you present it to. See our Disclaimer for more on this.",
    },
    { type: "heading", text: "6. Downloading & Sharing" },
    {
      type: "paragraph",
      text: "You can download your certificate as a PDF from your dashboard at any time after issuance, and a copy is also emailed to you automatically the moment it's issued. You're welcome to share it — on LinkedIn, in an application, wherever it's useful to you.",
    },
    { type: "heading", text: "7. Corrections" },
    {
      type: "paragraph",
      text: "If your name or course details are shown incorrectly on an issued certificate (for example, due to a typo in your profile at the time), contact us and we'll correct your profile and reissue it.",
    },
    { type: "heading", text: "8. Certificates & Refunds" },
    {
      type: "paragraph",
      text: "Once a completion certificate has been issued, the course enrollment is considered fulfilled and is no longer eligible for a refund under our Refund & Cancellation Policy.",
    },
    { type: "heading", text: "9. Revocation" },
    {
      type: "paragraph",
      text: "In the rare case that a certificate was issued in error, or is later found to be associated with a proven academic-honesty violation, HEA reserves the right to revoke it. A revoked certificate's verification page will reflect this status rather than silently disappearing.",
    },
    { type: "heading", text: "10. Contact" },
    {
      type: "paragraph",
      text: "For certificate corrections, verification issues, or any other question, contact hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "11. Sharing Your Certificate Professionally" },
    {
      type: "paragraph",
      text: "Many students add their HEA certificate to a resume, a LinkedIn profile, or a college application. Because every certificate carries a scannable QR code linking to a live verification page, anyone reviewing your application can confirm it's genuine in seconds, without needing to contact us directly — something a plain PDF or printed certificate can't offer.",
    },
    { type: "heading", text: "12. Certificate Design & Format" },
    {
      type: "paragraph",
      text: "Certificates are generated as landscape PDF documents in HEA's navy-and-gold branding, including your full name as it appears on your profile, the course name, the date of issuance, your unique verification code, and the QR code. Keep your profile name accurate and complete before a certificate is issued, since that's exactly what will appear on it.",
    },
    { type: "heading", text: "13. Achievement Certificates in Detail" },
    {
      type: "paragraph",
      text: "Achievement certificates recognize something beyond standard course completion — for example, perfect attendance across a term, an outstanding project, or consistent top performance in weekly tests. These are issued at a teacher's discretion, carry their own achievement title on the certificate itself, and use the same verification and QR system as completion certificates.",
    },
    { type: "heading", text: "14. No Cost for Certificates" },
    {
      type: "paragraph",
      text: "Certificate issuance, PDF download, and verification are included at no extra cost for any course you've completed — we don't charge separately for a certificate you've already earned through your enrollment.",
    },
    { type: "heading", text: "15. Retained Records" },
    {
      type: "paragraph",
      text: "Even if you later delete your HEA account, the underlying certificate record and its verification page remain accessible by verification code, so a certificate you've already shared with an employer or institution stays verifiable — this protects you as much as it protects the integrity of the credential.",
    },
    { type: "heading", text: "16. Print Quality" },
    {
      type: "paragraph",
      text: "The generated PDF is designed for both digital sharing and physical printing, at a resolution and layout suitable for framing or including in a physical portfolio if you'd like a printed copy.",
    },
  ],
};
