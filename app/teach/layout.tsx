import { redirect } from "next/navigation";
import { TeacherShell } from "@/components/teacher/TeacherShell";
import { SuspendedAccountNotice } from "@/components/shared/SuspendedAccountNotice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentTeacherProfile, getOpenDoubtsCount } from "@/lib/teacher/repository";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders, same as the student dashboard layout: middleware
  // already checks auth + role, but this layout never trusts that alone.
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/teach/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    redirect("/teach/login?error=not_staff");
  }

  const [teacherProfile, openDoubtsCount] = await Promise.all([getCurrentTeacherProfile(), getOpenDoubtsCount()]);

  if (teacherProfile?.is_suspended) {
    return <SuspendedAccountNotice />;
  }

  return (
    <TeacherShell
      teacherName={teacherProfile?.full_name ?? "Teacher"}
      avatarUrl={teacherProfile?.avatar_url}
      openDoubtsCount={openDoubtsCount}
    >
      {children}
    </TeacherShell>
  );
}
