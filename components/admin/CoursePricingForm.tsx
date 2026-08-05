"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { setCoursePrice } from "@/lib/admin/repository";

interface CourseOption {
  id: string;
  name: string;
}

export function CoursePricingForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState(2999);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!courseId) return setError("Choose a course.");
    if (amount <= 0) return setError("Enter a valid amount.");

    setStatus("saving");
    // amount entered in whole units (₹/$ etc.) — converted to minor units
    // (paise/cents) here, since that's what both gateways and the
    // course_prices table expect, and what a human types is whole units.
    const result = await setCoursePrice(courseId, currency, Math.round(amount * 100));

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    router.refresh();
  }

  if (courses.length === 0) {
    return <p className="text-sm text-navy-500 dark:text-navy-400">Create a course first (Course Management) before setting a price.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option value="INR">INR (Razorpay)</option>
            <option value="USD">USD (Stripe)</option>
            <option value="GBP">GBP (Stripe)</option>
            <option value="EUR">EUR (Stripe)</option>
            <option value="AED">AED (Stripe)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Amount</label>
          <input type="number" min={1} step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
      </div>

      {error && <p role="alert" className="mt-3 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-3 text-sm font-medium text-success-text dark:text-success">Price saved — checkout is live for this course and currency.</p>}

      <Button type="submit" size="sm" className="mt-4" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Set Price"}
      </Button>
    </form>
  );
}
