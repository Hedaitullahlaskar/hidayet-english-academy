import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { theProblem } from "@/content/about-data";

export function TheProblem() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading eyebrow={theProblem.eyebrow} title={theProblem.title} />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-xl border border-navy-200 bg-white p-8 shadow-card dark:border-navy-700 dark:bg-navy-800 sm:p-10">
            <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white">
              {theProblem.problemHeading}
            </h3>
            <ul className="mt-6 space-y-4">
              {theProblem.problemPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-navy-600 dark:text-navy-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-400" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="rounded-xl border border-gold-400 bg-navy-800 p-8 shadow-elevated sm:p-10">
            <h3 className="font-display text-xl font-semibold text-white">
              {theProblem.possibilityHeading}
            </h3>
            <ul className="mt-6 space-y-4">
              {theProblem.possibilityPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-navy-100">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
