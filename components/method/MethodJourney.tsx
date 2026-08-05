import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { methodJourney } from "@/content/method-data";

export function MethodJourney() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Student Success Journey"
          title="How the Method Carries You, Step by Step"
        />
        <div className="relative mt-16">
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent lg:block"
            aria-hidden="true"
          />
          <ol className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {methodJourney.map((item, i) => (
              <Reveal
                as="li"
                key={item.step}
                delay={i * 70}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500 bg-navy-800 font-display text-xl font-semibold text-gold-300 shadow-gold">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {item.tie}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
