import Link from "next/link";
import { TeacherSettingsForm } from "@/components/teacher/TeacherSettingsForm";
import { getCurrentTeacherProfile } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function TeacherSettingsPage() {
  const profile = await getCurrentTeacherProfile();

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Profile & Settings</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Keep your details current.</p>
      <div className="mt-8">
        <TeacherSettingsForm
          initialName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
          initialTimezone={profile?.timezone ?? "Asia/Kolkata"}
          initialAvatarUrl={profile?.avatar_url ?? null}
        />
      </div>
      <div className="mt-8 rounded-lg border border-navy-100 bg-paper-100 p-4 dark:border-navy-700 dark:bg-navy-900">
        <Link href="/account" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          Account Security — change password, login history, devices →
        </Link>
      </div>
    </div>
  );
}
