import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface PublishedTestimonial {
  id: string;
  student_name: string;
  course_name: string | null;
  quote: string;
  rating: number | null;
}

/**
 * Public, unauthenticated — same pattern as course data. Only ever
 * returns is_published = true rows (enforced both by this query and by
 * the RLS policy itself, belt-and-suspenders).
 */
export async function getPublishedTestimonials(): Promise<PublishedTestimonial[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, student_name, course_name, quote, rating")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}
