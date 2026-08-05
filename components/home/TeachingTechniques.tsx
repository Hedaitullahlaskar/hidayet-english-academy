import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { teachingPillars } from "@/content/site-data";

export function TeachingTechniques() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Modern International Child Learning Techniques"
          title="How We Teach Is as Important as What We Teach"
          description="Five research-informed pillars shape every HEA classroom — online and offline."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {teachingPillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={i * 70}>
              <div className="flex h-full flex-col rounded-lg border border-navy-100 bg-white p-6 shadow-card transition-shadow hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800">
                <span className="font-display text-2xl font-semibold text-gold-800 dark:text-gold-400">
                  {pillar.number}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-navy-900 dark:text-white">
                  {pillar.title}
                </h3>
                <ul className="mt-4 flex-1 space-y-2">
                  {pillar.points.map((point) => (
                    <li key={point} className="text-sm leading-snug text-navy-600 dark:text-navy-300">
                      · {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-navy-100 pt-3 text-xs font-bold uppercase tracking-wide text-gold-800 dark:border-navy-700 dark:text-gold-400">
                  {pillar.footerTag}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
