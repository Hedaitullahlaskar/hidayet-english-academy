import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getCourseBySlug } from "@/lib/courses/repository";

export const metadata = { robots: { index: false, follow: false } };

export default async function CheckoutPage({ params }: { params: { courseSlug: string } }) {
  const course = await getCourseBySlug(params.courseSlug);
  if (!course) notFound();

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md">
        <h1 className="mb-6 text-center font-display text-2xl font-semibold text-navy-900 dark:text-white">
          Complete Your Enrollment
        </h1>
        <CheckoutForm courseSlug={params.courseSlug} courseName={course.name} />
      </Container>
    </section>
  );
}
