import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCoursePriceForCurrency, createPendingOrder, attachGatewayOrderId } from "@/lib/payments/repository";
import { selectProviderForCurrency, isProviderConfiguredForCurrency } from "@/lib/payments/router";
import type { SupportedCurrency } from "@/lib/payments/types";

const VALID_CURRENCIES: SupportedCurrency[] = ["INR", "USD", "GBP", "EUR", "AED", "SGD", "AUD", "CAD"];

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { courseSlug?: string; currency?: string };
  const { courseSlug, currency } = body;

  if (!courseSlug || !currency || !VALID_CURRENCIES.includes(currency as SupportedCurrency)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const typedCurrency = currency as SupportedCurrency;

  if (!isProviderConfiguredForCurrency(typedCurrency)) {
    return NextResponse.json(
      { error: "not_configured", message: "Payments aren't connected yet for this currency — no gateway key is set." },
      { status: 503 }
    );
  }

  // The ONLY price this route trusts — never the client. If no price row
  // exists for this course+currency, checkout correctly cannot proceed,
  // rather than falling back to a guessed or client-supplied amount.
  const price = await getCoursePriceForCurrency(courseSlug, typedCurrency);
  if (!price) {
    return NextResponse.json(
      { error: "no_price", message: "This course doesn't have a price set for that currency yet." },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, email, phone").eq("id", user.id).single();

  const pendingOrder = await createPendingOrder({
    studentId: user.id,
    adminCourseId: price.adminCourseId,
    provider: typedCurrency === "INR" ? "razorpay" : "stripe",
    currency: typedCurrency,
    amountMinorUnits: price.amountMinorUnits,
  });
  if (!pendingOrder) {
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 500 });
  }

  const provider = selectProviderForCurrency(typedCurrency);

  try {
    const session = await provider.createCheckoutSession({
      courseSlug,
      amount: price.amountMinorUnits,
      currency: typedCurrency,
      customerName: profile?.full_name ?? "Student",
      customerEmail: profile?.email ?? user.email ?? "",
      customerPhone: profile?.phone ?? "",
    });

    await attachGatewayOrderId(pendingOrder.orderId, session.sessionId);

    return NextResponse.json({ redirectUrl: session.redirectUrl, sessionId: session.sessionId, provider: provider.name });
  } catch {
    return NextResponse.json({ error: "The payment gateway couldn't be reached. Please try again shortly." }, { status: 502 });
  }
}
