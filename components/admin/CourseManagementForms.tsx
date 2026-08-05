"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createAdminCourse, toggleCoursePublish } from "@/lib/admin/repository";

export function CreateCourseForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Speaking");
  const [level, setLevel] = useState("Beginner");
  const [isFree, setIsFree] = useState(false);
  const [priceInr, setPriceInr] = useState(2999);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) return setError("Please name the course.");
    const finalSlug = slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    setStatus("saving");
    const result = await createAdminCourse({
      slug: finalSlug,
      name: name.trim(),
      category,
      level,
      is_free: isFree,
      price_inr: isFree ? 0 : priceInr,
    });

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    setName("");
    setSlug("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option>Speaking</option><option>Grammar</option><option>Vocabulary</option><option>Interview</option><option>Career</option><option>School</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Pricing</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsFree(true)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${isFree ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>Free</button>
            <button type="button" onClick={() => setIsFree(false)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${!isFree ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>Paid</button>
          </div>
        </div>
        {!isFree && (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Price (₹ INR)</label>
            <input type="number" min={0} value={priceInr} onChange={(e) => setPriceInr(Number(e.target.value))} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
          </div>
        )}
      </div>
      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Course created as a draft — publish it when ready.</p>}
      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Creating…" : "Create Course"}
      </Button>
    </form>
  );
}

interface AdminCourseRow {
  id: string;
  name: string;
  category: string;
  is_free: boolean;
  is_published: boolean;
}

export function CourseListWithPublishToggle({ courses }: { courses: AdminCourseRow[] }) {
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(courses.map((c) => [c.id, c.is_published]))
  );
  const router = useRouter();

  async function handleToggle(id: string) {
    const next = !published[id];
    const result = await toggleCoursePublish(id, next);
    if (result.success) {
      setPublished((prev) => ({ ...prev, [id]: next }));
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div>
            <p className="font-semibold text-navy-900 dark:text-white">{c.name}</p>
            <p className="text-xs text-navy-500 dark:text-navy-400">{c.category} · {c.is_free ? "Free" : "Paid"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone={published[c.id] ? "success" : "outline"}>{published[c.id] ? "Published" : "Draft"}</Badge>
            <button onClick={() => handleToggle(c.id)} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
              {published[c.id] ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
