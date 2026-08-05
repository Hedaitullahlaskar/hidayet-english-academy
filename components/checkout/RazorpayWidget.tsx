"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/**
 * Opens Razorpay's hosted checkout widget. Critically, the client-side
 * "payment successful" callback below does NOT grant enrollment — it only
 * moves the UI to a "processing" state. The actual enrollment grant only
 * ever happens in app/api/payments/webhook/razorpay/route.ts, after real
 * signature verification. A client-side callback can be faked by anyone
 * with browser dev tools; a verified server-to-server webhook can't.
 */
export function RazorpayWidget({ gatewayOrderId, keyId }: { gatewayOrderId: string; keyId: string }) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || opened || !window.Razorpay) return;
    setOpened(true);

    const razorpay = new window.Razorpay({
      key: keyId,
      order_id: gatewayOrderId,
      name: "Hidayet English Academy",
      theme: { color: "#0A2540" },
      handler: () => {
        router.push("/checkout/success");
      },
      modal: {
        ondismiss: () => {
          router.push("/checkout/cancelled");
        },
      },
    });
    razorpay.open();
  }, [scriptLoaded, opened, gatewayOrderId, keyId, router]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptLoaded(true)} />
      <div className="text-center">
        <p className="text-navy-600 dark:text-navy-300">Opening secure payment window…</p>
      </div>
    </>
  );
}
