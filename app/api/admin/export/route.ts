import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { exportTableAsJson } from "@/lib/admin/repository";

export async function GET(request: NextRequest) {
  // Defense in depth again: middleware already gates /admin/*, but a route
  // handler under /api is a distinct surface and must not assume the
  // request only ever arrives via a page a browser navigated to.
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const table = request.nextUrl.searchParams.get("table") ?? "";
  const result = await exportTableAsJson(table);

  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ data: result.data });
}
