import { TeacherShell } from "@/components/teacher/TeacherShell";
import { SuspendedAccountNotice } from "@/components/shared/SuspendedAccountNotice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentTeacherProfile, getOpenDoubtsCount } from "@/lib/teacher/repository";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
    return null;
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
