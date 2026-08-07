import { Tag, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { CreateCouponForm, CouponList, RefundRequestList } from "@/components/admin/PaymentForms";
import { CoursePricingForm } from "@/components/admin/CoursePricingForm";
import {
  getIntegrationSettings,
  getCoupons,
  getRefundRequests,
  getAdminCourses,
  getCoursePricesForAllCourses,
} from "@/lib/admin/repository";

export const metadata = { robots: { index: false, follow: false } };

const gateways = [
  { key: "razorpay", label: "Razorpay", note: "India — UPI, cards, net banking", built: true },
  { key: "stripe", label: "Stripe", note: "International cards, Apple/Google Pay", built: true },
  { key: "paypal", label: "PayPal", note: "Cross-border, diaspora-trusted", built: false },
  { key: "wise", label: "Wise", note: "International transfers", built: false },
];

export default async function AdminPaymentsPage() {
  const [settings, coupons, refunds, courses, prices] = await Promise.all([
    getIntegrationSettings(),
    getCoupons(),
    getRefundRequests(),
    getAdminCourses(),
    getCoursePricesForAllCourses(),
  ]);
  const statusFor = (key: string) => settings.find((s: { service_name: string }) => s.service_name === key)?.is_configured ?? false;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Payment Management</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Razorpay (India) and Stripe (international) are real, working integrations — set a real API key and a
        course price, and checkout goes live. PayPal and Wise are not built yet.
      </p>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Gateway Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gateways.map((g) => (
            <div key={g.key} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-navy-900 dark:text-white">{g.label}</p>
                <Badge tone={!g.built ? "outline" : statusFor(g.key) ? "success" : "gold"}>
                  {!g.built ? "Not Built Yet" : statusFor(g.key) ? "Configured" : "Awaiting API Key"}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{g.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-navy-500 dark:text-navy-400">
          Real API keys are set via environment variables at deploy time, never stored or displayed here — see the Integrations page.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Course Pricing</h2>
        <p className="mb-3 text-sm text-navy-600 dark:text-navy-300">
          This is the only place a price is set — checkout always reads from here, never from anything a browser sends.
        </p>
        <CoursePricingForm courses={courses.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))} />
        {prices.length > 0 && (
          <div className="mt-4 space-y-2">
            {prices.map((p: { id: string; currency: string; amount_minor_units: number; admin_courses: { name: string } | null }) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-3 text-sm shadow-card dark:border-navy-700 dark:bg-navy-800">
                <span className="text-navy-800 dark:text-navy-100">{p.admin_courses?.name ?? "Course"}</span>
                <span className="font-semibold text-navy-900 dark:text-white">{p.currency} {(p.amount_minor_units / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Coupons</h2>
          <CreateCouponForm />
          {coupons.length === 0 ? (
            <EmptyState className="mt-4" icon={<Tag className="h-6 w-6" strokeWidth={1.75} />} title="No coupons yet" body="Discount codes you create will appear here." />
          ) : (
            <CouponList coupons={coupons} />
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-navy-900 dark:text-white">Refund Requests</h2>
          {refunds.length === 0 ? (
            <EmptyState icon={<Undo2 className="h-6 w-6" strokeWidth={1.75} />} title="No refund requests" body="Requests will appear here, and approving one now genuinely calls the gateway's refund API." />
          ) : (
            <RefundRequestList refunds={refunds} />
          )}
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-gold-300 bg-paper-100 p-5 dark:border-navy-700 dark:bg-navy-900">
        <h2 className="font-display text-base font-semibold text-navy-900 dark:text-white">Invoice Generator</h2>
        <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">
          Invoices are generated from real payment records in the <code>orders</code> table. Genuinely still empty
          until a real payment succeeds — not built as a separate module yet, since generating invoice PDFs from
          zero real transactions has nothing honest to show.
        </p>
      </div>
    </div>
  );
}
