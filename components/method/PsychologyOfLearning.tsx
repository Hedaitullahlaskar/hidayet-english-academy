import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { psychologyPrinciples } from "@/content/method-data";

export function PsychologyOfLearning() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Psychology of Learning English"
          title="Fluency Is a Brain Process, Not a Willpower Problem"
          description="Our method isn't guesswork — it's built around four well-established principles of how people actually acquire a second language."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {psychologyPrinciples.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="flex h-full gap-5 rounded-lg border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-100 text-2xl dark:bg-navy-700" aria-hidden="true">
                  {p.icon}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
