import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { FounderPortrait } from "@/components/ui/FounderPortrait";
import { founderStory } from "@/content/about-data";

export function FounderStoryHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy py-20 sm:py-28">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-gold-600/20 blur-3xl" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="mx-auto w-full max-w-xs">
          <FounderPortrait size="lg" priority />
        </Reveal>

        <Reveal delay={100} className="text-center lg:text-left">
          <Badge tone="gold">{founderStory.eyebrow}</Badge>
          <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {founderStory.title}
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 lg:mx-0">
            {founderStory.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === founderStory.paragraphs.length - 1
                    ? "text-balance font-display text-lg italic text-gold-300 sm:text-xl"
                    : "text-balance leading-relaxed text-navy-200 sm:text-lg"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
