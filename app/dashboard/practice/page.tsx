import { Target } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const metadata = { robots: { index: false, follow: false } };

export default function PracticePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Practice Exercises</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Low-stakes practice — fill-in-the-blank, multiple choice, and sentence building drawn from your Grammar and
        Vocabulary lessons.
      </p>
      <EmptyState
        className="mt-8"
        icon={<Target className="h-6 w-6" strokeWidth={1.75} />}
        title="Practice sets appear here once you're enrolled in a course"
        body="Your teacher builds practice exercises from your course content. Nothing has been assigned yet."
      />
    </div>
  );
}
