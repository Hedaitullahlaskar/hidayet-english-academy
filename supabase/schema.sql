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

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Teachers/admins get broader read access — enforced via a role check function.
create or replace function is_staff(uid uuid) returns boolean as $$
  select exists (
    select 1 from profiles where id = uid and role in ('teacher', 'admin')
  );
$$ language sql security definer;

drop policy if exists "Staff can view all profiles" on profiles;
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
drop policy if exists "Students manage their own enrollments" on enrollments;
create policy "Students manage their own enrollments"
  on enrollments for all
  using (auth.uid() = student_id);
drop policy if exists "Staff view all enrollments" on enrollments;
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
drop policy if exists "Enrolled students can view lessons" on lessons;
create policy "Enrolled students can view lessons"
  on lessons for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = lessons.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
drop policy if exists "Staff manage lessons" on lessons;
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
drop policy if exists "Students manage their own progress" on lesson_progress;
create policy "Students manage their own progress"
  on lesson_progress for all
  using (auth.uid() = student_id);
drop policy if exists "Staff view all progress" on lesson_progress;
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
drop policy if exists "Enrolled students can view assignments" on assignments;
create policy "Enrolled students can view assignments"
  on assignments for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = assignments.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
drop policy if exists "Staff manage assignments" on assignments;
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
drop policy if exists "Students manage their own submissions" on submissions;
create policy "Students manage their own submissions"
  on submissions for all
  using (auth.uid() = student_id);
drop policy if exists "Staff manage all submissions" on submissions;
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
drop policy if exists "Enrolled students can view tests" on tests;
create policy "Enrolled students can view tests"
  on tests for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = tests.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
drop policy if exists "Staff manage tests" on tests;
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
drop policy if exists "Students manage their own attempts" on test_attempts;
create policy "Students manage their own attempts"
  on test_attempts for all
  using (auth.uid() = student_id);
drop policy if exists "Staff view all attempts" on test_attempts;
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
drop policy if exists "Enrolled students can view live classes" on live_classes;
create policy "Enrolled students can view live classes"
  on live_classes for select
  using (
    exists (
      select 1 from enrollments
      where enrollments.course_slug = live_classes.course_slug
      and enrollments.student_id = auth.uid()
    )
  );
drop policy if exists "Staff manage live classes" on live_classes;
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
drop policy if exists "Students view their own attendance" on attendance;
create policy "Students view their own attendance"
  on attendance for select
  using (auth.uid() = student_id);
drop policy if exists "Staff manage attendance" on attendance;
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
drop policy if exists "Students manage their own notes" on notes;
create policy "Students manage their own notes" on notes for all using (auth.uid() = student_id);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  timestamp_seconds integer default 0,
  created_at timestamptz not null default now()
);
alter table bookmarks enable row level security;
drop policy if exists "Students manage their own bookmarks" on bookmarks;
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
drop policy if exists "Students manage their own vocabulary" on vocabulary_entries;
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
drop policy if exists "Students manage their own streak" on streaks;
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
drop policy if exists "Students view their own certificates" on certificates;
create policy "Students view their own certificates" on certificates for select using (auth.uid() = student_id);
drop policy if exists "Staff manage certificates" on certificates;
create policy "Staff manage certificates" on certificates for all using (is_staff(auth.uid()));
drop policy if exists "Anyone can verify a certificate by exact code" on certificates;
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
drop policy if exists "Students manage their own notifications" on notifications;
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
drop policy if exists "Any authenticated user can read announcements" on announcements;
create policy "Any authenticated user can read announcements"
  on announcements for select
  using (auth.role() = 'authenticated');
drop policy if exists "Staff manage announcements" on announcements;
create policy "Staff manage announcements" on announcements for all using (is_staff(auth.uid()));

-- ============================================================================
-- STORAGE — avatar uploads (Settings page profile photo)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly viewable" on storage.objects;
create policy "Avatar images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
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
drop policy if exists "Staff manage the question bank" on questions;
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
drop policy if exists "Enrolled students can view test questions" on test_questions;
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
drop policy if exists "Staff manage test questions" on test_questions;
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
drop policy if exists "Students manage their own doubts" on doubts;
create policy "Students manage their own doubts" on doubts for all using (auth.uid() = student_id);
drop policy if exists "Staff view and update all doubts" on doubts;
create policy "Staff view and update all doubts" on doubts for all using (is_staff(auth.uid()));

create table if not exists doubt_replies (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references doubts(id) on delete cascade,
  author_id uuid not null references profiles(id),
  reply text not null,
  created_at timestamptz not null default now()
);

alter table doubt_replies enable row level security;
drop policy if exists "Participants can view replies on their own doubt" on doubt_replies;
create policy "Participants can view replies on their own doubt"
  on doubt_replies for select
  using (
    exists (select 1 from doubts where doubts.id = doubt_replies.doubt_id and doubts.student_id = auth.uid())
    or is_staff(auth.uid())
  );
drop policy if exists "Students can reply on their own doubt" on doubt_replies;
create policy "Students can reply on their own doubt"
  on doubt_replies for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from doubts where doubts.id = doubt_id and doubts.student_id = auth.uid())
  );
drop policy if exists "Staff can reply on any doubt" on doubt_replies;
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

drop policy if exists "Lesson content is publicly viewable" on storage.objects;
create policy "Lesson content is publicly viewable"
  on storage.objects for select
  using (bucket_id = 'lesson-content');

drop policy if exists "Staff can upload lesson content" on storage.objects;
create policy "Staff can upload lesson content"
  on storage.objects for insert
  with check (bucket_id = 'lesson-content' and is_staff(auth.uid()));

drop policy if exists "Staff can update lesson content" on storage.objects;
create policy "Staff can update lesson content"
  on storage.objects for update
  using (bucket_id = 'lesson-content' and is_staff(auth.uid()));

drop policy if exists "Staff can delete lesson content" on storage.objects;
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
drop policy if exists "Admins can view audit logs" on audit_logs;
create policy "Admins can view audit logs" on audit_logs for select using (is_admin(auth.uid()));
drop policy if exists "Admins can write audit logs" on audit_logs;
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
drop policy if exists "Anyone can view published courses" on admin_courses;
create policy "Anyone can view published courses" on admin_courses for select using (is_published = true);
drop policy if exists "Staff manage courses" on admin_courses;
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
drop policy if exists "Admins manage coupons" on coupons;
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
drop policy if exists "Admins manage refund requests" on refund_requests;
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
drop policy if exists "Admins manage scholarship applications" on scholarship_applications;
create policy "Admins manage scholarship applications" on scholarship_applications for all using (is_admin(auth.uid()));
-- The public /scholarship page has never required login (matching the
-- WhatsApp-based flow it was built alongside in Module 4) — this policy
-- lets an anonymous visitor submit exactly one row, write-only. They
-- can't read back applications (that stays admin-only), only create one.
drop policy if exists "Anyone can submit a scholarship application" on scholarship_applications;
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
drop policy if exists "Anyone can read CMS content" on cms_content;
create policy "Anyone can read CMS content" on cms_content for select using (true);
drop policy if exists "Staff manage CMS content" on cms_content;
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
drop policy if exists "Anyone can view published testimonials" on testimonials;
create policy "Anyone can view published testimonials" on testimonials for select using (is_published = true);
drop policy if exists "Staff manage testimonials" on testimonials;
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
drop policy if exists "Anyone can view active banners" on site_banners;
create policy "Anyone can view active banners" on site_banners for select using (is_active = true);
drop policy if exists "Staff manage banners" on site_banners;
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
drop policy if exists "Admins manage integration settings" on integration_settings;
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
drop policy if exists "Only admins can access teacher notes" on teacher_notes;
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
drop policy if exists "Applicants view their own application" on teacher_applications;
create policy "Applicants view their own application" on teacher_applications for select using (auth.uid() = applicant_id);
drop policy if exists "Applicants can submit one application" on teacher_applications;
create policy "Applicants can submit one application" on teacher_applications for insert with check (auth.uid() = applicant_id);
drop policy if exists "Admins manage all applications" on teacher_applications;
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
drop policy if exists "Users view their own login history" on login_history;
create policy "Users view their own login history" on login_history for select using (auth.uid() = user_id);
drop policy if exists "Anyone can insert their own login record" on login_history;
create policy "Anyone can insert their own login record" on login_history for insert with check (auth.uid() = user_id or user_id is null);
drop policy if exists "Admins view all login history" on login_history;
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
drop policy if exists "Users manage their own sessions" on user_sessions;
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
drop policy if exists "Users manage their own deletion request" on account_deletion_requests;
create policy "Users manage their own deletion request" on account_deletion_requests for all using (auth.uid() = user_id);
drop policy if exists "Admins view all deletion requests" on account_deletion_requests;
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
drop policy if exists "Service role only" on rate_limit_events;
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
drop policy if exists "Students manage their own AI conversations" on ai_conversations;
create policy "Students manage their own AI conversations" on ai_conversations for all using (auth.uid() = student_id);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table ai_messages enable row level security;
drop policy if exists "Students manage messages in their own conversations" on ai_messages;
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

drop policy if exists "Students can upload their own submissions" on storage.objects;
create policy "Students can upload their own submissions"
  on storage.objects for insert
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Students can view their own submissions" on storage.objects;
create policy "Students can view their own submissions"
  on storage.objects for select
  using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Staff can view all submissions" on storage.objects;
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
drop policy if exists "Anyone can view course prices" on course_prices;
create policy "Anyone can view course prices" on course_prices for select using (true);
drop policy if exists "Staff manage course prices" on course_prices;
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
drop policy if exists "Students view their own orders" on orders;
create policy "Students view their own orders" on orders for select using (auth.uid() = student_id);
drop policy if exists "Staff view all orders" on orders;
create policy "Staff view all orders" on orders for select using (is_staff(auth.uid()));
-- A student may create their own order, but only as 'pending' — the price
-- itself is always computed server-side from course_prices before this
-- insert happens (see /api/payments/checkout), so RLS here only needs to
-- stop one student from creating an order attributed to someone else.
drop policy if exists "Students can create their own pending order" on orders;
create policy "Students can create their own pending order"
  on orders for insert
  with check (auth.uid() = student_id and status = 'pending');
-- Critically, there is NO student update policy. Only staff (admin refund
-- actions) or the service-role webhook handler (which bypasses RLS
-- entirely) can ever transition an order to 'paid' — a student's browser
-- session must never be able to mark its own payment successful.
drop policy if exists "Staff can update orders" on orders;
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
alter table test_attempts drop constraint if exists test_attempts_unique_attempt;
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
-- CLASS REMINDER DELIVERY (Module 10 follow-up) — see LIVE_CLASS_MODULE_README.md
-- ============================================================================

-- Set by /api/cron/reminders once a reminder pass has run for this class,
-- so a cron firing more often than the reminder window never double-sends.
-- Nullable and unset by default — every class starts un-reminded.
alter table live_classes add column if not exists reminder_sent_at timestamptz;

-- ============================================================================
-- COURSE CATALOG MIGRATION — admin_courses becomes the single source of
-- truth for course content, closing the gap ADMIN_MODULE_README.md
-- flagged: full admin CRUD existed here with the public site still reading
-- content/courses-data.ts (now deleted from the app entirely). See
-- COURSES_MODULE_README.md for the full writeup of this pass.
-- ============================================================================

-- Full CourseDetail-shaped content, previously only in the deleted static file.
alter table admin_courses add column if not exists name_bn text;
alter table admin_courses add column if not exists tagline text;
alter table admin_courses add column if not exists icon text;
alter table admin_courses add column if not exists audience text[] not null default '{}';
-- `categories` (plural, array) supersedes the original singular `category`
-- column — a course can genuinely have more than one (e.g. Interview +
-- Career). The old `category` column is left in place, unused, rather
-- than dropped or type-converted in place — safer under repeated re-runs
-- of this file than an ALTER COLUMN TYPE would be.
alter table admin_courses add column if not exists categories text[] not null default '{}';
alter table admin_courses add column if not exists duration text;
alter table admin_courses add column if not exists format text;
alter table admin_courses add column if not exists language text;
alter table admin_courses add column if not exists schedule text;
alter table admin_courses add column if not exists overview text;
alter table admin_courses add column if not exists who_should_join text[] not null default '{}';
alter table admin_courses add column if not exists eligibility text;
alter table admin_courses add column if not exists syllabus text[] not null default '{}';
alter table admin_courses add column if not exists outcomes text[] not null default '{}';
alter table admin_courses add column if not exists weekly_practice text;
alter table admin_courses add column if not exists assignments_summary text;
alter table admin_courses add column if not exists mock_tests_summary text;
alter table admin_courses add column if not exists certificate_status text not null default 'coming-soon' check (certificate_status in ('available', 'coming-soon'));
alter table admin_courses add column if not exists is_coming_soon boolean not null default false;
alter table admin_courses add column if not exists is_featured boolean not null default false;

-- Publish/archive lifecycle. `is_published` (existing) is kept as-is for
-- anything still reading it, but `status` is now the real source of
-- truth — it adds the 'archived' state is_published alone can't express.
-- The admin publish/archive/unpublish actions set both together (see
-- lib/admin/repository.ts) so they never drift apart.
alter table admin_courses add column if not exists status text not null default 'draft' check (status in ('draft', 'published', 'archived'));
update admin_courses set status = 'published' where is_published = true and status = 'draft';

-- Public read now checks `status`, not `is_published` — status alone can
-- tell "never published" and "archived" apart, which is_published can't.
-- This is the ONLY table where "everyone" includes anonymous visitors —
-- the whole point of a course catalog is that non-enrolled visitors must
-- be able to browse and buy. Enrollment-gating applies to a course's
-- actual lesson CONTENT (lessons/live_classes/etc, already RLS-scoped to
-- enrolled students below and elsewhere in this file), never to the
-- catalog listing itself.
drop policy if exists "Anyone can view published courses" on admin_courses;
create policy "Anyone can view published courses" on admin_courses for select using (status = 'published');

-- Course catalog records (name, price, publish/archive/delete) are
-- admin-only — distinct from course CONTENT (lessons, tests, live
-- classes, etc.), which an assigned teacher manages via the policies
-- further below. A teacher can't rename, reprice, or unpublish a course
-- directly, even one they're assigned to.
drop policy if exists "Staff manage courses" on admin_courses;
drop policy if exists "Admins manage courses" on admin_courses;
create policy "Admins manage courses" on admin_courses for all using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- TEACHER COURSE ASSIGNMENTS — which teacher(s) can manage which course's
-- content. Previously any teacher/admin ("is_staff") could manage any
-- course's lessons/tests/etc; this table is what "teachers manage only
-- their own assigned courses" is actually enforced against below.
-- ---------------------------------------------------------------------------
create table if not exists teacher_course_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  course_slug text not null,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  unique (teacher_id, course_slug)
);
alter table teacher_course_assignments enable row level security;
drop policy if exists "Teachers view their own assignments" on teacher_course_assignments;
create policy "Teachers view their own assignments"
  on teacher_course_assignments for select
  using (auth.uid() = teacher_id);
drop policy if exists "Admins manage teacher assignments" on teacher_course_assignments;
create policy "Admins manage teacher assignments"
  on teacher_course_assignments for all
  using (is_admin(auth.uid()));

-- Admins always pass (same "highest privilege" pattern as is_staff/is_admin
-- elsewhere in this file); a teacher passes only if actually assigned.
create or replace function can_manage_course(uid uuid, slug text) returns boolean as $$
  select is_admin(uid) or exists (
    select 1 from teacher_course_assignments
    where teacher_id = uid and course_slug = slug
  );
$$ language sql security definer;

-- Seed: migrate every course that lived in content/courses-data.ts (the
-- prior single source of truth, now removed from the app entirely) into
-- admin_courses, published, so nothing is lost and the public site keeps
-- working the moment this file is run. This INSERT is now the only
-- remaining record of that original static content.
insert into admin_courses
  (slug, name, name_bn, tagline, icon, level, audience, categories, duration, format, language, schedule, overview, who_should_join, eligibility, syllabus, outcomes, weekly_practice, assignments_summary, mock_tests_summary, certificate_status, is_coming_soon, is_featured, is_free, status)
values
('spoken-english-master-course', 'Spoken English Master Course', 'স্পোকেন ইংলিশ মাস্টার কোর্স', 'Our flagship path from first sentence to fluent conversation.', '🗣️', 'All Levels', '{"Students","College","Professionals"}', '{"Speaking"}', 'Basic (6 months) → Intermediate (1 year) → Advanced (2 years)', 'Live', 'Bilingual — Bengali & English', 'Batches run through the week; timing confirmed at enrollment to suit your time zone.', 'Our most complete spoken English journey — three connected levels that take you from basic sentence-building to fluent, confident conversation, all taught with our bilingual, speaking-first method.', '{"Anyone starting from scratch who wants a complete, structured path","Students who''ve studied English for years but still can''t speak it","Professionals who want fluency, not just exam grammar"}', 'No prior spoken English proficiency required — placement is honest and judgment-free.', '{"Foundational grammar and sentence construction","Daily guided speaking practice","Vocabulary building by real-life theme","Conversation and real-world scenario practice"}', '{"Speak in complete, grammatically sound sentences","Hold an everyday conversation without freezing","Read and understand general English confidently","A foundation strong enough to build any specialization on top of"}', 'Structured speaking and grammar exercises assigned every week.', 'Checked, purposeful assignments tied directly to that week''s lesson.', 'Regular practice evaluations to catch gaps early.', 'coming-soon', false, true, false, 'published'),
('complete-english-grammar-mastery', 'Complete English Grammar Mastery', 'সম্পূর্ণ ইংলিশ গ্রামার মাস্টারি', 'Every grammar rule, explained bilingually, drilled through real examples.', '📖', 'All Levels', '{"Students","College"}', '{"Grammar"}', 'Self-paced core syllabus + live sessions', 'Hybrid', 'Bilingual — Bengali & English', 'Live doubt-solving sessions weekly; core material available anytime.', 'A structured, rule-by-rule journey through English grammar — from tenses to complex sentence structure — explained in Bengali first, then anchored firmly in English.', '{"Students who know grammar rules but still make the same mistakes","Anyone preparing for board or competitive exams","Learners who were only ever taught grammar in English and stayed confused"}', 'Open to all levels — the syllabus is sequenced from foundational to advanced.', '{"Tenses, taught in the order they''re actually used in speech","Sentence structure, clauses, and common error patterns","A running \"common mistakes Bengali speakers make\" correction log","Applied grammar — using rules in real writing and speech, not just worksheets"}', '{"Stop translating grammar rules and start using them naturally","Recognize and self-correct the most common Bengali-English error patterns","Write and speak with structural confidence"}', 'Themed grammar drills released weekly.', 'Written exercises reviewed with corrective feedback.', 'Regular practice tests across every grammar topic covered.', 'coming-soon', false, false, false, 'published'),
('vocabulary-builder', 'Vocabulary Builder', 'ভোকাবুলারি বিল্ডার', 'Themed word lists and spaced repetition — words you''ll actually use.', '🔤', 'All Levels', '{"Students","College","Professionals"}', '{"Vocabulary"}', 'Self-paced with weekly practice sets', 'Hybrid', 'Bilingual — Bengali & English', 'New themed word sets released weekly.', 'Vocabulary organized by real-life theme — travel, interviews, workplace, exams — with every word anchored in a full example sentence instead of an isolated list to memorize and forget.', '{"Anyone whose vocabulary feels smaller than their actual thinking","Students preparing for exams with a vocabulary component","Professionals who want sharper, more precise everyday English"}', 'Open to all levels.', '{"Theme-based word sets (not alphabetical lists)","Every word taught inside a full example sentence","Planned spaced-repetition review for long-term retention","Bilingual meaning and English usage shown side by side"}', '{"A working vocabulary organized around real situations, not random lists","Words that stick because you''ve seen them used, not just defined","Faster, more precise expression in both speech and writing"}', 'Themed word sets with usage exercises.', 'Sentence-writing tasks using newly learned words.', 'Periodic vocabulary recall checks.', 'coming-soon', false, false, false, 'published'),
('pronunciation-accent-training', 'Pronunciation & Accent Training', 'প্রোনানসিয়েশন ও অ্যাকসেন্ট ট্রেনিং', 'Focused correction of the sounds Bengali speakers find hardest.', '🎙️', 'Intermediate', '{"Students","Professionals","Job Seekers"}', '{"Speaking"}', 'Short-course intensive', 'Live', 'Bilingual — Bengali & English', 'Live practice sessions, confirmed at enrollment.', 'Focused, judgment-free training on the specific sound patterns that make Bengali-accented English hard to follow for others — so you''re understood clearly, without needing to erase your identity.', '{"Anyone who''s been asked to \"repeat that\" one too many times","Job seekers preparing for interviews or client-facing roles","Students who want clearer, more confident spoken delivery"}', 'Basic conversational English recommended before joining.', '{"Listen-and-repeat drills targeting real Bengali-to-English sound gaps","Stress, rhythm, and intonation patterns in natural speech","Clarity-focused correction — not accent elimination","Practice built into real conversation scenarios"}', '{"Clearer, more easily understood spoken English","Confidence speaking without over-monitoring every word","Awareness of your own common pronunciation patterns and how to adjust them"}', 'Guided listen-and-repeat drills.', 'Recorded practice with teacher feedback.', 'Periodic clarity and comprehension checks.', 'coming-soon', false, false, false, 'published'),
('spoken-english-for-beginners', 'Spoken English for Beginners', 'বিগিনারদের জন্য স্পোকেন ইংলিশ', 'Your very first steps — no prior knowledge assumed, ever.', '🌱', 'Beginner', '{"Students","Children"}', '{"Speaking"}', '6 months', 'Live', 'Bilingual — Bengali & English', 'Batches run through the week; timing confirmed at enrollment.', 'Built for absolute beginners — starting from simple words and sentences, with every explanation grounded in Bengali so nothing feels overwhelming.', '{"Anyone who has never really spoken English before","Students who feel \"behind\" and want to start fresh, without shame","Parents choosing a first English program for an older child or teen"}', 'None — this is specifically designed for a true beginner.', '{"Basic sentence construction and everyday vocabulary","Simple, guided speaking practice from lesson one","Foundational grammar, explained bilingually","Confidence-building through low-pressure repetition"}', '{"Comfort speaking simple, correct English sentences","A foundation ready for the Intermediate level","Real confidence, not just theoretical knowledge"}', 'Simple guided speaking exercises.', 'Light, confidence-building practice tasks.', 'Gentle, low-pressure progress checks.', 'coming-soon', false, false, false, 'published'),
('advanced-spoken-english', 'Advanced Spoken English', 'অ্যাডভান্সড স্পোকেন ইংলিশ', 'Master English completely. Speak fluently, think in English.', '🚀', 'Advanced', '{"College","Professionals","Job Seekers"}', '{"Speaking"}', '2 years', 'Live', 'Bilingual instruction, English-majority practice', 'Batches run through the week; timing confirmed at enrollment.', 'For learners who already speak reasonably well and want to go further — nuanced expression, complex conversation, and the shift from translating to truly thinking in English.', '{"Learners who''ve completed our Basic and Intermediate levels","Confident speakers who want polish, nuance, and range","Professionals preparing for senior, English-heavy roles"}', 'Intermediate-level spoken comfort recommended.', '{"Advanced conversation and debate practice","Nuanced vocabulary and idiomatic expression","Public speaking and presentation skills","Personality development alongside language skill"}', '{"Genuine fluency — thinking in English, not translating","Confidence in high-stakes conversations and presentations","Career-ready communication skills"}', 'Advanced conversation and debate sessions.', 'Presentation and structured-argument tasks.', 'Comprehensive fluency evaluations.', 'coming-soon', false, false, false, 'published'),
('interview-english', 'Interview English', 'ইন্টারভিউ ইংলিশ', 'Speak with confidence in any interview, anywhere.', '💼', 'Intermediate', '{"College","Job Seekers"}', '{"Interview","Career"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, confirmed at enrollment.', 'Focused preparation for the moment that matters most — the interview. Real questions, professional phrasing, and live mock-interview practice.', '{"Job seekers with an interview coming up","Final-year college students entering the job market","Anyone who freezes under interview pressure, regardless of actual ability"}', 'Basic conversational English recommended.', '{"Common interview questions and confident answer structures","Professional phrasing and tone","Body language and delivery alongside language","Live, recorded mock interview practice with feedback"}', '{"A confident, structured approach to any interview question","Reduced anxiety through repeated real practice","Professional communication that reflects your actual ability"}', 'Mock interview drills.', 'Self-introduction and answer-structuring exercises.', 'Full live mock interviews with feedback.', 'coming-soon', false, false, false, 'published'),
('hotel-hospitality-english', 'Hotel & Hospitality English', 'হোটেল ও হসপিটালিটি ইংলিশ', 'Workplace English for hospitality and service careers.', '🏨', 'Intermediate', '{"Professionals","Job Seekers"}', '{"Career"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, confirmed at enrollment.', 'Practical English for hotel, restaurant, and guest-service roles — guest conversation, phone etiquette, and the vocabulary this specific industry actually uses.', '{"Hospitality and service-industry job seekers","Current hospitality staff wanting stronger guest communication","Anyone pursuing hospitality careers abroad"}', 'Basic conversational English recommended.', '{"Guest-facing conversation scenarios","Phone and email etiquette for hospitality settings","Industry-specific vocabulary and phrasing","Handling complaints and requests professionally"}', '{"Confident, professional guest communication","Industry-relevant vocabulary ready for real shifts","Stronger prospects for hospitality roles, including abroad"}', 'Guest-scenario role-play exercises.', 'Written guest-communication tasks (emails, messages).', 'Scenario-based practice evaluations.', 'coming-soon', false, false, false, 'published'),
('corporate-english', 'Corporate English', 'কর্পোরেট ইংলিশ', 'Professional communication for the modern workplace.', '🏢', 'Advanced', '{"Professionals"}', '{"Career"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, confirmed at enrollment.', 'Email writing, meeting participation, presentations, and everyday workplace conversation — English built for the corporate environment specifically.', '{"Working professionals in English-heavy corporate roles","Anyone preparing for a promotion or client-facing responsibilities","Teams wanting sharper, more confident workplace communication"}', 'Intermediate spoken and written English recommended.', '{"Professional email and report writing","Meeting participation and presentation skills","Everyday workplace conversation and small talk","Cross-cultural communication awareness"}', '{"Confident participation in meetings and presentations","Clear, professional written communication","Communication that supports career advancement"}', 'Workplace-scenario writing and speaking tasks.', 'Real-format email and report exercises.', 'Presentation and communication evaluations.', 'coming-soon', false, false, false, 'published'),
('business-english', 'Business English', 'বিজনেস ইংলিশ', 'Negotiate, network, and communicate like a business professional.', '📊', 'Advanced', '{"Professionals"}', '{"Career"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, confirmed at enrollment.', 'Beyond day-to-day workplace English — negotiation, networking, client relationships, and the language of business itself.', '{"Business owners and entrepreneurs communicating with English-speaking clients","Professionals in sales, business development, or client relations","Anyone building an international business network"}', 'Intermediate-to-advanced English recommended.', '{"Negotiation and persuasive communication","Networking and relationship-building conversation","Business writing — proposals, pitches, client communication","Presenting ideas and numbers with confidence"}', '{"Confidence in high-stakes business conversations","Stronger client and partner relationships through clearer communication","Professional presence in English-speaking business contexts"}', 'Negotiation and pitch-practice exercises.', 'Business writing tasks (proposals, client emails).', 'Simulated negotiation and pitch evaluations.', 'coming-soon', false, false, false, 'published'),
('ielts-preparation', 'IELTS Preparation', 'আইইএলটিএস প্রস্তুতি', 'Coming soon — structured preparation for the IELTS exam.', '📄', 'Advanced', '{"Students","College","Job Seekers"}', '{"School","Career"}', 'To be announced', 'Live', 'Bilingual instruction, English-majority practice', 'To be announced.', 'A dedicated IELTS preparation track is in planning. This page will be updated with full syllabus and schedule details once the program launches.', '{"Students and professionals planning to study or work abroad","Anyone needing a certified English proficiency score"}', 'To be announced.', '{"Full syllabus to be announced when this program launches."}', '{"To be announced."}', 'To be announced.', 'To be announced.', 'To be announced.', 'coming-soon', true, false, false, 'published'),
('pte-preparation', 'PTE Preparation', 'পিটিই প্রস্তুতি', 'Coming soon — structured preparation for the PTE Academic exam.', '🖥️', 'Advanced', '{"Students","College","Job Seekers"}', '{"School","Career"}', 'To be announced', 'Live', 'Bilingual instruction, English-majority practice', 'To be announced.', 'A dedicated PTE Academic preparation track is in planning. This page will be updated with full syllabus and schedule details once the program launches.', '{"Students and professionals planning to study or migrate abroad","Anyone needing a computer-based English proficiency score"}', 'To be announced.', '{"Full syllabus to be announced when this program launches."}', '{"To be announced."}', 'To be announced.', 'To be announced.', 'To be announced.', 'coming-soon', true, false, false, 'published'),
('oet-preparation', 'OET Preparation', 'ওইটি প্রস্তুতি', 'Coming soon — English preparation for healthcare professionals.', '🩺', 'Advanced', '{"Professionals","Job Seekers"}', '{"Career"}', 'To be announced', 'Live', 'Bilingual instruction, English-majority practice', 'To be announced.', 'A dedicated OET track for nurses, doctors, and other healthcare professionals is in planning. This page will be updated once the program launches.', '{"Healthcare professionals seeking OET certification to work abroad"}', 'To be announced.', '{"Full syllabus to be announced when this program launches."}', '{"To be announced."}', 'To be announced.', 'To be announced.', 'To be announced.', 'coming-soon', true, false, false, 'published'),
('madhyamik-english', 'Madhyamik English', 'মাধ্যমিক ইংলিশ', '100% free board-exam English mastery for Class 10 students.', '🎓', 'Intermediate', '{"Children","Students"}', '{"School","Grammar"}', 'Aligned to the board exam schedule', 'Live', 'Bilingual — Bengali & English', 'Batches run through the week; timing confirmed at enrollment.', 'A complete, 100% free English program built specifically for Madhyamik (Class 10) students — grammar, writing, and exam strategy, taught with genuine care.', '{"Every Madhyamik (Class 10) student — regardless of financial background"}', 'Currently enrolled in, or preparing for, the Madhyamik (Class 10) board exam.', '{"Complete grammar syllabus, A to Z","Seen and unseen passage practice","Board-pattern writing practice","Exam strategy and time management"}', '{"Strong, confident board-exam English performance","Real grammar understanding, not just memorized answers","A foundation that carries into Higher Secondary and beyond"}', 'Board-pattern practice sets released weekly.', 'Checked writing and grammar assignments.', 'Regular board-pattern test practice.', 'coming-soon', false, true, true, 'published'),
('hs-english', 'HS English', 'উচ্চ মাধ্যমিক ইংলিশ', 'Higher Secondary English, built for real exam confidence.', '📚', 'Intermediate', '{"Students","College"}', '{"School","Grammar"}', 'Aligned to the board exam schedule', 'Live', 'Bilingual — Bengali & English', 'Batches run through the week; timing confirmed at enrollment.', 'Structured English preparation for Higher Secondary (Class 11–12) students — building on Madhyamik-level grammar toward more advanced comprehension and writing.', '{"Higher Secondary (Class 11–12) students preparing for board exams"}', 'Currently enrolled in Higher Secondary studies.', '{"Advanced grammar and comprehension","Essay and formal writing practice","Seen and unseen passage analysis","Board-pattern exam strategy"}', '{"Confident, exam-ready English skills","Stronger writing and comprehension for higher studies ahead","A bridge between board English and real-world fluency"}', 'Board-pattern comprehension and writing sets.', 'Essay and formal-writing assignments.', 'Regular board-pattern test practice.', 'coming-soon', false, false, false, 'published'),
('english-for-competitive-exams', 'English for Competitive Exams', 'প্রতিযোগিতামূলক পরীক্ষার ইংলিশ', 'English preparation for government and competitive entrance exams.', '🏆', 'Advanced', '{"Students","Job Seekers"}', '{"School","Career"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, confirmed at enrollment.', 'Focused English preparation for the kind of competitive and government exams many Bengali-speaking students take — comprehension, grammar accuracy, and vocabulary under time pressure.', '{"Students and job seekers preparing for competitive or government exams"}', 'Intermediate English level recommended.', '{"Grammar accuracy under exam conditions","Comprehension and vocabulary-in-context practice","Time-management strategy for English sections","Common competitive-exam question patterns"}', '{"Faster, more accurate performance on English sections","Reduced exam-day anxiety through repeated practice","A vocabulary and grammar base built for test conditions"}', 'Timed practice sets.', 'Exam-format grammar and comprehension exercises.', 'Timed mock sections mirroring real exam conditions.', 'coming-soon', false, false, false, 'published'),
('kids-english', 'Kids English', 'কিডস ইংলিশ', 'A joyful, confidence-first introduction to English for children.', '🧒', 'Beginner', '{"Children"}', '{"Speaking","Vocabulary"}', '6 months', 'Live', 'Bilingual — Bengali & English', 'Batches run through the week; timing confirmed at enrollment.', 'A gentle, game-based introduction to English for children — built around stories, play, and encouragement rather than pressure or memorization.', '{"Children beginning their English learning journey"}', 'Designed for young learners; exact age guidance shared at enrollment.', '{"Basic vocabulary through stories and games","Simple, encouraged speaking practice","Foundational reading readiness","Confidence and curiosity-building activities"}', '{"Comfort and curiosity around speaking English","A joyful early foundation, not fear of the subject","Readiness for more structured English learning ahead"}', 'Playful, story-based practice activities.', 'Light, engagement-focused home activities.', 'Gentle, encouragement-focused progress checks.', 'coming-soon', false, false, false, 'published'),
('english-for-homemakers', 'English for Homemakers', 'গৃহিণীদের জন্য ইংলিশ', 'Practical, everyday English — on a schedule that respects your day.', '🏡', 'Beginner', '{"Students"}', '{"Speaking"}', '6 months', 'Live', 'Bilingual — Bengali & English', 'Flexible batch timing designed around a homemaker''s daily schedule.', 'Practical, everyday spoken English — for conversations with children''s schools, doctors, shopping, travel, and simply feeling confident in English-speaking spaces.', '{"Homemakers who want practical English for daily life, at a comfortable pace"}', 'None — designed to start from wherever you are.', '{"Everyday conversation — home, school, market, travel","Practical vocabulary for common daily situations","Confidence-building speaking practice","Basic grammar, explained simply and bilingually"}', '{"Comfort speaking English in everyday situations","Confidence in settings like children''s schools or clinics","A foundation you can keep building on, at your own pace"}', 'Everyday-scenario speaking practice.', 'Light, practical conversation tasks.', 'Gentle, encouraging progress checks.', 'coming-soon', false, false, false, 'published'),
('english-for-working-professionals', 'English for Working Professionals', 'কর্মজীবীদের জন্য ইংলিশ', 'Fit fluency into a working schedule — practical, career-focused English.', '💻', 'Intermediate', '{"Professionals"}', '{"Career"}', '1 year', 'Live', 'Bilingual instruction, English-majority practice', 'Evening and weekend batches designed around working hours.', 'Built for professionals balancing a full-time job — practical spoken and written English for the workplace, at a pace and schedule that respects your time.', '{"Working professionals who want fluency without disrupting their job"}', 'Basic English comprehension recommended.', '{"Workplace conversation and everyday professional English","Email and message writing","Meeting and small-talk confidence","Practical grammar review"}', '{"Confident everyday workplace communication","Improved written professional English","Fluency progress that fits around a full-time job"}', 'Workplace-scenario practice, scheduled around working hours.', 'Practical writing and speaking tasks.', 'Periodic progress evaluations.', 'coming-soon', false, false, false, 'published'),
('english-for-international-job-seekers', 'English for International Job Seekers', 'আন্তর্জাতিক চাকরিপ্রার্থীদের জন্য ইংলিশ', 'Career-ready English for Bengali speakers job-hunting abroad.', '🌍', 'Advanced', '{"Job Seekers","Professionals"}', '{"Career","Interview"}', 'Short-course intensive', 'Live', 'Bilingual instruction, English-majority practice', 'Live sessions, timed to work across time zones.', 'Focused English preparation for Bengali speakers pursuing jobs abroad — resumes, interviews, workplace communication, and the confidence to compete internationally.', '{"Job seekers applying for roles in the Middle East, Europe, North America, or elsewhere abroad","Professionals preparing for international recruitment processes"}', 'Intermediate spoken English recommended.', '{"Resume and cover letter English","International interview practice","Workplace communication across cultures","Confidence for video and phone interviews"}', '{"Application materials that read professionally","Interview confidence for international recruiters","Communication skills built for a global workplace"}', 'International interview and application practice.', 'Resume, cover letter, and self-introduction tasks.', 'Full mock international interview sessions.', 'coming-soon', false, false, false, 'published')
on conflict (slug) do update set
  name = excluded.name,
  name_bn = excluded.name_bn,
  tagline = excluded.tagline,
  icon = excluded.icon,
  level = excluded.level,
  audience = excluded.audience,
  categories = excluded.categories,
  duration = excluded.duration,
  format = excluded.format,
  language = excluded.language,
  schedule = excluded.schedule,
  overview = excluded.overview,
  who_should_join = excluded.who_should_join,
  eligibility = excluded.eligibility,
  syllabus = excluded.syllabus,
  outcomes = excluded.outcomes,
  weekly_practice = excluded.weekly_practice,
  assignments_summary = excluded.assignments_summary,
  mock_tests_summary = excluded.mock_tests_summary,
  certificate_status = excluded.certificate_status,
  is_coming_soon = excluded.is_coming_soon,
  is_featured = excluded.is_featured,
  is_free = excluded.is_free,
  updated_at = now();

-- Backfill: assign every existing teacher to every existing course. This
-- preserves exactly today's behavior (any teacher/admin could touch any
-- course's content under the old is_staff-only policies) so flipping the
-- policies below to assignment-based access doesn't lock a real,
-- currently-working teacher out of courses they already teach the moment
-- this migration runs. Admins narrow these down to real assignments
-- afterward via /admin/courses — this is a safe starting point, not the
-- intended long-term assignment state.
insert into teacher_course_assignments (teacher_id, course_slug)
select p.id, c.slug
from profiles p
cross join admin_courses c
where p.role = 'teacher'
on conflict (teacher_id, course_slug) do nothing;

-- Course-scoped content tables: "any staff" tightened to "admin, or the
-- specifically assigned teacher." Each drop+recreate targets the exact
-- policy that previously used is_staff(auth.uid()) alone for this table.
drop policy if exists "Staff manage lessons" on lessons;
create policy "Staff manage lessons" on lessons for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff manage assignments" on assignments;
create policy "Staff manage assignments" on assignments for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff manage all submissions" on submissions;
create policy "Staff manage all submissions" on submissions for all using (
  exists (select 1 from assignments a where a.id = submissions.assignment_id and can_manage_course(auth.uid(), a.course_slug))
);

drop policy if exists "Staff manage tests" on tests;
create policy "Staff manage tests" on tests for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff manage test questions" on test_questions;
create policy "Staff manage test questions" on test_questions for all using (
  exists (select 1 from tests t where t.id = test_questions.test_id and can_manage_course(auth.uid(), t.course_slug))
);

drop policy if exists "Staff manage live classes" on live_classes;
create policy "Staff manage live classes" on live_classes for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff manage attendance" on attendance;
create policy "Staff manage attendance" on attendance for all using (
  exists (select 1 from live_classes lc where lc.id = attendance.live_class_id and can_manage_course(auth.uid(), lc.course_slug))
);

drop policy if exists "Staff manage certificates" on certificates;
create policy "Staff manage certificates" on certificates for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff manage the question bank" on questions;
create policy "Staff manage the question bank" on questions for all using (can_manage_course(auth.uid(), course_slug));

drop policy if exists "Staff view and update all doubts" on doubts;
create policy "Staff view and update all doubts" on doubts for all using (can_manage_course(auth.uid(), course_slug));

-- Deliberately left broader (any staff, not assignment-scoped):
-- doubt_replies ("Staff can reply on any doubt") — cross-course help on a
-- student's question is reasonable collaboration, not a content-ownership
-- action; and announcements ("Staff manage announcements"), since an
-- announcement's course_slug is nullable (audience can be sitewide),
-- which doesn't map onto a single course assignment. test_attempts'
-- staff-visibility policy is also left as-is (view-only; the actual score
-- write path is separately protected by protect_test_attempt_score()).

-- ============================================================================
-- WEBSITE CMS, PHASE 1 — CORE CONTENT (see WEBSITE_CMS_README.md)
-- Site-wide settings, homepage hero copy, FAQ, and the photo gallery move
-- from hardcoded files (content/site-data.ts, content/about-data.ts) into
-- real, admin-editable tables. cms_content (Module 7) already existed for
-- exactly this purpose — homepage hero copy uses it as designed. Fixed,
-- site-wide fields (name, contact info, social links) get their own
-- singleton table instead, since they're scalar, not a growing list.
-- ============================================================================

-- Singleton: `id integer primary key default 1 check (id = 1)` is the
-- standard Postgres pattern for "exactly one row, always" — every write is
-- an update against id=1, never an insert of a second row.
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  academy_name text not null default 'Hidayet English Academy',
  tagline_en text,
  tagline_bn text,
  sub_tagline text,
  footer_tagline text,
  phone text,
  phone_display text,
  whatsapp_number text,
  email text,
  address text,
  logo_url text,
  facebook_url text,
  youtube_url text,
  instagram_url text,
  google_map_url text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);
alter table site_settings enable row level security;
-- Public site info — every visitor's browser needs this to render the
-- header/footer, logged in or not.
drop policy if exists "Anyone can read site settings" on site_settings;
create policy "Anyone can read site settings" on site_settings for select using (true);
drop policy if exists "Staff manage site settings" on site_settings;
create policy "Staff manage site settings" on site_settings for all using (is_staff(auth.uid()));

insert into site_settings (id, academy_name, tagline_en, tagline_bn, sub_tagline, footer_tagline, phone, phone_display, whatsapp_number, email, address, logo_url, facebook_url, youtube_url, instagram_url)
values (1, 'Hidayet English Academy', 'Learn English, Build Your Future', 'ইংরেজি শিখুন, গড়ুন আপনার ভবিষ্যৎ', 'English Learning for Bengali Speakers Worldwide', 'Learn Today, Lead Tomorrow', '6290056461', '+91 62900 56461', '916290056461', 'hidayetenglishacademy@gmail.com', null, '/images/hea-logo.png', 'https://facebook.com/hidayetenglishacademy', 'https://youtube.com/@hidayetenglishacademy', 'https://instagram.com/hidayetenglishacademy')
on conflict (id) do nothing;

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null unique,
  answer text not null,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table faqs enable row level security;
drop policy if exists "Anyone can read published FAQs" on faqs;
create policy "Anyone can read published FAQs" on faqs for select using (is_published = true);
drop policy if exists "Staff manage FAQs" on faqs;
create policy "Staff manage FAQs" on faqs for all using (is_staff(auth.uid()));

insert into faqs (question, answer, order_index) values
('Do you teach students outside India and Bangladesh?', 'Yes. HEA teaches Bengali-speaking learners everywhere online — including the Middle East, Europe, North America, Southeast Asia, and Australia. All you need is an internet connection; class timings are arranged to work across time zones.', 0),
('Is the Madhyamik English Program really 100% free?', 'Yes. The complete English program for Class 10 (Madhyamik) students is 100% free, with no admission fee and no hidden charges.', 1),
('What is the medium of instruction?', 'Classes are taught bilingually — grammar rules and difficult concepts are explained in Bengali, with practice conducted in English so you build real speaking confidence.', 2),
('How long are the Basic, Intermediate, and Advanced courses?', 'Basic is 6 months, Intermediate is 1 year, and Advanced is 2 years — each building on the last, from foundational grammar to complete fluency.', 3),
('Are classes live or recorded?', 'Classes are live and interactive, with regular practice sessions, doubt-solving, and personal feedback from your teacher.', 4),
('How do I join the WhatsApp community?', 'Scan the QR code on our promotional materials or tap "Join WhatsApp Group" on this site to connect directly with the academy for updates and support.', 5),
('How do I enroll?', 'Tap "Join Free Class," fill in your details, or simply message us on WhatsApp — our team will guide you through enrollment.', 6)
on conflict (question) do nothing;

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null unique,
  alt_text text not null default '',
  caption text,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table gallery_images enable row level security;
drop policy if exists "Anyone can view published gallery images" on gallery_images;
create policy "Anyone can view published gallery images" on gallery_images for select using (is_published = true);
drop policy if exists "Staff manage gallery images" on gallery_images;
create policy "Staff manage gallery images" on gallery_images for all using (is_staff(auth.uid()));

insert into gallery_images (image_url, alt_text, caption, order_index) values
('/images/hea-logo.png', 'The Hidayet English Academy crest', 'Our Emblem', 0),
('/images/founder-hidayet-sir.jpg', 'Hidayet Sir, Founder of Hidayet English Academy', 'Hidayet Sir, Founder', 1),
('/images/resource-present-perfect.jpg', 'A sample bilingual grammar lesson', 'Our Grammar Teaching Style', 2),
('/images/gallery/gallery-teaching-techniques.jpg', 'HEA''s modern child-learning teaching techniques', 'Our Teaching Techniques', 3),
('/images/gallery/gallery-free-classes-campaign.jpg', 'Join Free English Classes campaign', 'Free Classes Campaign', 4),
('/images/gallery/gallery-brochure.jpg', 'Hidayet English Academy brochure', 'Our Brochure', 5)
on conflict (image_url) do nothing;

-- ---------------------------------------------------------------------------
-- STORAGE — general site-content images (hero backgrounds, gallery photos,
-- future CMS-managed images). Public read (it's marketing imagery),
-- staff-only write — same pattern as the lesson-content bucket.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-content', 'site-content', true)
on conflict (id) do nothing;

drop policy if exists "Site content images are publicly viewable" on storage.objects;
create policy "Site content images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'site-content');

drop policy if exists "Staff can upload site content images" on storage.objects;
create policy "Staff can upload site content images"
  on storage.objects for insert
  with check (bucket_id = 'site-content' and is_staff(auth.uid()));

drop policy if exists "Staff can update site content images" on storage.objects;
create policy "Staff can update site content images"
  on storage.objects for update
  using (bucket_id = 'site-content' and is_staff(auth.uid()));

drop policy if exists "Staff can delete site content images" on storage.objects;
create policy "Staff can delete site content images"
  on storage.objects for delete
  using (bucket_id = 'site-content' and is_staff(auth.uid()));

-- ============================================================================
-- End of schema. See COURSES_MODULE_README.md, LMS_MODULE_README.md,
-- TEACHER_MODULE_README.md, ADMIN_MODULE_README.md, AUTH_MODULE_README.md,
-- AI_LESSON_PLAYER_README.md, PAYMENTS_MODULE_README.md,
-- LIVE_CLASS_MODULE_README.md, ASSESSMENT_MODULE_README.md, and
-- WEBSITE_CMS_README.md for how the app layer talks to these tables.
-- ============================================================================
