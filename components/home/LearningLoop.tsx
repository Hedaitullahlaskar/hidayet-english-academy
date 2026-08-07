import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { learningLoop } from "@/content/site-data";

export function LearningLoop() {
  return (
    <section id="method" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Teaching Philosophy"
          title="We don't just teach English. We build confidence."
          description="Every HEA lesson follows the same proven sequence — the natural order languages are actually learned in, not the order textbooks usually teach them."
        />

        <div className="relative mt-16">
          {/* connecting line for larger screens */}
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent lg:block"
            aria-hidden="true"
          />
          <ol className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {learningLoop.map((stage, i) => (
              <Reveal key={stage.id} as="li" delay={i * 70} className="group relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500 bg-navy-800 font-display text-xl font-semibold text-gold-300 shadow-gold transition-transform duration-300 ease-premium group-hover:-translate-y-1 group-hover:scale-105">
                  {stage.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 dark:text-white">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {stage.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Button href="/method" variant="outline" size="md">
            See the Full Method &amp; Psychology Behind It →
          </Button>
        </div>
      </Container>
    </section>
  );
}
