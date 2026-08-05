"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { programs, site } from "@/content/site-data";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";

export function ScholarshipApplyForm() {
  const [name, setName] = useState("");
  const [courseInterest, setCourseInterest] = useState(programs[0]?.name.en ?? "");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Please tell us a little more about why you're applying (at least a sentence or two).");
      return;
    }

    // Real database record now, alongside the WhatsApp flow — an admin
    // can review this in /admin/scholarships even if the applicant never
    // sends the WhatsApp message. Best-effort: if this insert fails (no
    // Supabase connection yet), the WhatsApp path below still works, so a
    // real application still reaches a human either way.
    try {
      const supabase = createClient();
      await supabase.from("scholarship_applications").insert({
        applicant_name: name.trim(),
        course_interest: courseInterest,
        reason: reason.trim(),
      });
    } catch {
      // Intentionally silent — see comment above.
    }

    const link = whatsappLink(
      whatsappMessages.scholarshipApplication(name.trim(), courseInterest, reason.trim())
    );
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="apply" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Apply Now"
          title="Scholarship Application"
          description="Fill this in, and we'll open WhatsApp with your details ready to send — attach any supporting documents directly in that same chat."
        />

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-navy-100 bg-white p-6 shadow-card dark:border-navy-700 dark:bg-navy-800 sm:p-8"
          noValidate
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="sch-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Full Name
              </label>
              <input
                id="sch-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="sch-course" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Course You'd Like to Join
              </label>
              <select
                id="sch-course"
                value={courseInterest}
                onChange={(e) => setCourseInterest(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.name.en}>
                    {p.name.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sch-reason" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Tell Us Your Situation
              </label>
              <textarea
                id="sch-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                placeholder="A few honest sentences about your circumstances and why this matters to you — that's all we need to start."
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full">
            Continue on WhatsApp →
          </Button>

          <p className="mt-4 text-center text-xs text-navy-500 dark:text-navy-400">
            No document upload system yet — once WhatsApp opens, just attach any
            supporting documents directly in that chat. Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-gold-800 underline dark:text-gold-400">
              {site.email}
            </a>
          </p>
        </form>
      </Container>
    </section>
  );
}
