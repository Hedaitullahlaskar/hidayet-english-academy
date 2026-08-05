import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { strugglePoints } from "@/content/method-data";

export function MethodHero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-gold-600/20 blur-3xl" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="gold">Why Most Bengali Speakers Struggle</Badge>
          <h1 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            It Was Never About Intelligence. It Was Always About Method.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-navy-300 sm:text-lg">
            Millions of talented Bengali-speaking students study English for
            over a decade and still freeze the moment they need to say a
            sentence out loud. Here's why — and exactly what we do
            differently.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {strugglePoints.map((point, i) => (
            <Reveal key={point.title} delay={i * 70}>
              <div className="h-full rounded-lg border border-white/10 bg-navy-800/60 p-6 backdrop-blur-sm">
                <h3 className="font-display text-base font-semibold text-white">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
