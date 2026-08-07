import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getSiteSettings, getFaqs } from "@/lib/settings/repository";
import { safeJsonLd } from "@/lib/utils";

// Moved here from the root layout: this setting is only correct for the
// genuinely static marketing pages. It was previously on the root layout,
// which — now that dashboard/teach/admin/account/auth routes all live
// under the same root and depend on cookies() for auth — would have
// fought with those routes' need for per-request dynamic rendering.
export const dynamic = "force-static";

/**
 * This is the marketing-site chrome — announcement bar, main nav, footer,
 * floating WhatsApp button. Until this fix, it lived in the ROOT layout,
 * which meant it wrapped every route in the app, including /dashboard,
 * /teach, and /admin — each of which already has its own complete shell
 * (sidebar, header, avatar). Every dashboard page was rendering two
 * headers stacked on top of each other. Scoping this to the (marketing)
 * route group — which covers exactly the public pages that should have
 * it — fixes that without touching any dashboard/teach/admin code at all.
 *
 * Site settings (name, logo, contact, social links) and FAQ content are
 * fetched once here and threaded down — Header needs settings as a client
 * component prop, Footer reads it directly, and the FAQPage JSON-LD below
 * is built from the same real FAQ rows FAQ.tsx renders (Website CMS,
 * Phase 1 — see WEBSITE_CMS_README.md), not a separately-maintained list
 * that could drift from what's actually on the page.
 */
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <AnnouncementBar />
      <Header settings={settings} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton />
    </>
  );
}
