import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { supportSystems } from "@/content/method-data";

export function SupportSystems() {
  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Complete Support System"
          title="Everything Around the Lesson Matters Too"
          description="Some of this is how we already teach. Some is actively being built into our new learning platform — labeled honestly, either way."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportSystems.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 80}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-lg border p-6 shadow-card",
                  "border-navy-100 bg-paper-100 dark:border-navy-700 dark:bg-navy-900"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.status === "coming-soon" ? (
                    <Badge tone="gold">Coming Soon</Badge>
                  ) : (
                    <Badge tone="success">Available Now</Badge>
                  )}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-navy-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
