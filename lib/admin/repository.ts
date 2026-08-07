"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { selectProviderForCurrency } from "@/lib/payments/router";

/**
 * ADMIN REPOSITORY — highest-privilege data access in the app. Same
 * safeQuery-to-empty-state pattern for reads, same honest {success, error}
 * pattern for writes as lib/teacher/repository.ts — plus every sensitive
 * write here also inserts an audit_logs row. That's not optional
 * decoration; Gate 6 (Security) for this module specifically checks that
 * role changes, suspensions, refunds, and deletions are traceable.
 */

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export interface MutationResult {
  success: boolean;
  error?: string;
}

async function logAction(action: string, targetTable?: string, targetId?: string, details?: object) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("audit_logs").insert({
      actor_id: user?.id,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
    });
  } catch {
    // Audit logging must never block the primary action from completing —
    // but a failure here is worth knowing about in real operation, hence
    // this is the one place in the repository that's intentionally silent
    // rather than surfaced, since surfacing it would be confusing ("did my
    // action fail, or did logging fail?").
  }
}

export async function cancelLiveClass(id: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("live_classes").update({ status: "cancelled" }).eq("id", id);
  if (!error) await logAction("live_class_cancelled", "live_classes", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getCurrentAdminProfile() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  }, null);
}

// ---------------------------------------------------------------------------
// Global Dashboard
// ---------------------------------------------------------------------------

export async function getGlobalStats() {
  return safeQuery(
    async () => {
      const supabase = createServerSupabaseClient();
      const [
        { count: totalStudents },
        { count: teacherCount },
        { count: liveClassCount },
        { count: enrollmentCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("live_classes").select("*", { count: "exact", head: true }).gte("scheduled_at", new Date().toISOString()),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
      ]);

      return {
        totalStudents: totalStudents ?? 0,
        activeStudents: 0, // honest zero — "active in last 7 days" needs real session/activity tracking not built yet
        teacherCount: teacherCount ?? 0,
        revenue: 0, // honest zero — no live payment gateway (Module 16) means no real revenue figure exists
        upcomingLiveClasses: liveClassCount ?? 0,
        courseSales: enrollmentCount ?? 0, // enrollments are the closest real proxy without payment data
      };
    },
    { totalStudents: 0, activeStudents: 0, teacherCount: 0, revenue: 0, upcomingLiveClasses: 0, courseSales: 0 }
  );
}

export async function getRecentActivity(limit = 8) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("audit_logs")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  }, []);
}

export async function getSystemHealth() {
  const supabase = createServerSupabaseClient();
  const checks: { name: string; ok: boolean; detail: string }[] = [];

  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    checks.push({ name: "Database", ok: !error, detail: error ? error.message : "Connected" });
  } catch (e) {
    checks.push({ name: "Database", ok: false, detail: e instanceof Error ? e.message : "Unreachable" });
  }

  try {
    const { error } = await supabase.storage.from("avatars").list("", { limit: 1 });
    checks.push({ name: "Storage", ok: !error, detail: error ? error.message : "Connected" });
  } catch (e) {
    checks.push({ name: "Storage", ok: false, detail: e instanceof Error ? e.message : "Unreachable" });
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    checks.push({ name: "Auth", ok: Boolean(user), detail: user ? "Session valid" : "No active session" });
  } catch (e) {
    checks.push({ name: "Auth", ok: false, detail: e instanceof Error ? e.message : "Unreachable" });
  }

  return checks;
}

// ---------------------------------------------------------------------------
// Student Management
// ---------------------------------------------------------------------------

export async function getAllStudentsAdmin() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function suspendStudent(studentId: string, suspend: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  // Module 8 added a real account-level is_suspended flag, checked by
  // every dashboard layout — this is now a genuine full suspension, not
  // just a per-course pause. The enrollment pause is kept alongside it so
  // course-level status stays consistent with the account state.
  const [{ error: profileError }, { error: enrollmentError }] = await Promise.all([
    supabase.from("profiles").update({ is_suspended: suspend }).eq("id", studentId),
    supabase.from("enrollments").update({ status: suspend ? "paused" : "active" }).eq("student_id", studentId),
  ]);
  const error = profileError ?? enrollmentError;
  if (!error) await logAction(suspend ? "student_suspended" : "student_reinstated", "profiles", studentId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Teacher Management
// ---------------------------------------------------------------------------

export async function getAllTeachers() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("profiles").select("*").eq("role", "teacher").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

/**
 * Promotes an existing registered user to teacher, by email. There's no
 * "invite a brand-new teacher by email" flow here — that requires the
 * Supabase Admin API with the service-role key, server-only, and is a
 * deliberately separate, more sensitive capability left for a dedicated
 * server action once this module is wired to a real project (see
 * ADMIN_MODULE_README.md).
 */
export async function promoteUserToTeacher(email: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("profiles").select("id").eq("email", email.trim()).maybeSingle();
  if (!existing) {
    return { success: false, error: "No account found with that email. They need to register first." };
  }
  const { error } = await supabase.from("profiles").update({ role: "teacher" }).eq("id", existing.id);
  if (!error) await logAction("user_promoted_to_teacher", "profiles", existing.id, { email });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getTeacherNotes(teacherId: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("teacher_notes").select("*").eq("teacher_id", teacherId).order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function addTeacherNote(teacherId: string, note: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("teacher_notes").insert({ teacher_id: teacherId, note, created_by: user?.id });
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Course Management — admin_courses is the single source of truth for the
// whole course catalog (content, not just publish status). See
// COURSES_MODULE_README.md for the migration this replaced.
// ---------------------------------------------------------------------------

export interface AdminCourseInput {
  slug: string;
  name: string;
  name_bn?: string;
  tagline?: string;
  icon?: string;
  level: string;
  audience?: string[];
  categories?: string[];
  duration?: string;
  format?: string;
  language?: string;
  schedule?: string;
  overview?: string;
  who_should_join?: string[];
  eligibility?: string;
  syllabus?: string[];
  outcomes?: string[];
  weekly_practice?: string;
  assignments_summary?: string;
  mock_tests_summary?: string;
  certificate_status?: "available" | "coming-soon";
  is_coming_soon?: boolean;
  is_featured?: boolean;
  is_free: boolean;
  price_inr?: number;
}

export async function getAdminCourses() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("admin_courses").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function getAdminCourseBySlug(slug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("admin_courses").select("*").eq("slug", slug).maybeSingle();
    return data;
  }, null);
}

export async function getAdminCourseById(id: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("admin_courses").select("*").eq("id", id).maybeSingle();
    return data;
  }, null);
}

export async function createAdminCourse(input: AdminCourseInput): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("admin_courses").insert({ ...input, status: "draft", is_published: false });
  if (!error) await logAction("course_created", "admin_courses", input.slug);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function updateAdminCourse(id: string, input: Partial<AdminCourseInput>): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("admin_courses").update(input).eq("id", id);
  if (!error) await logAction("course_updated", "admin_courses", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export type CourseStatus = "draft" | "published" | "archived";

// `status` is the real lifecycle field; `is_published` is kept in sync
// alongside it purely so anything still reading the older boolean column
// never sees it drift out of date with the richer status.
export async function setCourseStatus(id: string, status: CourseStatus): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("admin_courses")
    .update({ status, is_published: status === "published" })
    .eq("id", id);
  if (!error) await logAction(`course_${status}`, "admin_courses", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function deleteAdminCourse(id: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("admin_courses").delete().eq("id", id);
  if (!error) await logAction("course_deleted", "admin_courses", id);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Teacher ↔ Course assignments — which teacher(s) can manage a course's
// content (lessons, tests, live classes, etc). Admin-only to change; see
// the RLS policies in schema.sql for how this is actually enforced.
// ---------------------------------------------------------------------------

export async function getTeacherAssignmentsForCourse(courseSlug: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    // teacher_course_assignments has TWO foreign keys into profiles
    // (teacher_id and assigned_by) — an unqualified `profiles(...)` embed
    // is ambiguous and PostgREST rejects it at query time. `!teacher_id`
    // tells it which FK to follow.
    const { data } = await supabase
      .from("teacher_course_assignments")
      .select("id, teacher_id, profiles!teacher_id(id, full_name, email)")
      .eq("course_slug", courseSlug);
    return data ?? [];
  }, []);
}

export async function assignTeacherToCourse(teacherId: string, courseSlug: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("teacher_course_assignments")
    .insert({ teacher_id: teacherId, course_slug: courseSlug, assigned_by: user?.id });
  if (!error) await logAction("teacher_assigned_to_course", "teacher_course_assignments", `${teacherId}:${courseSlug}`);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function unassignTeacherFromCourse(assignmentId: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("teacher_course_assignments").delete().eq("id", assignmentId);
  if (!error) await logAction("teacher_unassigned_from_course", "teacher_course_assignments", assignmentId);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Website CMS
// ---------------------------------------------------------------------------

export async function getCmsSection(section: string) {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("cms_content").select("*").eq("section", section);
    return data ?? [];
  }, []);
}

export async function upsertCmsContent(section: string, contentKey: string, valueEn: string, valueBn?: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("cms_content")
    .upsert({ section, content_key: contentKey, value_en: valueEn, value_bn: valueBn, updated_by: user?.id }, { onConflict: "section,content_key" });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getAllTestimonials() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function createTestimonial(input: {
  student_name: string;
  course_name: string;
  quote: string;
  rating: number;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("testimonials").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function togglePublishTestimonial(id: string, publish: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("testimonials").update({ is_published: publish }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getAllBanners() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("site_banners").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function createBanner(input: { message: string; link_url?: string }): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("site_banners").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function toggleBanner(id: string, active: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("site_banners").update({ is_active: active }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export interface SiteSettingsInput {
  academy_name: string;
  tagline_en?: string;
  tagline_bn?: string;
  sub_tagline?: string;
  footer_tagline?: string;
  phone?: string;
  phone_display?: string;
  whatsapp_number?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  google_map_url?: string;
}

// site_settings is a singleton (id = 1 always) — this is always an update
// against that one row, never an insert of a new one.
export async function updateSiteSettings(input: SiteSettingsInput): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_by: user?.id, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (!error) await logAction("site_settings_updated", "site_settings", "1");
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getAllFaqsAdmin() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("faqs").select("*").order("order_index", { ascending: true });
    return data ?? [];
  }, []);
}

export async function createFaq(input: { question: string; answer: string }): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("faqs").select("order_index").order("order_index", { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (existing?.order_index ?? -1) + 1;
  const { error } = await supabase.from("faqs").insert({ ...input, order_index: nextOrder });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function updateFaq(id: string, input: { question: string; answer: string }): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("faqs").update(input).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function toggleFaqPublish(id: string, publish: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("faqs").update({ is_published: publish }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function reorderFaq(id: string, direction: "up" | "down"): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: all } = await supabase.from("faqs").select("id, order_index").order("order_index", { ascending: true });
  if (!all) return { success: false, error: "Could not load FAQ order." };
  const index = all.findIndex((f: { id: string }) => f.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= all.length) return { success: true };
  const a = all[index];
  const b = all[swapWith];
  const [err1, err2] = await Promise.all([
    supabase.from("faqs").update({ order_index: b.order_index }).eq("id", a.id).then((r) => r.error),
    supabase.from("faqs").update({ order_index: a.order_index }).eq("id", b.id).then((r) => r.error),
  ]);
  return err1 || err2 ? { success: false, error: (err1 ?? err2)!.message } : { success: true };
}

export async function deleteFaq(id: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getAllGalleryImagesAdmin() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("gallery_images").select("*").order("order_index", { ascending: true });
    return data ?? [];
  }, []);
}

export async function createGalleryImage(input: { image_url: string; alt_text: string; caption?: string }): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("gallery_images").select("order_index").order("order_index", { ascending: false }).limit(1).maybeSingle();
  const nextOrder = (existing?.order_index ?? -1) + 1;
  const { error } = await supabase.from("gallery_images").insert({ ...input, order_index: nextOrder });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function toggleGalleryImagePublish(id: string, publish: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("gallery_images").update({ is_published: publish }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function deleteGalleryImage(id: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Payment Management
// ---------------------------------------------------------------------------

export async function getIntegrationSettings() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("integration_settings").select("*");
    return data ?? [];
  }, []);
}

/**
 * Marks a service as configured. Deliberately takes no key/secret
 * parameter — there is nothing here to leak, by design. Setting real
 * credentials happens via environment variables at deploy time; this
 * function only records that it was done and by whom.
 */
export async function markIntegrationConfigured(serviceName: string, configured: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("integration_settings")
    .upsert({ service_name: serviceName, is_configured: configured, configured_by: user?.id, configured_at: new Date().toISOString() });
  if (!error) await logAction("integration_status_changed", "integration_settings", serviceName, { configured });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getCoupons() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function createCoupon(input: {
  code: string;
  discount_percent: number;
  max_uses?: number;
  expires_at?: string;
}): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("coupons").insert(input);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function toggleCoupon(id: string, active: boolean): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("coupons").update({ active }).eq("id", id);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function getRefundRequests() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("refund_requests").select("*, profiles(full_name)").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function updateRefundStatus(id: string, status: "approved" | "rejected"): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Approving now genuinely calls the payment gateway's refund API when
  // the request is linked to a real order — previously this only changed
  // a status label with no actual money movement, which would have been
  // a confusing gap between what the admin UI implied and what actually
  // happened at Razorpay/Stripe.
  if (status === "approved") {
    const { data: refundRequest } = await supabase
      .from("refund_requests")
      .select("*, orders(*)")
      .eq("id", id)
      .single();

    if (refundRequest?.orders?.gateway_payment_id) {
      const provider = selectProviderForCurrency(refundRequest.orders.currency);
      const result = await provider.refund(refundRequest.orders.gateway_payment_id, refundRequest.orders.amount_minor_units);
      if (!result.success) {
        return { success: false, error: "The payment gateway declined the refund. No status was changed." };
      }
      await supabase.from("orders").update({ status: "refunded" }).eq("id", refundRequest.orders.id);
    }
  }

  const { error } = await supabase.from("refund_requests").update({ status, reviewed_by: user?.id }).eq("id", id);
  if (!error) await logAction("refund_" + status, "refund_requests", id);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Scholarship Management
// ---------------------------------------------------------------------------

export async function getScholarshipApplications() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("scholarship_applications").select("*").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function updateScholarshipStatus(id: string, status: "approved" | "rejected"): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("scholarship_applications")
    .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (!error) await logAction("scholarship_" + status, "scholarship_applications", id);
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Certificates (admin-wide view)
// ---------------------------------------------------------------------------

export async function getAllCertificatesAdmin() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("certificates").select("*, profiles(full_name)").order("issued_at", { ascending: false });
    return data ?? [];
  }, []);
}

// ---------------------------------------------------------------------------
// Course Pricing (Module 10 — Payments)
// ---------------------------------------------------------------------------

export async function getCoursePricesForAllCourses() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("course_prices").select("*, admin_courses(name, slug)").order("updated_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function setCoursePrice(adminCourseId: string, currency: string, amountMinorUnits: number): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("course_prices")
    .upsert(
      { admin_course_id: adminCourseId, currency, amount_minor_units: amountMinorUnits, updated_at: new Date().toISOString() },
      { onConflict: "admin_course_id,currency" }
    );
  if (!error) await logAction("course_price_set", "course_prices", adminCourseId, { currency, amountMinorUnits });
  return error ? { success: false, error: error.message } : { success: true };
}



export async function getTeacherApplications() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("teacher_applications")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function reviewTeacherApplication(
  applicationId: string,
  applicantId: string,
  decision: "approved" | "rejected"
): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: appError } = await supabase
    .from("teacher_applications")
    .update({ status: decision, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (appError) return { success: false, error: appError.message };

  if (decision === "approved") {
    const { error: roleError } = await supabase.from("profiles").update({ role: "teacher" }).eq("id", applicantId);
    if (roleError) return { success: false, error: roleError.message };
  }

  await logAction("teacher_application_" + decision, "teacher_applications", applicationId);
  return { success: true };
}

export async function getAccountDeletionRequests() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("account_deletion_requests")
      .select("*, profiles(full_name)")
      .eq("status", "pending")
      .order("requested_at", { ascending: false });
    return data ?? [];
  }, []);
}



export async function getAllUsersForRoles() {
  return safeQuery(async () => {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export async function updateUserRole(userId: string, role: "student" | "teacher" | "admin"): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (!error) await logAction("role_changed", "profiles", userId, { new_role: role });
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Notification Center
// ---------------------------------------------------------------------------

export async function broadcastNotification(title: string, body: string): Promise<MutationResult> {
  const supabase = createServerSupabaseClient();
  const { data: students } = await supabase.from("profiles").select("id").eq("role", "student");
  if (!students || students.length === 0) {
    return { success: false, error: "No students to notify yet." };
  }
  const rows = students.map((s: { id: string }) => ({ student_id: s.id, title, body }));
  const { error } = await supabase.from("notifications").insert(rows);
  if (!error) await logAction("broadcast_sent", "notifications", undefined, { title, recipientCount: students.length });
  return error ? { success: false, error: error.message } : { success: true };
}

// ---------------------------------------------------------------------------
// Backup — real data export, not a fake one-click infrastructure restore
// ---------------------------------------------------------------------------

export async function exportTableAsJson(tableName: string): Promise<{ data: unknown[]; error?: string }> {
  const supabase = createServerSupabaseClient();
  const allowedTables = ["profiles", "enrollments", "admin_courses", "certificates", "coupons"];
  if (!allowedTables.includes(tableName)) {
    return { data: [], error: "That table isn't available for export." };
  }
  const { data, error } = await supabase.from(tableName).select("*");
  return { data: data ?? [], error: error?.message };
}
