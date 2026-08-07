import { Hero } from "@/components/home/Hero";
import { GlobalReach } from "@/components/home/GlobalReach";
import { TrustStats } from "@/components/home/TrustStats";
import { EnrollForm } from "@/components/home/EnrollForm";
import { LearningLoop } from "@/components/home/LearningLoop";
import { Programs } from "@/components/home/Programs";
import { WhatYouGet } from "@/components/home/WhatYouGet";
import { FounderSpotlight } from "@/components/home/FounderSpotlight";
import { Testimonials } from "@/components/home/Testimonials";
import { TeachingTechniques } from "@/components/home/TeachingTechniques";
import { WhatsAppCommunity } from "@/components/home/WhatsAppCommunity";
import { FreeResource } from "@/components/home/FreeResource";
import { ContactSection } from "@/components/home/ContactSection";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { getFaqs } from "@/lib/settings/repository";

// Note: MadhyamikOffer.tsx is intentionally not rendered here anymore.
// Madhyamik is now presented as one of seven flagship Programs (see below),
// preserving its "100% Free" trust signal without letting it dominate the
// page. The full MadhyamikOffer component is preserved in the codebase —
// it's pre-built content for the dedicated /programs/madhyamik landing page
// planned in the roadmap (Module 4).

export default async function HomePage() {
  const faqs = await getFaqs();

  return (
    <>
      <Hero />
      <GlobalReach />
      <TrustStats />
      <EnrollForm />
      <LearningLoop />
      <Programs />
      <WhatYouGet />
      <FounderSpotlight />
      <Testimonials />
      <TeachingTechniques />
      <WhatsAppCommunity />
      <FreeResource />
      <ContactSection />
      <FAQ faqs={faqs} />
      <FinalCTA />
    </>
  );
}
