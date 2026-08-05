import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SuspendedAccountNotice } from "@/components/shared/SuspendedAccountNotice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentAdminProfile } from "@/lib/admin/repository";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders, same as /dashboard and /teach layouts — middleware
  // already checks this, but the highest-privilege surface in the app
  // never trusts that alone. Strictly role === "admin" — a teacher's valid
  // session is rejected here too, not just students.
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=not_admin");
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
