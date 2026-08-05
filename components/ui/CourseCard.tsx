import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import type { Course } from "@/types";

export function CourseCard({ course }: { course: Course }) {
  const isFree = course.price === "Free";

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        course.featured
          ? "border-gold-400 bg-navy-800 text-white"
          : "border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge
          tone={course.featured ? "gold" : "outline"}
          className={course.featured ? "" : "text-navy-700 dark:border-navy-600 dark:text-navy-200"}
        >
          {course.level}
        </Badge>
        {isFree && <Badge tone="success">100% Free</Badge>}
      </div>

      <h3
        className={cn(
          "mt-5 font-display text-xl font-semibold",
          course.featured ? "text-white" : "text-navy-900 dark:text-white"
        )}
      >
        {course.name.en}
      </h3>
      <p lang="bn" className={cn("text-sm", course.featured ? "text-gold-300" : "text-navy-500 dark:text-navy-400")}>
        {course.name.bn}
      </p>

      <p
        className={cn(
          "mt-3 text-sm font-semibold",
          course.featured ? "text-gold-400" : "text-gold-800 dark:text-gold-400"
        )}
      >
        {course.duration}
      </p>

      <p className={cn("mt-3 text-sm leading-relaxed", course.featured ? "text-navy-200" : "text-navy-600 dark:text-navy-300")}>
        {course.description}
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {course.highlights.map((h) => (
          <li
            key={h}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              course.featured ? "text-navy-100" : "text-navy-700 dark:text-navy-200"
            )}
          >
            <CheckIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", course.featured ? "text-gold-400" : "text-success-text dark:text-success")}
            />
            {h}
          </li>
        ))}
      </ul>

      {isFree ? (
        <Button href="/#enroll" variant={course.featured ? "primary" : "outline"} className="mt-7 w-full">
          Enroll Free
        </Button>
      ) : (
        <Button
          href={whatsappLink(whatsappMessages.courseInterest(course.name.en))}
          variant="outline"
          className={cn("mt-7 w-full", !course.featured && "border-navy-800 dark:border-navy-400 dark:text-navy-200")}
        >
          Ask About Fees
        </Button>
      )}
    </div>
  );
}
