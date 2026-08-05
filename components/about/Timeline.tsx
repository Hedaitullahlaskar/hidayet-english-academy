import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/content/about-data";

export function Timeline() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Our Journey" title="How We Got Here" />
        <ol className="relative mt-14 space-y-10 border-l-2 border-gold-300 pl-8 dark:border-navy-700">
          {timeline.map((item, i) => (
            <Reveal as="li" key={item.era} delay={i * 80} className="relative">
              <span className="absolute -left-[2.55rem] flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold-500 bg-white dark:bg-navy-900" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-gold-600" />
              </span>
              <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-white">
                {item.era}
              </h3>
              <p className="mt-1.5 leading-relaxed text-navy-600 dark:text-navy-300">{item.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
