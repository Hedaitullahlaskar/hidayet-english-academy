import type { PolicyDocument } from "@/content/legal/types";

export const dataProtectionPolicy: PolicyDocument = {
  slug: "data-protection-policy",
  title: "Data Protection Policy",
  shortDescription: "The concrete technical and organizational measures we use to protect your data.",
  category: "Safety & Privacy",
  lastUpdated: "2026-08-01",
  icon: "🛡️",
  blocks: [
    {
      type: "paragraph",
      text: "Where our Privacy Policy explains what data we collect and why, this Data Protection Policy explains, more concretely, how we actually protect it — the technical and organizational measures behind the promises.",
    },
    { type: "heading", text: "1. Database-Level Access Control" },
    {
      type: "paragraph",
      text: "Our database uses Row Level Security (RLS), enforced by PostgreSQL itself — not just checked in application code. This means a student's data is only ever returned to that student's own authenticated session, a teacher only ever sees data relevant to their own courses, and an admin's broader access is itself logged. This is enforced at the data layer, so even a bug in the application UI can't accidentally expose another person's record.",
    },
    { type: "heading", text: "2. Encryption" },
    {
      type: "list",
      items: [
        "All data in transit between your browser and our servers is encrypted via HTTPS.",
        "Passwords are never stored in plain text — they're hashed using industry-standard methods.",
        "Sensitive files (like homework submissions) are stored in access-controlled storage, not public folders, and are served through short-lived signed URLs rather than permanent public links.",
      ],
    },
    { type: "heading", text: "3. Payment Data" },
    {
      type: "callout",
      text: "HEA's own servers never receive, process, or store your card number, CVV, or bank credentials. That data goes directly to Razorpay or Stripe, both PCI-DSS compliant payment processors.",
    },
    { type: "heading", text: "4. Access Auditing" },
    {
      type: "paragraph",
      text: "Sensitive administrative actions — role changes, account suspensions, refund approvals, data exports — are recorded in an audit log, so there's always an accountable record of who did what and when.",
    },
    { type: "heading", text: "5. Service Providers" },
    {
      type: "paragraph",
      text: "We use a small, deliberate set of infrastructure providers: Supabase (database, authentication, storage), Vercel (hosting), Razorpay and Stripe (payments), Anthropic (AI Assistant), and Resend (email). Each is contractually and technically restricted to using your data only to provide their specific service to us.",
    },
    { type: "heading", text: "6. Data Minimization" },
    {
      type: "paragraph",
      text: "We collect what we need to run the Platform well, and avoid collecting data we have no genuine use for. Where a feature could work without a particular piece of personal data, we design it that way.",
    },
    { type: "heading", text: "7. Breach Response" },
    {
      type: "paragraph",
      text: "In the unlikely event of a data breach affecting your personal information, we will investigate promptly, take immediate steps to contain it, and notify affected users and relevant authorities as required by applicable law.",
    },
    { type: "heading", text: "8. Staff Access" },
    {
      type: "paragraph",
      text: "Internal access to student data is limited to what's needed for the relevant role — support, teaching, or administration — following the same principle as our RLS policies: access is scoped, not blanket.",
    },
    { type: "heading", text: "9. Your Role in Data Protection" },
    {
      type: "paragraph",
      text: "Use a strong, unique password, enable the security features available in Account Settings (like reviewing active sessions), and never share your login credentials — the strongest technical protections still depend on account-level security too.",
    },
    { type: "heading", text: "10. Questions" },
    {
      type: "paragraph",
      text: "For any question about how your data is protected, contact hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "11. Testing & Development Practices" },
    {
      type: "paragraph",
      text: "When we build and test new features, we use synthetic or clearly separated test data wherever possible rather than real student records, to reduce the exposure of genuine personal data during development.",
    },
    { type: "heading", text: "12. Third-Party Security Standards" },
    {
      type: "paragraph",
      text: "Our infrastructure providers are chosen partly for their own security posture: Supabase and Vercel both maintain independently audited security practices, and Razorpay and Stripe are both certified to the PCI-DSS standard required of payment processors handling card data.",
    },
    { type: "heading", text: "13. Data Backups" },
    {
      type: "paragraph",
      text: "Our database infrastructure includes regular automated backups, so that a technical failure doesn't put your learning history, certificates, or progress records at risk of being permanently lost.",
    },
    { type: "heading", text: "14. Ongoing Review" },
    {
      type: "paragraph",
      text: "As HEA grows and adds features, we review these protections regularly rather than treating them as a one-time setup — new functionality is built with the same row-level-security and least-privilege principles described above, not bolted on afterward.",
    },
    { type: "heading", text: "15. Vendor Risk Management" },
    {
      type: "paragraph",
      text: "Before adopting a new infrastructure or service provider, we consider their security track record and data-handling practices, favoring established providers with clear, published security commitments over untested alternatives, even where a newer option might be cheaper.",
    },
    { type: "heading", text: "16. Physical Security" },
    {
      type: "paragraph",
      text: "Because our infrastructure runs on managed cloud platforms (Supabase and Vercel) rather than our own physical servers, the physical security of the data centers hosting your information is handled by these providers' own enterprise-grade facilities, audited independently to standards well beyond what a small platform could maintain on its own hardware.",
    },
    { type: "heading", text: "17. Data Protection Officer" },
    {
      type: "paragraph",
      text: "Data protection matters are currently overseen directly by HEA's administration team through hidayetenglishacademy@gmail.com; as the Platform scales, a formally designated data protection contact will be published here.",
    },
  ],
};
