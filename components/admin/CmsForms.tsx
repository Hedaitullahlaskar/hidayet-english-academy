"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createTestimonial, togglePublishTestimonial, createBanner, toggleBanner } from "@/lib/admin/repository";

export function CreateTestimonialForm() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (studentName.trim().length < 2 || quote.trim().length < 5) return;
    setStatus("saving");
    const result = await createTestimonial({ student_name: studentName.trim(), course_name: courseName.trim(), quote: quote.trim(), rating });
    if (result.success) {
      setStudentName(""); setCourseName(""); setQuote("");
      setStatus("done");
      router.refresh();
    } else {
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <p className="mb-3 text-xs text-navy-500 dark:text-navy-400">
        Only add testimonials from real students who agreed to be featured — never fabricated.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" className="rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" className="rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      </div>
      <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} placeholder="What they said…" className="mt-4 w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      <Button type="submit" size="sm" className="mt-4" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Add Testimonial (as Draft)"}</Button>
    </form>
  );
}

export function TestimonialList({ testimonials }: { testimonials: { id: string; student_name: string; quote: string; is_published: boolean }[] }) {
  const [pubMap, setPubMap] = useState(Object.fromEntries(testimonials.map((t) => [t.id, t.is_published])));
  async function toggle(id: string) {
    const next = !pubMap[id];
    const result = await togglePublishTestimonial(id, next);
    if (result.success) setPubMap((p) => ({ ...p, [id]: next }));
  }
  return (
    <div className="space-y-3">
      {testimonials.map((t) => (
        <div key={t.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-navy-800 dark:text-navy-100">&quot;{t.quote}&quot;</p>
            <Badge tone={pubMap[t.id] ? "success" : "outline"}>{pubMap[t.id] ? "Live" : "Draft"}</Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-navy-500 dark:text-navy-400">— {t.student_name}</p>
            <button onClick={() => toggle(t.id)} className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">
              {pubMap[t.id] ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CreateBannerForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (message.trim().length < 3) return;
    setStatus("saving");
    const result = await createBanner({ message: message.trim() });
    if (result.success) { setMessage(""); router.refresh(); }
    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="New batch starting Monday — enroll now!" className="flex-1 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
      <Button type="submit" size="sm" disabled={status === "saving"}>Add Banner</Button>
    </form>
  );
}

export function BannerList({ banners }: { banners: { id: string; message: string; is_active: boolean }[] }) {
  const [activeMap, setActiveMap] = useState(Object.fromEntries(banners.map((b) => [b.id, b.is_active])));
  async function toggle(id: string) {
    const next = !activeMap[id];
    const result = await toggleBanner(id, next);
    if (result.success) setActiveMap((p) => ({ ...p, [id]: next }));
  }
  return (
    <div className="mt-4 space-y-2">
      {banners.map((b) => (
        <div key={b.id} className="flex items-center justify-between rounded-lg border border-navy-100 bg-white p-3 text-sm shadow-card dark:border-navy-700 dark:bg-navy-800">
          <span className="text-navy-800 dark:text-navy-100">{b.message}</span>
          <div className="flex items-center gap-2">
            <Badge tone={activeMap[b.id] ? "success" : "outline"}>{activeMap[b.id] ? "Active" : "Off"}</Badge>
            <button onClick={() => toggle(b.id)} className="text-xs font-semibold text-gold-800 underline dark:text-gold-400">Toggle</button>
          </div>
        </div>
      ))}
    </div>
  );
}
