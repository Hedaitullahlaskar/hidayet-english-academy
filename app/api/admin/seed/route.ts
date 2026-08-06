import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Protected one-time seed endpoint. Supply header `x-seed-secret` that
// matches the `SEED_ADMIN_SECRET` env var to run. Uses the service-role
// client so it can create users and set roles in `profiles`.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-seed-secret");
  if (!process.env.SEED_ADMIN_SECRET || secret !== process.env.SEED_ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const adminEmail = process.env.SAMPLE_ADMIN_EMAIL ?? "admin@hidayetenglishacademy.com";
  const adminPassword = process.env.SAMPLE_ADMIN_PASSWORD ?? "AdminPass123!";
  const teacherEmail = process.env.SAMPLE_TEACHER_EMAIL ?? "teacher@hidayetenglishacademy.com";
  const teacherPassword = process.env.SAMPLE_TEACHER_PASSWORD ?? "TeacherPass123!";

  const results: Record<string, any> = {};

  // Helper: try to create user; if exists, fetch the user id.
  async function ensureUser(email: string, password: string) {
    try {
      const { data, error } = await admin.auth.admin.createUser({ email, password });
      if (error) {
        // If user already exists, try to look them up via listUsers
        // (some Supabase installs return an error instead of data).
        const list = await admin.auth.admin.listUsers();
        const found = list.data.find((u: any) => u.email === email);
        if (found) return found.id;
        throw error;
      }
      return data.user?.id ?? null;
    } catch (err: any) {
      return null;
    }
  }

  const adminId = await ensureUser(adminEmail, adminPassword);
  results.admin = { email: adminEmail, id: adminId };

  const teacherId = await ensureUser(teacherEmail, teacherPassword);
  results.teacher = { email: teacherEmail, id: teacherId };

  // Ensure roles: update profiles rows using service-role client
  if (adminId) await admin.from("profiles").upsert({ id: adminId, email: adminEmail, full_name: "Site Admin", role: "admin" });
  if (teacherId) await admin.from("profiles").upsert({ id: teacherId, email: teacherEmail, full_name: "Sample Teacher", role: "teacher" });

  return NextResponse.json({ success: true, results });
}
