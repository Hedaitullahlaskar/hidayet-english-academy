import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Two responsibilities:
 * 1. Geo-detection (from Module 4) — sets a `hea-country` cookie from
 *    Vercel's edge header, real only once deployed.
 * 2. Session refresh + route protection for the Student LMS — redirects
 *    unauthenticated visitors away from /dashboard/*. This will correctly
 *    let nobody through until real Supabase credentials exist, since an
 *    unconfigured client can never produce a valid session — that's the
 *    honest, safe failure mode for a protected route with no backend yet.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const country = request.headers.get("x-vercel-ip-country") ?? null;
  if (country) {
    response.cookies.set("hea-country", country, { path: "/", maxAge: 60 * 60 * 24 });
  }

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isTeachRoute = request.nextUrl.pathname.startsWith("/teach") && request.nextUrl.pathname !== "/teach/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login";
  const isAccountRoute = request.nextUrl.pathname.startsWith("/account");
  if (!isDashboardRoute && !isTeachRoute && !isAdminRoute && !isAccountRoute) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginPath = isAdminRoute ? "/admin/login" : isTeachRoute ? "/teach/login" : "/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Teacher routes accept teacher OR admin. Admin routes accept admin ONLY —
  // a teacher's valid session must be explicitly rejected here too, not
  // just "not a student."
  if (isTeachRoute || isAdminRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = profile?.role;
    const allowed = isAdminRoute ? role === "admin" : role === "teacher" || role === "admin";
    if (!allowed) {
      const rejectPath = isAdminRoute ? "/admin/login?error=not_admin" : "/teach/login?error=not_staff";
      return NextResponse.redirect(new URL(rejectPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
