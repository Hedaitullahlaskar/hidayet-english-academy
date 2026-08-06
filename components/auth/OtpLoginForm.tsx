"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { recordSuccessfulLogin } from "@/lib/auth/recordLogin";
import { dashboardPathFor } from "@/lib/auth/permissions";

export function OtpLoginForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"request" | "verify">("request");
  const [status, setStatus] = useState<"idle" | "sending" | "verifying" | "error">("idle");
  const [error, setError] = useState("");

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "email" && !contact.includes("@")) return setError("Enter a valid email address.");
    if (mode === "phone" && contact.replace(/\D/g, "").length < 10) return setError("Enter a valid phone number with country code.");

    setStatus("sending");
    const rateLimitRes = await fetch("/api/auth/rate-limit-check", {
      method: "POST",
      body: JSON.stringify({ identifier: contact.trim(), action: "otp_request" }),
    });
    const rateLimitData = await rateLimitRes.json();
    if (!rateLimitData.allowed) {
      setStatus("error");
      setError(`Too many code requests. Please try again in ${rateLimitData.retryAfterMinutes} minutes.`);
      return;
    }

    const supabase = createClient();
    const origin = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : window.location.origin;

    const redirectTo = `${origin}/auth/callback?next=/dashboard`;

    const { error: otpError } =
      mode === "email"
        ? await supabase.auth.signInWithOtp({ email: contact.trim(), options: { emailRedirectTo: redirectTo } })
        : await supabase.auth.signInWithOtp({ phone: contact.trim(), options: { smsRedirectTo: redirectTo } });

    if (otpError) {
      setStatus("error");
      setError(otpError.message);
      return;
    }
    setStatus("idle");
    setStage("verify");
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (otp.trim().length < 4) return setError("Enter the code you received.");

    setStatus("verifying");
    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp(
      mode === "email"
        ? { email: contact.trim(), token: otp.trim(), type: "email" }
        : { phone: contact.trim(), token: otp.trim(), type: "sms" }
    );

    if (verifyError || !data.user) {
      setStatus("error");
      setError(verifyError?.message ?? "Verification failed.");
      return;
    }

    await recordSuccessfulLogin(data.user.id, mode === "email" ? "otp_email" : "otp_phone");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    router.push(dashboardPathFor(profile?.role));
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => { setMode("email"); setStage("request"); }}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${mode === "email" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}
        >
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => { setMode("phone"); setStage("request"); }}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${mode === "phone" ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}
        >
          Mobile OTP
        </button>
      </div>

      {stage === "request" ? (
        <form onSubmit={handleRequestOtp}>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
            {mode === "email" ? "Email" : "Phone (with country code)"}
          </label>
          <input
            type={mode === "email" ? "email" : "tel"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={mode === "email" ? "you@example.com" : "+91 98765 43210"}
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
          {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
          <Button type="submit" size="lg" className="mt-4 w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending Code…" : "Send Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <p className="mb-3 text-sm text-navy-600 dark:text-navy-300">Enter the code sent to {contact}.</p>
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-center text-lg tracking-widest text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
          />
          {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
          <Button type="submit" size="lg" className="mt-4 w-full" disabled={status === "verifying"}>
            {status === "verifying" ? "Verifying…" : "Verify & Log In"}
          </Button>
          <button type="button" onClick={() => setStage("request")} className="mt-3 w-full text-center text-xs text-navy-500 underline dark:text-navy-400">
            Use a different email/phone
          </button>
        </form>
      )}

      <button type="button" onClick={onBack} className="mt-4 w-full text-center text-xs font-semibold text-gold-800 underline dark:text-gold-400">
        ← Back to password login
      </button>
    </div>
  );
}
