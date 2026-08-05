import { EmptyState } from "@/components/dashboard/EmptyState";
import { getAnnouncements } from "@/lib/dashboard/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Announcements</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Updates from HEA and your teachers.</p>

      {announcements.length === 0 ? (
        <EmptyState className="mt-8" icon="📢" title="No announcements yet" body="Course and academy-wide updates will appear here." />
      ) : (
        <div className="mt-8 space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <p className="font-semibold text-navy-900 dark:text-white">{a.title}</p>
              <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">{a.body}</p>
              <p className="mt-2 text-xs text-navy-400">{new Date(a.published_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
