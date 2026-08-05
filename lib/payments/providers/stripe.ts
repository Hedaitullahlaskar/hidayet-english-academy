import "server-only";
import Stripe from "stripe";
import type { CheckoutRequest, CheckoutSession, PaymentConfirmation, PaymentProvider } from "@/lib/payments/types";

function getClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured — STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(secretKey, { apiVersion: "2024-06-20" });
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export const stripeProvider: PaymentProvider = {
  name: "stripe",
  supportedCurrencies: ["USD", "GBP", "EUR", "AED", "SGD", "AUD", "CAD"],

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    const client = getClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Stripe Checkout is a real hosted payment page — we never collect
    // card details ourselves, which keeps this app out of PCI-DSS scope
    // entirely. That's a deliberate security choice, not a shortcut.
    const session = await client.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: request.currency.toLowerCase(),
            product_data: { name: request.courseSlug },
            unit_amount: request.amount, // minor units (cents) — computed server-side by the caller
          },
          quantity: 1,
        },
      ],
      customer_email: request.customerEmail,
      metadata: { course_slug: request.courseSlug },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    return {
      provider: "stripe",
      redirectUrl: session.url,
      sessionId: session.id,
    };
  },

  /**
   * Verifies a Stripe webhook signature using Stripe's own SDK helper,
   * which needs the exact raw request body — see
   * app/api/payments/webhook/stripe/route.ts for why that matters.
   */
  async verifyWebhook(payload: unknown, signature: string): Promise<PaymentConfirmation> {
    const client = getClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");

    const rawBody = payload as string;
    const event = client.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        provider: "stripe",
        sessionId: session.id,
        status: "paid",
        gatewayReference: (session.payment_intent as string) ?? "",
      };
    }

    return {
      provider: "stripe",
      sessionId: "",
      status: event.type.includes("failed") ? "failed" : "pending",
      gatewayReference: "",
    };
  },

  async refund(gatewayReference: string, amount: number): Promise<{ success: boolean }> {
    const client = getClient();
    try {
      await client.refunds.create({ payment_intent: gatewayReference, amount });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};
