# Module 7 — Super Admin Dashboard: README

## The security model, precisely

Three roles, enforced at the database level via Postgres RLS policies —
never just hidden in the UI:

- **`is_staff(uid)`** — true for `teacher` or `admin`. Used everywhere the
  Teacher Dashboard (Module 6) needs access.
- **`is_admin(uid)`** — true for `admin` only. New in this module. A
  teacher's valid, logged-in session is explicitly rejected on every
  `/admin/*` route — both in `middleware.ts` (the real enforcement layer)
  and again in `app/admin/layout.tsx` (defense in depth, same pattern as
  every prior dashboard's layout).

Verified via full-codebase grep before shipping: `SUPABASE_SERVICE_ROLE_KEY`
is referenced in zero application files, and no API key or secret value is
stored or rendered anywhere in `components/admin/IntegrationStatusGrid.tsx`
or `lib/admin/repository.ts` — that page tracks *whether* a service is
configured, never the credential itself.

## A real bug this module's build surfaced

Writing `promoteUserToTeacher()` required looking up a user by email — and
there was no `email` column on `profiles`, and worse, **no trigger that
ever created a `profiles` row on signup in the first place**. Since
Module 5, every `supabase.auth.signUp()` call would have created a row in
`auth.users` and *nothing* in `public.profiles`. Every dashboard page that
fetches "the current user's profile" would have returned `null` forever,
even for a successfully registered, logged-in student.

Fixed in `schema.sql`: an `email` column plus a real Postgres trigger
(`handle_new_user()`, fired `after insert on auth.users`) that creates the
matching profile row automatically. This is the standard Supabase pattern
for keeping the two tables in sync, and it should have existed since
Module 5 — worth knowing it didn't, rather than discovering it silently
during a real launch.

## What's real vs. deliberately not wired together

Three admin sections manage data that a currently-frozen public page
either doesn't write to yet, or doesn't read from yet. Same honest pattern
as Module 6's Doubts gap — flagged directly in each page's UI, not just
here:

| Admin section | Real, working admin side | Not yet connected |
|---|---|---|
| **Course Management** | Full CRUD against a real `admin_courses` table | Public `/courses` pages still read `content/courses-data.ts` (Module 4, frozen) |
| ~~Website CMS~~ | ~~Real testimonials/banners tables, real publish toggles~~ | **Closed** — see below |
| ~~Scholarships~~ | ~~Full review/approve/reject queue against `scholarship_applications`~~ | **Closed** — see SESSION_COMPLETION_README.md |

Website CMS: `Testimonials` (closed in the session-completion pass) and
`AnnouncementBar` (closed in a later pass) both now read their real,
admin-published tables (`testimonials`, `site_banners`) with the same
honest-fallback pattern as everywhere else — an unpublished/empty table
shows a real empty state or a sensible default, never fake data.

**Course Management remains open, deliberately.** `admin_courses` is a
narrow catalog record (slug, name, category, level, price, publish
toggle) — it does not hold the rich content `content/courses-data.ts`
actually has (full descriptions, curriculum, images, comparisons, FAQ).
Making admin-created/edited courses actually appear on `/courses` means
one of:
1. Migrating the full rich content structure into `admin_courses` (or a
   related table) and rebuilding the public course pages to read from it
   — a real content migration, not a one-line data-source swap; or
2. A narrower sync (admin controls publish status/price only, rich
   content stays in the static file) — simpler, but the two sources can
   drift out of sync per course.
Both are genuinely buildable without new credentials, but they're a
product decision (how much of the course catalog should live in the
database vs. stay hand-authored), not a mechanical fix — flagging it
explicitly rather than picking one silently.

## Payments: what "Razorpay, Stripe, PayPal, Wise" actually means today

A status board, not a checkout. Each gateway shows **Configured** or **Not
Set Up** based on an `integration_settings` row — set by confirming an
environment variable exists, never by entering a key into this app. Real
charge processing, refund execution, and invoice generation from real
transactions are Module 16, still unbuilt. Coupons are fully real (they're
just business data, no security concern). Refund *requests* have a real
review queue; refund *execution* against a gateway does not exist because
there is no gateway connected yet.

## Backup & Restore: what's real

Full database backup/restore is a Supabase infrastructure feature (point-
in-time recovery), not something a browser button should pretend to do —
faking a "Restore Now" control would be actively dangerous UX. What's
genuinely built: a real `/api/admin/export` route, admin-only (checked
server-side, not just hidden from nav), that exports any of five tables as
downloadable JSON on demand.

## Consolidation: 20 requested modules → 17 routes

| Route | Covers |
|---|---|
| `/admin/login` | Auth, admin-only |
| `/admin` | Global Dashboard (all 8 requested widgets) |
| `/admin/students` | Student Management |
| `/admin/teachers` | Teacher Management (incl. private salary/performance notes) |
| `/admin/courses` | Course Management |
| `/admin/cms` | Website CMS |
| `/admin/payments` | Payment Management (all 8 sub-items) |
| `/admin/scholarships` | Scholarship Management |
| `/admin/live-classes` | Live Class Management |
| `/admin/certificates` | Certificate Management |
| `/admin/reports` | Reports & Analytics |
| `/admin/notifications` | Notification Center |
| `/admin/audit-logs` | Audit Logs |
| `/admin/roles` | User Roles & Permissions |
| `/admin/system` | Backup & Restore + Security Settings |
| `/admin/integrations` | API Keys + Email + WhatsApp + AI Settings |
| `/admin/settings` | Platform Settings + admin's own profile |

## International support (Requirements checklist)

- **Multi-currency**: reuses Module 4's `lib/currency.ts` (8 currencies)
- **Multi-timezone**: `profiles.timezone`, already used by Module 6's live
  class scheduling
- **Multi-language ready**: Module 5's `LanguageContext` pattern is the
  template; not yet extended into the admin UI itself in this pass
