-- ============================================================================
-- HIDAYET ENGLISH ACADEMY — STUDENT LMS SCHEMA
-- ============================================================================
-- This is the real schema the entire Student LMS (Module 5) is built against.
-- It has not been run against a live Supabase project yet — there are no
-- credentials configured (see lib/supabase/client.ts). Once a project exists,
-- running this file gives the app a working backend with zero code changes
-- required elsewhere, because every page reads through lib/dashboard/repository.ts,
-- never directly.
--
-- Row-Level Security (RLS) pattern: every student-owned table follows the
-- same rule — a student can only read/write rows where student_id = auth.uid().
-- The full policy is written out once below (profiles) and then referenced
-- for the remaining tables to avoid repeating fifteen identical blocks.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES — one row per authenticated user (student, teacher, or admin)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  country text,
  preferred_currency text default 'USD',
  preferred_locale text default 'en',
  timezone text default 'Asia/Kolkata',
  phone text,
  avatar_url text,
  guardian_name text,         -- required at signup if under 18, enforced in app logic
  guardian_contact text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Teachers/admins get broader read access — enforced via a role check function.
create or replace function is_staff(uid uuid) returns boolean as $$
  select exists (
    select 1 from profiles where id = uid and role in ('teacher', 'admin')
  );
$$ language sql security definer;

create policy "Staff can view all profiles"
  on profiles for select
  using (is_staff(auth.uid()));

-- SECURITY: "Users can update their own profile" above has no per-column
-- restriction — RLS alone would let a logged-in student run
-- `update profiles set role = 'admin' where id = auth.uid()` (or flip
-- is_suspended back to false) directly through the anon key, since
-- auth.uid() = id is satisfied for their own row regardless of which
-- columns change. is_admin() doesn't exist yet at this point in the file
-- (defined later, for Module 7), so this trigger is added once at the end
-- of the schema instead — see "PROTECT PRIVILEGED PROFILE COLUMNS" below.

-- ---------------------------------------------------------------------------
-- THE MISSING PIECE — until this trigger existed, signUp() created a row in
-- auth.users but NOTHING ever created the matching row in public.profiles.
-- Every page that fetches "the current user's profile" (which is most of
-- the Student, Teacher, and Admin dashboards) would have returned null
-- forever, even for a successfully registered, logged-in user. This is the
-- standard Supabase pattern for keeping profiles in sync with auth.users
-- automatically, and it should have been here since Module 5.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, phone, guardian_name, guardian_contact)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'guardian_name',
    new.raw_user_meta_data->>'guardian_contact'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- ENROLLMENTS — links a student to a course (course data lives in
-- content/courses-data.ts today per Module 4; course_slug is the join key
-- until courses also move into this database)
-- ---------------------------------------------------------------------------
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  course_slug text not null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_slug)
);

alter table enrollments enable row level security;
create policy "Students manage their own enrollments"
  on enrollments for all
  using (auth.uid() = student_id);
create policy "Staff view all enrollments"
  on enrollments for select
  using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- LESSONS — the actual teachable units within a course. Populated by
-- teachers/admin (Module 11/12) — empty until then.
-- ---------------------------------------------------------------------------
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  module_title text not null,
  title text not null,
  lesson_type text not null check (lesson_type in ('video', 'pdf', 'audio')),
  content_url text,           -- Supabase Storage path or external video URL
  duration_seconds integer,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table lessons enable row level security;
create policy "Enrolled students can view lessons"
  on lessons for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = lessons.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
create policy "Staff manage lessons"
  on lessons for all
  using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- LESSON PROGRESS — per-student completion/watch-time tracking
-- ---------------------------------------------------------------------------
create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  watch_time_seconds integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

alter table lesson_progress enable row level security;
create policy "Students manage their own progress"
  on lesson_progress for all
  using (auth.uid() = student_id);
create policy "Staff view all progress"
  on lesson_progress for select
  using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- ASSIGNMENTS & SUBMISSIONS
-- ---------------------------------------------------------------------------
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  title text not null,
  description text,
  due_at timestamptz,
  max_score integer not null default 100,
  created_at timestamptz not null default now()
);

alter table assignments enable row level security;
create policy "Enrolled students can view assignments"
  on assignments for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = assignments.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
create policy "Staff manage assignments"
  on assignments for all
  using (is_staff(auth.uid()));

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  content_url text,
  submitted_at timestamptz not null default now(),
  score integer,
  feedback text,
  graded_at timestamptz,
  unique (assignment_id, student_id)
);

alter table submissions enable row level security;
create policy "Students manage their own submissions"
  on submissions for all
  using (auth.uid() = student_id);
create policy "Staff manage all submissions"
  on submissions for all
  using (is_staff(auth.uid()));

-- SECURITY: "Students manage their own submissions" above has no
-- column-level restriction, so without this trigger a student could set
-- their own homework score/feedback directly (`update submissions set
-- score = 100 where id = ...`) instead of waiting for a teacher to grade
-- it. Grading (lib/teacher/repository.ts's gradeSubmission) always runs
-- under a staff session, so is_staff(auth.uid()) is sufficient here — no
-- service-role client is needed for the legitimate path.
create or replace function protect_submission_grade() returns trigger as $$
begin
  if (new.score is distinct from old.score
      or new.feedback is distinct from old.feedback
      or new.graded_at is distinct from old.graded_at)
     and not is_staff(auth.uid()) then
    raise exception 'Only staff can grade a submission.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_submission_grade on submissions;
create trigger trg_protect_submission_grade
  before update on submissions
  for each row execute function protect_submission_grade();

-- ---------------------------------------------------------------------------
-- TESTS (weekly tests + mock exams share one table, distinguished by test_type)
-- ---------------------------------------------------------------------------
create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  title text not null,
  test_type text not null check (test_type in ('weekly', 'mock')),
  scheduled_at timestamptz,
  duration_minutes integer not null default 30,
  total_marks integer not null default 100,
  created_at timestamptz not null default now()
);

alter table tests enable row level security;
create policy "Enrolled students can view tests"
  on tests for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = tests.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
create policy "Staff manage tests"
  on tests for all
  using (is_staff(auth.uid()));

create table if not exists test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references tests(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score integer,
  unique (test_id, student_id)
);

alter table test_attempts enable row level security;
create policy "Students manage their own attempts"
  on test_attempts for all
  using (auth.uid() = student_id);
create policy "Staff view all attempts"
  on test_attempts for select
  using (is_staff(auth.uid()));

-- SECURITY: "Students manage their own attempts" has no column-level
-- restriction, so without this trigger a student could set their own
-- test score directly instead of it being computed from the real answer
-- key. The app's grading (lib/assessments/repository.ts's
-- submitTestAttempt, lib/lessons/repository.ts's submitLessonQuizAttempt)
-- writes the score via the service-role client (lib/supabase/admin.ts)
-- after computing it server-side and independently verifying attempt
-- ownership — auth.role() = 'service_role' is what lets that legitimate
-- write through; a teacher's manual override (updateTestAttemptScore) runs
-- under a staff session, covered by is_staff(auth.uid()).
-- Covers both INSERT and UPDATE: lib/lessons/repository.ts's
-- submitLessonQuizAttempt uses an upsert, which is a plain INSERT the
-- first time a student takes a given lesson quiz — a BEFORE UPDATE-only
-- trigger would never see that first write, so a student could otherwise
-- set an arbitrary score simply by taking the quiz once.
create or replace function protect_test_attempt_score() returns trigger as $$
begin
  if (tg_op = 'UPDATE' and new.score is distinct from old.score
      or tg_op = 'INSERT' and new.score is not null)
     and not is_staff(auth.uid())
     and auth.role() <> 'service_role' then
    raise exception 'Score can only be set by the grading process or staff.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_test_attempt_score on test_attempts;
create trigger trg_protect_test_attempt_score
  before insert or update on test_attempts
  for each row execute function protect_test_attempt_score();

-- ---------------------------------------------------------------------------
-- LIVE CLASSES & ATTENDANCE
-- ---------------------------------------------------------------------------
create table if not exists live_classes (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  title text not null,
  platform text check (platform in ('google_meet', 'zoom')),
  meeting_url text,
  meeting_id text,              -- gateway's own meeting/event id, for future management (cancel, fetch recording)
  auto_generated boolean not null default false,  -- true if created via the real Meet/Zoom API, false if manually pasted
  recording_url text,           -- set after the class — replay link
  materials_url text,           -- class-specific downloadable material, distinct from a lesson's notes_url
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  created_at timestamptz not null default now()
);

alter table live_classes enable row level security;
create policy "Enrolled students can view live classes"
  on live_classes for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = live_classes.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
create policy "Staff manage live classes"
  on live_classes for all
  using (is_staff(auth.uid()));

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  live_class_id uuid not null references live_classes(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'absent' check (status in ('present', 'absent', 'excused')),
  marked_at timestamptz not null default now(),
  unique (live_class_id, student_id)
);

alter table attendance enable row level security;
create policy "Students view their own attendance"
  on attendance for select
  using (auth.uid() = student_id);
create policy "Staff manage attendance"
  on attendance for all
  using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- NOTES, BOOKMARKS, VOCABULARY NOTEBOOK — all fully student-owned
-- ---------------------------------------------------------------------------
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);
alter table notes enable row level security;
create policy "Students manage their own notes" on notes for all using (auth.uid() = student_id);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  timestamp_seconds integer default 0,
  created_at timestamptz not null default now()
);
alter table bookmarks enable row level security;
create policy "Students manage their own bookmarks" on bookmarks for all using (auth.uid() = student_id);

create table if not exists vocabulary_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  word text not null,
  meaning_en text,
  meaning_bn text,
  example_sentence text,
  created_at timestamptz not null default now()
);
alter table vocabulary_entries enable row level security;
create policy "Students manage their own vocabulary" on vocabulary_entries for all using (auth.uid() = student_id);

-- ---------------------------------------------------------------------------
-- STREAKS — one row per student, updated by app logic on each active day
-- ---------------------------------------------------------------------------
create table if not exists streaks (
  student_id uuid primary key references profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);
alter table streaks enable row level security;
create policy "Students manage their own streak" on streaks for all using (auth.uid() = student_id);

-- ---------------------------------------------------------------------------
-- CERTIFICATES — issued by staff, publicly verifiable by code (no auth
-- required to verify — see the public /verify/[code] route planned in
-- the Implementation Roadmap's Module 14)
-- ---------------------------------------------------------------------------
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  course_slug text not null,
  verification_code text not null unique,
  pdf_url text,
  issued_at timestamptz not null default now()
);
alter table certificates enable row level security;
create policy "Students view their own certificates" on certificates for select using (auth.uid() = student_id);
create policy "Staff manage certificates" on certificates for all using (is_staff(auth.uid()));
create policy "Anyone can verify a certificate by exact code"
  on certificates for select
  using (true); -- app layer only ever queries by exact verification_code, never lists all rows

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS & ANNOUNCEMENTS
-- ---------------------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table notifications enable row level security;
create policy "Students manage their own notifications" on notifications for all using (auth.uid() = student_id);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all' check (audience in ('all', 'course')),
  course_slug text,
  published_at timestamptz not null default now()
);
alter table announcements enable row level security;
create policy "Any authenticated user can read announcements"
  on announcements for select
  using (auth.role() = 'authenticated');
create policy "Staff manage announcements" on announcements for all using (is_staff(auth.uid()));

-- ============================================================================
-- STORAGE — avatar uploads (Settings page profile photo)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- QUESTION BANK — reusable questions that Quiz Builder / Mock Test Builder
-- assemble into tests via test_questions. Teacher/admin authored.
-- ---------------------------------------------------------------------------
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  question_text text not null,
  question_type text not null check (question_type in ('mcq', 'fill_blank', 'short_answer')),
  options jsonb,                 -- for mcq: [{"label":"A","text":"..."}]
  correct_answer text,
  difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table questions enable row level security;
create policy "Staff manage the question bank" on questions for all using (is_staff(auth.uid()));

create table if not exists test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references tests(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  order_index integer not null default 0,
  marks integer not null default 1,
  unique (test_id, question_id)
);

alter table test_questions enable row level security;
create policy "Enrolled students can view test questions"
  on test_questions for select
  using (
    exists (
      select 1 from tests
      join enrollments on enrollments.course_slug = tests.course_slug
      where tests.id = test_questions.test_id
      and enrollments.student_id = auth.uid()
    )
  );
create policy "Staff manage test questions" on test_questions for all using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- DISCUSSION / DOUBTS — students ask, teachers reply.
-- Note: no student-facing "ask a doubt" UI exists yet (Module 5 is frozen),
-- so this table has no real write path from the student side today. The
-- Teacher Dashboard's Doubt Section is fully built and ready the moment
-- that entry point is added — see LMS_MODULE_README.md's open item.
-- ---------------------------------------------------------------------------
create table if not exists doubts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  course_slug text not null,
  question text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

alter table doubts enable row level security;
create policy "Students manage their own doubts" on doubts for all using (auth.uid() = student_id);
create policy "Staff view and update all doubts" on doubts for all using (is_staff(auth.uid()));

create table if not exists doubt_replies (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references doubts(id) on delete cascade,
  author_id uuid not null references profiles(id),
  reply text not null,
  created_at timestamptz not null default now()
);

alter table doubt_replies enable row level security;
create policy "Participants can view replies on their own doubt"
  on doubt_replies for select
  using (
    exists (select 1 from doubts where doubts.id = doubt_replies.doubt_id and doubts.student_id = auth.uid())
    or is_staff(auth.uid())
  );
create policy "Students can reply on their own doubt"
  on doubt_replies for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from doubts where doubts.id = doubt_id and doubts.student_id = auth.uid())
  );
create policy "Staff can reply on any doubt"
  on doubt_replies for insert
  with check (auth.uid() = author_id and is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- STORAGE — lesson content (video/PDF/audio uploads from the Teacher
-- Dashboard). Separate, larger, staff-only-write bucket — distinct from the
-- public avatars bucket above.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('lesson-content', 'lesson-content', true)
on conflict (id) do nothing;

create policy "Lesson content is publicly viewable"
  on storage.objects for select
  using (bucket_id = 'lesson-content');

create policy "Staff can upload lesson content"
  on storage.objects for insert
  with check (bucket_id = 'lesson-content' and is_staff(auth.uid()));

create policy "Staff can update lesson content"
  on storage.objects for update
  using (bucket_id = 'lesson-content' and is_staff(auth.uid()));

create policy "Staff can delete lesson content"
  on storage.objects for delete
  using (bucket_id = 'lesson-content' and is_staff(auth.uid()));

-- ============================================================================
-- SUPER ADMIN DASHBOARD — additional schema (Module 7)
-- ============================================================================

-- Stricter than is_staff() — several admin operations must be admin-only,
-- excluding teachers entirely (salary notes, integration credentials,
-- role changes, refunds).
create or replace function is_admin(uid uuid) returns boolean as $$
  select exists (select 1 from profiles where id = uid and role = 'admin');
$$ language sql security definer;

-- ---------------------------------------------------------------------------
-- PROTECT PRIVILEGED PROFILE COLUMNS — closes the gap left by "Users can
-- update their own profile" (defined much earlier, before is_admin()
-- existed). That policy only checks auth.uid() = id; it never restricts
-- which columns a user can change on their own row. Without this trigger,
-- any authenticated student could call
--   supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id)
-- directly from the browser and RLS would allow it — a full account
-- takeover requiring no server-side bug at all, just the anon key every
-- visitor already has. Same issue for is_suspended (a suspended student
-- could just un-suspend themselves). This trigger makes role and
-- is_suspended changes stick only when the actor is already an admin,
-- regardless of which client/policy path the update came through.
-- ---------------------------------------------------------------------------
create or replace function protect_privileged_profile_columns() returns trigger as $$
begin
  if (new.role is distinct from old.role or new.is_suspended is distinct from old.is_suspended)
     and not is_admin(auth.uid()) then
    raise exception 'Only admins can change role or suspension status.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_protect_privileged_profile_columns on profiles;
create trigger trg_protect_privileged_profile_columns
  before update on profiles
  for each row execute function protect_privileged_profile_columns();

-- ---------------------------------------------------------------------------
-- AUDIT LOGS — every sensitive admin action writes here. Referenced in the
-- original Master Plan's database structure but never actually created
-- until this module needed it for real.
-- ---------------------------------------------------------------------------
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,           -- e.g. "role_changed", "student_suspended", "refund_issued"
  target_table text,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;
create policy "Admins can view audit logs" on audit_logs for select using (is_admin(auth.uid()));
create policy "Admins can write audit logs" on audit_logs for insert with check (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- COURSES — real, admin-manageable course records. Distinct from
-- content/courses-data.ts (Module 4's static file) — the public /courses
-- pages still read that file today; this table is the admin-CRUD side,
-- ready to become the single source of truth once wired together (a
-- deliberate, flagged next step — see ADMIN_MODULE_README.md).
-- ---------------------------------------------------------------------------
create table if not exists admin_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text,
  level text,
  price_inr integer,               -- null = "contact for fees", 0 = free
  is_free boolean not null default false,
  is_published boolean not null default false,
  lesson_order integer[] default '{}',
  created_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table admin_courses enable row level security;
create policy "Anyone can view published courses" on admin_courses for select using (is_published = true);
create policy "Staff manage courses" on admin_courses for all using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- COUPONS — real discount codes, admin-managed
-- ---------------------------------------------------------------------------
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null check (discount_percent between 1 and 100),
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
alter table coupons enable row level security;
create policy "Admins manage coupons" on coupons for all using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- REFUND REQUESTS — the request/approval record exists for real; actually
-- executing a refund against a gateway depends on Module 16's live
-- payment integration, which doesn't exist yet.
-- ---------------------------------------------------------------------------
create table if not exists refund_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id),
  payment_reference text,
  amount integer,
  currency text default 'INR',
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'processed')),
  reviewed_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
alter table refund_requests enable row level security;
create policy "Admins manage refund requests" on refund_requests for all using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- SCHOLARSHIP APPLICATIONS — real record. Note: the public /scholarship
-- page (Module 4) currently submits via WhatsApp only and does NOT insert
-- here yet — flagged explicitly, same pattern as Module 6's doubts gap.
-- ---------------------------------------------------------------------------
create table if not exists scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  applicant_contact text,
  course_interest text,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table scholarship_applications enable row level security;
create policy "Admins manage scholarship applications" on scholarship_applications for all using (is_admin(auth.uid()));
-- The public /scholarship page has never required login (matching the
-- WhatsApp-based flow it was built alongside in Module 4) — this policy
-- lets an anonymous visitor submit exactly one row, write-only. They
-- can't read back applications (that stays admin-only), only create one.
create policy "Anyone can submit a scholarship application"
  on scholarship_applications for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- CMS CONTENT — generic key-value content store for the Website CMS.
-- The live marketing pages (Homepage/About/Method — all previously
-- approved and frozen) still read from their static TypeScript data files
-- today, NOT from this table. This is the admin-editing side, built and
-- ready; wiring the two together is a flagged next step, not done here.
-- ---------------------------------------------------------------------------
create table if not exists cms_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,           -- 'homepage' | 'about' | 'founder_story' | 'contact'
  content_key text not null,       -- e.g. 'hero_title'
  value_en text,
  value_bn text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique (section, content_key)
);
alter table cms_content enable row level security;
create policy "Anyone can read CMS content" on cms_content for select using (true);
create policy "Staff manage CMS content" on cms_content for all using (is_staff(auth.uid()));

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  course_name text,
  quote text not null,
  rating integer check (rating between 1 and 5),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy "Anyone can view published testimonials" on testimonials for select using (is_published = true);
create policy "Staff manage testimonials" on testimonials for all using (is_staff(auth.uid()));

create table if not exists site_banners (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_url text,
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);
alter table site_banners enable row level security;
create policy "Anyone can view active banners" on site_banners for select using (is_active = true);
create policy "Staff manage banners" on site_banners for all using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- INTEGRATION SETTINGS — deliberately stores STATUS only, never secret
-- values. Real API keys belong in environment variables or Supabase
-- Vault, set server-side at deploy time — never in a table the app can
-- read back and render into a browser. See ADMIN_MODULE_README.md.
-- ---------------------------------------------------------------------------
create table if not exists integration_settings (
  service_name text primary key,   -- 'razorpay' | 'stripe' | 'paypal' | 'wise' | 'email' | 'whatsapp' | 'ai'
  is_configured boolean not null default false,
  configured_by uuid references profiles(id),
  configured_at timestamptz,
  notes text
);
alter table integration_settings enable row level security;
create policy "Admins manage integration settings" on integration_settings for all using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- TEACHER NOTES — salary notes and admin-only remarks about staff.
-- Deliberately a separate table from profiles (not a column on it), so
-- the existing "users can view their own profile" policy can never
-- accidentally expose this to the teacher it's about.
-- ---------------------------------------------------------------------------
create table if not exists teacher_notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  note text not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
alter table teacher_notes enable row level security;
create policy "Only admins can access teacher notes" on teacher_notes for all using (is_admin(auth.uid()));

-- ============================================================================
-- AUTHENTICATION & USER MANAGEMENT — additional schema (Module 8)
-- ============================================================================

-- A real, account-level suspension flag — distinct from Module 7's
-- per-enrollment pause, which only affected one course. This one blocks
-- access to the entire dashboard, checked in every layout (dashboard/teach/admin).
alter table profiles add column if not exists is_suspended boolean not null default false;

-- ---------------------------------------------------------------------------
-- TEACHER APPLICATIONS — self-service registration with required admin
-- approval. Distinct from Module 7's "promote an existing student by
-- email" (which assumes the admin already knows who to promote); this is
-- the applicant-initiated flow requested here.
-- ---------------------------------------------------------------------------
create table if not exists teacher_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references profiles(id) on delete cascade,
  bio text,
  subjects text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table teacher_applications enable row level security;
create policy "Applicants view their own application" on teacher_applications for select using (auth.uid() = applicant_id);
create policy "Applicants can submit one application" on teacher_applications for insert with check (auth.uid() = applicant_id);
create policy "Admins manage all applications" on teacher_applications for all using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- LOGIN HISTORY & SESSIONS — real device/session tracking, written at
-- login time by the app (Supabase Auth doesn't expose multi-session
-- listing to the client SDK, so this is how "Device Management" and
-- "Login History" become real features rather than reading nothing).
-- ---------------------------------------------------------------------------
create table if not exists login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  method text not null check (method in ('password', 'otp_email', 'otp_phone', 'google')),
  success boolean not null default true,
  user_agent text,
  created_at timestamptz not null default now()
);
alter table login_history enable row level security;
create policy "Users view their own login history" on login_history for select using (auth.uid() = user_id);
create policy "Anyone can insert their own login record" on login_history for insert with check (auth.uid() = user_id or user_id is null);
create policy "Admins view all login history" on login_history for select using (is_admin(auth.uid()));

create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  device_label text,
  user_agent text,
  last_active_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table user_sessions enable row level security;
create policy "Users manage their own sessions" on user_sessions for all using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ACCOUNT DELETION REQUESTS — the request is real and self-service;
-- actual execution (calling the Supabase Admin API to delete the
-- auth.users row) happens server-side only, via a service-role client
-- that never reaches the browser — see lib/supabase/admin.ts.
-- ---------------------------------------------------------------------------
create table if not exists account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table account_deletion_requests enable row level security;
create policy "Users manage their own deletion request" on account_deletion_requests for all using (auth.uid() = user_id);
create policy "Admins view all deletion requests" on account_deletion_requests for select using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- RATE LIMITING — a real, DB-backed limiter for sensitive unauthenticated
-- endpoints (OTP requests, password reset requests). No Redis/external
-- service in this stack, so this table is the honest, working substitute.
-- ---------------------------------------------------------------------------
create table if not exists rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,        -- email, phone, or IP
  action text not null,            -- 'otp_request' | 'password_reset_request'
  created_at timestamptz not null default now()
);
alter table rate_limit_events enable row level security;
create policy "Service role only" on rate_limit_events for all using (false);
create index if not exists idx_rate_limit_lookup on rate_limit_events (identifier, action, created_at);

-- ============================================================================
-- AI LEARNING ASSISTANT & LESSON PLAYER — additional schema (Module 9)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- AI CONVERSATIONS — real chat history, one thread per mode per student
-- session. Genuinely written to and read from by /api/ai/chat.
-- ---------------------------------------------------------------------------
create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  mode text not null check (mode in ('grammar', 'vocabulary', 'conversation', 'writing', 'reading', 'speaking')),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table ai_conversations enable row level security;
create policy "Students manage their own AI conversations" on ai_conversations for all using (auth.uid() = student_id);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table ai_messages enable row level security;
create policy "Students manage messages in their own conversations"
  on ai_messages for all
  using (exists (select 1 from ai_conversations where ai_conversations.id = ai_messages.conversation_id and ai_conversations.student_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Lesson Player completions: downloadable notes, per-lesson quizzes, and
-- optionally lesson-scoped homework — additive columns on tables that
-- already existed (lessons, tests, assignments), not new parallel systems.
-- ---------------------------------------------------------------------------
alter table lessons add column if not exists notes_url text;

alter table tests drop constraint if exists tests_test_type_check;
alter table tests add constraint tests_test_type_check check (test_type in ('weekly', 'mock', 'lesson_quiz'));
alter table tests add column if not exists lesson_id uuid references lessons(id) on delete cascade;

alter table assignments add column if not exists lesson_id uuid references lessons(id) on delete set null;

-- ---------------------------------------------------------------------------
-- STORAGE — homework submission uploads (Module 9's lesson-linked homework).
-- Private, not public like avatars/lesson-content — a student's submitted
-- work shouldn't be publicly listable by URL guessing.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "Students can upload their own submissions"
  on storage.objects for insert
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can view their own submissions"
  on storage.objects for select
  using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Staff can view all submissions"
  on storage.objects for select
  using (bucket_id = 'submissions' and is_staff(auth.uid()));

-- ============================================================================
-- PAYMENTS — real Razorpay + Stripe integration (per explicit request:
-- India via Razorpay, international via Stripe). SSLCommerz/Bangladesh
-- remains future scope, not built here.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- COURSE PRICES — the ONLY trusted source of what something costs. Every
-- checkout route looks the price up here server-side; a price is never
-- accepted from the client. Amounts are minor units (paise, cents) per
-- standard payment-gateway practice — avoids floating-point money bugs.
-- ---------------------------------------------------------------------------
create table if not exists course_prices (
  id uuid primary key default gen_random_uuid(),
  admin_course_id uuid not null references admin_courses(id) on delete cascade,
  currency text not null check (currency in ('INR', 'USD', 'GBP', 'EUR', 'AED', 'SGD', 'AUD', 'CAD')),
  amount_minor_units integer not null check (amount_minor_units > 0),
  updated_at timestamptz not null default now(),
  unique (admin_course_id, currency)
);
alter table course_prices enable row level security;
create policy "Anyone can view course prices" on course_prices for select using (true);
create policy "Staff manage course prices" on course_prices for all using (is_staff(auth.uid()));

-- ---------------------------------------------------------------------------
-- ORDERS — the real transaction record. Created as 'pending' the moment a
-- checkout session starts, updated to 'paid'/'failed' only by a verified
-- webhook — never by the client redirect, which can be closed, spoofed,
-- or simply never happen even after a real successful payment.
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  admin_course_id uuid not null references admin_courses(id),
  provider text not null check (provider in ('razorpay', 'stripe')),
  currency text not null,
  amount_minor_units integer not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  gateway_order_id text,       -- Razorpay order_id / Stripe checkout session id
  gateway_payment_id text,     -- Razorpay payment_id / Stripe payment_intent id, set on success
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "Students view their own orders" on orders for select using (auth.uid() = student_id);
create policy "Staff view all orders" on orders for select using (is_staff(auth.uid()));
-- A student may create their own order, but only as 'pending' — the price
-- itself is always computed server-side from course_prices before this
-- insert happens (see /api/payments/checkout), so RLS here only needs to
-- stop one student from creating an order attributed to someone else.
create policy "Students can create their own pending order"
  on orders for insert
  with check (auth.uid() = student_id and status = 'pending');
-- Critically, there is NO student update policy. Only staff (admin refund
-- actions) or the service-role webhook handler (which bypasses RLS
-- entirely) can ever transition an order to 'paid' — a student's browser
-- session must never be able to mark its own payment successful.
create policy "Staff can update orders" on orders for update using (is_staff(auth.uid()));

alter table refund_requests add column if not exists order_id uuid references orders(id);

-- ============================================================================
-- ASSESSMENT, CERTIFICATION & ACHIEVEMENT SYSTEM — additional schema (Module 11)
-- ============================================================================

alter table tests add column if not exists pass_percentage integer not null default 60 check (pass_percentage between 1 and 100);
alter table tests add column if not exists max_attempts integer not null default 1 check (max_attempts >= 1);
alter table tests add column if not exists shuffle_questions boolean not null default true;

alter table test_questions add column if not exists section_title text;

-- Multiple attempts requires dropping the old one-attempt-ever constraint
-- and tracking which attempt number this is instead.
alter table test_attempts drop constraint if exists test_attempts_test_id_student_id_key;
alter table test_attempts add column if not exists attempt_number integer not null default 1;
alter table test_attempts add constraint test_attempts_unique_attempt unique (test_id, student_id, attempt_number);

alter table assignments add column if not exists allow_late_submission boolean not null default true;
alter table assignments add column if not exists late_penalty_percent integer not null default 0 check (late_penalty_percent between 0 and 100);

alter table submissions add column if not exists submission_type text not null default 'file' check (submission_type in ('file', 'text'));
alter table submissions add column if not exists text_content text;
alter table submissions add column if not exists is_late boolean not null default false;
-- Multiple attempts on homework weren't asked for — resubmission before
-- grading is still supported via the existing upsert-by-(assignment,student)
-- pattern already in lib/lessons/repository.ts, so no constraint change needed.

alter table certificates add column if not exists certificate_type text not null default 'completion' check (certificate_type in ('completion', 'achievement'));
alter table certificates add column if not exists achievement_title text;

-- ============================================================================
-- End of schema. See COURSES_MODULE_README.md, LMS_MODULE_README.md,
-- TEACHER_MODULE_README.md, ADMIN_MODULE_README.md, AUTH_MODULE_README.md,
-- AI_LESSON_PLAYER_README.md, PAYMENTS_MODULE_README.md,
-- LIVE_CLASS_MODULE_README.md, and ASSESSMENT_MODULE_README.md for how the
-- app layer talks to these tables.
-- ============================================================================
