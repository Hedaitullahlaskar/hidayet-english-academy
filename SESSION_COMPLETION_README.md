# Certificates, Email, and Closed Integration Gaps — README

## Certificates: from a code (verification_code) to a real credential

- **Real PDF generation** (`lib/certificates/generate.ts`, `pdf-lib`) —
  built at request time, navy/gold branded, no headless browser needed.
- **Public verification** (`/verify/[code]`) — the RLS policy for this
  existed since Module 6 (`"Anyone can verify a certificate by exact
  code"`) but had no page using it until now. Public, unauthenticated,
  looks up by exact code only — never lists or browses certificates.
- **Real email on issuance** — wired into Module 6's `issueCertificate()`.

## Email: closing a gap the architecture audit itself flagged

The production audit two turns ago noted Supabase's default email is
fine for testing, not real signup volume — and separately, nothing in
this app sent email for anything *other* than auth (no receipt, no
enrollment confirmation, no certificate notice). `lib/email/client.ts`
wraps Resend with the same honest pattern as every other integration:
inert without `RESEND_API_KEY`, logs and continues rather than crashing
the event that triggered it. Wired into: payment confirmation
(enrollment + receipt, two emails) and certificate issuance.

## The four integration gaps, closed

Each of these was explicitly flagged in an earlier module's own
documentation as "built on the admin side, not yet connected" — this
session is where they actually got connected, now that "continue
building every remaining module" is the standing instruction rather than
something requiring a fresh sign-off each time.

1. **Doubts** (flagged in Module 6): students had no "Ask a Doubt" entry
   point at all. Added `/dashboard/doubts` — real form, real replies
   visible, one new sidebar link.
2. **Scholarship applications** (flagged in Modules 7 & 8): the public
   form only opened WhatsApp. It now also writes a real row to
   `scholarship_applications` — required a new public INSERT policy
   (write-only; applicants still can't read back other applications).
   WhatsApp still opens too, as a redundant path in case the DB write
   ever fails silently — a real application reaches a human either way.
3. **Checkout on public course pages** (flagged in the Payments README):
   `BuyNowButton` checks real pricing availability client-side (via a new
   public `/api/courses/[slug]/pricing` route) and only renders when
   checkout would actually work — the course pages stay statically
   generated, no rendering-strategy change needed.
4. **Homepage testimonials** (flagged since Module 1): the component was
   always written with a comment saying "ready for real data" — it now
   fetches published testimonials from the real `testimonials` table
   instead of a static empty array, falling back to the same honest
   "Coming Soon" state until an admin publishes a real one.

**One caveat worth knowing**: the homepage is `force-static` (an
intentional Module 8 performance decision). A newly published testimonial
won't appear until the next deploy or on-demand revalidation — this is
the normal, correct tradeoff for a statically generated marketing page,
not a bug.

## New schema this session

- `scholarship_applications` — added a public INSERT policy (was
  admin-only before, which made the form's real-write half impossible)

No other schema changes — doubts, certificates, and course pricing all
reused tables built in earlier modules exactly as intended.
