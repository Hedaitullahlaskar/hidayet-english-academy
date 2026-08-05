import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { mission, vision } from "@/content/about-data";

export function MissionVision() {
  return (
    <section id="mission" className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container className="grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-xl border border-navy-100 bg-paper-100 p-8 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-10">
          <span className="text-3xl" aria-hidden="true">
            🧭
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">
            {mission.title}
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-navy-600 dark:text-navy-300">
            {mission.body}
          </p>
        </Reveal>

        <Reveal delay={100} className="rounded-xl border border-navy-100 bg-paper-100 p-8 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-10">
          <span className="text-3xl" aria-hidden="true">
            🔭
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">
            {vision.title}
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-navy-600 dark:text-navy-300">
            {vision.body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
