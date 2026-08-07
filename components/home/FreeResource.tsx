import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GRAMMAR_BLUR } from "@/lib/blur-placeholders";

export function FreeResource() {
  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <Reveal>
          <div className="grid items-center gap-12 rounded-xl border border-navy-100 bg-paper-100 p-8 shadow-card dark:border-navy-700 dark:bg-navy-900 lg:grid-cols-2 lg:p-4">
            <div className="group overflow-hidden rounded-lg border border-navy-100 shadow-card dark:border-navy-700 lg:m-4">
              <Image
                src="/images/resource-present-perfect.jpg"
                alt="Free HEA grammar guide preview — Present Perfect Tense explained in English and Bengali"
                width={900}
                height={450}
                placeholder="blur"
                blurDataURL={GRAMMAR_BLUR}
                className="h-auto w-full transition-transform duration-500 ease-premium group-hover:scale-105"
                sizes="(max-width: 1024px) 90vw, 500px"
              />
            </div>
            <div className="p-6 text-center lg:p-4 lg:text-left">
              <Badge tone="gold">Free Resource</Badge>
              <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900 dark:text-white sm:text-3xl">
                Download a Free Grammar Guide
              </h2>
              <p className="mt-4 text-balance leading-relaxed text-navy-600 dark:text-navy-300">
                Get a sample lesson from our grammar library — explained clearly in
                English and Bengali, exactly the way we teach in class. A taste of
                the structured teaching every HEA student gets.
              </p>
              <Button href="/#enroll" size="lg" className="mt-7">
                Get the Free Guide →
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
