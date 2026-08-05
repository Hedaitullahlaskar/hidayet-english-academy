import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleBn?: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  titleBn,
  description,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 inline-block font-sans text-xs font-bold uppercase tracking-[0.18em]",
            isDark ? "text-gold-400" : "text-gold-800 dark:text-gold-400"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance text-3xl font-semibold sm:text-4xl",
          isDark ? "text-white" : "text-navy-900 dark:text-white"
        )}
      >
        {title}
      </h2>
      {titleBn && (
        <p
          lang="bn"
          className={cn(
            "mt-1 text-balance text-lg font-medium sm:text-xl",
            isDark ? "text-navy-200" : "text-navy-500 dark:text-navy-300"
          )}
        >
          {titleBn}
        </p>
      )}
      {description && (
        <p
          className={cn(
            "mt-4 text-balance text-base leading-relaxed sm:text-lg",
            isDark ? "text-navy-200" : "text-navy-600 dark:text-navy-300"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
