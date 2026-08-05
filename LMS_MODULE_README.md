# Module 5 — Student LMS: Technical Documentation

## The honesty boundary this module sits on

Every previous module (Courses, Method, About) could be genuinely
production-ready with zero backend, because none of it was per-user. A
student dashboard fundamentally cannot work that way — "your progress,"
"your streak," "your certificates" requires a real signed-in user and a
real database. **Neither exists yet.** This document is explicit about
what that means for what's actually running today.

## What's real, working code right now

- **Auth**: `/register` and `/login` call the real Supabase Auth SDK
  (`supabase.auth.signUp`, `signInWithPassword`). The moment real
  credentials are added to `.env.local` (see `.env.example`), these forms
  work exactly as written — nothing about them is a mock.
- **Route protection**: `middleware.ts` checks for a real Supabase session
  on every `/dashboard/*` request and redirects to `/login` if there isn't
  one. Today, since there's no Supabase project, `supabase.auth.getUser()`
  will simply never return a user — meaning **the dashboard is currently
  unreachable by anyone**, which is the correct, safe state for a
  protected area with no backend, not a bug.
- **Every dashboard page** reads through `lib/dashboard/repository.ts`,
  which makes real Supabase queries. Each is wrapped in `safeQuery()`,
  which catches the (currently guaranteed) failure and returns an empty
  result — that's why every page you can inspect in the code shows an
  honest "nothing here yet" empty state rather than fabricated data.

## The database schema

`supabase/schema.sql` is a complete, ready-to-run schema — 17 tables,
foreign keys, and Row-Level Security policies for every one of them. To
activate the real backend:

1. Create a Supabase project.
2. Run `supabase/schema.sql` against it (SQL Editor, or the CLI).
3. Copy `.env.example` to `.env.local` and fill in the three values from
   your project's API settings.
4. Run `npx supabase gen types typescript --project-id <id> > types/database.ts`
   and wire that into the `createClient`/`createServerSupabaseClient` calls
   as the generic type — this is the one deliberate gap in this module:
   without a live project to generate against, Supabase query results are
   currently typed `any` rather than fully type-safe. Everything still
   compiles and runs correctly; it just isn't as strict as it will be
   once real types exist.

## "Admin-ready" — what that means today

Per the brief: *"Future Admin Dashboard must be able to add students,
assign courses, upload lessons, track progress, issue certificates
without changing code."* That's exactly what the repository pattern and
RLS-protected schema deliver — Module 12 (Admin Dashboard) will be a UI
that inserts/updates rows in these same tables, through the same
`is_staff()` policies already written into `schema.sql`. No table, page,
or component in this module needs to change when that UI is built.

## Consolidation: 20 requested features → 12 routes

Rather than 20 separate shallow pages, related features share one page
where that's the more honest, usable design (matching the same
consolidation approach used in Module 3's Method page):

| Route | Covers |
|---|---|
| `/dashboard` | Overview — all 10 required widgets |
| `/dashboard/courses` + `/dashboard/courses/[slug]/learn` | My Courses, Progress Tracker, Lesson Player, Live Class join |
| `/dashboard/assignments` | Homework & Assignments |
| `/dashboard/practice` | Practice Exercises |
| `/dashboard/tests` | Weekly Tests + Mock Exams (tabbed by type) |
| `/dashboard/ai-assistant` | AI Study Assistant (honestly Coming Soon) |
| `/dashboard/notebook` | Notes, Bookmarks, Vocabulary Notebook |
| `/dashboard/attendance` | Attendance + Daily Streak |
| `/dashboard/certificates` | Certificates |
| `/dashboard/reports` | Progress Reports (honestly, mostly Coming Soon) |
| `/dashboard/announcements` | Announcements |
| `/dashboard/settings` | Student Profile & Settings |

Notifications are a header bell dropdown (real, interactive), not a
separate page — the more standard pattern for this kind of alert.

## Security notes (Gate 6)

- `SUPABASE_SERVICE_ROLE_KEY` is declared in `.env.example` but referenced
  in **zero** application files — verified by a full-codebase grep before
  shipping this module. It's reserved for Module 12's admin operations,
  which must run server-only and never reach the browser bundle.
- Every table in `schema.sql` has RLS enabled with a student-can-only-
  access-their-own-rows policy, plus a separate staff-read/write policy
  gated through `is_staff()` — never a blanket "authenticated users can do
  anything" policy.
- The certificate verification policy is intentionally permissive at the
  RLS level (`using (true)`) but is safe because the application layer
  only ever queries by an exact, unguessable verification code — never
  lists all certificates — matching how public certificate verification
  is meant to work (see the Implementation Roadmap's Module 14).

## What was NOT built, on purpose

- No fake student data anywhere in the Next.js codebase itself — every
  page's populated state is only ever demonstrated in the separate,
  clearly-labeled HTML preview, never in code that could ship to
  production and show a real student someone else's information.
- No real video/PDF/audio hosting integration — the Lesson Player's
  content area is a real, working tabbed UI with an honest empty state,
  since no content has been authored yet (that's Module 11, the Teacher
  Dashboard's job).
- No AI Study Assistant implementation — matches its explicit "(Coming
  Soon)" labeling in the brief and its treatment on the Method page.
