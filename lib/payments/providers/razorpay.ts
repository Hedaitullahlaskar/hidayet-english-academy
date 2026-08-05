import "server-only";
import Razorpay from "razorpay";
import crypto from "crypto";
import type { CheckoutRequest, CheckoutSession, PaymentConfirmation, PaymentProvider } from "@/lib/payments/types";

/**
 * Real Razorpay integration — India only, per the explicit brief. Not a
 * mock: this calls the actual Razorpay Orders API. It's simply inert
 * until RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are set, exactly like every
 * other integration in this app (Anthropic, Supabase, etc.) — same
 * honest pattern throughout, not a special case for payments.
 */
function getClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured — RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export const razorpayProvider: PaymentProvider = {
  name: "razorpay",
  supportedCurrencies: ["INR"],

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    const client = getClient();

    // Razorpay's "order" here is their term for a checkout session, not
    // this app's own `orders` table row — the route handler that calls
    // this creates both, and stores this gateway order id on our row.
    const gatewayOrder = await client.orders.create({
      amount: request.amount, // already minor units (paise) — computed server-side by the caller
      currency: request.currency,
      notes: {
        course_slug: request.courseSlug,
        customer_email: request.customerEmail,
      },
    });

    return {
      provider: "razorpay",
      // Razorpay's Checkout is a client-side JS widget, not a hosted
      // redirect URL like Stripe — the "redirectUrl" here is our own
      // checkout page, which opens the Razorpay widget using this order id.
      redirectUrl: `/checkout/razorpay/${gatewayOrder.id}`,
      sessionId: gatewayOrder.id,
    };
  },

  /**
   * Verifies a Razorpay webhook signature — HMAC-SHA256 of the raw request
   * body using the webhook secret, compared against the X-Razorpay-Signature
   * header. This MUST run against the raw, unparsed body — see
   * app/api/payments/webhook/razorpay/route.ts for why that matters.
   */
  async verifyWebhook(payload: unknown, signature: string): Promise<PaymentConfirmation> {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set.");

    const rawBody = payload as string;
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Invalid Razorpay webhook signature.");
    }

    const event = JSON.parse(rawBody);
    const paymentEntity = event.payload?.payment?.entity;

    return {
      provider: "razorpay",
      sessionId: paymentEntity?.order_id ?? "",
      status: event.event === "payment.captured" ? "paid" : event.event === "payment.failed" ? "failed" : "pending",
      gatewayReference: paymentEntity?.id ?? "",
    };
  },

  async refund(gatewayReference: string, amount: number): Promise<{ success: boolean }> {
    const client = getClient();
    try {
      await client.payments.refund(gatewayReference, { amount });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};
