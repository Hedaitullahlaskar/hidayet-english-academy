import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { trustStats } from "@/content/site-data";

export function TrustStats() {
  return (
    <section className="border-b border-navy-100 bg-white py-10 dark:border-navy-800 dark:bg-navy-950">
      <Container className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {trustStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80} className="text-center">
            <p className="font-display text-3xl font-semibold text-navy-900 dark:text-white sm:text-4xl">
              {stat.value}
              <span className="ml-1 text-xl text-gold-800 dark:text-gold-400">{stat.suffix}</span>
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-navy-500 dark:text-navy-400 sm:text-sm">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
