import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LegalCenterBrowser } from "@/components/legal/LegalCenterBrowser";
import { LegalAdviceDisclaimer } from "@/components/legal/LegalAdviceDisclaimer";
import { allPolicies } from "@/content/legal";

const SITE_URL = "https://www.hidayetenglishacademy.com";

export const metadata: Metadata = {
  title: "Legal Center | Hidayet English Academy",
  description:
    "Every HEA policy in one place — Terms, Privacy, Payments, Live Class Rules, AI Usage, Child Safety, and more. Search or browse by category.",
  alternates: { canonical: `${SITE_URL}/legal` },
};

export default function LegalCenterPage() {
  return (
    <section className="bg-paper-100 py-14 dark:bg-navy-900 sm:py-20">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Legal Center"
          title="Every HEA Policy, In One Place"
          description="Twenty clear, plainly written policies covering how HEA works — for students, parents, teachers, and international users alike. Search below, or browse by category."
        />

        <div className="mt-10">
          <LegalCenterBrowser policies={allPolicies} />
        </div>

        <LegalAdviceDisclaimer />
      </Container>
    </section>
  );
}
