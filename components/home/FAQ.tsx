"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronPlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { PublicFaq } from "@/lib/settings/repository";

export function FAQ({ faqs }: { faqs: PublicFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common Questions, Answered Honestly" />

        <div className="mt-12 space-y-3">
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
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="font-display text-base font-semibold text-navy-900 dark:text-white sm:text-lg">
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
                  id={`faq-panel-${i}`}
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
