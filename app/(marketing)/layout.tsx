import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { faqs } from "@/content/site-data";
import { safeJsonLd } from "@/lib/utils";

// Moved here from the root layout: this setting is only correct for the
// genuinely static marketing pages. It was previously on the root layout,
// which — now that dashboard/teach/admin/account/auth routes all live
// under the same root and depend on cookies() for auth — would have
// fought with those routes' need for per-request dynamic rendering.
export const dynamic = "force-static";

// Also moved from the root layout: this structured data describes the
// homepage's FAQ section specifically. It was previously duplicated onto
// every page in the app, including dashboards where no FAQ content
// exists — technically inaccurate structured data, harmless but sloppy.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

/**
 * This is the marketing-site chrome — announcement bar, main nav, footer,
 * floating WhatsApp button. Until this fix, it lived in the ROOT layout,
 * which meant it wrapped every route in the app, including /dashboard,
 * /teach, and /admin — each of which already has its own complete shell
 * (sidebar, header, avatar). Every dashboard page was rendering two
 * headers stacked on top of each other. Scoping this to the (marketing)
 * route group — which covers exactly the public pages that should have
 * it — fixes that without touching any dashboard/teach/admin code at all.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <AnnouncementBar />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
