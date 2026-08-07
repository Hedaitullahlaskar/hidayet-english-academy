import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { trustStats } from "@/content/site-data";

export function TrustStats() {
  return (
    <section className="border-b border-navy-100 bg-white py-10 dark:border-navy-800 dark:bg-navy-950">
      <Container className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:divide-x lg:divide-navy-100 dark:lg:divide-navy-800">
        {trustStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 80} className="group text-center transition-transform duration-300 ease-premium hover:-translate-y-0.5">
            <p className="font-display text-3xl font-semibold text-navy-900 transition-colors dark:text-white sm:text-4xl group-hover:text-gold-800 dark:group-hover:text-gold-400">
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
