import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site-data";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-600/20 blur-3xl" />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
          One Step Today, Better English Tomorrow.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-navy-300">
          Join Hidayet English Academy and start your journey toward real
          fluency — structured, supported, and built for Bengali speakers.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/#enroll" size="lg">
            Join Free Class →
          </Button>
          <Button
            href={`tel:${site.phone}`}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-navy-900"
          >
            Call Now: {site.phoneDisplay}
          </Button>
        </div>
      </Container>
    </section>
  );
}
