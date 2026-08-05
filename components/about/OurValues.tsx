import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ourValues } from "@/content/about-data";

export function OurValues() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Stand For"
          title="Our Values"
          description="Not words on a wall — the standard every lesson is held to."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {ourValues.map((value, i) => (
            <Reveal key={value.title} delay={i * 70}>
              <div className="flex h-full flex-col rounded-lg border border-navy-100 bg-white p-6 shadow-card transition-shadow hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800">
                <span className="text-3xl" aria-hidden="true">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
