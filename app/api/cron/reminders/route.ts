import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClassesNeedingReminders, getEnrolledContactsForCourse, markReminderSent } from "@/lib/liveclass/reminders";
import { sendEmail } from "@/lib/email/client";
import { classReminderEmail } from "@/lib/email/templates";
import { sendClassReminder } from "@/lib/whatsapp/reminders";

/**
 * Triggered by Vercel Cron (see vercel.json) roughly every 10 minutes.
 * Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on cron
 * invocations once CRON_SECRET is set as an env var — this route rejects
 * everything else, the same fail-closed pattern as /api/admin/seed.
 *
 * Per-class, marked reminded BEFORE sending rather than after: a partial
 * failure part-way through one class's student list should never cause
 * the next cron tick to re-send everyone who already got a message.
 * Losing a reminder to a rare mid-loop crash is a better failure mode
 * than spamming duplicates.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const classes = await getClassesNeedingReminders();
  const results: Array<{ classId: string; title: string; students: number; emailsSent: number; whatsappSent: number }> = [];

  for (const liveClass of classes) {
    await markReminderSent(liveClass.id);

    const contacts = await getEnrolledContactsForCourse(liveClass.course_slug);
    let emailsSent = 0;
    let whatsappSent = 0;

    for (const contact of contacts) {
      const meetingUrl = liveClass.meeting_url ?? "";

      if (contact.email) {
        const { subject, html } = classReminderEmail(contact.fullName, liveClass.title, liveClass.scheduled_at, meetingUrl, contact.timezone);
        const result = await sendEmail(contact.email, subject, html);
        if (result.sent) emailsSent += 1;
      }

      if (contact.phone) {
        const result = await sendClassReminder({
          toPhoneE164: contact.phone,
          studentName: contact.fullName,
          classTitle: liveClass.title,
          startTimeIso: liveClass.scheduled_at,
          meetingUrl,
        });
        if (result.sent) whatsappSent += 1;
      }
    }

    results.push({ classId: liveClass.id, title: liveClass.title, students: contacts.length, emailsSent, whatsappSent });
  }

  return NextResponse.json({ classesProcessed: classes.length, results });
}
