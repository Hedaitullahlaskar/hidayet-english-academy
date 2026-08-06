"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createAdminCourse, updateAdminCourse, setCourseStatus, deleteAdminCourse, type AdminCourseInput } from "@/lib/admin/repository";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const AUDIENCES = ["Children", "Students", "College", "Professionals", "Job Seekers"];
const CATEGORIES = ["Grammar", "Speaking", "Vocabulary", "Interview", "School", "Career"];
const FORMATS = ["Live", "Recorded", "Hybrid"];

function toLines(value: string[] | null | undefined): string {
  return (value ?? []).join("\n");
}
function fromLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export interface AdminCourseRecord extends AdminCourseInput {
  id: string;
  status: "draft" | "published" | "archived";
}

/**
 * Single form for both creating a new course and editing an existing one
 * — pass `existing` to switch to edit mode (calls updateAdminCourse instead
 * of createAdminCourse, and doesn't touch slug once set).
 */
export function CourseForm({ existing }: { existing?: AdminCourseRecord }) {
  const router = useRouter();
  const isEdit = Boolean(existing);

  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [nameBn, setNameBn] = useState(existing?.name_bn ?? "");
  const [tagline, setTagline] = useState(existing?.tagline ?? "");
  const [icon, setIcon] = useState(existing?.icon ?? "");
  const [level, setLevel] = useState(existing?.level ?? "Beginner");
  const [audience, setAudience] = useState<string[]>(existing?.audience ?? []);
  const [categories, setCategories] = useState<string[]>(existing?.categories ?? []);
  const [duration, setDuration] = useState(existing?.duration ?? "");
  const [format, setFormat] = useState(existing?.format ?? "Live");
  const [language, setLanguage] = useState(existing?.language ?? "");
  const [schedule, setSchedule] = useState(existing?.schedule ?? "");
  const [overview, setOverview] = useState(existing?.overview ?? "");
  const [whoShouldJoin, setWhoShouldJoin] = useState(toLines(existing?.who_should_join));
  const [eligibility, setEligibility] = useState(existing?.eligibility ?? "");
  const [syllabus, setSyllabus] = useState(toLines(existing?.syllabus));
  const [outcomes, setOutcomes] = useState(toLines(existing?.outcomes));
  const [weeklyPractice, setWeeklyPractice] = useState(existing?.weekly_practice ?? "");
  const [assignmentsSummary, setAssignmentsSummary] = useState(existing?.assignments_summary ?? "");
  const [mockTestsSummary, setMockTestsSummary] = useState(existing?.mock_tests_summary ?? "");
  const [certificateStatus, setCertificateStatus] = useState<"available" | "coming-soon">(existing?.certificate_status ?? "coming-soon");
  const [isComingSoon, setIsComingSoon] = useState(existing?.is_coming_soon ?? false);
  const [isFeatured, setIsFeatured] = useState(existing?.is_featured ?? false);
  const [isFree, setIsFree] = useState(existing?.is_free ?? false);
  const [priceInr, setPriceInr] = useState(existing?.price_inr ?? 2999);

  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) return setError("Please name the course.");

    const input: AdminCourseInput = {
      slug: isEdit ? existing!.slug : slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: name.trim(),
      name_bn: nameBn.trim() || undefined,
      tagline: tagline.trim() || undefined,
      icon: icon.trim() || undefined,
      level,
      audience,
      categories,
      duration: duration.trim() || undefined,
      format,
      language: language.trim() || undefined,
      schedule: schedule.trim() || undefined,
      overview: overview.trim() || undefined,
      who_should_join: fromLines(whoShouldJoin),
      eligibility: eligibility.trim() || undefined,
      syllabus: fromLines(syllabus),
      outcomes: fromLines(outcomes),
      weekly_practice: weeklyPractice.trim() || undefined,
      assignments_summary: assignmentsSummary.trim() || undefined,
      mock_tests_summary: mockTestsSummary.trim() || undefined,
      certificate_status: certificateStatus,
      is_coming_soon: isComingSoon,
      is_featured: isFeatured,
      is_free: isFree,
      price_inr: isFree ? 0 : priceInr,
    };

    setStatus("saving");
    const result = isEdit ? await updateAdminCourse(existing!.id, input) : await createAdminCourse(input);

    if (!result.success) {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setStatus("done");
    if (!isEdit) {
      setName("");
      setSlug("");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="course-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Course Name</label>
          <input id="course-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        {!isEdit && (
          <div>
            <label htmlFor="course-slug" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Slug <span className="font-normal text-navy-400">(auto-generated if left blank)</span></label>
            <input id="course-slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. spoken-english-master-course" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
          </div>
        )}
        <div>
          <label htmlFor="course-name-bn" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Name (Bengali)</label>
          <input id="course-name-bn" type="text" value={nameBn} onChange={(e) => setNameBn(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="course-tagline" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Tagline</label>
          <input id="course-tagline" type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-icon" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Icon (emoji)</label>
          <input id="course-icon" type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🗣️" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-level" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Level</label>
          <select id="course-level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <fieldset className="sm:col-span-2 m-0 border-0 p-0">
          <legend className="mb-1.5 text-sm font-semibold text-navy-800 dark:text-navy-100">Audience</legend>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button key={a} type="button" aria-pressed={audience.includes(a)} onClick={() => setAudience((prev) => toggleInArray(prev, a))} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${audience.includes(a) ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
                {a}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="sm:col-span-2 m-0 border-0 p-0">
          <legend className="mb-1.5 text-sm font-semibold text-navy-800 dark:text-navy-100">Categories</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={categories.includes(c)} onClick={() => setCategories((prev) => toggleInArray(prev, c))} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${categories.includes(c) ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="course-duration" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Duration</label>
          <input id="course-duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 6 months" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-format" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Format</label>
          <select id="course-format" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            {FORMATS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="course-language" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Language</label>
          <input id="course-language" type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. Bilingual — Bengali & English" className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-schedule" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Schedule</label>
          <input id="course-schedule" type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="course-overview" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Overview</label>
          <textarea id="course-overview" value={overview} onChange={(e) => setOverview(e.target.value)} rows={3} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-who-should-join" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Who Should Join <span className="font-normal text-navy-400">(one per line)</span></label>
          <textarea id="course-who-should-join" value={whoShouldJoin} onChange={(e) => setWhoShouldJoin(e.target.value)} rows={4} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-eligibility" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Eligibility</label>
          <textarea id="course-eligibility" value={eligibility} onChange={(e) => setEligibility(e.target.value)} rows={4} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-syllabus" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Syllabus <span className="font-normal text-navy-400">(one per line)</span></label>
          <textarea id="course-syllabus" value={syllabus} onChange={(e) => setSyllabus(e.target.value)} rows={4} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-outcomes" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Outcomes <span className="font-normal text-navy-400">(one per line)</span></label>
          <textarea id="course-outcomes" value={outcomes} onChange={(e) => setOutcomes(e.target.value)} rows={4} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-weekly-practice" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Weekly Practice</label>
          <input id="course-weekly-practice" type="text" value={weeklyPractice} onChange={(e) => setWeeklyPractice(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-assignments-summary" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Assignments</label>
          <input id="course-assignments-summary" type="text" value={assignmentsSummary} onChange={(e) => setAssignmentsSummary(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-mock-tests-summary" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Mock Tests</label>
          <input id="course-mock-tests-summary" type="text" value={mockTestsSummary} onChange={(e) => setMockTestsSummary(e.target.value)} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="course-certificate-status" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Certificate</label>
          <select id="course-certificate-status" value={certificateStatus} onChange={(e) => setCertificateStatus(e.target.value as "available" | "coming-soon")} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white">
            <option value="coming-soon">Coming Soon</option>
            <option value="available">Available</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
            <input type="checkbox" checked={isComingSoon} onChange={(e) => setIsComingSoon(e.target.checked)} className="h-4 w-4" /> Coming Soon
          </label>
          <label className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4" /> Featured
          </label>
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 text-sm font-semibold text-navy-800 dark:text-navy-100">Pricing</legend>
          <div className="flex gap-2">
            <button type="button" aria-pressed={isFree} onClick={() => setIsFree(true)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${isFree ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>Free</button>
            <button type="button" aria-pressed={!isFree} onClick={() => setIsFree(false)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${!isFree ? "border-gold-500 bg-gold-600 text-navy-900" : "border-navy-200 text-navy-700 dark:border-navy-600 dark:text-navy-200"}`}>Paid</button>
          </div>
        </fieldset>
        {!isFree && (
          <div>
            <label htmlFor="course-price-inr" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">Price (₹ INR)</label>
            <input id="course-price-inr" type="number" min={0} value={priceInr} onChange={(e) => setPriceInr(Number(e.target.value))} className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white" />
          </div>
        )}
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-medium text-error">{error}</p>}
      {status === "done" && (
        <p className="mt-4 text-sm font-medium text-success-text dark:text-success">
          {isEdit ? "Course updated." : "Course created as a draft — publish it when ready."}
        </p>
      )}
      <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
      </Button>
    </form>
  );
}

export function CreateCourseForm() {
  return <CourseForm />;
}

interface AdminCourseListRow {
  id: string;
  name: string;
  slug: string;
  categories: string[] | null;
  is_free: boolean;
  status: "draft" | "published" | "archived";
}

const STATUS_TONE = { draft: "outline", published: "success", archived: "navy" } as const;

export function CourseListWithPublishToggle({ courses }: { courses: AdminCourseListRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleStatusChange(id: string, next: "draft" | "published" | "archived") {
    setBusyId(id);
    const result = await setCourseStatus(id, next);
    setBusyId(null);
    if (result.success) router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
    setBusyId(id);
    const result = await deleteAdminCourse(id);
    setBusyId(null);
    if (result.success) router.refresh();
  }

  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <div key={c.id} className="rounded-lg border border-navy-100 bg-white p-4 shadow-card dark:border-navy-700 dark:bg-navy-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{(c.categories ?? []).join(", ") || "—"} · {c.is_free ? "Free" : "Paid"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
              <Link href={`/admin/courses/${c.id}/edit`} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                Edit
              </Link>
              {c.status !== "published" && (
                <button disabled={busyId === c.id} onClick={() => handleStatusChange(c.id, "published")} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                  Publish
                </button>
              )}
              {c.status === "published" && (
                <button disabled={busyId === c.id} onClick={() => handleStatusChange(c.id, "draft")} className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
                  Unpublish
                </button>
              )}
              {c.status !== "archived" && (
                <button disabled={busyId === c.id} onClick={() => handleStatusChange(c.id, "archived")} className="text-sm font-semibold text-navy-500 underline dark:text-navy-400">
                  Archive
                </button>
              )}
              {c.status === "archived" && (
                <button disabled={busyId === c.id} onClick={() => handleStatusChange(c.id, "draft")} className="text-sm font-semibold text-navy-500 underline dark:text-navy-400">
                  Restore to Draft
                </button>
              )}
              <button disabled={busyId === c.id} onClick={() => handleDelete(c.id, c.name)} className="text-sm font-semibold text-error underline">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
