import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * getCertificateByCode is intentionally callable without a logged-in
 * session — public certificate verification is the whole point. Safe
 * because the RLS policy on `certificates` (see schema.sql, "Anyone can
 * verify a certificate by exact code") only ever allows lookup by an
 * exact, unguessable code — this function never lists or browses
 * certificates, only fetches one by its precise verification_code.
 */
export async function getCertificateByCode(code: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("certificates")
      .select("*, profiles(full_name)")
      .eq("verification_code", code)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}
