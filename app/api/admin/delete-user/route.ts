import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Executes an account deletion request. Deliberately admin-only, not
 * self-service-immediate — a user requests deletion (lib/account/repository.ts,
 * regular RLS-protected client), an admin reviews and confirms it here.
 * That review step is a real safeguard, not bureaucracy for its own sake:
 * it catches accidental or coerced deletion requests before they're
 * irreversible.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { requestId, targetUserId } = (await request.json()) as { requestId?: string; targetUserId?: string };
  if (!requestId || !targetUserId) {
    return NextResponse.json({ error: "Missing requestId or targetUserId" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(targetUserId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // The profiles row cascades away automatically (foreign key ON DELETE
  // CASCADE to auth.users — see schema.sql). Mark the request completed
  // using the regular server client, which still works because this
  // route already verified the caller is an admin above.
  await supabase
    .from("account_deletion_requests")
    .update({ status: "completed", processed_at: new Date().toISOString() })
    .eq("id", requestId);

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "account_deleted",
    target_table: "profiles",
    target_id: targetUserId,
  });

  return NextResponse.json({ success: true });
}
