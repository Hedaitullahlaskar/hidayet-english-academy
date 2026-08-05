import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * SERVICE-ROLE CLIENT — bypasses Row-Level Security entirely. This is the
 * first legitimate use of SUPABASE_SERVICE_ROLE_KEY anywhere in this
 * codebase (verified by grep in every prior module's security review).
 *
 * The `import "server-only"` line is not decorative — it makes Next.js
 * throw a build error if this file is ever imported from a Client
 * Component, which is the actual guardrail that keeps this key out of the
 * browser bundle, not just a comment promising it won't happen.
 *
 * Only ever call this from Route Handlers that have already independently
 * verified the caller's identity and authorization (see
 * app/api/account/delete/route.ts for the pattern).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Service-role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set."
    );
  }

  return createSupabaseClient<any>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
