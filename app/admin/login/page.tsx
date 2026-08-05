import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthLayout title="Super Admin Login" subtitle="Master control panel — Hidayet English Academy.">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </AuthLayout>
  );
}
