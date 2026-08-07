import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata = { robots: { index: false, follow: false } };

export default function CheckoutSuccessPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md animate-fade-up text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-elevated dark:bg-navy-800" aria-hidden="true">
          ✅
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-navy-900 dark:text-white">Payment Received</h1>
        <p className="mt-2 leading-relaxed text-navy-600 dark:text-navy-300">
          We&apos;re confirming your payment now — your enrollment activates automatically the moment it&apos;s verified,
          usually within a few seconds.
        </p>
        <Button href="/dashboard/courses" size="lg" className="mt-7">Go to My Courses →</Button>
      </Container>
    </section>
  );
}
