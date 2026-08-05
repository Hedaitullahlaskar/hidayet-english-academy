import type { PolicyDocument } from "@/content/legal/types";

export const termsAndConditions: PolicyDocument = {
  slug: "terms-and-conditions",
  title: "Terms & Conditions",
  shortDescription: "The agreement between you and HEA when you register, enroll, or use the platform.",
  category: "Legal",
  lastUpdated: "2026-08-01",
  icon: "📜",
  blocks: [
    {
      type: "paragraph",
      text: "These Terms & Conditions ('Terms') govern your access to and use of the Hidayet English Academy ('HEA', 'we', 'us') website, mobile experience, AI Study Assistant, live classes, and all related services (collectively, the 'Platform'). By creating an account, enrolling in a course, or otherwise using the Platform, you agree to be bound by these Terms. If you are under 18, a parent or legal guardian must review and accept these Terms on your behalf.",
    },
    { type: "heading", text: "1. Who We Are" },
    {
      type: "paragraph",
      text: "HEA is a spoken-English and academic-English learning platform built for Bengali-speaking students in India, Bangladesh, and the wider diaspora. We offer live classes, recorded lessons, an AI Study Assistant, practice tests, and certification, delivered through this website and its student, teacher, and administrative dashboards.",
    },
    { type: "heading", text: "2. Eligibility & Accounts" },
    {
      type: "list",
      items: [
        "You must provide accurate registration information and keep it up to date.",
        "One account per person. Sharing login credentials, including with family members, is not permitted.",
        "You are responsible for all activity that occurs under your account, so keep your password secure and use the account-security tools in Settings if you suspect unauthorized access.",
        "We may suspend or terminate accounts that violate these Terms, the Acceptable Use Policy, or the Student/Teacher Code of Conduct.",
      ],
    },
    { type: "heading", text: "3. Courses, Enrollment & Access" },
    {
      type: "paragraph",
      text: "Enrolling in a paid course grants you a personal, non-transferable license to access that course's lessons, live classes, and materials for the duration described at checkout. Free programs, including our Madhyamik scholarship track, are subject to the same Terms and to any eligibility criteria stated on the relevant course page.",
    },
    {
      type: "callout",
      text: "Course access is personal to you. Reselling, sharing, or publicly redistributing course content is a breach of these Terms and of our Anti-Piracy Policy.",
    },
    { type: "heading", text: "4. Payments" },
    {
      type: "paragraph",
      text: "Paid enrollments are processed securely through Razorpay (for payments in India) or Stripe (for international payments). We never see or store your full card details. Pricing, currency, and applicable taxes are shown at checkout before you pay. See our separate Payment Policy and Refund & Cancellation Policy for details on billing, receipts, and refunds.",
    },
    { type: "heading", text: "5. The AI Study Assistant" },
    {
      type: "paragraph",
      text: "Our AI Study Assistant is a learning aid, not a substitute for a human teacher, and its responses may occasionally be incorrect or incomplete. Use of the Assistant is additionally governed by our AI Usage Policy, which explains its intended use, its limits, and how conversation data is handled.",
    },
    { type: "heading", text: "6. Live Classes & Recordings" },
    {
      type: "paragraph",
      text: "Live classes are conducted over Google Meet or Zoom. By joining a live class you agree to our Live Class Rules. Where a class is recorded for replay, we will indicate this; recordings are for enrolled students' personal study only and may not be redistributed.",
    },
    { type: "heading", text: "7. Intellectual Property" },
    {
      type: "paragraph",
      text: "All course content, video, audio, written material, and the HEA brand and platform design are the intellectual property of Hidayet English Academy or its licensors. Your enrollment gives you a right to use this content for personal learning, not a right to copy, republish, or commercially exploit it. See our Intellectual Property & Copyright Policy for full detail.",
    },
    { type: "heading", text: "8. Termination" },
    {
      type: "paragraph",
      text: "You may stop using the Platform and request account deletion at any time from Account Settings. We may suspend or terminate access where these Terms, our policies, or applicable law are violated, or where required to protect the safety of other students, teachers, or the Platform itself.",
    },
    { type: "heading", text: "9. Disclaimers & Limitation of Liability" },
    {
      type: "paragraph",
      text: "The Platform is provided on an 'as is' and 'as available' basis. While we work hard to keep classes, content, and systems reliable, we do not guarantee uninterrupted access, and we are not liable for indirect or consequential losses arising from use of the Platform, to the maximum extent permitted by applicable law. Nothing in these Terms limits liability that cannot lawfully be limited, such as liability for fraud or gross negligence.",
    },
    { type: "heading", text: "10. Changes to These Terms" },
    {
      type: "paragraph",
      text: "We may update these Terms from time to time as the Platform evolves. Material changes will be reflected in the 'Last Updated' date on this page, and where appropriate, we will notify registered users. Continued use of the Platform after an update constitutes acceptance of the revised Terms.",
    },
    { type: "heading", text: "11. Governing Law" },
    {
      type: "paragraph",
      text: "These Terms are intended to be governed by the laws of India, without prejudice to any mandatory consumer-protection rights you may have under the law of your own country of residence. This section, like the rest of this Policy Center, is a general framework and not a substitute for advice from a qualified lawyer in your jurisdiction.",
    },
    { type: "heading", text: "12. Contact" },
    {
      type: "paragraph",
      text: "Questions about these Terms can be sent to hidayetenglishacademy@gmail.com or raised through our Contact & Grievance Redressal Policy process.",
    },
  ],
};
