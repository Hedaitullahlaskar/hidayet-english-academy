# Platform Integration — README

This pass didn't add features — it made the eight already-built modules
behave as one application instead of eight independently-correct pieces.

## The real bug this surfaced

The root layout (`app/layout.tsx`) unconditionally wrapped **every**
route — including `/dashboard`, `/teach`, and `/admin` — in the marketing
site's `Header`, `Footer`, `AnnouncementBar`, and `WhatsAppButton`. Each of
those three areas already has its own complete shell (sidebar, its own
header, avatar, logout). Every dashboard page has been rendering two
headers stacked on top of each other since Module 5. This wasn't visible
in any single module's static HTML preview, because each preview was a
standalone file that never exercised the real root layout at all — which
is exactly why "one integrated preview" matters more than another
per-module one.

**Fix:** moved the marketing chrome into a new `app/(marketing)/layout.tsx`
scoped to a route group containing exactly the public pages
(`/`, `/about`, `/method`, `/courses`, `/scholarship`) that should have it.
Route groups don't change URLs — `app/(marketing)/page.tsx` is still `/`.
The root layout is now minimal: fonts, the dark-mode flash-prevention
script, and `{children}`. Dashboard/teach/admin/account/auth routes get
exactly the shell they already had, nothing more.

Two smaller correctness issues came with it, fixed the same way:
- `dynamic = "force-static"` was on the root layout, which would have
  fought with dashboard/account routes' need for per-request `cookies()`-based
  rendering. Moved to the marketing layout, where it's actually correct.
- The homepage FAQ structured data (`FAQPage` JSON-LD) was being duplicated
  onto every page in the app, including pages with no FAQ content — moved
  to the marketing layout where the content it describes actually lives.

## What was already correct

Student/Teacher/Admin login, registration, RBAC, and RLS all already
worked as built in Modules 5–8 — this pass didn't touch that logic except
where explicitly required below.

## What "connect navigation across all pages" actually required

The public `Header` had no login link anywhere — desktop nav, mobile menu,
nowhere. Someone landing on the homepage had no discoverable way to reach
`/login`. Fixed by making `Header` session-aware:

- **Logged out:** shows "Log In" (→ `/login`) alongside the existing "Join
  Free Class" CTA.
- **Logged in:** shows the visitor's avatar, "Dashboard" (routed to the
  correct area for their role), and stays that way if they navigate back
  to the marketing site mid-session — rather than treating a signed-in
  visitor as a stranger.

This uses `supabase.auth.onAuthStateChange`, so it updates immediately on
login/logout without a page reload.

## What "Student → X, Teacher → Y, Admin → Z" actually required

`LoginForm` (the one page linked from the public header) previously
redirected unconditionally to `/dashboard` regardless of who logged in.
Fixed with one shared helper, `dashboardPathFor(role)` in
`lib/auth/permissions.ts`, used consistently by:

- `LoginForm.tsx` (password login)
- `OtpLoginForm.tsx` (OTP login)
- `app/auth/callback/route.ts` (Google OAuth) — with a deliberate nuance:
  a `next` param that's an explicit specific destination (like
  `/reset-password/confirm`) is honored as-is; a generic `/dashboard`
  default gets corrected against the account's real role, since a Google
  login from the general login page could belong to a teacher or admin
  account, not just a student.

`/teach/login` and `/admin/login` still exist as their own, stricter entry
points (no Google/OTP on admin, by design from Module 8) — this didn't
remove them, it made the one *linked-from-navigation* login page correct
for whichever role actually signs in through it.

## The full loop, verified end to end

Homepage → Login → Dashboard (role-based) → Logout → Homepage was already
half-built: every dashboard's logout already correctly redirected to `/`.
The missing half was getting *to* login from the homepage in the first
place, and getting to the *correct* dashboard once there — both fixed above.

## Accessibility carried through the restructuring

The skip-to-content link (`href="#main-content"`) only had a matching
target on marketing pages before this pass — nowhere on dashboard, teach,
admin, or auth pages. Added the matching `id="main-content"` to
`DashboardShell`, `TeacherShell`, `AdminShell`, and `AuthLayout` so
keyboard/screen-reader navigation works consistently across the whole
app, not just the public site.

## Deliverable change

Per this request, the seven separate per-module static preview files are
retired. `hea-integrated-preview.html` replaces them with one file that
demonstrates the actual flow — a single persistent header that reacts to
a simulated login state across Homepage, Login, and all three role-based
dashboards, rather than seven files that had to link to each other by
filename and knew nothing about one another's state.
