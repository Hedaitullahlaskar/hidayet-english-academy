# Payments — Real Razorpay + Stripe Integration: README

## What changed from "prepared architecture" to "real integration"

Since Module 4, `lib/payments/types.ts` defined a `PaymentProvider`
interface with zero implementations — a contract, deliberately not a
checkout. This pass fills it in for real:

- `lib/payments/providers/razorpay.ts` — genuine Razorpay Orders API calls
- `lib/payments/providers/stripe.ts` — genuine Stripe Checkout Sessions
- `lib/payments/router.ts` — real routing (INR → Razorpay, everything else → Stripe)
- Full checkout flow, webhook handlers, and admin course pricing

Both provider files are inert without real API keys — same honest pattern
as every other integration in this app — but the code itself makes real
API calls, not mocked responses.

## The security model, precisely, because this one moves real money

**A price is never trusted from the client.** `course_prices` is the only
source of truth for what something costs. `/api/payments/checkout`
computes the amount server-side by looking it up there; nothing in the
request body is ever used as a charge amount. This is the single most
important line of defense in the whole flow.

**Webhooks verify signatures against the raw, unparsed request body.**
Both `app/api/payments/webhook/razorpay/route.ts` and
`.../stripe/route.ts` call `request.text()`, not `request.json()` —
parsing and re-serializing JSON can change whitespace and key order,
which would silently break byte-for-byte signature verification. This is
a real, specific bug class in payment integrations, and it's the reason
this detail gets its own comment in both files, not just in this doc.

**A client-side "payment succeeded" callback never grants enrollment.**
`RazorpayWidget.tsx`'s success handler only moves the UI to a "processing"
state and redirects to `/checkout/success`. The *only* place enrollment
actually gets granted is `confirmOrderPaid()` in
`lib/payments/repository.ts`, called exclusively from the two verified
webhook handlers. A client-side JS callback can be faked by anyone with
browser dev tools open; a signature-verified server-to-server webhook can't.

**Orders can be created by the student who owns them, but never updated
by them.** The RLS policy on `orders` lets a student insert their own
`pending` row (the price in it was already computed server-side by the
route handler, not by them) but has no student-facing update policy at
all. Only `is_staff()` or the service-role webhook client can transition
an order to `paid` — a student's browser session literally cannot
self-approve its own payment, even if it tried.

**Refund approval now genuinely calls the gateway.** Module 7's refund
queue previously only changed a status label. `updateRefundStatus()` now
calls `provider.refund()` against the real order's `gateway_payment_id`
when approving, and if the gateway declines it, the status doesn't change
either — the admin UI can no longer say "approved" while nothing actually
happened at Razorpay or Stripe.

**Webhook idempotency is real, not assumed.** Gateways retry webhook
delivery until they get a 200 response — that's normal, expected
behavior, not an attack. `confirmOrderPaid()` checks if the order is
already `paid` before doing anything, so a retried webhook is a safe
no-op, not a double-granted enrollment.

## What's genuinely new vs. what's a labeling fix

- **New, real**: checkout API route, both webhook handlers, both provider
  implementations, the `course_prices`/`orders` tables, the checkout UI
  (`/checkout/[courseSlug]`, the Razorpay widget page, success/cancelled
  pages), admin course pricing management, and real refund execution.
- **Labeling fix, not new code**: the admin Payments page previously said
  "Actual charge processing is Module 16 — not live yet" for every
  gateway, including ones that are now real. It now distinguishes
  **Razorpay/Stripe ("built")** from **PayPal/Wise ("not built yet")** —
  which was always the honest state, just not yet reflected in the UI
  after this pass.

## The one deliberate gap: no entry point on the public course pages yet

`/checkout/[courseSlug]` is fully functional and reachable by direct URL,
but the public course detail pages (Module 4, approved and frozen) still
route their "Enroll Now" button to WhatsApp. This wasn't an oversight —
it's the same pattern as every previous module's flagged integration
point (Doubts in Module 6, Scholarship applications and CMS content in
Module 7): I don't silently rewire an already-approved page's behavior.
Wiring the real "Buy Now" button into those pages is a small, clearly
scoped follow-up, not done here without your sign-off.

## Schema additions

- `course_prices` — the trusted pricing table, minor units, one row per
  course+currency, staff-writable, publicly readable (so a checkout page
  can display "₹2,999" without needing to be authenticated first)
- `orders` — the real transaction record, RLS as described above
- `refund_requests.order_id` — links a refund request to the real order
  it's refunding, so approval has something real to act on

## Environment variables this module needs

| Variable | Exposed to browser? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes — by design | Initializes the Razorpay Checkout widget. Razorpay's own convention: this key is meant to be public, same as Stripe's `pk_` publishable key. |
| `RAZORPAY_KEY_SECRET` | Never | Server-only, creates orders and processes refunds |
| `RAZORPAY_WEBHOOK_SECRET` | Never | Server-only, verifies webhook signatures |
| `STRIPE_SECRET_KEY` | Never | Server-only, all Stripe API calls |
| `STRIPE_WEBHOOK_SECRET` | Never | Server-only, verifies webhook signatures |
| `NEXT_PUBLIC_SITE_URL` | Yes | Builds Stripe's success/cancel redirect URLs |

## What you'd configure in each gateway's dashboard, separately from this code

- **Razorpay**: create the webhook pointing to
  `https://yourdomain.com/api/payments/webhook/razorpay`, subscribed to
  `payment.captured` and `payment.failed`.
- **Stripe**: create the webhook pointing to
  `https://yourdomain.com/api/payments/webhook/stripe`, subscribed to
  `checkout.session.completed` (and failure events if you want them
  reflected as `failed` rather than staying `pending`).

Neither of these is something code can do for you — they're dashboard
configuration steps, same category as the Supabase Auth settings covered
in the architecture audit.
