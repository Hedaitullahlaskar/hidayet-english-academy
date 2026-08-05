import "server-only";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Real Resend API calls — same honest pattern as every other integration
 * (Anthropic, Razorpay, Stripe): inert without a key, never a silent
 * failure that looks like success. If email isn't configured, the event
 * that triggered it (payment, certificate, enrollment) still completes —
 * a missing email should never block the thing it's confirming.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.log(`[email skipped — RESEND_API_KEY not set] To: ${to} | Subject: ${subject}`);
    return { sent: false, error: "not_configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM_ADDRESS ?? "Hidayet English Academy <noreply@hidayetenglishacademy.com>";
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "Unknown email error" };
  }
}
