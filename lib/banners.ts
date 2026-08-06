import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ActiveBanner {
  message: string;
  link_url: string | null;
}

/**
 * Public, unauthenticated — same pattern as lib/testimonials.ts. Filters
 * by the scheduling window (starts_at/ends_at) in addition to the RLS
 * policy's is_active check, since a banner can be active but not yet (or
 * no longer) in its scheduled window.
 */
export async function getActiveBanner(): Promise<ActiveBanner | null> {
  try {
    const supabase = createServerSupabaseClient();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from("site_banners")
      .select("message, link_url, starts_at, ends_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const active = (data ?? []).find((b: { starts_at: string | null; ends_at: string | null }) => {
      if (b.starts_at && b.starts_at > nowIso) return false;
      if (b.ends_at && b.ends_at < nowIso) return false;
      return true;
    });

    return active ? { message: active.message, link_url: active.link_url } : null;
  } catch {
    return null;
  }
}
