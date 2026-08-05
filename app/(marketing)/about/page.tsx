import type { Metadata } from "next";
import { FounderStoryHero } from "@/components/about/FounderStoryHero";
import { TheProblem } from "@/components/about/TheProblem";
import { MissionVision } from "@/components/about/MissionVision";
import { OurValues } from "@/components/about/OurValues";
import { TeachingPhilosophySummary } from "@/components/about/TeachingPhilosophySummary";
import { WhyChooseHEA } from "@/components/about/WhyChooseHEA";
import { StudentJourney } from "@/components/about/StudentJourney";
import { OurImpact } from "@/components/about/OurImpact";
import { PhotoGallery } from "@/components/about/PhotoGallery";
import { Timeline } from "@/components/about/Timeline";
import { FutureGoals } from "@/components/about/FutureGoals";
import { AwardsRecognition } from "@/components/about/AwardsRecognition";
import { AboutFinalCTA } from "@/components/about/AboutFinalCTA";

export const metadata: Metadata = {
  title: "About Us — Our Story",
  description:
    "Why Hidayet Sir started Hidayet English Academy, our mission to make English accessible to every Bengali-speaking student, and the teaching philosophy behind ten years of building confidence, not just grammar scores.",
  alternates: { canonical: "https://www.hidayetenglishacademy.com/about" },
  openGraph: {
    title: "About Hidayet English Academy — Our Story",
    description:
      "Why we started, what we believe, and how we help Bengali-speaking students build real English confidence — worldwide.",
    images: [{ url: "/images/founder-hidayet-sir.jpg", width: 640, height: 944, alt: "Hidayet Sir, Founder" }],
  },
};

// Ordered for narrative arc (problem → stakes → founder motivation → mission →
// values → method → differentiation → proof → gallery → history → future →
// recognition → CTA) rather than the flat request order — storytelling works
// better front-loaded with tension and payoff than as a flat list of headings.
export default function AboutPage() {
  return (
    <>
      <FounderStoryHero />
      <TheProblem />
      <MissionVision />
      <OurValues />
      <TeachingPhilosophySummary />
      <WhyChooseHEA />
      <StudentJourney />
      <OurImpact />
      <PhotoGallery />
      <Timeline />
      <FutureGoals />
      <AwardsRecognition />
      <AboutFinalCTA />
    </>
  );
}
