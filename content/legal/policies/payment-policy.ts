import type { PolicyDocument } from "@/content/legal/types";

export const paymentPolicy: PolicyDocument = {
  slug: "payment-policy",
  title: "Payment Policy",
  shortDescription: "How billing, pricing, currencies, and payment security work on HEA.",
  category: "Payments",
  lastUpdated: "2026-08-01",
  icon: "💳",
  blocks: [
    {
      type: "paragraph",
      text: "This Payment Policy explains how pricing, billing, and payment processing work across Hidayet English Academy, for students paying from India, Bangladesh, and internationally.",
    },
    { type: "heading", text: "1. Payment Providers" },
    {
      type: "list",
      items: [
        "Razorpay handles all payments in Indian Rupees (INR), including UPI, cards, and net banking.",
        "Stripe handles international payments (USD, GBP, EUR, and other supported currencies), including major cards and digital wallets.",
        "Both providers are PCI-DSS compliant, industry-standard payment processors. Your card or bank details are entered directly into their secure checkout — HEA's own servers never receive or store them.",
      ],
    },
    {
      type: "callout",
      text: "We never see your full card number, CVV, or bank login. Payment happens entirely inside Razorpay's or Stripe's secure checkout.",
    },
    { type: "heading", text: "2. Pricing & Currency" },
    {
      type: "paragraph",
      text: "Course prices are set per currency and shown clearly at checkout before you pay — we do not use live currency conversion at the moment of payment, so the price you see is the exact price you'll be charged, with no surprise conversion markup from us. Prices may include applicable taxes depending on your location; where they don't, this is stated at checkout.",
    },
    { type: "heading", text: "3. What Happens When You Pay" },
    {
      type: "list",
      items: [
        "You choose a course and your preferred currency, which determines whether Razorpay or Stripe handles the transaction.",
        "You're redirected to the payment provider's secure checkout (or, for Razorpay, a secure in-page widget).",
        "Once payment is confirmed — verified through a cryptographically signed webhook, not just a browser redirect — your enrollment activates automatically, usually within seconds.",
        "You receive an email receipt and an in-app enrollment confirmation.",
      ],
    },
    { type: "heading", text: "4. Webhook-Verified Confirmation" },
    {
      type: "paragraph",
      text: "For technically-minded students and parents: we deliberately do not activate an enrollment just because your browser lands on a 'success' page. Enrollment is only ever granted after Razorpay or Stripe sends us a cryptographically signed confirmation directly, server-to-server. This protects both you and us from a payment being falsely reported as successful.",
    },
    { type: "heading", text: "5. Receipts & Invoices" },
    {
      type: "paragraph",
      text: "A payment receipt is emailed automatically the moment your payment is confirmed, and your full payment history is visible in your dashboard. If you need a formatted invoice for reimbursement or tax purposes, contact us and we'll issue one.",
    },
    { type: "heading", text: "6. Coupons & Discounts" },
    {
      type: "paragraph",
      text: "Discount codes, where offered, are applied at checkout before payment and reduce the amount actually charged. Coupons cannot be applied retroactively to a completed payment.",
    },
    { type: "heading", text: "7. Failed Payments" },
    {
      type: "paragraph",
      text: "If a payment fails (insufficient funds, bank decline, etc.), no charge is made and you're free to try again with the same or a different payment method. Repeated failures are usually a bank-side issue — contact your bank first, then us if the problem persists.",
    },
    { type: "heading", text: "8. Auto-Renewal" },
    {
      type: "paragraph",
      text: "HEA course payments are one-time charges for the access period described at checkout — we do not currently auto-renew or auto-charge you for continued access without a fresh, explicit checkout.",
    },
    { type: "heading", text: "9. Refunds" },
    {
      type: "paragraph",
      text: "Refund eligibility, process, and timelines are covered in detail in our separate Refund & Cancellation Policy.",
    },
    { type: "heading", text: "10. Payment Security" },
    {
      type: "paragraph",
      text: "All payment pages are served over HTTPS. Course pricing is always computed and verified on our server before a charge is created — never trusted from anything sent by your browser — which prevents price tampering.",
    },
    { type: "heading", text: "11. Contact" },
    {
      type: "paragraph",
      text: "For billing questions, receipts, or payment issues, contact hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "12. Multiple Currencies, One Fair Approach" },
    {
      type: "paragraph",
      text: "We set explicit prices per currency rather than converting a single base price live at checkout, so an international student never sees a price that shifts with the day's exchange rate or carries an unexpected conversion margin — the number shown is the number charged.",
    },
    { type: "heading", text: "13. Bank & Card Fees" },
    {
      type: "paragraph",
      text: "Depending on your bank or card issuer, an international payment may carry a small foreign-transaction fee charged by your own bank, separate from and outside HEA's control. This is standard for any international online payment and not specific to our Platform.",
    },
    { type: "heading", text: "14. Enrollment Timing" },
    {
      type: "paragraph",
      text: "Because enrollment activates automatically the moment a payment is verified — usually within seconds — you can typically start learning immediately after checkout, without waiting for manual processing on our end.",
    },
    { type: "heading", text: "15. Payment Method Availability" },
    {
      type: "paragraph",
      text: "Available payment methods depend on your selected currency: INR payments through Razorpay support UPI, major debit and credit cards, and net banking; international payments through Stripe support major cards and, depending on your region, popular digital wallets.",
    },
    { type: "heading", text: "16. Split or Installment Payments" },
    {
      type: "paragraph",
      text: "Course payments are currently processed as a single, complete transaction at checkout. If cost is a genuine barrier to enrollment, we encourage you to explore our Scholarship Policy rather than expecting an informal payment plan.",
    },
  ],
};
