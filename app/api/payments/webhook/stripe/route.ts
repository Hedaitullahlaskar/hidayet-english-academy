import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stripeProvider } from "@/lib/payments/providers/stripe";
import { confirmOrderPaid, markOrderFailed } from "@/lib/payments/repository";

/**
 * Same principle as the Razorpay webhook: Stripe's signature verification
 * needs the exact raw request body, so this reads request.text() rather
 * than request.json() — see that file's comment for the full reasoning.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await request.text();

  try {
    const confirmation = await stripeProvider.verifyWebhook(rawBody, signature);

    if (confirmation.status === "paid") {
      await confirmOrderPaid(confirmation.sessionId, confirmation.gatewayReference);
    } else if (confirmation.status === "failed") {
      await markOrderFailed(confirmation.sessionId);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }
}
