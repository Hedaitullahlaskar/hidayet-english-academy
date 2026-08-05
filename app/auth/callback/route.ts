import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dashboardPathFor } from "@/lib/auth/permissions";

/**
 * Supabase requires a server-side callback to exchange the auth code that
 * arrives after: (1) clicking a Google OAuth consent, (2) clicking an
 * email verification link, or (3) clicking a password-reset link. All
 * three funnel through here.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Only Google sign-ins arrive via this code-exchange path with a
      // 'google' provider — email confirmation and password-reset links
      // also flow through here but aren't a "login" in the same sense,
      // so this deliberately only logs the OAuth case.
      if (data.user.app_metadata?.provider === "google") {
        await supabase.from("login_history").insert({
          user_id: data.user.id,
          method: "google",
          success: true,
          user_agent: request.headers.get("user-agent") ?? "Unknown",
        });
      }

      // `next` is a hint from whichever page initiated this (e.g.
      // TeacherLoginForm passes "/teach" as its default assumption), not a
      // guarantee — a Google login from the general login page could
      // belong to a teacher or admin account. Only a generic "/dashboard"
      // default gets corrected against the real role; an explicit,
      // specific destination like /reset-password/confirm is honored as-is.
      const destination =
        next === "/dashboard" || next === "/teach" || next === "/admin"
          ? await resolveRoleBasedDestination(supabase, data.user.id)
          : next;

      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", request.url));
}

async function resolveRoleBasedDestination(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return dashboardPathFor(profile?.role);
}
