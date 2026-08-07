import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = { robots: { index: false, follow: false } };

export default function CheckoutCancelledPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md animate-fade-up text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-elevated dark:bg-navy-800" aria-hidden="true">
          ↩️
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-navy-900 dark:text-white">Checkout Cancelled</h1>
        <p className="mt-2 leading-relaxed text-navy-600 dark:text-navy-300">No charge was made. You can try again any time.</p>
        <Button href="/courses" size="lg" className="mt-7">Back to Courses →</Button>
      </Container>
    </section>
  );
}
