import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export const metadata: Metadata = { title: "Set New Password", robots: { index: false, follow: false } };

export default function ResetPasswordConfirmPage() {
  return (
    <AuthLayout title="Choose a New Password" subtitle="Almost done — set your new password below.">
      <SetPasswordForm mode="reset" />
    </AuthLayout>
  );
}
