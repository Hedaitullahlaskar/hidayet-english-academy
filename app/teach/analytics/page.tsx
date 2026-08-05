import { StatWidget } from "@/components/dashboard/StatWidget";
import { coursesData } from "@/content/courses-data";
import { getCourseAnalytics } from "@/lib/teacher/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function AnalyticsPage() {
  const featured = coursesData.slice(0, 6);
  const analytics = await Promise.all(featured.map((c) => getCourseAnalytics(c.slug)));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Student Progress Analytics</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Real enrollment, score, and submission data per course — genuinely zero until students are active.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((c, i) => (
          <div key={c.slug} className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
            <p className="font-display font-semibold text-navy-900 dark:text-white">{c.icon} {c.name}</p>
            <div className="mt-4 space-y-3">
              <StatWidget icon="🧑‍🎓" label="Enrolled" value={String(analytics[i].enrolledCount)} />
              <StatWidget icon="📊" label="Avg. Test Score" value={analytics[i].avgTestScore !== null ? `${analytics[i].avgTestScore}%` : "No data yet"} />
              <StatWidget icon="📝" label="Submissions" value={String(analytics[i].totalSubmissions)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
