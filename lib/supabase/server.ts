import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server client for use in Server Components, Server Actions, and Route
 * Handlers — reads/writes the auth session via cookies. Same real SDK
 * pattern as the browser client; same "not connected yet" caveat.
 *
 * The explicit <any> here is deliberate, not sloppy: without a generated
 * Database schema type (there's no live Supabase project to generate one
 * from), Supabase's client falls back to its own internal generic schema
 * inference for every .from(table).select(...) call — which, empirically,
 * doesn't reliably resolve to `any` on its own and can produce narrow,
 * unexpected types like `{}` for query results, breaking real `tsc`
 * builds in ways that have nothing to do with actual application logic.
 * Passing <any> here means every query across the whole app is honestly
 * treated as the untyped data it actually is, everywhere at once, rather
 * than needing a workaround at each of the 70+ individual call sites.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component that can't set cookies —
            // safe to ignore if middleware.ts is refreshing the session.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}
