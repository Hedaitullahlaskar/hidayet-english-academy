import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function AwardsRecognition() {
  return (
    <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container className="max-w-2xl text-center">
        <SectionHeading eyebrow="Awards & Recognition" title="Recognition Is Still Being Written" />
        <Reveal>
          <div className="mx-auto mt-10 rounded-xl border-2 border-dashed border-navy-200 bg-white p-10 dark:border-navy-700 dark:bg-navy-800">
            <span className="text-4xl" aria-hidden="true">
              🏆
            </span>
            <p className="mt-4 leading-relaxed text-navy-600 dark:text-navy-300">
              We&apos;re early in our digital journey, and any formal awards or
              press recognition will be proudly displayed here as they come.
              What we can tell you today: our reputation was built the
              old-fashioned way — one WhatsApp group, one enrolled student,
              one confident sentence at a time.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
