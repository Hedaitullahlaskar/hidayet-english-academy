import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { getRecentActivity } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminAuditLogsPage() {
  const logs = await getRecentActivity(50);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Audit Logs</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Every sensitive action — role changes, suspensions, refunds — traceable to who did it and when.</p>

      {logs.length === 0 ? (
        <EmptyState className="mt-8" icon={<ScrollText className="h-6 w-6" strokeWidth={1.75} />} title="No audit events yet" body="This log fills in automatically as admin actions happen — nothing to show until then." />
      ) : (
        <AuditLogTable logs={logs} />
      )}
    </div>
  );
}
