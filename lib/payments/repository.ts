import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/client";
import { enrollmentConfirmationEmail, paymentReceiptEmail } from "@/lib/email/templates";
import type { SupportedCurrency } from "@/lib/payments/types";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/**
 * The only place a price is ever read from for a real charge. Never
 * accept a price from the client — this is why.
 */
export async function getCoursePriceForCurrency(courseSlug: string, currency: SupportedCurrency) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data: course } = await supabase.from("admin_courses").select("id, is_free").eq("slug", courseSlug).single();
    if (!course || course.is_free) return null;

    const { data: price } = await supabase
      .from("course_prices")
      .select("amount_minor_units")
      .eq("admin_course_id", course.id)
      .eq("currency", currency)
      .maybeSingle();

    if (!price) return null;
    return { adminCourseId: course.id as string, amountMinorUnits: price.amount_minor_units as number };
  }, null);
}

export async function createPendingOrder(input: {
  studentId: string;
  adminCourseId: string;
  provider: "razorpay" | "stripe";
  currency: SupportedCurrency;
  amountMinorUnits: number;
}): Promise<{ orderId: string } | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      student_id: input.studentId,
      admin_course_id: input.adminCourseId,
      provider: input.provider,
      currency: input.currency,
      amount_minor_units: input.amountMinorUnits,
    })
    .select("id")
    .single();

  return error ? null : { orderId: data.id };
}

export async function attachGatewayOrderId(orderId: string, gatewayOrderId: string) {
  const supabase = createServerSupabaseClient();
  await supabase.from("orders").update({ gateway_order_id: gatewayOrderId }).eq("id", orderId);
}

/**
 * Called ONLY from webhook handlers, using the service-role client — a
 * webhook is a server-to-server call authenticated by signature
 * verification, not a logged-in user session, so RLS's `is_staff()`
 * write policy doesn't apply here and shouldn't need to.
 *
 * Idempotent by design: if this order is already 'paid' (a gateway
 * retrying a webhook delivery is normal, expected behavior), this is a
 * no-op rather than double-granting enrollment.
 */
export async function confirmOrderPaid(gatewayOrderId: string, gatewayPaymentId: string): Promise<boolean> {
  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("*").eq("gateway_order_id", gatewayOrderId).maybeSingle();
  if (!order) return false;
  if (order.status === "paid") return true; // already processed — idempotent

  const { data: course } = await admin.from("admin_courses").select("slug, name").eq("id", order.admin_course_id).single();

  const { error: updateError } = await admin
    .from("orders")
    .update({ status: "paid", gateway_payment_id: gatewayPaymentId, updated_at: new Date().toISOString() })
    .eq("id", order.id);
  if (updateError) return false;

  if (course) {
    await admin.from("enrollments").upsert(
      { student_id: order.student_id, course_slug: course.slug, status: "active" },
      { onConflict: "student_id,course_slug" }
    );

    // Real emails, not a "TODO: notify user" comment. Failure to send
    // never blocks or reverses the payment/enrollment above — see
    // lib/email/client.ts for why that ordering matters.
    const { data: student } = await admin.from("profiles").select("full_name, email").eq("id", order.student_id).single();
    if (student?.email) {
      const courseName = course.name ?? course.slug;
      const enrollmentEmail = enrollmentConfirmationEmail(student.full_name, courseName);
      await sendEmail(student.email, enrollmentEmail.subject, enrollmentEmail.html);

      const receiptEmail = paymentReceiptEmail(student.full_name, courseName, order.amount_minor_units, order.currency);
      await sendEmail(student.email, receiptEmail.subject, receiptEmail.html);
    }
  }

  await admin.from("audit_logs").insert({
    action: "payment_confirmed",
    target_table: "orders",
    target_id: order.id,
    details: { provider: order.provider, amount_minor_units: order.amount_minor_units, currency: order.currency },
  });

  return true;
}

export async function markOrderFailed(gatewayOrderId: string) {
  const admin = createAdminClient();
  await admin.from("orders").update({ status: "failed", updated_at: new Date().toISOString() }).eq("gateway_order_id", gatewayOrderId);
}

export async function getMyOrders() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("orders")
      .select("*, admin_courses(name)")
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}
