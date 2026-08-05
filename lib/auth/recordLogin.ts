import { createClient } from "@/lib/supabase/client";

/**
 * Called client-side immediately after a successful sign-in. Writes to
 * login_history (RLS allows a user to insert their own row) and
 * upserts a lightweight session record so /account/security has real
 * data to show — this is the actual mechanism behind "Login History" and
 * "Device Management," not a page reading from an empty table forever.
 */
export async function recordSuccessfulLogin(
  userId: string,
  method: "password" | "otp_email" | "otp_phone" | "google"
) {
  const supabase = createClient();
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown device";

  await Promise.all([
    supabase.from("login_history").insert({ user_id: userId, method, success: true, user_agent: userAgent }),
    supabase.from("user_sessions").insert({ user_id: userId, user_agent: userAgent, device_label: guessDeviceLabel(userAgent) }),
  ]);
}

function guessDeviceLabel(userAgent: string): string {
  if (/iphone|ipad/i.test(userAgent)) return "iPhone/iPad";
  if (/android/i.test(userAgent)) return "Android device";
  if (/macintosh/i.test(userAgent)) return "Mac";
  if (/windows/i.test(userAgent)) return "Windows PC";
  return "Unknown device";
}
