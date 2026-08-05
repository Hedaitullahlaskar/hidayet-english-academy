export type UserRole = "student" | "teacher" | "admin";

/**
 * Single source of truth for "who can access what," mirroring the
 * is_staff()/is_admin() SQL functions in schema.sql. Previously this logic
 * was duplicated inline across middleware.ts and three separate layouts
 * (dashboard/teach/admin) — small enough each time not to have caused a
 * bug yet, but exactly the kind of duplication that eventually does.
 */
export function canAccessDashboard(role: UserRole | null | undefined): boolean {
  return role === "student" || role === "teacher" || role === "admin";
}

export function canAccessTeach(role: UserRole | null | undefined): boolean {
  return role === "teacher" || role === "admin";
}

export function canAccessAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function loginPathFor(area: "dashboard" | "teach" | "admin"): string {
  if (area === "teach") return "/teach/login";
  if (area === "admin") return "/admin/login";
  return "/login";
}

/**
 * The other half of "Student → Student Dashboard, Teacher → Teacher
 * Dashboard, Admin → Super Admin Dashboard": given a role fetched right
 * after authentication, this is the one place that decides where to send
 * them. Used by LoginForm, OtpLoginForm, and the OAuth callback route so
 * all three login methods land in the same place for the same role,
 * rather than each hardcoding its own redirect.
 */
export function dashboardPathFor(role: UserRole | null | undefined): string {
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teach";
  return "/dashboard";
}
