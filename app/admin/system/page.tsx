import { DataExportPanel } from "@/components/admin/DataExportPanel";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminSystemPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Security &amp; Backup</h1>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Security Settings</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
            <p className="font-semibold text-navy-900 dark:text-white">Row-Level Security</p>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
              Every table enforces access at the database level (see <code>supabase/schema.sql</code>) — not just hidden in the UI. This isn't a toggle; it's structural.
            </p>
          </div>
          <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
            <p className="font-semibold text-navy-900 dark:text-white">Password Policy</p>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
              Minimum 8 characters, enforced at registration. Supabase Auth's own policies (breach detection, rate limiting) apply automatically once a real project is connected.
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-navy-200 bg-paper-100 p-4 dark:border-navy-700 dark:bg-navy-900">
            <p className="font-semibold text-navy-800 dark:text-navy-100">Two-Factor Authentication</p>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">
              Not built yet — Supabase Auth supports TOTP-based MFA natively; wiring it in is a scoped follow-up, not a fake toggle here.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Backup &amp; Data Export</h2>
        <p className="mt-2 max-w-2xl text-sm text-navy-600 dark:text-navy-300">
          Full database backup and point-in-time recovery is handled by Supabase at the infrastructure level, not
          by a button in this app — that's the correct, safer place for it. What this app <em>can</em> genuinely do
          is export your own data as JSON, any time:
        </p>
        <div className="mt-4">
          <DataExportPanel />
        </div>
      </section>
    </div>
  );
}
