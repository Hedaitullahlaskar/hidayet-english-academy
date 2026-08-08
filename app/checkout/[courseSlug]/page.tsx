import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCourseBySlug } from "@/lib/courses/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" />
      <Container className="relative max-w-md">
        <h1 className="mb-6 text-center font-display text-3xl font-semibold text-navy-900 dark:text-white">
          Complete Your Enrollment
        </h1>
        <div className="animate-fade-up">
          <CheckoutForm courseSlug={courseSlug} courseName={course.name} />
        </div>
      </Container>
    </section>
  );
}
