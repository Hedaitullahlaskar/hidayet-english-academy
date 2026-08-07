import { BookOpen, CheckCircle2, Award } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { TimelineEvent, TimelineEventType } from "@/lib/dashboard/achievements-repository";

const TYPE_STYLE: Record<TimelineEventType, { icon: typeof BookOpen; color: string }> = {
  lesson: { icon: BookOpen, color: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300" },
  test: { icon: CheckCircle2, color: "bg-success/10 text-success-text dark:bg-success/15 dark:text-emerald-400" },
  certificate: { icon: Award, color: "bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400" },
};

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        className="mt-4"
        icon={<BookOpen className="h-6 w-6" strokeWidth={1.75} />}
        title="No activity yet"
        body="Complete a lesson, take a test, or earn a certificate — it'll show up here as a real, timestamped record."
      />
    );
  }

  return (
    <ol className="mt-4 space-y-0">
      {events.map((event, i) => {
        const { icon: Icon, color } = TYPE_STYLE[event.type];
        return (
          <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < events.length - 1 && (
              <span className="absolute left-4 top-9 h-full w-px -translate-x-1/2 bg-navy-100 dark:bg-navy-700" aria-hidden="true" />
            )}
            <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{event.title}</p>
              <p className="mt-0.5 text-xs text-navy-400 dark:text-navy-500">
                {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
