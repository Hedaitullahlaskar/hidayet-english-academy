# Deployment Guide — Hidayet English Academy Platform

This is the single, authoritative deployment reference. Thirteen other
`*_MODULE_README.md` files document *why* each part was built the way it
was; this document is about *getting it running*.

## 1. What you need before you start

- A Supabase account (free tier is enough to launch)
- A Vercel account
- A domain name (optional at first — Vercel provides a free subdomain)
- Accounts with whichever of these you intend to enable at launch (all
  optional individually — the app degrades honestly, not silently, when
  one is missing): Anthropic, Razorpay, Stripe, Resend, Google Cloud
  (Meet), Zoom

## 2. Supabase setup

1. Create a new Supabase project.
2. Open the SQL Editor and run the entire contents of `supabase/schema.sql`
   in one pass. This creates all 40 tables, every RLS policy, the
   `handle_new_user()` trigger, and all three Storage buckets.
3. Go to **Authentication → Providers**: enable Email and Google.
4. Go to **Authentication → URL Configuration**: set the **Site URL** and
   **Redirect URLs** to your real deployed domain — not `localhost`. If
   you don't have a domain yet, use your Vercel-provided URL and update
   this later.
5. Go to **Authentication → Email Templates → SMTP Settings**: replace
   Supabase's default sender with a real SMTP provider (Resend works
   well here too) before launch. Supabase's built-in email is rate-limited
   for development, not real signup volume.
6. Copy your **Project URL**, **anon public key**, and **service_role
   key** (Settings → API) — you'll need all three for step 4 below.

## 3. Google Cloud setup (only if enabling Google login or Google Meet)

- **Google login**: create an OAuth 2.0 Client ID in Google Cloud
  Console, add your Supabase project's callback URL as an authorized
  redirect URI, and paste the client ID/secret into Supabase's Google
  provider settings (not into this app's own environment variables).
- **Google Meet auto-generation**: separately, create OAuth credentials
  for *this app* (not Supabase), authorize the Calendar API scope, and
  complete the OAuth consent flow once to obtain a refresh token for
  whichever Google account should own generated Meet events. This is a
  one-time manual step — there's no UI for it in the app itself.

## 4. Environment variables

Copy `.env.example` to `.env.local` for local development, or enter each
one directly into Vercel's dashboard for production. Every variable is
documented in `.env.example` itself with what it powers and whether it's
safe to expose to the browser — read the comments there, not just the
names. In summary, by category:

| Category | Required to launch at all? |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **Yes** — nothing works without these |
| `NEXT_PUBLIC_SITE_URL` | **Yes** — used for checkout redirects, email links, calendar files |
| `ANTHROPIC_API_KEY` | No — AI Assistant shows "not connected" without it |
| `RAZORPAY_*` / `STRIPE_*` | No — checkout shows "not configured" per currency without them |
| `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` | No — transactional emails are skipped and logged, not sent |
| `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN`, `ZOOM_*` | No — live classes fall back to manually-typed meeting links |
| `WHATSAPP_BUSINESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | No — reminder architecture only, not a working send path regardless |

## 5. Deploy to Vercel

1. Push this codebase to a GitHub repository.
2. In Vercel, import the repository.
3. Add every environment variable from step 4.
4. Deploy.
5. Point your custom domain at the Vercel project (Vercel → Domains).
6. Go back to Supabase's Auth URL Configuration and update the Site
   URL/Redirect URLs to your final domain if you were using a
   placeholder earlier.

## 6. Payment gateway webhooks (configured in each gateway's own dashboard)

- **Razorpay**: add a webhook pointing to
  `https://yourdomain.com/api/payments/webhook/razorpay`, subscribed to
  `payment.captured` and `payment.failed`.
- **Stripe**: add a webhook pointing to
  `https://yourdomain.com/api/payments/webhook/stripe`, subscribed to
  `checkout.session.completed`.

Neither of these can be done from within this codebase — they're
dashboard configuration on the gateway's own side.

## 7. The first admin account

There is deliberately no way to create the first admin through the UI —
every promotion after the first requires an existing admin. Register a
real account on your live site, then run once in the Supabase SQL Editor:

```sql
update profiles set role = 'admin' where email = 'you@example.com';
```

## 8. Setting real course prices

Checkout won't work for a course until a price exists for it. Log in as
the admin you just created, go to **Payments → Course Pricing**, and set
a price per course per currency.

## 9. Backup & restore

- **Automatic backups**: Supabase's paid tiers include automated daily
  backups with point-in-time recovery; the free tier does not. If you
  launch on the free tier, budget for an upgrade before you have real
  paying students' data you can't afford to lose.
- **Manual backup**: `pg_dump` against your Supabase connection string
  (available in Settings → Database) gives you a portable SQL dump you
  can store independently of Supabase.
- **Restore**: a `pg_dump` output restores via `psql` against a fresh
  Supabase project's connection string, or through the SQL Editor for
  smaller dumps. Always restore into a *new* project first and verify
  before pointing production traffic at it.
- **Storage backup**: the three Storage buckets (`avatars`,
  `lesson-content`, `submissions`) aren't covered by a database dump —
  back them up separately if their contents matter to you (lesson videos
  in particular represent real teacher work).

## 10. Ongoing maintenance

- **Dependency updates**: run `npm outdated` periodically; prioritize
  security patches to `@supabase/supabase-js`, `stripe`, and `razorpay`
  specifically, since those touch money and auth.
- **Monitoring what actually matters**: watch the `audit_logs` table for
  unexpected admin actions, and the `rate_limit_events` table for signs
  of abuse against OTP/password-reset/AI-chat endpoints.
- **Rotating secrets**: if any API key is ever exposed, rotate it at the
  provider (Supabase, Anthropic, Razorpay, Stripe, Google, Zoom, Resend)
  and update the Vercel environment variable — no code change needed,
  since every credential is read from environment variables, never
  hardcoded.
- **Scaling**: this architecture (Next.js on Vercel + Supabase via
  PostgREST) scales without code changes up to real, meaningful traffic —
  see the architecture audit's scalability notes. The first thing to
  watch as usage grows is Supabase's connection/request limits on
  whichever pricing tier you're on, not application code.
