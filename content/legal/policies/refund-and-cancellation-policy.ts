import type { PolicyDocument } from "@/content/legal/types";

export const refundAndCancellationPolicy: PolicyDocument = {
  slug: "refund-and-cancellation-policy",
  title: "Refund & Cancellation Policy",
  shortDescription: "When you're eligible for a refund, how to request one, and how cancellations work.",
  category: "Payments",
  lastUpdated: "2026-08-01",
  icon: "↩️",
  blocks: [
    {
      type: "paragraph",
      text: "We want you to enroll in a course because it's genuinely right for you, not because you felt locked in after paying. This Policy explains when a refund is available, how to request one, and how long it takes — for both Razorpay (India) and Stripe (international) payments.",
    },
    { type: "heading", text: "1. Free Trial First" },
    {
      type: "paragraph",
      text: "Every paid course offers a free introductory class before you're asked to pay. We encourage you to use it — it's the best way to know whether a course's teaching style and pace are right for you before any money changes hands.",
    },
    { type: "heading", text: "2. Standard Refund Window" },
    {
      type: "callout",
      text: "You may request a full refund within 7 days of payment, provided you have attended no more than 2 live classes and completed no more than 20% of the recorded lessons in that course.",
    },
    {
      type: "paragraph",
      text: "This window exists for genuine cases where a course turns out not to be the right fit. It is not intended to allow completing a course and then requesting a refund — the attendance and completion limits above exist to keep the window fair to both students and teachers.",
    },
    { type: "heading", text: "3. How to Request a Refund" },
    {
      type: "list",
      items: [
        "Go to Dashboard → Assignments/Payments, or contact us directly at hidayetenglishacademy@gmail.com with your order details.",
        "Tell us the course name and the reason for the request — this helps us improve, and isn't used to deny genuine requests.",
        "Our admin team reviews the request against the eligibility criteria above and against your real attendance/completion data (which we can see, not just what you report).",
        "Approved refunds are processed back to your original Razorpay or Stripe payment method.",
      ],
    },
    { type: "heading", text: "4. Processing Time" },
    {
      type: "paragraph",
      text: "Once approved, refunds are issued immediately on our side through the original payment gateway. From there, it typically takes 5-10 business days for Razorpay refunds and 5-10 business days for Stripe refunds to appear on your statement, depending on your bank or card issuer — this final step is outside our control.",
    },
    { type: "heading", text: "5. Non-Refundable Situations" },
    {
      type: "list",
      items: [
        "Requests made after the 7-day window, or after exceeding the attendance/completion limits above.",
        "Courses explicitly marked as non-refundable at checkout (rare, and always disclosed before payment).",
        "Coupons, discounts, or scholarship-subsidized amounts are not separately refundable beyond the amount actually paid.",
        "Account suspension for violating our Terms, Code of Conduct, or Acceptable Use Policy does not entitle you to a refund.",
      ],
    },
    { type: "heading", text: "6. Cancelling an Enrollment (No Refund Requested)" },
    {
      type: "paragraph",
      text: "You can stop attending a course at any time without formally cancelling — your access simply remains available for the duration you paid for. If you'd like your enrollment status updated for record-keeping, contact us and we'll note it, without affecting any refund eligibility already determined above.",
    },
    { type: "heading", text: "7. Live Class Cancellations by HEA" },
    {
      type: "paragraph",
      text: "If we cancel a scheduled live class (teacher illness, technical failure, etc.), we will reschedule it and notify you in-app and by email. A rescheduled class is not grounds for a refund; a pattern of cancelled classes that meaningfully reduces the value of your course is something our admin team will review case by case and address fairly.",
    },
    { type: "heading", text: "8. Certificates & Refunds" },
    {
      type: "paragraph",
      text: "Once a course-completion certificate has been issued to you, the enrollment is considered fulfilled and is no longer eligible for a refund, regardless of the 7-day window.",
    },
    { type: "heading", text: "9. Disputes & Chargebacks" },
    {
      type: "paragraph",
      text: "If you believe a charge was made in error, please contact us directly first — most issues are resolved faster this way than through a bank chargeback, and a direct request lets us investigate using our own transaction records. We participate in good faith with any formal dispute process your bank or card issuer requires.",
    },
    { type: "heading", text: "10. Scholarship Program" },
    {
      type: "paragraph",
      text: "Our scholarship-funded programs (including the Madhyamik free program) involve no payment and so this Refund Policy does not apply to them; see our separate Scholarship Policy for how that program works.",
    },
    { type: "heading", text: "11. Contact" },
    {
      type: "paragraph",
      text: "For any refund or cancellation question, reach us at hidayetenglishacademy@gmail.com or through WhatsApp — we aim to respond to refund requests within 2 business days.",
    },
    { type: "heading", text: "12. Partial Refunds" },
    {
      type: "paragraph",
      text: "In situations that don't cleanly fit the standard window — for example, a genuine technical failure on our side that prevented meaningful access to a course — our admin team may, at its discretion, offer a partial refund reflecting the portion of the course genuinely unusable, rather than an all-or-nothing decision.",
    },
    { type: "heading", text: "13. Currency of Refund" },
    {
      type: "paragraph",
      text: "Refunds are issued in the same currency and through the same payment method used for the original transaction — we don't convert a refund into a different currency or issue it via an alternative method.",
    },
  ],
};
