import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Student Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue your learning.">
      <div className="mb-6 flex items-center justify-center gap-3">
        <a href="/login" className="rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50 dark:border-navy-600 dark:bg-navy-800 dark:text-white">Student Login</a>
        <a href="/teach/login" className="rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50 dark:border-navy-600 dark:bg-navy-800 dark:text-white">Teacher Login</a>
        <a href="/admin/login" className="rounded-md border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 hover:bg-navy-50 dark:border-navy-600 dark:bg-navy-800 dark:text-white">Admin Login</a>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}
