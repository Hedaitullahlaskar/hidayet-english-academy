"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  createTestimonial,
  togglePublishTestimonial,
  createBanner,
  toggleBanner,
  updateSiteSettings,
  type SiteSettingsInput,
  upsertCmsContent,
  createFaq,
  updateFaq,
  toggleFaqPublish,
  reorderFaq,
  deleteFaq,
  createGalleryImage,
  toggleGalleryImagePublish,
  deleteGalleryImage,
} from "@/lib/admin/repository";

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

interface SiteSettingsRow {
  academy_name: string;
  tagline_en: string | null;
  tagline_bn: string | null;
  sub_tagline: string | null;
  footer_tagline: string | null;
  phone: string | null;
  phone_display: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  logo_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  instagram_url: string | null;
  google_map_url: string | null;
}

const textFieldConfig: { key: keyof SiteSettingsInput; label: string; required?: boolean }[] = [
  { key: "academy_name", label: "Academy Name", required: true },
  { key: "tagline_en", label: "Tagline (English)" },
  { key: "tagline_bn", label: "Tagline (Bengali)" },
  { key: "sub_tagline", label: "Sub-tagline" },
  { key: "footer_tagline", label: "Footer Tagline" },
  { key: "phone", label: "Phone (digits only, e.g. 6290056461)" },
  { key: "phone_display", label: "Phone (display, e.g. +91 62900 56461)" },
  { key: "whatsapp_number", label: "WhatsApp Number (with country code, no +)" },
  { key: "email", label: "Contact Email" },
  { key: "address", label: "Physical Address" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "google_map_url", label: "Google Maps URL" },
];

export function SiteSettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteSettingsInput>({
    academy_name: settings.academy_name,
    tagline_en: settings.tagline_en ?? "",
    tagline_bn: settings.tagline_bn ?? "",
    sub_tagline: settings.sub_tagline ?? "",
    footer_tagline: settings.footer_tagline ?? "",
    phone: settings.phone ?? "",
    phone_display: settings.phone_display ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    logo_url: settings.logo_url ?? "",
    facebook_url: settings.facebook_url ?? "",
    youtube_url: settings.youtube_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    google_map_url: settings.google_map_url ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function setField(key: keyof SiteSettingsInput, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (values.academy_name.trim().length < 2) return setError("Academy name is required.");
    setError("");
    setStatus("saving");
    const result = await updateSiteSettings(values);
    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-4 sm:grid-cols-2">
        {textFieldConfig.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">{f.label}</label>
            <input
              type="text"
              value={values[f.key] ?? ""}
              onChange={(e) => setField(f.key, e.target.value)}
              className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <ImageUploadField label="Logo" value={values.logo_url ?? ""} onChange={(url) => setField("logo_url", url)} folder="logo" />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Saved — the live site reflects these changes immediately.</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save Site Settings"}
      </Button>
    </form>
  );
}

const heroFieldConfig: { key: string; label: string; multiline?: boolean }[] = [
  { key: "hero_badge_text", label: "Badge Text (e.g. \"10 Years of Experience\")" },
  { key: "hero_title_line1", label: "Headline — Line 1" },
  { key: "hero_title_line2", label: "Headline — Line 2 (highlighted in gold)" },
  { key: "hero_subtitle_bn", label: "Subtitle (Bengali)" },
  { key: "hero_body", label: "Body Paragraph", multiline: true },
  { key: "hero_cta_text", label: "Primary Button Text" },
];

export function HeroContentForm({ initialValues }: { initialValues: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(heroFieldConfig.map((f) => [f.key, initialValues[f.key] ?? ""]))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("saving");
    const results = await Promise.all(
      heroFieldConfig.map((f) => upsertCmsContent("homepage", f.key, values[f.key] ?? ""))
    );
    const failed = results.find((r) => !r.success);
    if (failed) {
      setStatus("error");
      setError(failed.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <p className="mb-4 text-xs text-navy-500 dark:text-navy-400">
        Leave a field blank to keep the site&apos;s original wording for it.
      </p>
      <div className="grid gap-4">
        {heroFieldConfig.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">{f.label}</label>
            {f.multiline ? (
              <textarea
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            ) : (
              <input
                type="text"
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            )}
          </div>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && <p className="mt-4 text-sm font-medium text-success-text dark:text-success">Saved — the homepage reflects these changes immediately.</p>}

      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Save Hero Content"}
      </Button>
    </form>
  );
}

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
}

export function FaqManager({ faqs }: { faqs: FaqRow[] }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (question.trim().length < 5 || answer.trim().length < 5) return setError("Please write out both the question and the answer.");
    const result = editingId
      ? await updateFaq(editingId, { question: question.trim(), answer: answer.trim() })
      : await createFaq({ question: question.trim(), answer: answer.trim() });
    if (!result.success) return setError(result.error ?? "Something went wrong.");
    setQuestion("");
    setAnswer("");
    setEditingId(null);
    router.refresh();
  }

  function startEdit(faq: FaqRow) {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const result = await deleteFaq(id);
    setBusyId(null);
    setPendingDeleteId(null);
    if (result.success) router.refresh();
  }

  async function handleToggle(id: string, publish: boolean) {
    setBusyId(id);
    const result = await toggleFaqPublish(id, publish);
    setBusyId(null);
    if (result.success) router.refresh();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    setBusyId(id);
    const result = await reorderFaq(id, direction);
    setBusyId(null);
    if (result.success) router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          placeholder="Answer"
          className="mt-3 w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        {error && <p role="alert" className="mt-2 text-sm font-medium text-error">{error}</p>}
        <div className="mt-3 flex items-center gap-3">
          <Button type="submit" size="sm">{editingId ? "Save Changes" : "Add FAQ"}</Button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setQuestion(""); setAnswer(""); }}
              className="text-xs font-semibold text-navy-500 underline dark:text-navy-400"
            >
              Cancel editing
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {faqs.map((f, i) => (
          <div key={f.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-navy-900 dark:text-white">{f.question}</p>
              <Badge tone={f.is_published ? "success" : "outline"}>{f.is_published ? "Live" : "Draft"}</Badge>
            </div>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">{f.answer}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <button disabled={busyId === f.id || i === 0} onClick={() => handleReorder(f.id, "up")} className="text-navy-500 underline dark:text-navy-400 disabled:opacity-40">Move Up</button>
              <button disabled={busyId === f.id || i === faqs.length - 1} onClick={() => handleReorder(f.id, "down")} className="text-navy-500 underline dark:text-navy-400 disabled:opacity-40">Move Down</button>
              <button onClick={() => startEdit(f)} className="text-gold-800 underline dark:text-gold-400">Edit</button>
              <button disabled={busyId === f.id} onClick={() => handleToggle(f.id, !f.is_published)} className="text-gold-800 underline dark:text-gold-400">
                {f.is_published ? "Unpublish" : "Publish"}
              </button>
              <button disabled={busyId === f.id} onClick={() => setPendingDeleteId(f.id)} className="text-error underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
        title="Delete this FAQ?"
        description="This removes it from the homepage FAQ section immediately. This can't be undone."
        confirmLabel="Delete"
        tone="danger"
        loading={busyId === pendingDeleteId}
      />
    </div>
  );
}

interface GalleryImageRow {
  id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  is_published: boolean;
}

export function GalleryManager({ images }: { images: GalleryImageRow[] }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!imageUrl) return setError("Please upload an image first.");
    if (altText.trim().length < 3) return setError("Please describe the image (alt text) for accessibility.");
    const result = await createGalleryImage({ image_url: imageUrl, alt_text: altText.trim(), caption: caption.trim() || undefined });
    if (!result.success) return setError(result.error ?? "Something went wrong.");
    setImageUrl("");
    setAltText("");
    setCaption("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const result = await deleteGalleryImage(id);
    setBusyId(null);
    setPendingDeleteId(null);
    if (result.success) router.refresh();
  }

  async function handleToggle(id: string, publish: boolean) {
    setBusyId(id);
    const result = await toggleGalleryImagePublish(id, publish);
    setBusyId(null);
    if (result.success) router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
        <ImageUploadField label="Photo" value={imageUrl} onChange={setImageUrl} folder="gallery" />
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image (for accessibility)"
          className="mt-3 w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="mt-3 w-full rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
        {error && <p role="alert" className="mt-2 text-sm font-medium text-error">{error}</p>}
        <Button type="submit" size="sm" className="mt-3">Add to Gallery</Button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img) => (
          <div key={img.id} className="rounded-lg border border-navy-100 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-navy-800">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/seeded URL */}
            <img src={img.image_url} alt={img.alt_text} className="aspect-[4/3] w-full rounded-md object-cover" />
            <p className="mt-2 truncate text-xs font-semibold text-navy-800 dark:text-navy-100">{img.caption ?? img.alt_text}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge tone={img.is_published ? "success" : "outline"}>{img.is_published ? "Live" : "Hidden"}</Badge>
              <div className="flex gap-2 text-xs font-semibold">
                <button disabled={busyId === img.id} onClick={() => handleToggle(img.id, !img.is_published)} className="text-gold-800 underline dark:text-gold-400">
                  {img.is_published ? "Hide" : "Show"}
                </button>
                <button disabled={busyId === img.id} onClick={() => setPendingDeleteId(img.id)} className="text-error underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
        title="Remove this image?"
        description="This removes it from the public gallery immediately. This can't be undone."
        confirmLabel="Remove"
        tone="danger"
        loading={busyId === pendingDeleteId}
      />
    </div>
  );
}
