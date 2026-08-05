# Module 11 — Assessment, Certification & Achievement System: README

## Read this section first — a critical, cross-module architecture fix

While building this module (specifically, giving teachers visibility into
submission content), I found that the pattern used to call server-side
mutations from Client Components — direct function calls like
`await gradeSubmission(...)` inside an `onClick` handler — was not valid
Next.js. Those functions use `createServerSupabaseClient()`, which reads
`cookies()` from `next/headers`, an API that only exists in a server
request context. Calling it from code that runs in the browser doesn't
work.

This wasn't a Module 11 bug. It was the pattern used for essentially
every interactive mutation since Module 6: attendance marking, grading,
bookmarking, homework submission, role promotion, coupon creation,
doubt replies, live class scheduling, refund approval — roughly 30
components across the Teacher, Admin, and Student areas.

**The fix**: Next.js has a purpose-built mechanism for exactly this —
Server Actions. Adding a `"use server"` directive to the top of a file
turns every exported async function into something safely callable from
client code; Next.js generates the client/server RPC boundary
automatically. Applied to the six repository files actually called from
client components:

- `lib/teacher/repository.ts`
- `lib/admin/repository.ts`
- `lib/lessons/repository.ts`
- `lib/account/repository.ts`
- `lib/assessments/repository.ts`
- `lib/dashboard/doubts-repository.ts`

Server Actions have one hard constraint: every exported member must be an
async function (type exports are fine — they don't exist at runtime, so
`MutationResult` interfaces across these files are unaffected). The one
genuine violation was `shuffleQuestions()` in the assessments repository,
a synchronous pure function — extracted into `lib/assessments/shuffle.ts`,
which has no reason to be a server action at all (no database access,
no need for the "use server" boundary).

**Why this didn't break anything already working**: "use server" is
purely additive. Every existing Server Component caller (a `page.tsx`
doing `const data = await getAllStudents()` during render) continues to
work identically — the directive only adds new capability (safe
client-callability), it doesn't remove or change server-side behavior.

This is the actual headline of this module. Everything below is real,
but this is the fix that mattered most.

## Quiz & Mock Test System

The single biggest functional gap this module closed: **students could
see that weekly tests and mock exams existed, but had no way to actually
take one.** `/dashboard/tests` was a read-only list since Module 5.

Built:
- `/dashboard/tests/[testId]/take` — real countdown timer (auto-submits
  at zero rather than leaving a stalled screen), question shuffling
  (Fisher-Yates, genuinely different order per attempt), section grouping
  via `test_questions.section_title`, and pass/fail against a real
  `tests.pass_percentage`.
- **Multiple attempts, for real**: `test_attempts` previously had a
  `unique(test_id, student_id)` constraint — structurally impossible to
  attempt twice. Replaced with `unique(test_id, student_id, attempt_number)`
  and a real `tests.max_attempts` cap, enforced server-side in the take
  page (redirects away once attempts are exhausted, not just hidden by UI).
- **Shared question rendering**: `QuestionRenderer.tsx` is used by both
  the new standalone test-taking flow and the existing lesson-embedded
  `LessonQuiz` — extracted rather than duplicated, per the explicit
  instruction not to create duplicate code. `LessonQuiz` was refactored to
  use it; its behavior is otherwise unchanged.
- **Score history**: `/dashboard/tests` now shows every past attempt's
  score per test, not just whether one was scheduled.

## Homework & Assignments

- **Text submission**, alongside the existing file upload — a real mode
  toggle in `LessonHomeworkPanel`, not just a file picker.
- **Real late-submission detection**: compares the actual submit moment
  against `assignments.due_at` and honors a new `allow_late_submission`
  flag — an assignment can genuinely refuse late work, not just display a
  due date nobody enforces.
- **Teachers can now see what was actually submitted.** This was the
  discovery point for the Server Actions issue above:
  `AssignmentReviewPanel` was grading blind — no file link, no text
  preview, ever. Now shows the actual content, with a signed URL for file
  submissions (the `submissions` bucket is private, so a plain public URL
  wouldn't have worked) and a late-submission badge.
- **Real "result published" notification** fires the moment a submission
  is graded.

## Certificates

- **Real, scannable QR codes** — embedded directly in the generated PDF
  and shown on the public verification page, encoding the actual
  verification URL (not a code someone has to type in manually).
  `certificate_type` (`completion`/`achievement`) and `achievement_title`
  columns exist for non-completion awards (e.g., "Perfect Attendance");
  the issuance UI for achievement-type certificates specifically is a
  small, clearly scoped follow-up — the schema and PDF/QR generation
  already support it.

## Student Progress: from "coming soon" to real

`/dashboard/reports` had been an honest placeholder since Module 5
("monthly reports coming soon"). `getMyOverallPerformance()` now
genuinely aggregates course completion %, attendance %, average quiz
score, and average assignment score from real rows — and where a metric
has zero underlying data, it renders "No data yet," never a fabricated
0%, which would look identical to a real failing score.

## Teacher Evaluation Dashboard

Added directly to the existing teacher home page (`/teach`) rather than
a new nav item — a real "Evaluation Dashboard" section: exactly which
assignments and test attempts are awaiting review (not just a count),
plus a running "reviews completed all-time" figure. This is
complementary to, not a duplicate of, the existing `/teach/analytics`
page — that's per-course score/enrollment analytics; this is
cross-course pending-work triage.

## Notifications wired this module

- **Result published** — on grading (`gradeSubmission`)
- **Quiz/exam available** — on test creation, sent to every actively
  enrolled student in that course

Not built this pass: time-based reminders ("assignment due in 24
hours," "exam tomorrow") — these need a scheduled trigger (Vercel Cron
is the natural fit, and doesn't require new infrastructure beyond a
`vercel.json` entry and one route), which is real, bounded, unbuilt
scope, not silently dropped.

## Schema additions

`tests`: `pass_percentage`, `max_attempts`, `shuffle_questions`.
`test_questions`: `section_title`. `test_attempts`: attempt-number-based
uniqueness replacing the old one-attempt constraint. `assignments`:
`allow_late_submission`, `late_penalty_percent` (column exists; penalty
calculation itself isn't applied to the score yet — a small, clearly
scoped follow-up). `submissions`: `submission_type`, `text_content`,
`is_late`. `certificates`: `certificate_type`, `achievement_title`.

## New dependencies

`qrcode` (+ `@types/qrcode`) for certificate QR generation — chosen for
the same reason as every other library decision in this app: it does
exactly one well-defined thing, with no heavier alternative needed.
