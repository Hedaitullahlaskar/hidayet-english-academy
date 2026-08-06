# Hidayet English Academy — Full Site QA Bug Report

## 🔴 BUG-000 — CRITICAL: Production is missing required Supabase environment variables. Auth, dashboards, and payments are entirely non-functional.
- **Where:** Vercel project environment variables (infrastructure, not app code). Confirmed via `lib/supabase/client.ts` and `.env.example`.
- **What happens:** Registering a new student (`/register`) hangs forever on "Creating Account…" and throws in console:
  `@supabase/ssr: Your project's URL and API key are required to create a Supabase client!`
  The identical error fires on `/login`. Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset in the deployed build.
- **Impact:** This is the root cause behind essentially every downstream flow: registration, login (student/teacher/admin), all `/dashboard`, `/teach`, `/admin` pages, checkout, and any Supabase-backed API route. The app's own code (see `lib/supabase/client.ts` comment and `DEPLOYMENT_GUIDE.md`) confirms this is a known, documented pre-launch step that was never completed — not a code bug. Per `DEPLOYMENT_GUIDE.md`, the full setup requires: creating a Supabase project, running `supabase/schema.sql`, configuring Auth providers/URLs, adding ~4 required env vars (+ optional ones for payments/email/AI) to Vercel, redeploying, then promoting the first admin via SQL and setting course pricing.
- **Why I can't fix this myself:** This requires real secret credentials (Supabase project URL/keys, and optionally Stripe/Razorpay/Resend/Anthropic/Google/Zoom keys). I don't have and won't handle these — entering API keys/secrets anywhere is outside what I can do for you, even with permission. This needs to be done by you directly in the Supabase and Vercel dashboards.
- **Status:** ⏳ Blocking — see recommended next steps at the end of this report.



Site tested: https://www.hidayetenglishacademy.com
Date: 2026-08-06
Method: Live browser testing (Chrome/DevTools) of production site + source code review of connected local repo.

Status legend: 🔴 Critical  🟠 High  🟡 Medium  🟢 Low/Cosmetic
Fix legend: ✅ Fixed  ⏳ Pending  ➖ Not a bug / by design (noted)

---

## 2. Security — Found via Code Review

### BUG-004 🔴 CRITICAL: Test/quiz correct answers were shipped to the browser, and scores were graded client-side
- **Where:** `lib/assessments/repository.ts` (`getTestForTaking`, `submitTestAttempt`), `lib/lessons/repository.ts` (`getLessonQuiz`, `submitLessonQuizAttempt`), `components/assessments/TestTakingInterface.tsx`, `components/lessons/LessonQuiz.tsx`, `app/dashboard/tests/[testId]/take/page.tsx`, `app/dashboard/courses/[slug]/learn/[lessonId]/page.tsx`.
- **What happened:** Every question's `correct_answer` was fetched and passed straight into the client component as a prop for both standalone tests and lesson quizzes — visible in page source/React state to any student before or during the test. On top of that, the score was computed in the browser and sent to the server as a plain number, which the server trusted and wrote directly to `test_attempts.score` with no verification.
- **Impact:** Any student could see every correct answer just by opening dev tools, or simply submit a perfect score for any test/quiz without answering anything. This defeats the entire assessment/certification system.
- **Fix:** Grading now happens entirely server-side. The client sends only the student's raw answers; `submitTestAttempt` / `submitLessonQuizAttempt` re-fetch the real answer key from the database and compute the score themselves. `correct_answer` is now stripped out of question data before it's ever passed to a client component (both the take-test page and the lesson page).
- **Status:** ✅ Fixed

### BUG-005 🔴 CRITICAL: A student could promote themselves to admin (or un-suspend themselves) via direct RLS
- **Where:** `supabase/schema.sql` — the `"Users can update their own profile"` policy on `profiles`.
- **What happened:** That policy only checks `auth.uid() = id`, with no restriction on which columns can change. Since `role` and (later) `is_suspended` are just ordinary columns on the same row, any authenticated user could call `supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id)` directly from the browser console using nothing but the public anon key, and RLS would allow it — a full account takeover with no application code involved at all. The same gap let a suspended account un-suspend itself.
- **Impact:** Complete privilege escalation to admin for any registered user. This is as severe as it gets — worse than the missing env vars, because it's silent and would work the instant Supabase is connected if left unfixed.
- **Fix:** Added a `before update` trigger (`protect_privileged_profile_columns`) on `profiles` that rejects any change to `role` or `is_suspended` unless the actor is already an admin (`is_admin(auth.uid())`), regardless of which policy/client path the update came through. Since `supabase/schema.sql` has never been run against a live project yet (confirmed in the file's own header), this fix is in place before the vulnerability could ever exist in production.
- **Status:** ✅ Fixed (in schema — will take effect the moment you run `schema.sql` against your Supabase project; if you've already run an earlier version, you'll need to re-run this updated file or apply the trigger manually).

### BUG-005b 🔴 CRITICAL: Same self-grading gap on homework submissions, and RLS still allowed the test-score bypass even after the app-layer fix
- **Where:** `supabase/schema.sql` — `submissions` and `test_attempts` policies.
- **What happened:** Same shape as BUG-005: `"Students manage their own submissions"` (homework) had no column restriction, so a student could set their own `score`/`feedback`/`graded_at` directly, bypassing teacher grading entirely. Separately, fixing BUG-004 at the app layer wasn't sufficient by itself — RLS still permitted a student to call `supabase.from('test_attempts').update({score:100})` directly on their own attempt row from the browser console, sidestepping the app's server action altogether.
- **Fix:**
  - Added `protect_submission_grade` trigger on `submissions`: only staff can change `score`/`feedback`/`graded_at`.
  - Added `protect_test_attempt_score` trigger on `test_attempts` (fires on both INSERT and UPDATE, since lesson-quiz submission uses upsert): only staff or the service role can set a non-null `score`.
  - Updated `submitTestAttempt` and `submitLessonQuizAttempt` (`lib/assessments/repository.ts`, `lib/lessons/repository.ts`) to write the graded score through the service-role client (`createAdminClient()`) after independently verifying the attempt belongs to the calling student — this is what makes the new trigger compatible with the legitimate grading path while still blocking a direct student write.
- **Status:** ✅ Fixed

### BUG-006 🟢 No column-level audit issue found in `orders`/payments RLS
- Reviewed `orders`, `course_prices`, `coupons`, `refund_requests` policies — these are correctly designed (students can only insert their own order as `pending`; only staff/service-role can mark `paid`; price is always looked up server-side, never trusted from the client). No fix needed. Noting this so it's clear it was checked, not missed.

## Summary

| # | Bug | Severity | Status |
|---|---|---|---|
| 000 | Production missing Supabase env vars — auth/dashboards/checkout all non-functional | 🔴 Critical | ⏳ Needs you (Supabase + Vercel dashboards) |
| 001 | "Enroll Now" hero CTA opens WhatsApp instead of checkout | 🟡 Medium | ⏳ Pending |
| 002 | No course currently has online pricing configured | ➖ Config, not a bug | ⏳ To do once backend is live |
| 003 | Duplicated site name in page `<title>` (3 routes incl. 20 legal sub-pages) | 🟢 Low | ✅ Fixed |
| 004 | Test/quiz correct answers shipped to browser + client-side grading | 🔴 Critical | ✅ Fixed |
| 005 | Student could self-promote to admin / un-suspend via direct RLS | 🔴 Critical | ✅ Fixed |
| 005b | Student could self-grade homework; RLS still allowed test-score bypass after app fix | 🔴 Critical | ✅ Fixed |
| 006 | Payment/order RLS reviewed | — | ✅ No issue found |

## Next Steps

1. **Connect the backend (blocking everything else):** In Supabase, confirm your project has `supabase/schema.sql` run against it (the updated version, with the three new security triggers). In Vercel → Settings → Environment Variables, add at minimum `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL`, then redeploy. `DEPLOYMENT_GUIDE.md` in the repo has the full checklist (Auth provider setup, redirect URLs, first-admin promotion, course pricing).
2. **Redeploy** so the title-bug fix and the rest of this session's code changes actually reach production — everything above was fixed in your local project folder, not yet pushed live.
3. **Once the backend is live, ask me to resume full live testing** — registration, login, all three dashboards, checkout end-to-end — since that was blocked this round by BUG-000.
4. Decide what to do about BUG-001 (Enroll Now → WhatsApp) — happy to fix once you tell me the intended behavior (should it scroll to the real Buy Now button, or is WhatsApp-first intentional for high-touch sales?).

## 1. Public Marketing Site

### BUG-001 🟡 "Enroll Now" button on course detail hero opens WhatsApp, not checkout
- **Where:** `components/courses/detail/CourseDetailHero.tsx` line 65-72
- **What happens:** The hero's third CTA is labeled "Enroll Now" but links to a WhatsApp inquiry message, identical to the "WhatsApp Inquiry" button next to it. A real "Buy Now — Pay Online" button (`BuyNowButton.tsx`) exists further down the page in `CourseDetailCTA`, but only renders when the course has confirmed online pricing.
- **Impact:** Confusing/duplicate CTA — a user clicking "Enroll Now" expects an enrollment/checkout flow, not to be sent to WhatsApp with a generic inquiry message already used by another button.
- **Status:** ⏳ Pending

### BUG-003 🟢 Duplicated "| Hidayet English Academy" in page `<title>`
- **Where:** `app/(marketing)/programs/madhyamik/page.tsx`, `app/(marketing)/legal/page.tsx`, `app/(marketing)/legal/[slug]/page.tsx`
- **What happens:** Root layout (`app/layout.tsx`) uses a title template `"%s | Hidayet English Academy"`. These three pages/routes set their own `title` already including the suffix, producing browser tabs like "Free English Program for Madhyamik Students | Hidayet English Academy | Hidayet English Academy".
- **Impact:** Cosmetic, but hits SEO (duplicated brand string in `<title>`) and every legal policy sub-page (20 of them, via the dynamic `[slug]` route).
- **Status:** ✅ Fixed — removed the redundant suffix from the three `title` fields; template now supplies it once. OpenGraph titles (separate field, not templated) left as-is.

### BUG-002 ➖ No courses currently have online checkout enabled
- **Where:** `app/api/courses/[slug]/pricing/route.ts`, Supabase tables `admin_courses` / `course_prices`
- **What happens:** Pricing API returns `available:false` for the flagship course (and likely all courses) because no matching row / prices exist in the DB yet. The full Stripe/Razorpay checkout system (`/checkout/[courseSlug]`) is built but currently unreachable from any course page.
- **Impact:** Online payment cannot be tested end-to-end until admin configures at least one course's pricing via `/admin/courses`.
- **Status:** ⏳ To confirm during admin dashboard audit — will attempt to configure pricing for one course to test full checkout.
