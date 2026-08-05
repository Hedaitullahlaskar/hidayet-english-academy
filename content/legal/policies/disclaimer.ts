import type { PolicyDocument } from "@/content/legal/types";

export const disclaimer: PolicyDocument = {
  slug: "disclaimer",
  title: "Disclaimer",
  shortDescription: "The honest limits of what HEA promises and doesn't promise.",
  category: "Legal",
  lastUpdated: "2026-08-01",
  icon: "⚠️",
  blocks: [
    {
      type: "paragraph",
      text: "This Disclaimer sets out, plainly, what Hidayet English Academy does and doesn't promise. We'd rather be clear about our limits than let anyone assume something we can't guarantee.",
    },
    { type: "heading", text: "1. Educational Results" },
    {
      type: "paragraph",
      text: "We are genuinely committed to helping every student improve their English. That said, learning outcomes depend on many factors outside our control — your starting level, how consistently you attend and practice, and your own effort. We do not guarantee a specific fluency level, exam score, or job/interview outcome as a result of taking our courses.",
    },
    { type: "heading", text: "2. The AI Study Assistant" },
    {
      type: "callout",
      text: "The AI Study Assistant is a learning aid, not an infallible authority. It can occasionally be wrong, incomplete, or phrase something in a way that doesn't perfectly fit your situation. Always cross-check anything important with your teacher.",
    },
    { type: "heading", text: "3. Live Classes & Technology" },
    {
      type: "paragraph",
      text: "Live classes depend on third-party video platforms (Google Meet, Zoom) and on your own and our internet connectivity. While we choose reliable providers and reschedule classes when something goes wrong on our end, we cannot guarantee uninterrupted service, and we are not responsible for issues caused by your local internet connection, device, or the third-party platform's own outages.",
    },
    { type: "heading", text: "4. Certificates" },
    {
      type: "paragraph",
      text: "Certificates issued by HEA recognize completion of our own coursework and, where applicable, a passing assessment score. They are not a government-issued qualification, a university credit, or an official accreditation unless explicitly stated on the certificate itself. Their acceptance for a specific purpose (a job application, an academic transfer, etc.) is at the discretion of the receiving organization.",
    },
    { type: "heading", text: "5. Free Resources & Third-Party Links" },
    {
      type: "paragraph",
      text: "Where our site or lessons reference or link to third-party resources, tools, or websites, we don't control and aren't responsible for their content, accuracy, or availability.",
    },
    { type: "heading", text: "6. No Professional Advice" },
    {
      type: "paragraph",
      text: "Nothing on the Platform constitutes legal, financial, immigration, or career-counseling advice, even where a course touches on interview preparation or workplace English. For decisions with real consequences, please consult an appropriately qualified professional.",
    },
    { type: "heading", text: "7. Accuracy of Content" },
    {
      type: "paragraph",
      text: "We take care to keep lesson content, grammar explanations, and test materials accurate and current, and we correct errors when they're reported. Occasional mistakes are possible in any large body of educational content; if you spot one, please tell us — we genuinely want to fix it.",
    },
    { type: "heading", text: "8. Testimonials" },
    {
      type: "paragraph",
      text: "Where we feature student testimonials, they reflect that individual student's genuine, real experience. Results vary between students, and a testimonial is not a promise of similar results for you.",
    },
    { type: "heading", text: "9. Limitation of Liability" },
    {
      type: "paragraph",
      text: "To the maximum extent permitted by applicable law, HEA is not liable for indirect, incidental, or consequential damages arising from use of the Platform. This Disclaimer works alongside, and does not replace, the Limitation of Liability section in our Terms & Conditions.",
    },
    { type: "heading", text: "10. Contact" },
    {
      type: "paragraph",
      text: "If anything here is unclear, or if you've found an error in our content, contact hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "11. Comparisons to Other Platforms" },
    {
      type: "paragraph",
      text: "Where we describe our own teaching method, pricing, or features, we do so honestly and don't make direct claims about competing platforms we haven't independently verified. If you're comparing HEA to another option, we'd rather you make that decision on accurate information from both sides.",
    },
    { type: "heading", text: "12. Screenshots & Marketing Material" },
    {
      type: "paragraph",
      text: "Screenshots, sample lessons, and promotional material shown on our website and social channels reflect genuine platform content, though minor visual details may differ slightly from the current live version as we continue improving the Platform.",
    },
    { type: "heading", text: "13. Force Majeure" },
    {
      type: "paragraph",
      text: "We are not responsible for delays or interruptions caused by events outside our reasonable control — internet infrastructure failures, natural disasters, government action, or widespread outages affecting our third-party providers (Supabase, Vercel, Razorpay, Stripe, Google Meet, Zoom). We will still make reasonable efforts to communicate and reschedule affected classes where possible.",
    },
    { type: "heading", text: "14. Language Interpretation" },
    {
      type: "paragraph",
      text: "Where our policies or course content are presented in both English and Bengali, the English version is the authoritative reference in the event of any discrepancy between the two, since our legal and policy documents are drafted in English first.",
    },
    { type: "heading", text: "15. No Waiver" },
    {
      type: "paragraph",
      text: "If we don't immediately act on a violation of our policies, that does not mean we've waived our right to act on it, or on similar violations, later. Each situation is assessed on its own facts.",
    },
    { type: "heading", text: "16. Severability" },
    {
      type: "paragraph",
      text: "If any part of this Disclaimer or our other policies is found unenforceable in a particular jurisdiction, the remainder continues to apply in full — an issue with one clause doesn't invalidate the whole document.",
    },
  ],
};
