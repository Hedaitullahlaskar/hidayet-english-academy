"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/client";
import { certificateIssuedEmail } from "@/lib/email/templates";
import { tryAutoGenerateLink } from "@/lib/liveclass/router";

/**
 * TEACHER REPOSITORY — same seam pattern as lib/dashboard/repository.ts,
 * but this one has real WRITE operations too, since the entire point of
 * this module is letting a teacher manage the academy without touching the
 * database directly. Reads use the same safeQuery-to-empty-state pattern;
 * writes deliberately do NOT swallow errors — a teacher needs to know if
 * uploading a lesson or grading a submission actually worked.
 */

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export interface MutationResult {
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Profile & overview
// ---------------------------------------------------------------------------

export async function getCurrentTeacherProfile() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  }, null);
}

export async function getAllStudents() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getStudentById(id: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    return data;
  }, null);
}

export async function getStudentEnrollments(studentId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("enrollments").select("*").eq("student_id", studentId);
    return data ?? [];
  }, []);
}

export async function getStudentSubmissions(studentId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("submissions").select("*, assignments(title)").eq("student_id", studentId);
    return data ?? [];
  }, []);
}

export async function getStudentAttendance(studentId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("attendance").select("*, live_classes(title, scheduled_at)").eq("student_id", studentId);
    return data ?? [];
  }, []);
}

export async function getTodaysLiveClasses() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getPendingSubmissionsCount() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { count } = await supabase.from("submissions").select("*", { count: "exact", head: true }).is("score", null);
    return count ?? 0;
  }, 0);
}

export async function getPendingAssessmentsBreakdown() {
  return safeQuery(
    async () => {
      const supabase = createServerSupabaseClient();
      const [{ data: ungradedSubmissions }, { data: ungradedAttempts }] = await Promise.all([
        supabase.from("submissions").select("id, assignments(title)").is("score", null),
        supabase.from("test_attempts").select("id, tests(title)").is("score", null).not("submitted_at", "is", null),
      ]);
      return {
        assignments: (ungradedSubmissions ?? []).map((s: { id: string; assignments: { title: string } | null }) => ({
          id: s.id,
          label: s.assignments?.title ?? "Assignment",
        })),
        tests: (ungradedAttempts ?? []).map((a: { id: string; tests: { title: string } | null }) => ({
          id: a.id,
          label: a.tests?.title ?? "Test",
        })),
      };
    },
    { assignments: [], tests: [] }
  );
}

export async function getCompletedReviewsCount() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { count } = await supabase.from("submissions").select("*", { count: "exact", head: true }).not("score", "is", null);
    return count ?? 0;
  }, 0);
}

export async function getOpenDoubtsCount() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { count } = await supabase.from("doubts").select("*", { count: "exact", head: true }).eq("status", "open");
    return count ?? 0;
  }, 0);
}

// ---------------------------------------------------------------------------
// Live classes
// ---------------------------------------------------------------------------

export async function getAllLiveClasses() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("live_classes").select("*").order("scheduled_at", { ascending: true });
    return data ?? [];
  }, []);
}

export async function createLiveClass(input: {
  course_slug: string;
  title: string;
  platform: "google_meet" | "zoom";
  meeting_url: string;
  scheduled_at: string;
  duration_minutes: number;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();

  // Real auto-generation when the platform is configured — falls back
  // honestly to whatever was typed into the meeting_url field otherwise,
  // rather than blocking scheduling on a missing integration.
  const autoLink = await tryAutoGenerateLink(input.platform, input.title, input.scheduled_at, input.duration_minutes);

  const { error } = await supabase.from("live_classes").insert({
    ...input,
    meeting_url: autoLink?.meetingUrl ?? input.meeting_url,
    meeting_id: autoLink?.meetingId ?? null,
    auto_generated: Boolean(autoLink),
  });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getEnrolledStudentsForClass(liveClassId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data: liveClass } = await supabase.from("live_classes").select("course_slug").eq("id", liveClassId).single();
    if (!liveClass) return [];

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("student_id, profiles(id, full_name, avatar_url)")
      .eq("course_slug", liveClass.course_slug)
      .eq("status", "active");

    const { data: existingAttendance } = await supabase.from("attendance").select("student_id, status").eq("live_class_id", liveClassId);
    const attendanceMap = new Map((existingAttendance ?? []).map((a: { student_id: string; status: string }) => [a.student_id, a.status]));

    return (enrollments ?? []).map((e: { student_id: string; profiles: { id: string; full_name: string; avatar_url: string | null } | null }) => ({
      studentId: e.student_id,
      fullName: e.profiles?.full_name ?? "Student",
      avatarUrl: e.profiles?.avatar_url ?? null,
      currentStatus: attendanceMap.get(e.student_id) ?? null,
    }));
  }, []);
}

export async function markAttendance(liveClassId: string, studentId: string, status: "present" | "absent" | "excused"): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("attendance")
    .upsert(
      { live_class_id: liveClassId, student_id: studentId, status, marked_at: new Date().toISOString() },
      { onConflict: "live_class_id,student_id" }
    );
  return error ? { success: false, error: error.message } : { success: true };
}

export async function attachRecording(liveClassId: string, recordingUrl: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("live_classes").update({ recording_url: recordingUrl, status: "completed" }).eq("id", liveClassId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Lessons (video / PDF / audio upload)
// ---------------------------------------------------------------------------

export async function getLessonsByCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("lessons").select("*").eq("course_slug", courseSlug).order("order_index");
    return data ?? [];
  }, []);
}

export async function createLesson(input: {
  course_slug: string;
  module_title: string;
  title: string;
  lesson_type: "video" | "pdf" | "audio";
  content_url: string;
  duration_seconds?: number;
  order_index?: number;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("lessons").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Homework: assignments + submissions
// ---------------------------------------------------------------------------

export async function getAllAssignments() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("assignments").select("*").order("due_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function createAssignment(input: {
  course_slug: string;
  title: string;
  description: string;
  due_at: string;
  max_score: number;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("assignments").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

/**
 * The `submissions` Storage bucket is private (Module 9) — a plain public
 * URL won't work. This generates a short-lived signed URL server-side.
 */
export async function getSubmissionFileUrl(filePath: string): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.storage.from("submissions").createSignedUrl(filePath, 300); // 5 minutes
  return data?.signedUrl ?? null;
}

export async function getSubmissionsForAssignment(assignmentId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("submissions")
      .select("*, profiles(full_name)")
      .eq("assignment_id", assignmentId);
    return data ?? [];
  }, []);
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string
): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: submission, error } = await supabase
    .from("submissions")
    .update({ score, feedback, graded_at: new Date().toISOString() })
    .eq("id", submissionId)
    .select("student_id, assignment_id, assignments(title)")
    .single();

  if (!error && submission) {
    // Real "result published" notification — not just a data update the
    // student has to happen to notice on their own.
    await supabase.from("notifications").insert({
      student_id: submission.student_id,
      title: "Assignment Graded",
      body: `Your submission for "${submission.assignments?.title ?? "an assignment"}" has been graded: ${score} points.`,
    });
  }

  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Question bank + tests
// ---------------------------------------------------------------------------

export async function getQuestionBank(courseSlug?: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    let query = supabase.from("questions").select("*").order("created_at", { ascending: false });
    if (courseSlug) query = query.eq("course_slug", courseSlug);
    const { data } = await query;
    return data ?? [];
  }, []);
}

export async function createQuestion(input: {
  course_slug: string;
  question_text: string;
  question_type: "mcq" | "fill_blank" | "short_answer";
  options?: { label: string; text: string }[];
  correct_answer: string;
  difficulty: "easy" | "medium" | "hard";
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("questions").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getAllTests() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("tests").select("*").order("scheduled_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function createTest(input: {
  course_slug: string;
  title: string;
  test_type: "weekly" | "mock";
  scheduled_at: string;
  duration_minutes: number;
  total_marks: number;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("tests").insert(input);

  if (!error) {
    // Real "quiz available" notification — every enrolled student gets
    // notified the moment a test is created, not left to discover it by
    // happening to check /dashboard/tests.
    const { data: enrolled } = await supabase.from("enrollments").select("student_id").eq("course_slug", input.course_slug).eq("status", "active");
    if (enrolled && enrolled.length > 0) {
      const label = input.test_type === "mock" ? "mock exam" : "weekly test";
      await supabase.from("notifications").insert(
        enrolled.map((e: { student_id: string }) => ({
          student_id: e.student_id,
          title: `New ${label} available`,
          body: `"${input.title}" is ready — you can take it any time before it closes.`,
        }))
      );
    }
  }

  return error ? { success: false, error: error.message } : { success: true };
}

export async function addQuestionToTest(testId: string, questionId: string, marks: number): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("test_questions").insert({ test_id: testId, question_id: questionId, marks });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getTestAttempts(testId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("test_attempts").select("*, profiles(full_name)").eq("test_id", testId);
    return data ?? [];
  }, []);
}

export async function updateTestAttemptScore(attemptId: string, score: number): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("test_attempts").update({ score }).eq("id", attemptId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

function generateVerificationCode(): string {
  return `HEA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function issueCertificate(studentId: string, courseSlug: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const verificationCode = generateVerificationCode();
  const { error } = await supabase.from("certificates").insert({
    student_id: studentId,
    course_slug: courseSlug,
    verification_code: verificationCode,
  });
  if (error) return { success: false, error: error.message };

  const { data: student } = await supabase.from("profiles").select("full_name, email").eq("id", studentId).single();
  if (student?.email) {
    const email = certificateIssuedEmail(student.full_name, courseSlug, verificationCode);
    await sendEmail(student.email, email.subject, email.html);
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Notifications & announcements
// ---------------------------------------------------------------------------

export async function sendNotificationToStudent(
  studentId: string,
  title: string,
  body: string
): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("notifications").insert({ student_id: studentId, title, body });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function createAnnouncement(input: {
  title: string;
  body: string;
  audience: "all" | "course";
  course_slug?: string;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("announcements").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Doubts
// ---------------------------------------------------------------------------

export async function getAllDoubts() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("doubts")
      .select("*, profiles(full_name), doubt_replies(*)")
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function replyToDoubt(doubtId: string, authorId: string, reply: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("doubt_replies").insert({ doubt_id: doubtId, author_id: authorId, reply });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function markDoubtResolved(doubtId: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("doubts").update({ status: "resolved" }).eq("id", doubtId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Analytics — genuine aggregation queries, honest zero-state until real
// data exists
// ---------------------------------------------------------------------------

export async function getCourseAnalytics(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const [{ count: enrolledCount }, { data: attempts }, { data: submissions }] = await Promise.all([
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("course_slug", courseSlug),
      supabase.from("test_attempts").select("score, tests!inner(course_slug)").eq("tests.course_slug", courseSlug),
      supabase.from("submissions").select("score, assignments!inner(course_slug)").eq("assignments.course_slug", courseSlug),
    ]);

    const scoredAttempts = (attempts ?? []).filter((a: { score: number | null }) => a.score !== null);
    const avgTestScore =
      scoredAttempts.length > 0
        ? Math.round(scoredAttempts.reduce((sum: number, a: { score: number }) => sum + a.score, 0) / scoredAttempts.length)
        : null;

    return {
      enrolledCount: enrolledCount ?? 0,
      avgTestScore,
      totalSubmissions: (submissions ?? []).length,
    };
  }, { enrolledCount: 0, avgTestScore: null, totalSubmissions: 0 });
}
