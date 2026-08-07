import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Monitor } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import { LoginHistoryList, DeviceSessionList } from "@/components/account/AccountSecurityPanels";
import { DeleteAccountPanel } from "@/components/account/DeleteAccountPanel";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMyLoginHistory, getMySessions, getMyDeletionRequest } from "@/lib/account/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AccountSecurityPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();

  const backLink =
    profile?.role === "admin" ? "/admin/settings" : profile?.role === "teacher" ? "/teach/settings" : "/dashboard/settings";

  const [loginHistory, sessions, deletionRequest] = await Promise.all([
    getMyLoginHistory(),
    getMySessions(),
    getMyDeletionRequest(),
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link href={backLink} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
        ← Back to Settings
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">Account Security</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Works the same regardless of whether you&apos;re logged in as a student, teacher, or admin.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Change Password</h2>
        <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <SetPasswordForm mode="change" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Login History</h2>
        {loginHistory.length === 0 ? (
          <EmptyState icon={<Clock className="h-6 w-6" strokeWidth={1.75} />} title="No login history yet" body="Your recent logins will appear here." />
        ) : (
          <LoginHistoryList history={loginHistory} />
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Active Devices</h2>
        {sessions.length === 0 ? (
          <EmptyState icon={<Monitor className="h-6 w-6" strokeWidth={1.75} />} title="No active sessions on record" body="Devices you've logged in from will appear here, with the ability to sign each one out remotely." />
        ) : (
          <DeviceSessionList sessions={sessions} />
        )}
      </section>

      <section className="mt-10 border-t border-navy-100 pt-8 dark:border-navy-700">
        <h2 className="mb-3 font-display text-lg font-semibold text-error">Delete Account</h2>
        <DeleteAccountPanel hasPendingRequest={Boolean(deletionRequest)} />
      </section>
    </main>
  );
}
