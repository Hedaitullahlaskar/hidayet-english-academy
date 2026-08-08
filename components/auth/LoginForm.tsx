"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { OtpLoginForm } from "@/components/auth/OtpLoginForm";
import { createClient } from "@/lib/supabase/client";
import { recordSuccessfulLogin } from "@/lib/auth/recordLogin";
import { dashboardPathFor } from "@/lib/auth/permissions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 1) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient(rememberMe);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setSubmitting(false);
      setError(signInError?.message ?? "Login failed.");
      return;
    }

    await recordSuccessfulLogin(data.user.id, "password");

    // The core of "Student → Student Dashboard, Teacher → Teacher
    // Dashboard, Admin → Super Admin Dashboard": one login form, the
    // destination is decided by the real role on the profile, not
    // hardcoded to /dashboard regardless of who signed in.
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    router.push(dashboardPathFor(profile?.role));
    router.refresh();
  }

  if (showOtp) {
    return (
      <div className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-elevated dark:border-navy-700 dark:bg-navy-900 sm:p-8">
        <OtpLoginForm onBack={() => setShowOtp(false)} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-elevated dark:border-navy-700 dark:bg-navy-900 sm:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
              Password
            </label>
            <Link href="/reset-password" className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
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

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
        {/* navy-500/navy-300, not navy-400 both ways: navy-400 measures
            4.48:1 on white (light mode) and 4.29:1 on navy-950 (dark
            mode) — both just under WCAG AA's 4.5:1. navy-500 (7.65:1 on
            white) and navy-300 (7.04:1 on navy-950) are genuinely
            different colors per mode, not one swapped value. */}
        <span className="text-xs font-semibold text-navy-500 dark:text-navy-300">OR</span>
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
      </div>

      <div className="space-y-3">
        <GoogleSignInButton redirectTo="/dashboard" />
        <button
          type="button"
          onClick={() => setShowOtp(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
        >
          Log in with OTP instead
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-navy-600 dark:text-navy-300">
        New to HEA?{" "}
        <Link href="/register" className="font-semibold text-gold-800 underline dark:text-gold-400">
          Create an account
        </Link>
      </p>
    </form>
  );
}
