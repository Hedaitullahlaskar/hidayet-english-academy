import Link from "next/link";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getMyTestsWithHistory } from "@/lib/assessments/repository";

export const metadata = { robots: { index: false, follow: false } };

interface TestWithHistory {
  id: string;
  title: string;
  total_marks: number;
  pass_percentage: number;
  max_attempts: number;
  scheduled_at: string;
  attempts: { id: string; score: number | null; submitted_at: string | null }[];
}

function TestCard({ test }: { test: TestWithHistory }) {
  const completed = test.attempts.filter((a) => a.submitted_at);
  const bestScore = completed.length > 0 ? Math.max(...completed.map((a) => a.score ?? 0)) : null;
  const bestPercentage = bestScore !== null && test.total_marks > 0 ? Math.round((bestScore / test.total_marks) * 100) : null;
  const canRetake = completed.length < test.max_attempts;

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-navy-900 dark:text-white">{test.title}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">
            {new Date(test.scheduled_at).toLocaleDateString()} · Pass mark {test.pass_percentage}% · {completed.length}/{test.max_attempts} attempts used
          </p>
        </div>
        {bestPercentage !== null && (
          <Badge tone={bestPercentage >= test.pass_percentage ? "success" : "outline"}>{bestPercentage}%</Badge>
        )}
      </div>

      {completed.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {completed.map((a, i) => (
            <span key={a.id} className="rounded-full bg-paper-100 px-2 py-0.5 text-xs text-navy-600 dark:bg-navy-900 dark:text-navy-300">
              Attempt {i + 1}: {a.score}/{test.total_marks}
            </span>
          ))}
        </div>
      )}

      {canRetake ? (
        <Link href={`/dashboard/tests/${test.id}/take`} className="mt-3 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          {completed.length > 0 ? "Retake Test →" : "Take Test →"}
        </Link>
      ) : (
        <p className="mt-3 text-xs text-navy-400 dark:text-navy-500">No attempts remaining.</p>
      )}
    </div>
  );
}

export default async function TestsPage() {
  const [weekly, mock] = await Promise.all([getMyTestsWithHistory("weekly"), getMyTestsWithHistory("mock")]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Tests & Mock Exams</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">Regular evaluation to catch gaps early, not punish them.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Weekly Tests</h2>
          {weekly.length === 0 ? (
            <EmptyState className="mt-4" icon={<CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />} title="No weekly tests scheduled" body="Your next weekly test will appear here once scheduled." />
          ) : (
            <div className="mt-4 space-y-3">{weekly.map((t: TestWithHistory) => <TestCard key={t.id} test={t} />)}</div>
          )}
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Mock Exams</h2>
          {mock.length === 0 ? (
            <EmptyState className="mt-4" icon={<ClipboardList className="h-6 w-6" strokeWidth={1.75} />} title="No mock exams scheduled" body="Full-length mock exams will appear here as they're scheduled." />
          ) : (
            <div className="mt-4 space-y-3">{mock.map((t: TestWithHistory) => <TestCard key={t.id} test={t} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
