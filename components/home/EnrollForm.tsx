"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { programs, site } from "@/content/site-data";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function EnrollForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(programs[0]?.name.en ?? "");
  const [status, setStatus] = useState<"idle" | "opening">("idle");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setStatus("opening");
    const link = whatsappLink(whatsappMessages.freeClassBooked(name.trim(), interest, phone.trim()));
    window.open(link, "_blank", "noopener,noreferrer");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <section id="enroll" className="bg-white py-20 dark:bg-navy-950 sm:py-28">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Book Your Free Class"
          title="Start With a Free Class — No Commitment"
          description="Tell us a little about you and we'll confirm your free class over WhatsApp within a day."
        />

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-navy-100 bg-paper-100 p-6 shadow-card dark:border-navy-700 dark:bg-navy-900 sm:p-8"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="enroll-name" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Full Name
              </label>
              <input
                id="enroll-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="enroll-phone" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                Phone / WhatsApp Number
              </label>
              <input
                id="enroll-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                autoComplete="tel"
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="enroll-interest" className="mb-1.5 block text-sm font-semibold text-navy-800 dark:text-navy-100">
                I&rsquo;m Interested In
              </label>
              <select
                id="enroll-interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.name.en}>
                    {p.name.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full">
            {status === "opening" ? "Opening WhatsApp…" : "Book My Free Class →"}
          </Button>

          <p className="mt-4 text-center text-xs text-navy-500 dark:text-navy-400">
            We&rsquo;ll open WhatsApp with your details filled in — just hit send. Prefer to
            talk first?{" "}
            <a href={`tel:${site.phone}`} className="font-semibold text-gold-800 underline dark:text-gold-400">
              Call {site.phoneDisplay}
            </a>
          </p>
        </form>
      </Container>
    </section>
  );
}
