# Module 6 — Teacher Dashboard: Technical Documentation

## What's different about this module

Modules 4 and 5 were mostly reads. This one is mostly writes — the entire
point is letting a teacher populate the academy without touching the
database. That changes the honesty framing slightly:

- **Read functions** still use the `safeQuery()`-to-empty-state pattern
  from Module 5, so listing pages show an honest "nothing yet" instead of
  crashing when there's no Supabase connection.
- **Write functions** (`createLiveClass`, `createLesson`,
  `gradeSubmission`, `issueCertificate`, etc.) deliberately do **not**
  swallow errors — they return `{ success, error }`, and every form in this
  module surfaces that error to the teacher. A teacher needs to know if an
  upload actually worked, not see a false "saved" state.

## Real, working right now (once credentials exist)

- **Role-gated auth**: `/teach/login` checks `profiles.role` after
  authentication — a student's valid session is explicitly rejected, both
  client-side (immediate feedback) and in `middleware.ts` (the actual
  enforcement, can't be bypassed by skipping the client check).
- **File uploads**: video/PDF/audio lessons and certificates upload to real
  Supabase Storage (`lesson-content` bucket, staff-write-only per
  `schema.sql`'s policies) and insert real rows into `lessons`.
- **Every CRUD form** — live classes, assignments, questions, tests,
  certificates, announcements, doubt replies — calls a real Supabase
  insert/update through `lib/teacher/repository.ts`.

## Schema additions this module required

Three things didn't exist before Module 6 and are now in `schema.sql`:

1. **`questions` + `test_questions`** — the question bank Quiz Builder and
   Mock Test Builder both need. Not a placeholder table — a real
   many-to-many join with per-question marks.
2. **`doubts` + `doubt_replies`** — see the honest gap below.
3. **`lesson-content` Storage bucket** — separate from the `avatars` bucket
   (Module 5), with staff-only write policies since lesson content isn't
   something students should be able to upload.

## The one honest gap: doubts have no student-side entry point yet

The Discussion/Doubt Section is fully built on the teacher side — list,
reply, mark resolved, all real. But **Module 5 (Student LMS) is frozen**,
and there's no "Ask a Doubt" button anywhere in the student dashboard. That
means `doubts` has no real write path yet — a teacher opening this page
today will correctly see "no doubts yet," not because the feature is
broken, but because there's genuinely nowhere for a student to create one.

This is called out directly in the Doubts page UI itself, not just buried
in this doc. Adding the student-side entry point is a small, additive
change to Module 5 (one button + one form, same pattern as the Scholarship
application form) — flagging it for your decision rather than quietly
modifying a module you said was frozen.

## Consolidation: 20 requested features → 14 routes

| Route | Covers |
|---|---|
| `/teach/login` | Teacher Login |
| `/teach` | Teacher Home Dashboard |
| `/teach/students` + `/teach/students/[id]` | Student List, Student Profiles |
| `/teach/attendance` | Attendance |
| `/teach/live-classes` | Live Class Schedule |
| `/teach/lessons/upload` | Upload Video Lessons, PDFs, Audio Lessons (one form, type selector) |
| `/teach/homework` | Homework Management, Assignment Review |
| `/teach/question-bank` | Question Bank |
| `/teach/tests` | Quiz Builder, Mock Test Builder (one form, type toggle) |
| `/teach/marks` | Marks Entry |
| `/teach/analytics` | Student Progress Analytics |
| `/teach/certificates` | Issue Certificates |
| `/teach/notifications` | Notifications (announcement composer) |
| `/teach/doubts` | Discussion / Doubt Section |
| `/teach/settings` | Teacher Profile & Settings |

## Security notes (Gate 6)

- Verified via full-codebase grep: `SUPABASE_SERVICE_ROLE_KEY` still
  referenced in zero application files.
- Every write function runs through `createServerSupabaseClient()`,
  meaning it's subject to the same RLS policies as any other request — a
  teacher account with a tampered client can't bypass `is_staff()` checks,
  because those checks live in Postgres, not in application code.
- The certificate `verification_code` is generated server-side
  (`generateVerificationCode()`) using a timestamp + random suffix — not
  predictable, not sequential, so certificate codes can't be guessed.
