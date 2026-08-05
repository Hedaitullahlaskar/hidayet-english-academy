import type { Metadata } from "next";
import { MethodHero } from "@/components/method/MethodHero";
import { PsychologyOfLearning } from "@/components/method/PsychologyOfLearning";
import { LearningFramework } from "@/components/method/LearningFramework";
import { SkillSystemsSection } from "@/components/method/SkillSystemsSection";
import { SupportSystems } from "@/components/method/SupportSystems";
import { MethodJourney } from "@/components/method/MethodJourney";
import { MethodFAQ } from "@/components/method/MethodFAQ";
import { MethodFinalCTA } from "@/components/method/MethodFinalCTA";
import { methodFaqs } from "@/content/method-data";

export const metadata: Metadata = {
  title: "Our Teaching Method — Why It Works",
  description:
    "Why Bengali-speaking learners struggle with English, the psychology behind real fluency, and the step-by-step framework Hidayet English Academy uses to build grammar, vocabulary, pronunciation, and speaking confidence.",
  alternates: { canonical: "https://www.hidayetenglishacademy.com/method" },
  openGraph: {
    title: "Our Teaching Method — Hidayet English Academy",
    description:
      "The psychology, framework, and skill systems behind how we turn grammar knowledge into real spoken confidence.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: methodFaqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function MethodPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MethodHero />
      <PsychologyOfLearning />
      <LearningFramework />
      <SkillSystemsSection />
      <SupportSystems />
      <MethodJourney />
      <MethodFAQ />
      <MethodFinalCTA />
    </>
  );
}
