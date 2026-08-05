import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";
import { MADHYAMIK_BLUR } from "@/lib/blur-placeholders";
import { offerHighlights, trustBadges } from "@/content/site-data";

export function MadhyamikOffer() {
  return (
    <section id="madhyamik" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <Badge tone="navy">Special Offer</Badge>
          <h2 className="mt-5 text-balance font-display text-3xl font-semibold text-navy-900 dark:text-white sm:text-4xl">
            Attention, Class 10 Students —{" "}
            <span className="text-gold-700 dark:text-gold-400">This One&rsquo;s for You.</span>
          </h2>
          <p lang="bn" className="mt-2 text-lg font-medium text-navy-600 dark:text-navy-300">
            মাধ্যমিক শিক্ষার্থীদের জন্য সম্পূর্ণ বিনামূল্যে ইংলিশ প্রোগ্রাম
          </p>
          <p className="mt-5 text-balance leading-relaxed text-navy-600 dark:text-navy-300">
            A dedicated, 100% free English program built around the Madhyamik
            syllabus — because every board-exam student deserves expert
            guidance, regardless of budget.
          </p>

          <ul className="mt-7 space-y-3">
            {offerHighlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-navy-800 dark:text-navy-100">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 dark:bg-navy-800 dark:text-gold-400">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/#enroll" size="lg">
              Claim Your Free Seat →
            </Button>
            <div className="flex gap-2">
              {trustBadges.map((b) => (
                <Badge key={b} tone="success">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 mx-auto w-full max-w-sm lg:order-2" delay={120}>
          <div className="overflow-hidden rounded-xl border border-navy-100 shadow-elevated dark:border-navy-700">
            <Image
              src="/images/madhyamik-offer.jpg"
              alt="Madhyamik students special offer — 100% free English program for Class 10 students at Hidayet English Academy"
              width={700}
              height={1050}
              placeholder="blur"
              blurDataURL={MADHYAMIK_BLUR}
              className="h-auto w-full"
              sizes="(max-width: 640px) 90vw, 400px"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
