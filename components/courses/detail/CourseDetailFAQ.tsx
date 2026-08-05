"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronPlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { CourseDetail } from "@/types";

export function CourseDetailFAQ({ course }: { course: CourseDetail }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: `Is "${course.name}" taught live or recorded?`,
      answer: `This course is taught ${course.format === "Live" ? "live, with real-time interaction and doubt-solving" : course.format === "Hybrid" ? "as a hybrid of live sessions and self-paced material" : "through structured recorded material"}.`,
    },
    {
      question: "What if I'm not sure this is the right level for me?",
      answer:
        "Join a free class first. We'll honestly tell you if this course is the right fit, or point you to one that is — no pressure either way.",
    },
    {
      question: "Is the certificate available immediately?",
      answer:
        course.certificateStatus === "available"
          ? "Yes, a certificate is issued on completion of the course."
          : "Not yet — verifiable completion certificates are part of the learning platform we're actively building. You'll still get honest, regular feedback on your progress in the meantime.",
    },
    {
      question: "Can I switch courses later if my goals change?",
      answer:
        "Yes. Message us on WhatsApp any time — our team will help you move to whichever program fits your goals now.",
    },
  ];

  return (
    <section className="bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title={`Questions About ${course.name}`} />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-lg border border-navy-100 bg-white shadow-card dark:border-navy-700 dark:bg-navy-800"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`course-faq-${i}`}
                >
                  <span className="font-display text-base font-semibold text-navy-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 transition-transform duration-300 dark:bg-navy-700 dark:text-gold-400",
                      isOpen && "rotate-45"
                    )}
                    aria-hidden="true"
                  >
                    <ChevronPlusIcon className="h-3.5 w-3.5" />
                  </span>
                </button>
                <div
                  id={`course-faq-${i}`}
                  role="region"
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-navy-600 dark:text-navy-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
