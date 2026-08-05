import { IntegrationStatusGrid } from "@/components/admin/IntegrationStatusGrid";
import { getIntegrationSettings } from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

const integrations = [
  { key: "razorpay", label: "Razorpay (Payments) — built", envVarHint: "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET" },
  { key: "stripe", label: "Stripe (Payments) — built", envVarHint: "STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET" },
  { key: "paypal", label: "PayPal (Payments) — not built yet", envVarHint: "No integration code exists yet — setting a key here does nothing until it's built." },
  { key: "wise", label: "Wise (Payments) — not built yet", envVarHint: "No integration code exists yet — setting a key here does nothing until it's built." },
  { key: "email", label: "Email (Transactional)", envVarHint: "RESEND_API_KEY or similar" },
  { key: "whatsapp", label: "WhatsApp Business API", envVarHint: "WHATSAPP_BUSINESS_TOKEN" },
  { key: "ai", label: "AI Study Assistant", envVarHint: "ANTHROPIC_API_KEY" },
];

export default async function AdminIntegrationsPage() {
  const settings = await getIntegrationSettings();
  const configuredMap = Object.fromEntries(
    integrations.map((i) => [i.key, settings.find((s: { service_name: string }) => s.service_name === i.key)?.is_configured ?? false])
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Integrations &amp; API Keys</h1>
      <p className="mt-1 max-w-2xl text-navy-600 dark:text-navy-300">
        By design, no API key or secret is ever stored in this table or rendered into a browser. This page tracks
        <em> whether</em> each integration is configured, not the credential itself — real values live in
        environment variables, set at deploy time.
      </p>
      <div className="mt-8">
        <IntegrationStatusGrid integrations={integrations} configuredMap={configuredMap} />
      </div>
    </div>
  );
}
