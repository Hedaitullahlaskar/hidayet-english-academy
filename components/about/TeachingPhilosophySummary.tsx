import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { learningLoop } from "@/content/site-data";

export function TeachingPhilosophySummary() {
  return (
    <section className="bg-navy-900 py-20 sm:py-28">
      <Container className="text-center">
        <Reveal>
          <Badge tone="gold">Our Teaching Philosophy</Badge>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
            We Don&rsquo;t Just Teach English. We Build Confidence.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance leading-relaxed text-navy-300 sm:text-lg">
            Every HEA lesson follows the same sequence — the natural order
            languages are actually learned in, not the order textbooks
            usually teach them.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {learningLoop.map((stage, i) => (
            <Reveal key={stage.id} delay={i * 60} className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-gold-400/40 bg-navy-800/80 px-4 py-2 text-sm font-semibold text-gold-300">
                <span className="text-gold-500">{stage.step}</span> {stage.title}
              </span>
              {i < learningLoop.length - 1 && (
                <span className="text-gold-500/50" aria-hidden="true">
                  →
                </span>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <Button href="/method" variant="outline" size="lg" className="mt-10 border-white/30 text-white hover:bg-white hover:text-navy-900">
            Explore Our Full Method →
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
