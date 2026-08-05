import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TeacherApplicationForm } from "@/components/auth/TeacherApplicationForm";

export const metadata: Metadata = {
  title: "Apply to Teach",
  robots: { index: false, follow: false },
};

export default function TeacherApplicationPage() {
  return (
    <AuthLayout title="Apply to Teach" subtitle="Every application is personally reviewed before teacher access is granted.">
      <TeacherApplicationForm />
    </AuthLayout>
  );
}
