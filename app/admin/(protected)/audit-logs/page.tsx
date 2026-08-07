import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
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
        <div className="mt-8 overflow-hidden rounded-lg border border-navy-100 shadow-card dark:border-navy-700">
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead><tr className="bg-navy-800 text-white"><th className="p-4">Action</th><th className="p-4">By</th><th className="p-4">When</th></tr></thead>
            <tbody>
              {logs.map((l: { id: string; action: string; created_at: string; profiles: { full_name: string } | null }, i: number) => (
                <tr key={l.id} className={i % 2 === 0 ? "bg-white dark:bg-navy-900" : "bg-paper-100 dark:bg-navy-800"}>
                  <td className="p-4 text-navy-800 dark:text-navy-100">{l.action.replace(/_/g, " ")}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{l.profiles?.full_name ?? "System"}</td>
                  <td className="p-4 text-navy-600 dark:text-navy-300">{new Date(l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
