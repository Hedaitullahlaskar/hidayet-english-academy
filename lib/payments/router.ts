import "server-only";
import type { PaymentProvider, SupportedCurrency } from "@/lib/payments/types";
import { razorpayProvider, isRazorpayConfigured } from "@/lib/payments/providers/razorpay";
import { stripeProvider, isStripeConfigured } from "@/lib/payments/providers/stripe";

/**
 * India (INR) → Razorpay. Everything else → Stripe. Real routing, not a
 * stub — both providers above are genuine SDK integrations, inert only
 * until their respective API keys are set.
 */
export function selectProviderForCurrency(currency: SupportedCurrency): PaymentProvider {
  return currency === "INR" ? razorpayProvider : stripeProvider;
}

export function isProviderConfiguredForCurrency(currency: SupportedCurrency): boolean {
  return currency === "INR" ? isRazorpayConfigured() : isStripeConfigured();
}
