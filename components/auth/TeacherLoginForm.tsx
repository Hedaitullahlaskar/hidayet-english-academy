"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { createClient } from "@/lib/supabase/client";
import { recordSuccessfulLogin } from "@/lib/auth/recordLogin";

export function TeacherLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notStaffError = searchParams.get("error") === "not_staff";

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

    if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("This account doesn't have teacher access yet. If you applied, an admin needs to approve it first.");
      return;
    }

    await recordSuccessfulLogin(signInData.user.id, "password");

    router.push("/teach");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-8"
      noValidate
    >
      {notStaffError && (
        <p className="mb-4 rounded-lg bg-error/10 p-3 text-sm font-medium text-error">
          That account doesn't have teacher access.
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
          <div className="flex items-center justify-between">
            <label htmlFor="t-password" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
              Password
            </label>
            <Link href="/reset-password" className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
              Forgot password?
            </Link>
          </div>
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

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
        <span className="text-xs font-semibold text-navy-400 dark:text-navy-500">OR</span>
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
      </div>
      <GoogleSignInButton redirectTo="/teach" />

      <p className="mt-5 text-center text-xs text-navy-500 dark:text-navy-400">
        Not a teacher yet?{" "}
        <Link href="/register/teacher" className="font-semibold text-gold-800 underline dark:text-gold-400">
          Apply to teach
        </Link>{" "}
        — every application is reviewed by an admin before access is granted.
      </p>
    </form>
  );
}
