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
/**
 * Deliberately kept synchronous (not `async function`), even though
 * Next.js 15 made `cookies()` itself return a Promise — @supabase/ssr's
 * cookie methods (get/set/remove) are typed to accept either a value or
 * a Promise of one, so each method just `await`s `cookies()` internally
 * instead. That's what makes this a one-file fix: every one of this
 * app's 60+ call sites (`const supabase = createServerSupabaseClient()`)
 * keeps working completely unchanged, rather than every repository
 * function needing to become `await createServerSupabaseClient()`.
 */
export function createServerSupabaseClient() {
  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component that can't set cookies —
            // safe to ignore if middleware.ts is refreshing the session.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}
