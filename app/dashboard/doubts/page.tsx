import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AskDoubtForm } from "@/components/dashboard/AskDoubtForm";
import { getMyDoubts } from "@/lib/dashboard/doubts-repository";
import { getMyEnrollments } from "@/lib/dashboard/repository";
import { getAllCourses } from "@/lib/courses/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudentDoubtsPage() {
  const [doubts, enrollments, allCourses] = await Promise.all([getMyDoubts(), getMyEnrollments(), getAllCourses()]);
  const enrolledSlugs = new Set(enrollments.map((e: { course_slug: string }) => e.course_slug));
  const myCourses = allCourses.filter((c) => enrolledSlugs.has(c.slug)).map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Ask a Doubt</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Stuck on something? Ask directly — your teacher sees and replies here.</p>

      <div className="mt-8">
        {myCourses.length === 0 ? (
          <EmptyState icon="📚" title="Enroll in a course first" body="Once you're enrolled in a course, you can ask your teacher questions about it here." />
        ) : (
          <AskDoubtForm courses={myCourses} />
        )}
      </div>

      <h2 className="mb-4 mt-10 font-display text-lg font-semibold text-navy-900 dark:text-white">Your Questions</h2>
      {doubts.length === 0 ? (
        <EmptyState icon="💬" title="No questions yet" body="Questions you ask will appear here, along with your teacher's replies." />
      ) : (
        <div className="space-y-4">
          {doubts.map((d: { id: string; question: string; course_slug: string; status: string; doubt_replies: { id: string; reply: string }[] }) => (
            <div key={d.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-navy-800 dark:text-navy-100">{d.question}</p>
                <Badge tone={d.status === "open" ? "gold" : "success"}>{d.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{d.course_slug}</p>
              {d.doubt_replies.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-navy-50 pt-3 dark:border-navy-700">
                  {d.doubt_replies.map((r) => (
                    <p key={r.id} className="rounded-lg bg-paper-100 p-3 text-sm text-navy-700 dark:bg-navy-900 dark:text-navy-200">
                      {r.reply}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
