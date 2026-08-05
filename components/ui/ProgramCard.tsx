import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import type { Program } from "@/types";

export function ProgramCard({ program }: { program: Program }) {
  const isMadhyamik = program.id === "madhyamik";

  return (
    <div
      id={program.id === "madhyamik" ? "madhyamik" : undefined}
      className={cn(
        "flex h-full scroll-mt-24 flex-col rounded-lg border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        program.featured
          ? "border-gold-400 bg-navy-800 text-white"
          : "border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden="true">
          {program.icon}
        </span>
        {program.badge && (
          <Badge tone={isMadhyamik ? "success" : "gold"}>{program.badge}</Badge>
        )}
      </div>

      <h3
        className={cn(
          "mt-5 font-display text-xl font-semibold",
          program.featured ? "text-white" : "text-navy-900 dark:text-white"
        )}
      >
        {program.name.en}
      </h3>
      <p lang="bn" className={cn("text-sm", program.featured ? "text-gold-300" : "text-navy-500 dark:text-navy-400")}>
        {program.name.bn}
      </p>

      <p className={cn("mt-3 text-sm font-semibold", program.featured ? "text-gold-400" : "text-gold-800 dark:text-gold-400")}>
        {program.duration}
      </p>

      <p className={cn("mt-3 text-sm leading-relaxed", program.featured ? "text-navy-200" : "text-navy-600 dark:text-navy-300")}>
        {program.tagline}
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {program.highlights.map((h) => (
          <li
            key={h}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              program.featured ? "text-navy-100" : "text-navy-700 dark:text-navy-200"
            )}
          >
            <CheckIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", program.featured ? "text-gold-400" : "text-success-text dark:text-success")}
            />
            {h}
          </li>
        ))}
      </ul>

      {isMadhyamik ? (
        <Button href="/#enroll" variant="primary" className="mt-7 w-full">
          Claim Your Free Seat →
        </Button>
      ) : (
        <Button
          href={whatsappLink(whatsappMessages.courseInterest(program.name.en))}
          variant="outline"
          className={cn("mt-7 w-full", !program.featured && "border-navy-800 dark:border-navy-400 dark:text-navy-200")}
        >
          Ask About This Program
        </Button>
      )}
    </div>
  );
}
