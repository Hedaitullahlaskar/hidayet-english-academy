# Module 10 — Live Learning & Communication System: README

## What already existed vs. what's genuinely new

Live class scheduling, joining, and viewing existed since Modules 5–7 —
this module didn't rebuild that. What's new: real Google Meet/Zoom
auto-generation, a genuinely working attendance-marking UI (previously a
hardcoded empty state), recordings/replay, real timezone-aware time
display, real calendar file export, and honestly-scoped WhatsApp reminder
architecture.

## Google Meet & Zoom: real integrations, deliberately without the heavy SDK

Both `lib/liveclass/providers/googleMeet.ts` and `.../zoom.ts` are plain
`fetch()` calls — OAuth token exchange, then one API call to create the
meeting. `googleapis` (Google's official Node SDK) was deliberately not
added as a dependency; it's a genuinely large package for what's really
two REST calls, and the plain-fetch pattern matches how every other
integration in this app (Razorpay, Stripe, Anthropic, Resend) is built.

- **Google Meet**: a Meet link is a side effect of creating a Calendar
  event with `conferenceData.createRequest` set — there's no separate
  "Meet API." Uses a refresh token belonging to whichever Google account
  should own these events (the academy's own account, obtained once via
  standard OAuth consent — not something a student or teacher authorizes
  per class).
- **Zoom**: uses Zoom's Server-to-Server OAuth app type, their current
  recommended approach for exactly this kind of automation — no per-user
  consent flow needed.
- **Honest fallback, not a hard dependency**: `lib/liveclass/router.ts`'s
  `tryAutoGenerateLink()` returns `null` — not an error — when a provider
  isn't configured, or if the real API call fails for any reason (expired
  token, rate limit). The teacher's "Schedule Class" flow always falls
  back to whatever was typed into the meeting URL field. A missing
  integration or a transient API failure never blocks scheduling a class.

## The real bug this module's build surfaced, twice

Adding class cancellation (`status = 'cancelled'`) meant two existing
queries needed a filter that didn't exist yet: `getUpcomingLiveClasses()`
(the student's "Next Live Class" widget) and `getTodaysLiveClasses()`
(the teacher's attendance page) both would have kept showing a cancelled
class as if it were still happening. Both fixed in this pass — caught
while building the cancel feature itself, not after shipping it.

## Attendance: from a decorative empty state to something that works

`/teach/attendance` had shown "No enrolled students to mark yet" **since
Module 6, regardless of whether students were actually enrolled** — it
never queried real enrollment data at all. `getEnrolledStudentsForClass()`
now does the real join (enrollments → profiles, plus existing attendance
marks), and `AttendanceMarkingList.tsx` gives a teacher real
present/absent/excused buttons per student, persisted immediately.

## Timezone support: making the column real

`profiles.timezone` has existed since Module 5 but nothing actually
formatted a time using it — displays defaulted to whatever the *viewer's
browser* considered local time. `lib/utils/timezone.ts`'s
`formatInTimezone()` uses `Intl.DateTimeFormat` (native to JS, no
library) to render a class time in the *student's own saved timezone*,
wired into the course lesson-list page's live-class widget.

## Calendar integration: a real, working feature with zero API keys

`/api/live-classes/[id]/calendar` generates a genuine iCalendar (.ics)
file — hand-written to the RFC 5545 format, no library needed. This is
one of the few pieces in this module that works completely today, with
no configuration at all: click "Add to Calendar," get a file any
calendar app opens directly.

## Reminders: now a real, triggered send path (follow-up pass)

The gap the original module README flagged — "architecture, precisely as
scoped" — is closed. `sendClassReminder()` in `lib/whatsapp/reminders.ts`
now makes the real WhatsApp Business Cloud API call (previously commented
out), `lib/email/templates.ts` gained a `classReminderEmail` template, and
`/api/cron/reminders` is a real endpoint — triggered by Vercel Cron (see
`vercel.json`, every 10 minutes) — that finds classes starting within 30
minutes (`lib/liveclass/reminders.ts`'s `REMINDER_LEAD_MINUTES`), emails
every enrolled student (works as soon as Resend is configured), and
attempts a WhatsApp message too (works only once WhatsApp credentials
**and** an approved Meta message template both exist — the business
verification step still isn't something code can shortcut). Each class is
marked `reminder_sent_at` before sending, not after, so a slow or
partially-failed run never causes a duplicate reminder on the next cron
tick. Full credential list: `CREDENTIALS_CHECKLIST.md`.

## Downloads: materials_url finally has its UI

The original module README noted `materials_url` was "reserved... not yet
given its own UI." `/dashboard/downloads` (new) now aggregates lesson
notes (`lessons.notes_url`) and live-class materials/recordings
(`live_classes.materials_url` / `recording_url`) across every enrolled
course in one place, via `getMyDownloads()` in
`lib/dashboard/repository.ts` — both queries rely on the same RLS
enrollment policies as everywhere else in this file, nothing new to grant.

## Recordings & replay

Teachers attach a recording link (Drive, unlisted YouTube, etc.) to a
past class via `AttachRecordingForm`; students see it under "Past Classes
& Replays" on their course page. No automatic recording capture — Zoom's
Cloud Recording API and a webhook to fetch it automatically is real,
buildable future scope, not built here.

## Schema additions

`live_classes` gained: `meeting_id` (gateway's own ID, for future
management), `auto_generated` (whether the API created the link),
`recording_url`, `materials_url` (reserved for class-specific downloads
distinct from a lesson's `notes_url` — not yet given its own UI, since
lesson notes already cover most of what "study material downloads"
needs; a genuinely separate UI for this is a small, clearly scoped
follow-up), and `status` (`scheduled`/`completed`/`cancelled`).

## New environment variables

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` | Google Meet auto-generation |
| `ZOOM_ACCOUNT_ID` / `ZOOM_CLIENT_ID` / `ZOOM_CLIENT_SECRET` | Zoom auto-generation |
| `WHATSAPP_BUSINESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp reminders — inert until a template is also approved in Meta Business Manager |
| `WHATSAPP_TEMPLATE_NAME` | Optional override if your approved template isn't named `class_reminder` |
| `CRON_SECRET` | Authenticates Vercel Cron's call to `/api/cron/reminders` |

## Why no preview was regenerated for this module

This module's real content — OAuth token exchange, live API calls to
Google/Zoom, `Intl`-based timezone math against a real student's saved
preference, generated `.ics` file bytes — has nothing meaningful to show
in a static HTML mock. A fake "Schedule Class" button that doesn't call a
real API would demonstrate less than the honest layout screens already
shown in the existing integrated preview. Skipped deliberately, not
overlooked.
