import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { FounderPortrait } from "@/components/ui/FounderPortrait";
import { site } from "@/content/site-data";

export function FounderSpotlight() {
  return (
    <section id="founder" className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="mx-auto w-full max-w-xs">
          <FounderPortrait size="lg" />
        </Reveal>

        <Reveal className="text-center lg:text-left" delay={120}>
          <Badge tone="gold">Meet Your Teacher</Badge>
          <h2 className="mt-5 font-display text-3xl font-semibold text-navy-900 dark:text-white sm:text-4xl">
            {site.founder.name}
          </h2>
          <p className="mt-2 font-semibold text-gold-800 dark:text-gold-400">{site.founder.experience}</p>

          <ul className="mx-auto mt-6 max-w-md space-y-2.5 lg:mx-0">
            {site.founder.roles.map((role) => (
              <li key={role} className="flex items-start gap-3 text-navy-700 dark:text-navy-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />
                <span>{role}</span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-6 max-w-lg text-balance leading-relaxed text-navy-600 dark:text-navy-300 lg:mx-0">
            For over a decade, Hidayet Sir has helped Bengali-speaking
            students — from board-exam candidates to working professionals
            abroad — build real English confidence. Structured grammar,
            daily speaking practice, and a teaching style that travels
            wherever you live.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
