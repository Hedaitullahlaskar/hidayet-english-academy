import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { learningFramework } from "@/content/method-data";

export function LearningFramework() {
  return (
    <section id="framework" className="bg-navy-900 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Step-by-Step Learning Framework"
          title="The Order Languages Are Actually Learned In"
          tone="dark"
          description="Not the order textbooks teach them in. Every HEA lesson — regardless of program — moves through this same sequence."
        />

        <ol className="relative mx-auto mt-16 max-w-4xl">
          <div
            className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-gold-500/60 via-gold-500/30 to-transparent"
            aria-hidden="true"
          />
          {learningFramework.map((stage, i) => (
            <Reveal as="li" key={stage.step} delay={i * 90} className="relative mb-10 flex gap-6 last:mb-0">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-navy-800 font-display text-lg font-semibold text-gold-300 shadow-gold">
                {stage.step}
              </span>
              <div className="rounded-lg border border-white/10 bg-navy-800/50 p-5 backdrop-blur-sm">
                <h3 className="font-display text-lg font-semibold text-white">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">{stage.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
