import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function MethodFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-center sm:py-24">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-600/20 blur-3xl" />
      <Container className="relative">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
            Now You Know How We Teach. Come Experience It.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-navy-300">
            The best way to understand the method is to sit in a class. Your
            first one is free.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/#enroll" size="lg">
              Join Free Class →
            </Button>
            <Button href="/#programs" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-navy-900">
              Explore Programs
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
