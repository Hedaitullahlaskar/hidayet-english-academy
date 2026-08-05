import "server-only";

/**
 * WHATSAPP REMINDER ARCHITECTURE — deliberately scoped as architecture,
 * not a full integration, per the explicit brief. This is not the same
 * caveat as "no API key yet": even with WHATSAPP_BUSINESS_TOKEN and
 * WHATSAPP_PHONE_NUMBER_ID set, real delivery additionally requires Meta
 * Business verification and pre-approved message templates — a business
 * process measured in days, not something two env vars unlock. Building
 * a full send path now would either fake success or silently fail against
 * an unapproved template, which is worse than being honest that this is
 * the interface, ready to wire in once that approval exists.
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
 * The real request shape the WhatsApp Business Cloud API expects for a
 * template message — written out now so wiring in a real send is a
 * matter of uncommenting the fetch() call below once a template named
 * "class_reminder" is approved in Meta Business Manager, not designing
 * the payload from scratch under deadline pressure later.
 */
export async function sendClassReminder(message: ReminderMessage): Promise<{ sent: boolean; reason: string }> {
  if (!isWhatsAppBusinessConfigured()) {
    return { sent: false, reason: "not_configured" };
  }

  // Intentionally not sending yet — see the module comment above. The
  // real call, once a template is approved, looks like this:
  //
  // await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     messaging_product: "whatsapp",
  //     to: message.toPhoneE164,
  //     type: "template",
  //     template: {
  //       name: "class_reminder",
  //       language: { code: "en" },
  //       components: [{
  //         type: "body",
  //         parameters: [
  //           { type: "text", text: message.studentName },
  //           { type: "text", text: message.classTitle },
  //           { type: "text", text: message.meetingUrl },
  //         ],
  //       }],
  //     },
  //   }),
  // });

  return { sent: false, reason: "template_not_approved" };
}
