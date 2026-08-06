import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Runs with the service-role client, not a user session — a cron trigger
 * has no logged-in user for RLS's `auth.uid()` checks to key off, so this
 * deliberately bypasses RLS the same way every other system job in this
 * codebase does (see lib/supabase/admin.ts). Only ever called from
 * app/api/cron/reminders/route.ts, which independently verifies the
 * caller via CRON_SECRET before either of these functions runs.
 */

export const REMINDER_LEAD_MINUTES = 30;

export interface ClassNeedingReminder {
  id: string;
  course_slug: string;
  title: string;
  meeting_url: string | null;
  scheduled_at: string;
}

export interface EnrolledContact {
  studentId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  timezone: string;
}

/** Scheduled classes starting within the reminder window that haven't been reminded yet. */
export async function getClassesNeedingReminders(): Promise<ClassNeedingReminder[]> {
  const admin = createAdminClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_LEAD_MINUTES * 60_000);

  const { data } = await admin
    .from("live_classes")
    .select("id, course_slug, title, meeting_url, scheduled_at")
    .eq("status", "scheduled")
    .is("reminder_sent_at", null)
    .gt("scheduled_at", now.toISOString())
    .lte("scheduled_at", windowEnd.toISOString());

  return data ?? [];
}

export async function getEnrolledContactsForCourse(courseSlug: string): Promise<EnrolledContact[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("enrollments")
    .select("student_id, profiles(id, full_name, email, phone, timezone)")
    .eq("course_slug", courseSlug)
    .eq("status", "active");

  return (data ?? [])
    .map((row: any) => row.profiles)
    .filter(Boolean)
    .map((p: any) => ({
      studentId: p.id,
      fullName: p.full_name ?? "Student",
      email: p.email ?? null,
      phone: p.phone ?? null,
      timezone: p.timezone ?? "Asia/Kolkata",
    }));
}

export async function markReminderSent(liveClassId: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from("live_classes").update({ reminder_sent_at: new Date().toISOString() }).eq("id", liveClassId);
}
