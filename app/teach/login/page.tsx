import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TeacherLoginForm } from "@/components/auth/TeacherLoginForm";

export const metadata: Metadata = {
  title: "Teacher Login",
  robots: { index: false, follow: false },
};

export default function TeacherLoginPage() {
  return (
    <AuthLayout title="Teacher Login" subtitle="Manage your courses, students, and classes.">
      <Suspense fallback={null}>
        <TeacherLoginForm />
      </Suspense>
    </AuthLayout>
  );
}
