import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon } from "@/components/ui/icons";
import type { CourseDetail } from "@/types";

export function CourseDetailCurriculum({ course }: { course: CourseDetail }) {
  const supportItems = [
    { icon: "📅", label: "Weekly Practice", value: course.weeklyPractice },
    { icon: "📝", label: "Assignments", value: course.assignments },
    { icon: "✅", label: "Mock Tests", value: course.mockTests },
    {
      icon: "🎓",
      label: "Certificate",
      value:
        course.certificateStatus === "available"
          ? "Issued on completion."
          : "Verifiable certificates are part of our platform build — coming soon.",
      badge: course.certificateStatus === "coming-soon" ? "Coming Soon" : undefined,
    },
  ];

  return (
    <section className="bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Syllabus</h2>
            <ul className="mt-5 space-y-3">
              {course.syllabus.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-700 dark:text-navy-200">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-success-text dark:text-success" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">
              Learning Outcomes
            </h2>
            <ul className="mt-5 space-y-3">
              {course.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-700 dark:text-navy-200">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-700 dark:text-gold-400" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-gold-300 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
          <p className="text-sm text-navy-700 dark:text-navy-200">
            <span className="font-semibold text-navy-900 dark:text-white">Teaching Method: </span>
            Every course follows the same bilingual, speaking-first framework.{" "}
            <Link href="/method" className="font-semibold text-gold-800 underline dark:text-gold-400">
              See exactly how we teach →
            </Link>
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                {item.badge && <Badge tone="gold">{item.badge}</Badge>}
              </div>
              <p className="mt-3 font-display text-sm font-semibold text-navy-900 dark:text-white">
                {item.label}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-600 dark:text-navy-300">{item.value}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
