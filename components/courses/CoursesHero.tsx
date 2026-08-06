import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function CoursesHero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="gold">All Courses</Badge>
          <h1 className="mt-6 text-balance font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Find the Right Course for Exactly Where You Are
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-navy-300 sm:text-lg">
            Filter by level, who it&apos;s for, or what you&apos;re trying to
            achieve — every course is taught with the same bilingual,
            speaking-first method.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
