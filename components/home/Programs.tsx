import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { programs } from "@/content/site-data";

export function Programs() {
  return (
    <section id="programs" className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Flagship Programs"
          title="Seven Programs. One Goal: Real English Confidence."
          description="Whether you're facing a board exam, prepping for an interview, or building a career abroad — there's a program built for exactly where you are."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {programs.map((program, i) => (
            <Reveal key={program.id} delay={(i % 4) * 80}>
              <ProgramCard program={program} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/courses" variant="outline" size="md">
            View All 20 Courses →
          </Button>
        </div>
      </Container>
    </section>
  );
}
