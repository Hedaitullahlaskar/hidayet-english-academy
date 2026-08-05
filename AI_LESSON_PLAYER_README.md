# Module 9 — AI Learning Assistant & Lesson Player: README

## The AI Assistant is real code calling a real API — not a mock

`/dashboard/ai-assistant` no longer shows "Coming Soon." It's a genuine
ChatGPT-style interface (`components/ai/AIChatInterface.tsx`) that calls
`/api/ai/chat`, which calls the real Anthropic API via
`lib/ai/client.ts`. There is no canned-response fallback and no fake
"AI thinking" animation hiding static text — if `ANTHROPIC_API_KEY` isn't
set, the chat interface shows an honest "AI Assistant Not Connected Yet"
state instead of pretending to work. The moment that env var is set, this
feature is fully live — same pattern as every other integration in this
app (Razorpay, WhatsApp, etc. from Module 7's Integrations page).

### The six modes, and what's actually different between them

Each mode isn't a re-skinned chatbot — it's a distinct system prompt
(`lib/ai/prompts.ts`) written to match how HEA's human teachers actually
teach (bilingual, plain-English-first, then Bengali reinforcement — the
same voice as the Method page):

- **Grammar Helper** — explains rules bilingually, names the specific
  Bengali-to-English pattern behind a mistake rather than just saying "wrong."
- **Vocabulary Builder** — definition, phonetic pronunciation, example
  sentences, Bengali meaning, every time.
- **Conversation Practice** — natural back-and-forth, with brief inline
  corrections that don't interrupt the flow of conversation.
- **Writing Correction** — corrected text + the *patterns* of error (not
  a line-by-line red-pen dump) in both languages.
- **Reading Comprehension** — generates a level-appropriate passage, asks
  real comprehension questions, evaluates answers without just handing
  over the answer.
- **Speaking Practice** — text-based today, explicitly per the brief
  ("prepare for future voice integration," not "build voice now"). See below.

Switching modes starts a fresh conversation thread — mixing Grammar
Helper context into a Writing Correction thread would confuse the system
prompt, so this is deliberate, not an oversight.

### Speaking Practice: what "prepare for future voice integration" means here

`components/ai/SpeakingPracticeMicButton.tsx` renders a real, visibly
disabled microphone button with an honest tooltip — not a button that
silently does nothing when clicked, and not a fake "recording…" animation.
The component's own comments document exactly where real voice input
plugs in later: the browser-native Web Speech API for client-side
transcription (no new dependency needed), or a `/api/ai/transcribe` route
for server-side speech-to-text if higher accuracy is needed. Either way,
the same plain-text string flows into the existing `/api/ai/chat` — so
adding real voice later doesn't require touching that flow at all.

### Rate limiting, because API calls cost real money

`/api/ai/chat` reuses Module 8's DB-backed rate limiter (30 messages per
15 minutes per user) — the same honest, no-Redis-needed pattern already
used for OTP and password-reset requests.

### Chat history is real, not ephemeral

Every message — both the student's and the AI's — is written to
`ai_conversations` / `ai_messages`, RLS-locked to the student who owns the
thread. This isn't just for show: it's what lets a conversation continue
correctly across multiple messages (the full thread is sent as context on
each call, not just the latest message).

## The Lesson Player is now genuinely functional

Previously (Module 5), `/dashboard/courses/[slug]/learn` was an honest
empty-state page — tabs that didn't switch, no real content, because no
lesson content existed yet. That's now:

- **`/dashboard/courses/[slug]/learn`** — the lesson list, grouped by
  module, with a real progress bar (X of Y lessons complete), bookmark
  status, and a **Continue Lesson** button that jumps to the most
  recently viewed *incomplete* lesson (or the first lesson if nothing's
  been started).
- **`/dashboard/courses/[slug]/learn/[lessonId]`** — the actual player:
  real `<video>`/`<audio>` elements or a PDF iframe depending on
  `lesson_type`, a bookmark toggle, a per-lesson quiz (if one exists,
  pulled from the question bank via `tests.lesson_id`), lesson-linked
  homework with real file upload, and previous/next lesson navigation.

### Completion tracking: what's genuinely automatic vs. what's honest to leave manual

- **Video and audio**: real automatic completion, fired on the native
  `ended` event — not a timer guess, not "assume they watched it."
- **PDF**: manual "Mark as Read" only. Reliably detecting that someone
  actually read a PDF (not just opened it) needs page-scroll tracking via
  a PDF.js-based viewer, which wasn't built in this pass. Claiming
  automatic PDF completion without that would be tracking data that isn't
  true — the manual button is the honest choice, not a shortcut.

### "Recently Viewed Lessons" — one write powers two features

Every lesson visit calls `touchLessonProgress()`, which upserts a
`lesson_progress` row with a fresh `updated_at`. That single write is what
powers **both** "Continue Lesson" (most recent incomplete lesson) and the
new "Recently Viewed Lessons" widget on the dashboard overview — no
separate view-tracking table needed.

### Homework submission, unified

The lesson-linked homework panel (`LessonHomeworkPanel.tsx`) is used in
two places: inside the lesson player for lesson-specific assignments, and
on the general `/dashboard/assignments` page for course-level ones
(previously read-only in Module 5 — now has real file upload via a new,
private `submissions` Storage bucket, RLS-locked so a student can only
read their own uploads and staff can read everyone's).

## Schema additions this module required

- `ai_conversations`, `ai_messages` — new
- `lessons.notes_url` — new column, for downloadable supplementary notes
  distinct from the primary video/PDF/audio file
- `tests.lesson_id` + `test_type` extended to include `'lesson_quiz'` —
  reuses the existing question-bank/test infrastructure from Module 6
  rather than building a parallel quiz system
- `assignments.lesson_id` — optional, for lesson-scoped homework
- `submissions` Storage bucket — private, student-write-to-own-folder-only
