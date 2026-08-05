import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/icons";
import type { CourseDetail } from "@/types";

export function CourseDetailOverview({ course }: { course: CourseDetail }) {
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">
            Course Overview
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-navy-600 dark:text-navy-300">
            {course.overview}
          </p>

          <h3 className="mt-8 font-display text-lg font-semibold text-navy-900 dark:text-white">
            Who Should Join
          </h3>
          <ul className="mt-4 space-y-3">
            {course.whoShouldJoin.map((item) => (
              <li key={item} className="flex items-start gap-3 text-navy-700 dark:text-navy-200">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-success-text dark:text-success" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-navy-100 bg-paper-100 p-5 dark:border-navy-700 dark:bg-navy-900">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-800 dark:text-gold-400">
              Eligibility
            </p>
            <p className="mt-2 text-sm leading-relaxed text-navy-700 dark:text-navy-200">
              {course.eligibility}
            </p>
          </div>
          <div className="rounded-lg border border-navy-100 bg-paper-100 p-5 dark:border-navy-700 dark:bg-navy-900">
            <p className="text-xs font-bold uppercase tracking-wide text-gold-800 dark:text-gold-400">
              Class Schedule
            </p>
            <p className="mt-2 text-sm leading-relaxed text-navy-700 dark:text-navy-200">
              {course.schedule}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
