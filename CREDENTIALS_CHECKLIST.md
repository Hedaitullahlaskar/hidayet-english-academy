# Credentials Checklist — What's Left Before This Goes Fully Live

Every integration in this codebase is real code, not a mock — each one just
degrades honestly (an "not configured" state, never a fake success or a
crash) when its credentials are missing. This is the complete list of what
to add, grouped by what breaks without it. `.env.example` has the same
variables with inline setup notes; this file is the prioritized, "what do
I actually need to do" version.

Copy `.env.example` to `.env.local` for local testing. In production
(Vercel), set each variable under Project → Settings → Environment
Variables instead — `.env.local` is never deployed.

---

## 1. Core — nothing works without these

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (keep server-side only, never expose to the browser) |
| `NEXT_PUBLIC_SITE_URL` | Your real deployed domain, e.g. `https://www.hidayetenglishacademy.com` |

**Without these:** login/register fail outright, and every dashboard page
shows its honest empty state instead of real data (see
`lib/dashboard/repository.ts`'s `safeQuery` pattern).

**Also required — not an environment variable:** run `supabase/schema.sql`
against your Supabase project (SQL Editor → paste → run). It's idempotent
(`create table if not exists` / `add column if not exists`), so re-running
it after a schema update — like the `reminder_sent_at` column added in this
pass — is always safe.

**Also required — Supabase Dashboard setting, not a variable:** if you want
**Mobile OTP login** to work (`components/auth/OtpLoginForm.tsx`, "phone"
mode), enable and configure an SMS provider under Supabase Dashboard →
Authentication → Providers → Phone. Supabase supports Twilio, MessageBird,
Vonage, and a few others there — this project doesn't need its own SMS
integration because Supabase Auth already handles OTP delivery once you
pick one. Email OTP needs no extra setup beyond Supabase's built-in email
sending (or your own SMTP override, same screen).

---

## 2. Payments — Razorpay (India) + Stripe (international)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys (same value as `RAZORPAY_KEY_ID`, see note below) |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Settings → Webhooks (create one pointing at `/api/payments/webhook/razorpay`) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks (create one pointing at `/api/payments/webhook/stripe`) |

`NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID` must be set to the
**identical** value — Next.js treats the `NEXT_PUBLIC_`-prefixed and
plain names as entirely separate variables even though they hold the same
key; the client-side widget reads one, order creation
(`lib/payments/providers/razorpay.ts`) reads the other.

**Without these:** `/api/payments/checkout` returns `503 not_configured`
per-currency (INR needs Razorpay, everything else needs Stripe) — checkout
fails cleanly with a real error message, not a silent charge attempt.

**Verify once configured:** place a real test-mode order end to end
(Razorpay and Stripe both have test-mode keys and test card numbers), then
confirm the corresponding webhook fires and `orders.status` flips to
`paid` (`lib/payments/repository.ts`'s `confirmOrderPaid`).

---

## 3. Transactional Email — Resend

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `EMAIL_FROM_ADDRESS` | Any address on a domain you've verified in Resend, e.g. `Hidayet English Academy <noreply@hidayetenglishacademy.com>` |

**Without these:** enrollment confirmations, payment receipts, certificate
notifications, and (new in this pass) class-starting-soon reminders are
all skipped and logged server-side — the event they're attached to (a
payment, a certificate, a class) still completes correctly either way.

---

## 4. AI Study Assistant — Anthropic

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

**Without this:** `/dashboard/ai-assistant` shows a real "not configured"
state instead of a broken chat window.

---

## 5. Live Classes — Google Meet + Zoom auto-generation

| Variable | Where to get it |
|---|---|
| `GOOGLE_CLIENT_ID` | Google Cloud Console → APIs & Services → Credentials (OAuth client) |
| `GOOGLE_CLIENT_SECRET` | Same OAuth client |
| `GOOGLE_REFRESH_TOKEN` | Obtained once via a standard OAuth consent flow for the Google account that should own the calendar events (the academy's own account — not a per-teacher token) |
| `ZOOM_ACCOUNT_ID` | Zoom App Marketplace → your Server-to-Server OAuth app |
| `ZOOM_CLIENT_ID` | Same Zoom app |
| `ZOOM_CLIENT_SECRET` | Same Zoom app |

**Without these:** a teacher scheduling a class (`CreateLiveClassForm`)
still works — they just type the meeting link in manually instead of it
being auto-generated. See `lib/liveclass/router.ts`'s `tryAutoGenerateLink`
— a missing key or a transient API failure never blocks scheduling.

**Note:** a Google Meet link is created as a side effect of a Calendar API
event (`conferenceData.createRequest`) — there's no separate "Meet API" to
enable, just the Calendar API on the Google Cloud project.

---

## 6. Class Reminders — email (works with #3 alone) + WhatsApp (needs Meta approval too)

| Variable | Where to get it |
|---|---|
| `CRON_SECRET` | Generate yourself: `openssl rand -hex 32` (or any long random string) |
| `WHATSAPP_BUSINESS_TOKEN` | Meta Business Manager → WhatsApp → API Setup |
| `WHATSAPP_PHONE_NUMBER_ID` | Same screen |
| `WHATSAPP_TEMPLATE_NAME` | Only needed if your approved template isn't literally named `class_reminder` |

**New in this pass:** `/api/cron/reminders` is a real, wired endpoint —
Vercel Cron calls it (see `vercel.json`) roughly every 10 minutes, it finds
classes starting within 30 minutes that haven't been reminded yet, and
sends each enrolled student an email (via #3) and a WhatsApp message (if
phone + WhatsApp are configured).

**Two things to know:**
- **Vercel plan limit:** Vercel Cron on the **Hobby plan only supports
  once-a-day schedules**. `vercel.json`'s `*/10 * * * *` (every 10 minutes)
  requires a **Pro plan**. On Hobby, either upgrade or change the schedule
  to something like `0 * * * *` and accept coarser reminder timing (the
  30-minute lookahead window in `lib/liveclass/reminders.ts` would need
  widening to match, or some classes could get no reminder at all if the
  cron only fires once a day).
- **WhatsApp needs more than credentials:** even with both WhatsApp
  variables set, real delivery additionally requires your WhatsApp
  Business Account to be verified in Meta Business Manager, and a message
  template (default name `class_reminder`; body: student name, class
  title, join link, in that order) submitted and approved there — a
  business-review process measured in days, not something the API keys
  alone unlock. Until approved, `sendClassReminder()` in
  `lib/whatsapp/reminders.ts` returns the real Meta API error as `reason`,
  which the cron route treats as non-fatal — email reminders still go out.

---

## 7. One-time database seeding — optional, dev/staging only

| Variable | Purpose |
|---|---|
| `SEED_ADMIN_SECRET` | Bearer secret required to call `/api/admin/seed` (fails closed — the route is inert if this is unset) |
| `SAMPLE_ADMIN_EMAIL` / `SAMPLE_ADMIN_PASSWORD` | Override the default seeded admin login (`admin@hidayetenglishacademy.com` / `AdminPass123!`) |
| `SAMPLE_TEACHER_EMAIL` / `SAMPLE_TEACHER_PASSWORD` | Override the default seeded teacher login |

**Recommendation:** only set `SEED_ADMIN_SECRET` temporarily to create your
first real admin account, then remove it (or rotate it) from your
production environment — there's no reason for this endpoint to stay
reachable indefinitely, and its default fallback passwords are meant for a
one-time bootstrap, not long-term use. Change the seeded admin's password
immediately after first login either way.

---

## Suggested order

1. **Core** (Supabase + site URL) — everything else is inert without this.
2. **Payments** — revenue-critical; test in Razorpay/Stripe test mode
   before flipping to live keys.
3. **Email** — cheap to set up (one API key), unblocks receipts,
   certificates, and reminders all at once.
4. **AI Assistant** — isolated, low-risk to add any time.
5. **Live Classes (Google/Zoom)** — nice-to-have automation; manual link
   entry already works without it.
6. **WhatsApp reminders** — start the Meta Business verification /
   template approval process early, since it's the slowest step (days),
   independent of when you add the two API keys.
7. **Seed secret** — set briefly, use once, remove.
