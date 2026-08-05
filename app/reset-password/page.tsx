import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordRequestForm } from "@/components/auth/ResetPasswordRequestForm";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset Your Password" subtitle="We'll email you a secure link.">
      <ResetPasswordRequestForm />
    </AuthLayout>
  );
}
