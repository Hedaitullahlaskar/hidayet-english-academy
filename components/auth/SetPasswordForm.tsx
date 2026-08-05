"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface SetPasswordFormProps {
  /** "reset" shows on the public confirm-reset page; "change" shows inside the authenticated account settings and asks for the current password first. */
  mode: "reset" | "change";
  onSuccess?: () => void;
}

export function SetPasswordForm({ mode, onSuccess }: SetPasswordFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords don't match.");

    setStatus("saving");
    const supabase = createClient();

    if (mode === "change") {
      // Supabase's updateUser() doesn't require re-entering the current
      // password by default (the active session already proves identity),
      // but re-verifying it here is a deliberate extra check before
      // changing a live account's credentials — a session being active
      // isn't the same guarantee as the user being at the keyboard right now.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });
        if (verifyError) {
          setStatus("error");
          setError("Current password is incorrect.");
          return;
        }
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }

    setStatus("done");
    if (onSuccess) onSuccess();
    if (mode === "reset") {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  if (status === "done" && mode === "reset") {
    return (
      <div className="rounded-xl border border-navy-100 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-3xl" aria-hidden="true">✅</span>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">Password Updated</h2>
        <p className="mt-2 text-navy-600 dark:text-navy-300">Redirecting you to log in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={mode === "change" ? "" : "rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-8"} noValidate>
      {mode === "change" && (
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">At least 8 characters.</p>
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Confirm New Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && mode === "change" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Password updated.</p>}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : mode === "reset" ? "Set New Password" : "Change Password"}
      </Button>
    </form>
  );
}
