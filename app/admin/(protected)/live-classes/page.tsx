import { Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CancelClassButton } from "@/components/admin/CancelClassButton";
import { getAllLiveClasses } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLiveClassesPage() {
  const classes = await getAllLiveClasses();
  const now = new Date();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Live Class Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Every live class across every teacher, in one view. Creating classes happens in the Teacher Dashboard.</p>

      {classes.length === 0 ? (
        <EmptyState className="mt-8" icon={<Video className="h-6 w-6" strokeWidth={1.75} />} title="No live classes scheduled" body="Classes scheduled by any teacher will appear here." />
      ) : (
        <div className="mt-8 space-y-3">
          {classes.map((c: { id: string; title: string; course_slug: string; scheduled_at: string; platform: string; status: string; auto_generated: boolean }) => {
            const isUpcoming = new Date(c.scheduled_at) >= now && c.status === "scheduled";
            return (
              <div key={c.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">
                      {c.course_slug} · {new Date(c.scheduled_at).toLocaleString()} · {c.platform === "zoom" ? "Zoom" : "Google Meet"}
                      {c.auto_generated && " · Auto-generated"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.status === "cancelled" ? (
                      <Badge tone="outline">Cancelled</Badge>
                    ) : (
                      <Badge tone={isUpcoming ? "success" : "outline"}>{isUpcoming ? "Upcoming" : "Past"}</Badge>
                    )}
                    {isUpcoming && <CancelClassButton liveClassId={c.id} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
