"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CurrencySelector, useCurrency } from "@/components/shared/CurrencySelector";

interface CheckoutFormProps {
  courseSlug: string;
  courseName: string;
}

export function CheckoutForm({ courseSlug, courseName }: CheckoutFormProps) {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handlePay() {
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, currency }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.message ?? "Couldn't start checkout.");
        return;
      }

      if (data.provider === "razorpay") {
        router.push(`/checkout/razorpay/${data.sessionId}`);
      } else {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the payment service — check your connection and try again.");
    }
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-elevated dark:border-navy-700 dark:bg-navy-800 sm:p-8">
      <p className="font-display text-lg font-semibold text-navy-900 dark:text-white">{courseName}</p>

      <div className="mt-5 flex items-center justify-between">
        <label className="text-sm font-semibold text-navy-800 dark:text-navy-100">Pay in</label>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}

      <Button onClick={handlePay} size="lg" className="mt-6 w-full" disabled={status === "loading"}>
        {status === "loading" ? "Starting checkout…" : "Proceed to Payment →"}
      </Button>

      <p className="mt-4 text-center text-xs text-navy-400 dark:text-navy-500">
        Secured by {currency === "INR" ? "Razorpay" : "Stripe"}. We never see or store your card details.
        <br />
        By paying, you agree to our{" "}
        <a href="/legal/payment-policy" className="underline hover:text-gold-800 dark:hover:text-gold-400">Payment Policy</a>{" "}
        and{" "}
        <a href="/legal/refund-and-cancellation-policy" className="underline hover:text-gold-800 dark:hover:text-gold-400">Refund Policy</a>.
      </p>
    </div>
  );
}
