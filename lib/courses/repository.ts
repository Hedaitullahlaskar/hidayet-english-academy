import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CourseDetail, CourseLevel, CourseAudience, CourseCategory } from "@/types";

// Re-exported for any Server Component still importing filterOptions from
// here — the real definition lives in ./filterOptions.ts, which has no
// server-only dependency, so client components can import it directly.
export { filterOptions } from "@/lib/courses/filterOptions";

/**
 * COURSE REPOSITORY — the single data-access seam for the whole site.
 *
 * Every page/component reads courses through these functions, never by
 * querying admin_courses directly. This used to be backed by a local
 * TypeScript array (content/courses-data.ts, now deleted) — the comment
 * that lived here said the day this became a real Supabase-backed table,
 * "only the function bodies below change... no page, component, or route
 * will need to change." That's exactly what happened; see
 * COURSES_MODULE_README.md for the migration.
 *
 * Public functions here only ever return status = 'published' courses —
 * enforced both by the query and by admin_courses' own RLS policy
 * ("Anyone can view published courses"), belt-and-suspenders. A course's
 * catalog listing is intentionally public (anonymous visitors must be able
 * to browse and buy); enrollment-gating applies to a course's actual
 * lesson content, not this catalog data.
 */

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

// Raw admin_courses row shape (snake_case, as Postgres returns it).
interface AdminCourseRow {
  slug: string;
  name: string;
  name_bn: string | null;
  tagline: string | null;
  icon: string | null;
  level: string | null;
  audience: string[] | null;
  categories: string[] | null;
  duration: string | null;
  format: string | null;
  language: string | null;
  schedule: string | null;
  overview: string | null;
  who_should_join: string[] | null;
  eligibility: string | null;
  syllabus: string[] | null;
  outcomes: string[] | null;
  weekly_practice: string | null;
  assignments_summary: string | null;
  mock_tests_summary: string | null;
  certificate_status: string | null;
  is_coming_soon: boolean | null;
  is_featured: boolean | null;
  is_free: boolean | null;
}

function mapRowToCourseDetail(row: AdminCourseRow): CourseDetail {
  return {
    slug: row.slug,
    name: row.name,
    nameBn: row.name_bn ?? "",
    tagline: row.tagline ?? "",
    icon: row.icon ?? "📘",
    level: (row.level as CourseLevel) ?? "All Levels",
    audience: (row.audience as CourseAudience[]) ?? [],
    category: (row.categories as CourseCategory[]) ?? [],
    duration: row.duration ?? "",
    format: (row.format as CourseDetail["format"]) ?? "Live",
    language: row.language ?? "",
    schedule: row.schedule ?? "",
    overview: row.overview ?? "",
    whoShouldJoin: row.who_should_join ?? [],
    eligibility: row.eligibility ?? "",
    syllabus: row.syllabus ?? [],
    outcomes: row.outcomes ?? [],
    weeklyPractice: row.weekly_practice ?? "",
    assignments: row.assignments_summary ?? "",
    mockTests: row.mock_tests_summary ?? "",
    certificateStatus: (row.certificate_status as CourseDetail["certificateStatus"]) ?? "coming-soon",
    comingSoon: row.is_coming_soon ?? false,
    featured: row.is_featured ?? false,
    free: row.is_free ?? false,
  };
}

const PUBLISHED_COLUMNS =
  "slug, name, name_bn, tagline, icon, level, audience, categories, duration, format, language, schedule, overview, who_should_join, eligibility, syllabus, outcomes, weekly_practice, assignments_summary, mock_tests_summary, certificate_status, is_coming_soon, is_featured, is_free";

export async function getAllCourses(): Promise<CourseDetail[]> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("admin_courses").select(PUBLISHED_COLUMNS).eq("status", "published");
    return (data ?? []).map(mapRowToCourseDetail);
  }, []);
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("admin_courses")
      .select(PUBLISHED_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data ? mapRowToCourseDetail(data) : null;
  }, null);
}

export async function getAllCourseSlugs(): Promise<string[]> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("admin_courses").select("slug").eq("status", "published");
    return (data ?? []).map((c: { slug: string }) => c.slug);
  }, []);
}

export async function getFeaturedCourses(): Promise<CourseDetail[]> {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("admin_courses")
      .select(PUBLISHED_COLUMNS)
      .eq("status", "published")
      .eq("is_featured", true);
    return (data ?? []).map(mapRowToCourseDetail);
  }, []);
}

export interface CourseFilters {
  level?: CourseLevel;
  audience?: CourseAudience;
  category?: CourseCategory;
}

export async function getFilteredCourses(filters: CourseFilters): Promise<CourseDetail[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => {
    if (filters.level && c.level !== filters.level && c.level !== "All Levels") return false;
    if (filters.audience && !c.audience.includes(filters.audience)) return false;
    if (filters.category && !c.category.includes(filters.category)) return false;
    return true;
  });
}
