import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillSystemsExplorer } from "@/components/method/SkillSystemsExplorer";

export function SkillSystemsSection() {
  return (
    <section id="skills" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Six Systems, One Method"
          title="Grammar. Vocabulary. Pronunciation. Speaking. Listening. Writing."
          description="Tap any system below to see exactly how we teach it."
        />
        <SkillSystemsExplorer />
      </Container>
    </section>
  );
}
