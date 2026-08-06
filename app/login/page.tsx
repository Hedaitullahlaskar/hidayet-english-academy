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
      <LoginForm />
    </AuthLayout>
  );
}
