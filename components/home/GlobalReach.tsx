import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { globalRegions } from "@/content/site-data";

export function GlobalReach() {
  return (
    <section className="border-b border-navy-100 bg-paper-100 py-12 dark:border-navy-800 dark:bg-navy-900 sm:py-14">
      <Container>
        <Reveal className="text-center">
          <p className="font-display text-xl font-semibold text-navy-900 dark:text-white sm:text-2xl">
            Wherever You Are, We Speak Your Language.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-navy-600 dark:text-navy-300 sm:text-base">
            HEA welcomes Bengali-speaking learners across the world — the same
            expert teaching, the same warm community, with class timing that
            works with your time zone.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {globalRegions.map((region) => (
              <span
                key={region}
                className="rounded-full border border-gold-300 bg-white px-4 py-1.5 text-sm font-semibold text-navy-800 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-100"
              >
                {region}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-navy-300 bg-transparent px-4 py-1.5 text-sm font-medium text-navy-500 dark:border-navy-600 dark:text-navy-400">
              and beyond
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
