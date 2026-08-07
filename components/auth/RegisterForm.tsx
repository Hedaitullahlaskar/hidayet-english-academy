"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "check-email">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (isMinor && guardianName.trim().length < 2) {
      return setError("A parent or guardian name is required for students under 18.");
    }
    if (isMinor && guardianContact.trim().length < 6) {
      return setError("A parent or guardian contact (phone or email) is required for students under 18.");
    }

    setStatus("submitting");
    const supabase = createClient();

    const origin = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : window.location.origin;

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          guardian_name: isMinor ? guardianName.trim() : null,
          guardian_contact: isMinor ? guardianContact.trim() : null,
        },
      },
    });

    if (signUpError) {
      setStatus("idle");
      setError(signUpError.message);
      return;
    }

    setStatus("check-email");
  }

  if (status === "check-email") {
    return (
      <div className="rounded-xl border border-navy-100 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-3xl" aria-hidden="true">
          📬
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">
          Check Your Email
        </h2>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it
          to activate your account, then come back and log in.
        </p>
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
          <label htmlFor="reg-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="reg-phone" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Phone (with country code)
          </label>
          <input
            id="reg-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
          <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">At least 8 characters.</p>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-navy-200 bg-white p-4 dark:border-navy-600 dark:bg-navy-800">
          <input
            type="checkbox"
            checked={isMinor}
            onChange={(e) => setIsMinor(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0"
          />
          <span className="text-sm text-navy-700 dark:text-navy-200">
            This student is under 18 — a parent or guardian is registering on
            their behalf.
          </span>
        </label>

        {isMinor && (
          <div className="space-y-5 rounded-lg border border-gold-300 bg-gold-50 p-4 dark:border-navy-600 dark:bg-navy-800">
            <div>
              <label htmlFor="reg-guardian-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Parent / Guardian Name
              </label>
              <input
                id="reg-guardian-name"
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="reg-guardian-contact" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Parent / Guardian Phone or Email
              </label>
              <input
                id="reg-guardian-contact"
                type="text"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-error">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Creating Account…" : "Create Account →"}
      </Button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
        <span className="text-xs font-semibold text-navy-400 dark:text-navy-500">OR</span>
        <div className="h-px flex-1 bg-navy-200 dark:bg-navy-700" />
      </div>
      <GoogleSignInButton redirectTo="/dashboard" />

      <p className="mt-5 text-center text-sm text-navy-600 dark:text-navy-300">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gold-800 underline dark:text-gold-400">
          Log in
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-navy-500 dark:text-navy-400">
        Want to teach instead?{" "}
        <Link href="/register/teacher" className="font-semibold text-gold-800 underline dark:text-gold-400">
          Apply here
        </Link>
      </p>
    </form>
  );
}
