import { Container } from "@/components/ui/Container";
import { RazorpayWidget } from "@/components/checkout/RazorpayWidget";

export const metadata = { robots: { index: false, follow: false } };

export default async function RazorpayCheckoutPage({ params }: { params: Promise<{ gatewayOrderId: string }> }) {
  const { gatewayOrderId } = await params;
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md text-center">
        {keyId ? (
          <RazorpayWidget gatewayOrderId={gatewayOrderId} keyId={keyId} />
        ) : (
          <p className="text-navy-600 dark:text-navy-300">
            Payments aren&apos;t connected yet — NEXT_PUBLIC_RAZORPAY_KEY_ID isn&apos;t set.
          </p>
        )}
      </Container>
    </section>
  );
}
