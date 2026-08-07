"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordRequestForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Please enter a valid email address.");

    setStatus("sending");

    const rateLimitRes = await fetch("/api/auth/rate-limit-check", {
      method: "POST",
      body: JSON.stringify({ identifier: email.trim(), action: "password_reset_request" }),
    });
    const rateLimitData = await rateLimitRes.json();
    if (!rateLimitData.allowed) {
      setStatus("error");
      setError(`Too many reset requests. Please try again in ${rateLimitData.retryAfterMinutes} minutes.`);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());

    // Deliberately show the same success message whether or not the email
    // exists — a different message either way would let someone probe
    // which emails are registered (account enumeration).
    if (resetError) {
      setStatus("error");
      setError("Something went wrong. Please try again shortly.");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-navy-100 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-3xl" aria-hidden="true">📬</span>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">Check Your Email</h2>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-elevated dark:border-navy-700 dark:bg-navy-900 sm:p-8" noValidate>
      <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
      />
      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Reset Link"}
      </Button>
      <p className="mt-5 text-center text-sm text-navy-600 dark:text-navy-300">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-gold-800 underline dark:text-gold-400">Log in</Link>
      </p>
    </form>
  );
}
