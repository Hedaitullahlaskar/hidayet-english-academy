import "server-only";

/**
 * WHATSAPP REMINDER SEND PATH — the API call below is real, not a stub.
 * It will still fail at Meta's end until two things happen outside this
 * codebase, neither of which any environment variable unlocks: the
 * WhatsApp Business Account must be verified in Meta Business Manager,
 * and a template (default name "class_reminder") must be submitted and
 * approved there — a business process measured in days. Until then,
 * `sendClassReminder()` returns `{ sent: false }` with the real API error
 * as `reason`, which the caller treats as non-fatal (see the module
 * comment in app/api/cron/reminders/route.ts).
 */

export interface ReminderMessage {
  toPhoneE164: string;   // e.g. "+919876543210"
  studentName: string;
  classTitle: string;
  startTimeIso: string;
  meetingUrl: string;
}

export function isWhatsAppBusinessConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_BUSINESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/**
 * The real request against the WhatsApp Business Cloud API, using the
 * "class_reminder" template. This call is real — it will actually POST
 * once WHATSAPP_BUSINESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are set — but
 * it will still fail at Meta's end (a 4xx with an error about an unknown
 * template) until two things happen outside this codebase, neither of
 * which any environment variable can unlock:
 *   1. The WhatsApp Business Account is verified in Meta Business Manager.
 *   2. A template literally named "class_reminder" (body: student name,
 *      class title, join link, in that order) is submitted and approved.
 * WHATSAPP_TEMPLATE_NAME can override the template name if a different
 * approved name is used instead of "class_reminder".
 */
export async function sendClassReminder(message: ReminderMessage): Promise<{ sent: boolean; reason: string }> {
  if (!isWhatsAppBusinessConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: message.toPhoneE164,
        type: "template",
        template: {
          name: process.env.WHATSAPP_TEMPLATE_NAME ?? "class_reminder",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: message.studentName },
                { type: "text", text: message.classTitle },
                { type: "text", text: message.meetingUrl },
              ],
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return { sent: false, reason: `api_error: ${response.status} ${body.slice(0, 200)}` };
    }

    return { sent: true, reason: "sent" };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "unknown_error" };
  }
}
