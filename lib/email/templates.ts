/**
 * Email templates — inline-styled HTML, since that's what's reliably
 * supported across real email clients (no external stylesheets, no
 * Tailwind classes). Navy/gold brand colors matched by hex value to the
 * design system's actual tokens, not approximated.
 */

const NAVY = "#0A2540";
const GOLD = "#C9A227";

function wrapper(bodyHtml: string): string {
  return `
  <div style="background:#FBF8F1; padding:32px 16px; font-family:Arial, sans-serif;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #eee;">
      <div style="background:${NAVY}; padding:24px; text-align:center;">
        <span style="color:${GOLD}; font-size:18px; font-weight:bold;">Hidayet English Academy</span>
      </div>
      <div style="padding:28px; color:#1a1a1a; line-height:1.6;">
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px; background:#FBF8F1; text-align:center; font-size:12px; color:#888;">
        Hidayet English Academy — Learn English, Build Your Future
      </div>
    </div>
  </div>`;
}

export function enrollmentConfirmationEmail(studentName: string, courseName: string): { subject: string; html: string } {
  return {
    subject: `You're enrolled in ${courseName}!`,
    html: wrapper(`
      <h2 style="color:${NAVY}; margin-top:0;">Welcome, ${studentName}!</h2>
      <p>You're officially enrolled in <strong>${courseName}</strong>. Your course is available right now in your dashboard.</p>
      <p style="margin-top:24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard/courses" style="background:${GOLD}; color:${NAVY}; padding:12px 24px; border-radius:999px; text-decoration:none; font-weight:bold;">Start Learning →</a>
      </p>
    `),
  };
}

export function paymentReceiptEmail(
  studentName: string,
  courseName: string,
  amountMinorUnits: number,
  currency: string
): { subject: string; html: string } {
  const amount = (amountMinorUnits / 100).toFixed(2);
  return {
    subject: `Payment received — ${courseName}`,
    html: wrapper(`
      <h2 style="color:${NAVY}; margin-top:0;">Payment Confirmed</h2>
      <p>Hi ${studentName}, thank you for your payment.</p>
      <table style="width:100%; margin-top:16px; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#666;">Course</td><td style="padding:8px 0; text-align:right; font-weight:bold;">${courseName}</td></tr>
        <tr><td style="padding:8px 0; color:#666; border-top:1px solid #eee;">Amount Paid</td><td style="padding:8px 0; text-align:right; font-weight:bold; border-top:1px solid #eee;">${currency} ${amount}</td></tr>
      </table>
      <p style="margin-top:20px; font-size:13px; color:#888;">This email serves as your receipt for this transaction.</p>
    `),
  };
}

export function certificateIssuedEmail(studentName: string, courseName: string, verificationCode: string): { subject: string; html: string } {
  return {
    subject: `Your certificate for ${courseName} is ready`,
    html: wrapper(`
      <h2 style="color:${NAVY}; margin-top:0;">Congratulations, ${studentName}! 🎓</h2>
      <p>Your certificate for completing <strong>${courseName}</strong> has been issued.</p>
      <p style="margin-top:24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/verify/${verificationCode}" style="background:${GOLD}; color:${NAVY}; padding:12px 24px; border-radius:999px; text-decoration:none; font-weight:bold;">View &amp; Download Certificate →</a>
      </p>
      <p style="margin-top:16px; font-size:13px; color:#888;">Verification code: ${verificationCode} — anyone can verify this certificate at the link above.</p>
    `),
  };
}
