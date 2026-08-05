import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PolicyRenderer } from "@/components/legal/PolicyRenderer";
import { LegalAdviceDisclaimer } from "@/components/legal/LegalAdviceDisclaimer";
import { allPolicies, getPolicyBySlug } from "@/content/legal";

const SITE_URL = "https://www.hidayetenglishacademy.com";

export function generateStaticParams() {
  return allPolicies.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const policy = getPolicyBySlug(params.slug);
  if (!policy) return {};

  return {
    title: `${policy.title} | Hidayet English Academy`,
    description: policy.shortDescription,
    alternates: { canonical: `${SITE_URL}/legal/${policy.slug}` },
    openGraph: {
      title: `${policy.title} | Hidayet English Academy`,
      description: policy.shortDescription,
      url: `${SITE_URL}/legal/${policy.slug}`,
      type: "article",
    },
  };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicyBySlug(params.slug);
  if (!policy) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: policy.title,
    description: policy.shortDescription,
    dateModified: policy.lastUpdated,
    publisher: { "@type": "Organization", name: "Hidayet English Academy" },
  };

  return (
    <section className="bg-white py-14 dark:bg-navy-950 sm:py-20">
      <Container className="max-w-3xl">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-navy-500 dark:text-navy-400">
          <Link href="/legal" className="hover:text-gold-800 dark:hover:text-gold-400">Legal Center</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-navy-800 dark:text-navy-100">{policy.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{policy.icon}</span>
          <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white sm:text-3xl">{policy.title}</h1>
          <Badge tone="outline">{policy.category}</Badge>
        </div>
        <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
          Last Updated: {new Date(policy.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8">
          <PolicyRenderer blocks={policy.blocks} />
        </div>

        <LegalAdviceDisclaimer />

        <div className="mt-8 border-t border-navy-100 pt-6 dark:border-navy-800">
          <Link href="/legal" className="text-sm font-semibold text-gold-800 underline dark:text-gold-400">
            ← Back to the Legal Center
          </Link>
        </div>
      </Container>
    </section>
  );
}
