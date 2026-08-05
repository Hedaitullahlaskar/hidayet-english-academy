import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = { robots: { index: false, follow: false } };

export default function CheckoutCancelledPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md text-center">
        <span className="text-3xl" aria-hidden="true">↩️</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">Checkout Cancelled</h1>
        <p className="mt-2 text-navy-600 dark:text-navy-300">No charge was made. You can try again any time.</p>
        <Button href="/courses" size="lg" className="mt-6">Back to Courses →</Button>
      </Container>
    </section>
  );
}
