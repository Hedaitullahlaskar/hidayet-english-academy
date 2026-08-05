import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SuspendedAccountNotice } from "@/components/shared/SuspendedAccountNotice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentProfile, getMyNotifications } from "@/lib/dashboard/repository";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders: middleware already redirects unauthenticated users
  // away from /dashboard/*, but a layout should never trust that alone.
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, notifications] = await Promise.all([getCurrentProfile(), getMyNotifications()]);

  if (profile?.is_suspended) {
    return <SuspendedAccountNotice />;
  }

  return (
    <DashboardShell studentName={profile?.full_name ?? "Student"} avatarUrl={profile?.avatar_url} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
