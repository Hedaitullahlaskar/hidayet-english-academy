import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ourImpact } from "@/content/about-data";

export function OurImpact() {
  return (
    <section className="bg-gradient-navy py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <Reveal>
          <Badge tone="gold">{ourImpact.title}</Badge>
          <p className="mx-auto mt-6 text-balance font-display text-2xl font-medium italic leading-relaxed text-white sm:text-3xl">
            &ldquo;{ourImpact.body}&rdquo;
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
