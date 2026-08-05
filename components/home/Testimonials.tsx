import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { whatsappLink } from "@/lib/whatsapp";
import { getPublishedTestimonials } from "@/lib/testimonials";

// Reads real, admin-published testimonials (see /admin/cms) — the honest
// empty state below is what actually renders until a teacher or admin
// publishes a real, consented student testimonial. Never fabricated data.
export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();

  if (testimonials.length === 0) {
    return (
      <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Success Stories"
            title="Real Student Stories — Coming Soon"
            description="We're collecting stories directly from HEA students. Are you one of them? We'd love to feature your journey here."
          />
          <div className="mx-auto mt-10 max-w-lg rounded-xl border border-dashed border-navy-200 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900">
            <p className="text-navy-600 dark:text-navy-300">
              This space is reserved for verified student success stories —
              nothing here is invented.
            </p>
            <a
              href={whatsappLink("Hello, I'd like to share my success story with Hidayet English Academy!")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-gold-800 underline dark:text-gold-400"
            >
              Share your story with us →
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Success Stories" title="What Our Students Say" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} hoverLift className="dark:border-navy-700 dark:bg-navy-900">
              <p className="text-navy-700 dark:text-navy-200">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-display font-semibold text-navy-900 dark:text-white">
                {t.student_name}
              </p>
              {t.course_name && <p className="text-sm text-navy-500 dark:text-navy-400">{t.course_name}</p>}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
