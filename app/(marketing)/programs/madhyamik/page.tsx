import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MadhyamikOffer } from "@/components/home/MadhyamikOffer";
import { ScholarshipTeaser } from "@/components/courses/ScholarshipTeaser";

const SITE_URL = "https://www.hidayetenglishacademy.com";

export const metadata: Metadata = {
  title: "Free English Program for Madhyamik Students | Hidayet English Academy",
  description:
    "A 100% free spoken-English program built around the Madhyamik syllabus — live classes, an AI Study Assistant, and a real certificate, at no cost to Class 10 students.",
  alternates: { canonical: `${SITE_URL}/programs/madhyamik` },
  openGraph: {
    title: "Free English Program for Madhyamik Students | Hidayet English Academy",
    description: "A 100% free spoken-English program built around the Madhyamik syllabus.",
    url: `${SITE_URL}/programs/madhyamik`,
    type: "website",
  },
};

// This page's content (MadhyamikOffer) was originally built for the
// homepage in an early module, then deliberately moved off it so
// Madhyamik wouldn't dominate a page meant to represent all seven
// programs — but the component itself was always meant to have a real
// home. This dedicated landing page is that home: a proper, indexable,
// shareable page for the offer, rather than component code that sat
// unused in the repository.
export default function MadhyamikProgramPage() {
  return (
    <>
      <MadhyamikOffer />
      <section className="bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
        <Container>
          <ScholarshipTeaser />
        </Container>
      </section>
    </>
  );
}
