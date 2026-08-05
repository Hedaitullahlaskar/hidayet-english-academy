import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Public, unauthenticated — course prices are meant to be visible to
 * anyone deciding whether to buy. This exists so the course detail pages
 * (statically generated at build time, per generateStaticParams) can
 * still show an accurate "Buy Now" button without needing to become
 * dynamic pages — an admin adding a price later doesn't need a redeploy
 * for the button to appear, since this check happens client-side at
 * request time.
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: course } = await supabase.from("admin_courses").select("id, is_free").eq("slug", params.slug).maybeSingle();

    if (!course || course.is_free) {
      return NextResponse.json({ available: false });
    }

    const { data: prices } = await supabase.from("course_prices").select("currency").eq("admin_course_id", course.id);
    return NextResponse.json({ available: (prices?.length ?? 0) > 0, currencies: prices?.map((p: { currency: string }) => p.currency) ?? [] });
  } catch {
    return NextResponse.json({ available: false });
  }
}
