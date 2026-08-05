import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client for use in Client Components. Reads the two public env
 * vars Supabase always exposes safely to the browser. Neither is set yet —
 * see .env.example. Until they are, every call through this client will
 * fail at request time, not silently return fake data; the repository
 * layer (lib/dashboard/repository.ts) catches that and returns honest
 * empty states instead of crashing the page.
 *
 * `persistent` controls "Remember me": true (default) sets a 30-day
 * cookie that survives a browser restart; false sets a session cookie
 * that's cleared when the browser closes. This has to be decided at
 * client-creation time, before sign-in — Supabase doesn't expose a way
 * to change it per-call after the fact.
 */
export function createClient(persistent: boolean = true) {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    persistent ? { cookieOptions: { maxAge: 60 * 60 * 24 * 30 } } : {} // omitting maxAge entirely (not setting it to undefined) is what makes it a true session cookie
  );
}
