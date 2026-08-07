import { Video } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { CreateLiveClassForm } from "@/components/teacher/CreateLiveClassForm";
import { AttachRecordingForm } from "@/components/teacher/AttachRecordingForm";
import { getAllLiveClasses, getCoursesForTeacher } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function LiveClassSchedulePage() {
  const [classes, courses] = await Promise.all([getAllLiveClasses(), getCoursesForTeacher()]);
  const now = new Date();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Live Class Schedule</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Schedule and manage live classes across every course.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">Schedule a New Class</h2>
          <CreateLiveClassForm courses={courses} />
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900 dark:text-white">All Classes</h2>
          {classes.length === 0 ? (
            <EmptyState icon={<Video className="h-6 w-6" strokeWidth={1.75} />} title="Nothing scheduled yet" body="Classes you schedule will appear here for students immediately." />
          ) : (
            <div className="space-y-3">
              {classes.map((c: { id: string; title: string; course_slug: string; scheduled_at: string; platform: string; auto_generated: boolean; recording_url: string | null }) => {
                const isPast = new Date(c.scheduled_at) < now;
                return (
                  <div key={c.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-navy-900 dark:text-white">{c.title}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">
                          {c.course_slug} · {new Date(c.scheduled_at).toLocaleString()} · {c.platform === "zoom" ? "Zoom" : "Google Meet"}
                          {c.auto_generated && " · Auto-generated link"}
                        </p>
                      </div>
                      {isPast && <Badge tone="outline">Past</Badge>}
                    </div>
                    {isPast && (
                      <div className="mt-3 border-t border-navy-50 pt-3 dark:border-navy-700">
                        <AttachRecordingForm liveClassId={c.id} existingUrl={c.recording_url} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
