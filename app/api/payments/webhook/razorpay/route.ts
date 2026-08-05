import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { razorpayProvider } from "@/lib/payments/providers/razorpay";
import { confirmOrderPaid, markOrderFailed } from "@/lib/payments/repository";

/**
 * Razorpay webhooks are server-to-server, authenticated by an HMAC
 * signature over the exact raw request body — NOT by a user session, and
 * NOT by anything the client can influence. This is why `request.text()`
 * is used instead of `request.json()`: parsing and re-serializing JSON
 * can change whitespace/key order, which would break byte-for-byte
 * signature verification. The raw text is what actually gets signed.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await request.text();

  try {
    const confirmation = await razorpayProvider.verifyWebhook(rawBody, signature);

    if (confirmation.status === "paid") {
      await confirmOrderPaid(confirmation.sessionId, confirmation.gatewayReference);
    } else if (confirmation.status === "failed") {
      await markOrderFailed(confirmation.sessionId);
    }

    // Razorpay retries a webhook until it receives a 200 — always
    // acknowledge once verified, even for events this app doesn't act on.
    return NextResponse.json({ received: true });
  } catch {
    // Invalid signature or malformed payload — reject without touching
    // any order data. Returning a non-200 here is intentional so Razorpay
    // doesn't mistake a rejected forgery attempt for a successful delivery.
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }
}
