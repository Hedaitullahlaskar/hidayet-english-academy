import { AdminShell } from "@/components/admin/AdminShell";
import { SuspendedAccountNotice } from "@/components/shared/SuspendedAccountNotice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentAdminProfile } from "@/lib/admin/repository";
import { canAccessAdmin } from "@/lib/auth/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!canAccessAdmin(profile?.role)) {
    return null;
  }

  const adminProfile = await getCurrentAdminProfile();

  if (adminProfile?.is_suspended) {
    return <SuspendedAccountNotice />;
  }

  return (
    <AdminShell adminName={adminProfile?.full_name ?? "Admin"} avatarUrl={adminProfile?.avatar_url}>
      {children}
    </AdminShell>
  );
}
