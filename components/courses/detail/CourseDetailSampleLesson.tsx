import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GRAMMAR_BLUR } from "@/lib/blur-placeholders";

export function CourseDetailSampleLesson() {
  return (
    <section className="bg-white py-16 dark:bg-navy-950 sm:py-20">
      <Container className="grid items-center gap-10 rounded-xl border border-navy-100 bg-paper-100 p-6 dark:border-navy-700 dark:bg-navy-900 lg:grid-cols-2 lg:p-4">
        <div className="overflow-hidden rounded-lg border border-navy-100 shadow-card dark:border-navy-700 lg:m-4">
          <Image
            src="/images/resource-present-perfect.jpg"
            alt="A real HEA lesson sample — Present Perfect Tense, explained bilingually"
            width={900}
            height={450}
            placeholder="blur"
            blurDataURL={GRAMMAR_BLUR}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
        </div>
        <div className="p-6 lg:p-4">
          <Badge tone="gold">Sample Lesson</Badge>
          <h2 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">
            See Our Teaching Style Before You Join
          </h2>
          <p className="mt-3 leading-relaxed text-navy-600 dark:text-navy-300">
            This is a real lesson from our grammar library, taught exactly
            the way it looks here — bilingual explanations, real examples,
            and a clear formula you can actually use. Every course is
            taught in this same clear, structured style.
          </p>
        </div>
      </Container>
    </section>
  );
}
