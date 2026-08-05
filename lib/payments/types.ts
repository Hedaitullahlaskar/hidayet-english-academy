/**
 * PAYMENT PROVIDER ARCHITECTURE.
 *
 * India (INR) routes to Razorpay; every other supported currency routes to
 * Stripe, per the explicit brief (Razorpay for India, Stripe international).
 * SSLCommerz/Bangladesh remains future scope — not built in this pass.
 */

export type SupportedCurrency = "INR" | "USD" | "GBP" | "EUR" | "AED" | "SGD" | "AUD" | "CAD";

export interface CheckoutRequest {
  courseSlug: string;
  amount: number;
  currency: SupportedCurrency;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CheckoutSession {
  provider: string;
  redirectUrl: string;
  sessionId: string;
}

export interface PaymentConfirmation {
  provider: string;
  sessionId: string;
  status: "paid" | "failed" | "pending";
  gatewayReference: string;
}

export interface PaymentProvider {
  name: string;
  supportedCurrencies: SupportedCurrency[];
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  verifyWebhook(payload: unknown, signature: string): Promise<PaymentConfirmation>;
  refund(gatewayReference: string, amount: number): Promise<{ success: boolean }>;
}
