import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Your Student Account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Your Account" subtitle="Start your English learning journey with HEA.">
      <RegisterForm />
    </AuthLayout>
  );
}
