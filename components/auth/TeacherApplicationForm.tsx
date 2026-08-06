"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function TeacherApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (bio.trim().length < 20) return setError("Tell us a little more about your teaching background (at least a couple of sentences).");

    setStatus("submitting");
    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim(), phone: phone.trim() } },
    });

    if (signUpError || !signUpData.user) {
      setStatus("idle");
      setError(signUpError?.message ?? "Something went wrong creating your account.");
      return;
    }

    // The account is created with the default 'student' role — it only
    // becomes a teacher account once an admin approves this application
    // (see /admin/teacher-applications). Submitting the application itself
    // requires an active session, which signUp() just established.
    const { error: applicationError } = await supabase.from("teacher_applications").insert({
      applicant_id: signUpData.user.id,
      bio: bio.trim(),
      subjects: subjects.trim(),
    });

    if (applicationError) {
      setStatus("idle");
      setError(applicationError.message);
      return;
    }

    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="rounded-xl border border-navy-100 bg-paper-100 p-8 text-center dark:border-navy-700 dark:bg-navy-900">
        <span className="text-3xl" aria-hidden="true">📝</span>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-900 dark:text-white">Application Submitted</h2>
        <p className="mt-2 text-navy-600 dark:text-navy-300">
          We&apos;ve sent a confirmation link to <strong>{email}</strong> — verify your email first, then an admin will
          review your application. You&apos;ll be able to log in as a teacher once approved.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
          <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">At least 8 characters.</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">What Would You Teach?</label>
          <input type="text" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="e.g. Spoken English, Grammar" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Your Teaching Background</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell us about your experience teaching English…" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white" />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Submit Application →"}
      </Button>

      <p className="mt-5 text-center text-sm text-navy-600 dark:text-navy-300">
        Already have a teacher account?{" "}
        <Link href="/teach/login" className="font-semibold text-gold-800 underline dark:text-gold-400">
          Log in
        </Link>
      </p>
    </form>
  );
}
