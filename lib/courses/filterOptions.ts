import type { CourseLevel, CourseAudience, CourseCategory } from "@/types";

// Deliberately its own file, not part of lib/courses/repository.ts: this
// is a pure constant with no Supabase/next-headers dependency, so client
// components (CourseFilterGrid, doing its filtering entirely in-memory
// from an already-fetched course list) can safely import it. The
// repository file, by contrast, is server-only the moment it touches
// createServerSupabaseClient.
export const filterOptions = {
  levels: ["Beginner", "Intermediate", "Advanced"] as CourseLevel[],
  audiences: ["Children", "Students", "College", "Professionals", "Job Seekers"] as CourseAudience[],
  categories: ["Grammar", "Speaking", "Vocabulary", "Interview", "School", "Career"] as CourseCategory[],
};
