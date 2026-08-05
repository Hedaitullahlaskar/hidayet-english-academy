import type { PolicyDocument } from "@/content/legal/types";

export const contactAndGrievanceRedressalPolicy: PolicyDocument = {
  slug: "contact-and-grievance-redressal-policy",
  title: "Contact & Grievance Redressal Policy",
  shortDescription: "How to reach us, and how a formal complaint is handled from start to finish.",
  category: "Legal",
  lastUpdated: "2026-08-01",
  icon: "📮",
  blocks: [
    {
      type: "paragraph",
      text: "Most questions and concerns are best resolved through a direct conversation with your teacher or our support team. This Policy describes both how to reach us for everyday questions, and how a formal grievance is handled when that's what's needed.",
    },
    { type: "heading", text: "1. General Contact" },
    {
      type: "list",
      items: [
        "Email: hidayetenglishacademy@gmail.com",
        "WhatsApp: +91 6290056461, for quick questions and enrollment support.",
        "In-app: the Doubts feature for course-related questions directly to your teacher.",
      ],
    },
    { type: "heading", text: "2. What Counts as a Grievance" },
    {
      type: "paragraph",
      text: "A grievance is a formal complaint about something that went wrong — a safety concern, a billing dispute you feel wasn't resolved, a conduct violation by a teacher or student, or dissatisfaction with how an earlier request was handled. It's a different track from a routine question or a first-time support request.",
    },
    { type: "heading", text: "3. How to Raise a Grievance" },
    {
      type: "paragraph",
      text: "Email hidayetenglishacademy@gmail.com with the subject line 'Grievance' and include: your name and account email, a clear description of the issue, any relevant dates or order/course details, and what outcome you're seeking.",
    },
    { type: "heading", text: "4. Our Review Process" },
    {
      type: "list",
      items: [
        "Acknowledgment: we confirm receipt within 2 business days.",
        "Investigation: we review the issue, which may include looking at real system records (attendance, payment status, message logs where relevant) rather than relying on memory alone.",
        "Resolution: we aim to resolve most grievances within 7 business days; complex cases may take longer, and we'll tell you if they do.",
        "Response: you'll receive a clear written explanation of the outcome and, where applicable, any action taken.",
      ],
    },
    {
      type: "callout",
      text: "Child-safety concerns are handled outside this standard timeline — they are reviewed immediately, not queued behind routine grievances. See our Child Safety Policy.",
    },
    { type: "heading", text: "5. Confidentiality" },
    {
      type: "paragraph",
      text: "Grievances, especially those involving another person's conduct, are handled as confidentially as the investigation allows. We won't share more detail than necessary with anyone involved.",
    },
    { type: "heading", text: "6. If You're Not Satisfied" },
    {
      type: "paragraph",
      text: "If you feel a grievance wasn't resolved fairly, you may request a review by a different member of our administration team. Beyond HEA's own process, you retain any rights available to you under applicable consumer-protection law in your jurisdiction.",
    },
    { type: "heading", text: "7. Payment-Specific Disputes" },
    {
      type: "paragraph",
      text: "For billing and refund concerns specifically, see our Payment Policy and Refund & Cancellation Policy — most are resolved faster through that direct process than as a formal grievance.",
    },
    { type: "heading", text: "8. Retaliation" },
    {
      type: "paragraph",
      text: "Raising a good-faith grievance — including one about a teacher or about HEA administration itself — will never result in retaliation, reduced support, or any negative consequence to your account standing.",
    },
    { type: "heading", text: "9. Grievance Officer" },
    {
      type: "paragraph",
      text: "For formal grievances, our team reviews and responds directly through hidayetenglishacademy@gmail.com; as the platform grows, a named grievance officer and updated contact details will be published here.",
    },
    { type: "heading", text: "10. What to Expect From Us Throughout" },
    {
      type: "paragraph",
      text: "We aim to communicate clearly at every stage — you should never be left wondering whether your grievance is still being looked at. If a resolution is taking longer than our usual timeline, we'll tell you why and give a realistic revised estimate rather than going quiet.",
    },
    { type: "heading", text: "11. Grievances Involving a Teacher" },
    {
      type: "paragraph",
      text: "A grievance about a specific teacher is reviewed by HEA administration directly, not by that teacher, to keep the process fair and independent. We take these particularly seriously, since teachers hold real responsibility for student wellbeing under our Teacher Code of Conduct.",
    },
    { type: "heading", text: "12. Anonymous Concerns" },
    {
      type: "paragraph",
      text: "If you'd rather not attach your name to an initial report — particularly for a sensitive concern — you're welcome to raise it that way. We may not be able to follow up directly or take formal action without more information, but an anonymous tip that helps us spot a pattern is still valuable and always read carefully.",
    },
    { type: "heading", text: "13. International Students" },
    {
      type: "paragraph",
      text: "Students contacting us from outside India or Bangladesh follow exactly the same grievance process — there's no separate, slower track for international users. We're mindful of timezone differences when scheduling any follow-up conversation.",
    },
    { type: "heading", text: "14. Language of Communication" },
    {
      type: "paragraph",
      text: "You're welcome to raise a grievance in English or Bengali, whichever you're more comfortable expressing yourself in clearly — we'd rather understand your concern precisely than have you struggle to phrase it in a second language.",
    },
    { type: "heading", text: "15. Escalation Within HEA" },
    {
      type: "paragraph",
      text: "Most grievances are resolved at the first point of contact. Where a matter is serious or unresolved after initial review, it is escalated to senior HEA administration for a final decision, and you'll be told clearly when that escalation happens.",
    },
  ],
};
