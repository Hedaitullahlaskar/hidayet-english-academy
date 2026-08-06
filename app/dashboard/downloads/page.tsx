import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyDownloads } from "@/lib/dashboard/repository";
import { getAllCourses } from "@/lib/courses/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function DownloadsPage() {
  const [{ lessonNotes, classMaterials }, allCourses] = await Promise.all([getMyDownloads(), getAllCourses()]);
  const courseNameBySlug = new Map(allCourses.map((c) => [c.slug, c.name]));
  const courseName = (slug: string) => courseNameBySlug.get(slug) ?? slug;
  const isEmpty = lessonNotes.length === 0 && classMaterials.length === 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Downloads</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Every lesson note, class material, and recording across your courses — in one place.
      </p>

      {isEmpty ? (
        <EmptyState
          className="mt-8"
          icon="⬇️"
          title="Nothing to download yet"
          body="Lesson notes and live-class materials will appear here as your teachers add them."
        />
      ) : (
        <div className="mt-8 space-y-10">
          {lessonNotes.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Lesson Notes</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lessonNotes.map((l: { id: string; title: string; course_slug: string; module_title: string; notes_url: string }) => (
                  <a
                    key={l.id}
                    href={l.notes_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-navy-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800"
                  >
                    <span className="text-xl" aria-hidden="true">📄</span>
                    <div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{l.title}</p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">
                        {courseName(l.course_slug)} · {l.module_title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {classMaterials.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Class Materials &amp; Recordings</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {classMaterials.map(
                  (c: {
                    id: string;
                    title: string;
                    course_slug: string;
                    materials_url: string | null;
                    recording_url: string | null;
                    scheduled_at: string;
                  }) => (
                    <div key={c.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{c.title}</p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">
                        {courseName(c.course_slug)} · {new Date(c.scheduled_at).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {c.materials_url && (
                          <a href={c.materials_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
                            Class Material →
                          </a>
                        )}
                        {c.recording_url && (
                          <a href={c.recording_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
                            Recording →
                          </a>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
