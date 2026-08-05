# Module 8 — Authentication & User Management: README

## What already existed vs. what's new here

Modules 5, 6, and 7 already built working Student registration/login,
Teacher login, Admin login, RBAC (`is_staff()`/`is_admin()`), and RLS on
every table. This module didn't rebuild any of that — it's the completion
pass: password reset, OTP, Google OAuth, teacher self-registration with
approval, change password, login history, device management, account
deletion, and a real account-suspension flag. Where a genuinely new
capability needed to live inside an existing login/register form (OTP and
Google are exactly that — new *methods* on an existing form, not new
pages), those forms were extended, not rebuilt from scratch.

## The real bug this module's security review caught

`createClient()` (the browser Supabase client) had no way to control
session persistence — "Remember me" was drafted first as a checkbox that
called `supabase.auth.updateUser({})` after sign-in, which is a **no-op**
that does nothing to cookie lifetime. Caught during self-review before
shipping: `lib/supabase/client.ts` now accepts a `persistent` parameter
that sets a 30-day cookie vs. a true session-only cookie, decided *before*
sign-in (the only point at which Supabase actually allows it), not
pretended to be adjustable after the fact.

## Security, item by item (Requirements checklist)

- **Supabase Auth**: every login/register/OTP/OAuth flow uses the real SDK
  — `signInWithPassword`, `signInWithOtp`, `verifyOtp`, `signInWithOAuth`,
  `resetPasswordForEmail`, `updateUser`.
- **PostgreSQL RLS**: all 6 new tables (`teacher_applications`,
  `login_history`, `user_sessions`, `account_deletion_requests`,
  `rate_limit_events`, plus `is_suspended` on `profiles`) have RLS enabled
  with real policies, not just `enable row level security` and nothing else.
- **JWT**: unchanged from Supabase's default — every request's identity
  comes from a verified JWT, never a client-asserted user ID.
- **Rate limiting**: real, DB-backed (`lib/auth/rateLimit.ts`), applied to
  OTP requests and password reset requests — the two endpoints most worth
  protecting from abuse (SMS/email bombing, account enumeration probing).
  No Redis in this stack; `rate_limit_events` is the honest substitute,
  locked to service-role-only access so it can't be tampered with client-side.
- **CSRF protection**: cookie-based Supabase SSR auth with `SameSite`
  cookies is inherently CSRF-resistant; Route Handlers additionally verify
  the caller's identity and role independently rather than trusting any
  client-supplied flag (see `app/api/admin/delete-user/route.ts`).
- **XSS protection**: React escapes all rendered content by default; the
  only `dangerouslySetInnerHTML` usage anywhere in the codebase is
  static JSON-LD (`JSON.stringify` of server-known data, never raw user
  input) — verified by grep before shipping.
- **Secure cookies**: handled by `@supabase/ssr`'s cookie adapter, used
  consistently since Module 5.
- **Input validation**: every new form validates client-side before
  submission (length checks, format checks, confirmation matching);
  server-side, Postgres `check` constraints on every new table's enum-like
  columns (`role`, `status`, `question_type`, etc.) are the actual backstop.

## The service-role key: first real use, carefully isolated

`SUPABASE_SERVICE_ROLE_KEY` has been declared in `.env.example` since
Module 5 but never referenced in application code — verified by grep at
the end of every module since. This module is the first legitimate need
for it (deleting an `auth.users` row isn't possible any other way), so:

- `lib/supabase/admin.ts` imports the `server-only` package, which makes
  Next.js **throw a build error** if this file is ever imported from a
  Client Component — an enforced guardrail, not a comment promising
  discipline.
- It's used in exactly two places: `app/api/admin/delete-user/route.ts`
  (account deletion) and `lib/auth/rateLimit.ts` (writing to the
  service-role-only `rate_limit_events` table) — verified by grep.
- The deletion route independently re-checks the caller is an
  authenticated admin *before* touching the service-role client — it does
  not trust that the request only arrives from the admin UI.

## Teacher registration: self-service application, not self-service access

`/register/teacher` creates a real Supabase Auth account (role stays
`student` by default, via the `handle_new_user()` trigger) plus a
`teacher_applications` row. The account can log in immediately — as a
student. It only gains `/teach/*` access once an admin approves the
application at `/admin/user-requests`, which flips the role to `teacher`.
Rejected applications leave the person with a normal student account, not
a broken one.

## Account deletion: two-step by design

A user requests deletion from `/account` (self-service, RLS-protected,
immediate). Actually executing it — calling Supabase's Admin API to delete
the `auth.users` row — happens only from `/admin/user-requests`, admin-only.
This isn't bureaucratic friction; it's a real safeguard against an
accidental or coerced deletion request being irreversible before anyone
else sees it.

## One necessary, minimal touch to a "frozen" module

Module 7 (Super Admin Dashboard) was approved and frozen. This module adds
exactly one new sidebar entry (`User Requests`) and one new page to it —
the minimum needed for Teacher Registration's "admin approval required"
requirement to mean anything. No existing Module 7 page, table read, or
design was changed. Flagged here rather than done silently.

## New routes this module adds

| Route | Purpose |
|---|---|
| `/register/teacher` | Teacher self-registration + application |
| `/reset-password`, `/reset-password/confirm` | Password reset flow |
| `/auth/callback` | OAuth + email verification + reset-link handler |
| `/account` | Change password, login history, devices, deletion — any role |
| `/admin/user-requests` | Teacher application + deletion request review |
| `/api/auth/rate-limit-check` | Rate limit check for client components |
| `/api/admin/delete-user` | Admin-only account deletion execution |
