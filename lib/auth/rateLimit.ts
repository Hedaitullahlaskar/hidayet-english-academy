import { createAdminClient } from "@/lib/supabase/admin";

/**
 * A real rate limiter, not a decoration. No Redis/Upstash in this stack,
 * so it's backed by the rate_limit_events table (RLS-locked to service-role
 * only — see schema.sql). Used for the two endpoints most worth protecting
 * from abuse: OTP requests (SMS/email bombing) and password reset requests
 * (email bombing, account enumeration probing).
 */
export async function checkRateLimit(
  identifier: string,
  action: "otp_request" | "password_reset_request" | "ai_message",
  maxAttempts = 5,
  windowMinutes = 15
): Promise<{ allowed: boolean; retryAfterMinutes?: number }> {
  const supabase = createAdminClient();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("rate_limit_events")
    .select("*", { count: "exact", head: true })
    .eq("identifier", identifier)
    .eq("action", action)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= maxAttempts) {
    return { allowed: false, retryAfterMinutes: windowMinutes };
  }

  await supabase.from("rate_limit_events").insert({ identifier, action });
  return { allowed: true };
}
