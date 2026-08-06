"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { recordSuccessfulLogin } from "@/lib/auth/recordLogin";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdminError = searchParams.get("error") === "not_admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 1) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient(rememberMe);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !signInData.user) {
      setSubmitting(false);
      setError(signInError?.message ?? "Login failed.");
      return;
    }

    // Real role check, client-side confirmation before navigating — the
    // middleware re-checks this server-side too, this just avoids a flash
    // of the teacher shell before the redirect fires.
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", signInData.user.id).single();

    if (!profile || (profile.role !== "admin")) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("This account doesn't have admin access. Contact a super administrator if this is unexpected.");
      return;
    }

    await recordSuccessfulLogin(signInData.user.id, "password");

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-8"
      noValidate
    >
      {notAdminError && (
        <p className="mb-4 rounded-lg bg-error/10 p-3 text-sm font-medium text-error">
          That account doesn&apos;t have admin access.
        </p>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="t-email" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Email
          </label>
          <input
            id="t-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="t-password" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Password
          </label>
          <input
            id="t-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4" />
          Remember me on this device
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Logging In…" : "Log In →"}
      </Button>

      <p className="mt-5 text-center text-xs text-navy-500 dark:text-navy-400">
        Admin accounts are created by a super administrator — there&apos;s no
        self-registration and no Google/OTP sign-in here by design. This is
        the highest-privilege login on the platform, kept deliberately
        narrower than student and teacher access.
      </p>
    </form>
  );
}
