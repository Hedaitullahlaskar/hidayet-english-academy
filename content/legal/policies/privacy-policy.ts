import type { PolicyDocument } from "@/content/legal/types";

export const privacyPolicy: PolicyDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  shortDescription: "What personal data we collect, why, and the choices you have over it.",
  category: "Safety & Privacy",
  lastUpdated: "2026-08-01",
  icon: "🔒",
  blocks: [
    {
      type: "paragraph",
      text: "This Privacy Policy explains how Hidayet English Academy ('HEA', 'we') collects, uses, stores, and protects your personal data when you use our website, dashboards, AI Study Assistant, and live classes. We built the Platform on Supabase (PostgreSQL with row-level security), which means access to your data is restricted at the database level, not just by application logic.",
    },
    { type: "heading", text: "1. What We Collect" },
    {
      type: "list",
      items: [
        "Account data: name, email, phone number, role (student, teacher, admin), timezone, and, for minors, guardian contact details.",
        "Learning data: enrollments, lesson progress, quiz and test attempts, homework submissions, attendance, and certificates.",
        "Communication data: messages sent to our AI Study Assistant, doubts asked to teachers, and support conversations.",
        "Payment data: transaction records (amount, currency, course, status) — we do not store your card number or bank details; those are handled entirely by Razorpay or Stripe.",
        "Technical data: login history, device/session information, and basic usage analytics needed to keep the Platform secure and working correctly.",
      ],
    },
    { type: "heading", text: "2. Why We Collect It" },
    {
      type: "paragraph",
      text: "We use your data to provide the service you signed up for: delivering lessons, tracking your progress, issuing certificates, processing payments, sending class reminders, and letting teachers give you meaningful feedback. We also use aggregated, non-identifying data to understand how the Platform is used and where it can be improved.",
    },
    {
      type: "callout",
      text: "We do not sell your personal data to third parties, and we do not use your learning data to train third-party advertising systems.",
    },
    { type: "heading", text: "3. The AI Study Assistant & Your Data" },
    {
      type: "paragraph",
      text: "Messages you send to the AI Study Assistant are processed by Anthropic's API to generate a response and are stored in our database so your conversation history is available to you across sessions. See our AI Usage Policy for how this specifically works, including what is and isn't shared with the AI provider.",
    },
    { type: "heading", text: "4. Who Can See Your Data" },
    {
      type: "list",
      items: [
        "You can always see your own data through your dashboard.",
        "Your teacher can see data relevant to courses you're enrolled in — progress, submissions, attendance — not your account security settings or payment details.",
        "Platform administrators can access data as needed for support, safety, and legal compliance, and every sensitive administrative action is recorded in an audit log.",
        "We use trusted service providers (Supabase for hosting and database, Razorpay/Stripe for payments, Resend for email, Anthropic for the AI Assistant) strictly to operate the Platform on our behalf, under their own data-protection obligations.",
      ],
    },
    { type: "heading", text: "5. Data Storage & Security" },
    {
      type: "paragraph",
      text: "Your data is stored in a Supabase-hosted PostgreSQL database with row-level security policies enforced at the database layer — meaning access rules aren't just checked in application code, they're enforced by the database itself. Passwords are never stored in plain text. Payment credentials never touch our servers at all. We use HTTPS for all data in transit.",
    },
    { type: "heading", text: "6. How Long We Keep Your Data" },
    {
      type: "paragraph",
      text: "We retain account and learning data for as long as your account is active, plus a reasonable period afterward to satisfy legal, tax, and record-keeping obligations (for example, payment records). You can request account deletion at any time from Account Settings; see the process and its limits below.",
    },
    { type: "heading", text: "7. Your Rights" },
    {
      type: "list",
      items: [
        "Access: you can view most of your data directly in your dashboard, and can request a full export.",
        "Correction: update your profile information at any time in Settings.",
        "Deletion: request account deletion; we'll process it subject to any legal retention requirements (e.g., financial records) and will let you know what's retained and why.",
        "Portability: request your data in a structured format.",
      ],
    },
    { type: "heading", text: "8. International Students" },
    {
      type: "paragraph",
      text: "HEA serves students in India, Bangladesh, and internationally. Your data may be processed on servers located outside your own country (our infrastructure providers operate globally). We take reasonable steps to protect your data regardless of where it's processed, consistent with this Policy.",
    },
    { type: "heading", text: "9. Children's Privacy" },
    {
      type: "paragraph",
      text: "Some of our students are minors. Where a student is under the age required by local law to consent to data processing independently, we require a parent or guardian to register on their behalf or to confirm consent. See our Child Safety Policy for more detail on how we protect younger learners specifically.",
    },
    { type: "heading", text: "10. Cookies" },
    {
      type: "paragraph",
      text: "We use a limited set of cookies for authentication, theme preference, and basic analytics. Full detail is in our separate Cookie Policy.",
    },
    { type: "heading", text: "11. Changes to This Policy" },
    {
      type: "paragraph",
      text: "We'll update the 'Last Updated' date above whenever this Policy changes, and will notify registered users of material changes.",
    },
    { type: "heading", text: "12. Contact" },
    {
      type: "paragraph",
      text: "For privacy questions or to exercise any of the rights above, contact hidayetenglishacademy@gmail.com or use our Contact & Grievance Redressal process.",
    },
  ],
};
