import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { whyChooseHEA } from "@/content/about-data";

export function WhyChooseHEA() {
  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Why Choose HEA" title="What Actually Makes Us Different" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseHEA.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="flex h-full flex-col items-center rounded-lg border border-navy-100 bg-paper-100 p-6 text-center shadow-card transition-shadow hover:shadow-elevated dark:border-navy-700 dark:bg-navy-900">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-2xl dark:bg-navy-800" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-navy-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
