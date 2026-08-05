import { coursesData } from "@/content/courses-data";
import type { CourseDetail, CourseLevel, CourseAudience, CourseCategory } from "@/types";

/**
 * COURSE REPOSITORY — the single data-access seam for the whole site.
 *
 * Every page/component reads courses through these functions, never by
 * importing `coursesData` directly. Today, these functions are backed by a
 * local TypeScript array. When Module 0 (Supabase backend) and Module 12
 * (Admin Dashboard) are built, only the function bodies below change to
 * query the database — no page, component, or route will need to change.
 *
 * This is intentionally written as async, exactly as a real database call
 * would be, so the swap later is mechanical rather than a rewrite.
 */

export async function getAllCourses(): Promise<CourseDetail[]> {
  return coursesData;
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  return coursesData.find((c) => c.slug === slug) ?? null;
}

export async function getAllCourseSlugs(): Promise<string[]> {
  return coursesData.map((c) => c.slug);
}

export async function getFeaturedCourses(): Promise<CourseDetail[]> {
  return coursesData.filter((c) => c.featured);
}

export interface CourseFilters {
  level?: CourseLevel;
  audience?: CourseAudience;
  category?: CourseCategory;
}

export async function getFilteredCourses(filters: CourseFilters): Promise<CourseDetail[]> {
  return coursesData.filter((c) => {
    if (filters.level && c.level !== filters.level && c.level !== "All Levels") return false;
    if (filters.audience && !c.audience.includes(filters.audience)) return false;
    if (filters.category && !c.category.includes(filters.category)) return false;
    return true;
  });
}

export const filterOptions = {
  levels: ["Beginner", "Intermediate", "Advanced"] as CourseLevel[],
  audiences: ["Children", "Students", "College", "Professionals", "Job Seekers"] as CourseAudience[],
  categories: ["Grammar", "Speaking", "Vocabulary", "Interview", "School", "Career"] as CourseCategory[],
};
