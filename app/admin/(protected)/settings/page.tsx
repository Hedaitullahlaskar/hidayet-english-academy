import Link from "next/link";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import { getCurrentAdminProfile } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const profile = await getCurrentAdminProfile();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Platform Settings</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Your profile, plus the defaults new visitors see.</p>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Your Profile</h2>
        <AdminSettingsForm
          initialName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
          initialTimezone={profile?.timezone ?? "Asia/Kolkata"}
          initialAvatarUrl={profile?.avatar_url ?? null}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Platform Defaults</h2>
        <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Default Currency</p>
              <p className="mt-1 font-semibold text-navy-900 dark:text-white">USD (visitor-detected — see lib/currency.ts)</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Default Timezone</p>
              <p className="mt-1 font-semibold text-navy-900 dark:text-white">Asia/Kolkata</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">Languages</p>
              <p className="mt-1 font-semibold text-navy-900 dark:text-white">English, বাংলা</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-navy-500 dark:text-navy-400">
            These currently reflect the real defaults already built into the codebase (Module 4&apos;s currency
            detection, Module 5&apos;s language switcher). Making them admin-editable rather than code-level constants
            is a reasonable next step, not done in this pass to avoid touching frozen modules unprompted.
          </p>
        </div>
      </section>
      <div className="mt-8 rounded-lg border border-navy-100 bg-paper-100 p-4 dark:border-navy-700 dark:bg-navy-900">
        <Link href="/account" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          Account Security — change password, login history, devices →
        </Link>
      </div>
    </div>
  );
}
