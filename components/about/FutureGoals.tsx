import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";
import { futureGoals } from "@/content/about-data";

export function FutureGoals() {
  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Future Goals"
          title="We're Not Finished. We're Just Getting Started."
        />
        <ul className="mt-10 space-y-5">
          {futureGoals.map((goal, i) => (
            <Reveal
              as="li"
              key={goal}
              delay={i * 90}
              className="flex items-start gap-4 rounded-lg border border-navy-100 bg-paper-100 p-5 dark:border-navy-700 dark:bg-navy-900"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 dark:bg-navy-800 dark:text-gold-400">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="leading-relaxed text-navy-700 dark:text-navy-200">{goal}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
