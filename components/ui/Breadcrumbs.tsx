import Link from "next/link";

interface Crumb {
  label: string;
  href: string;
}

const SITE_URL = "https://www.hidayetenglishacademy.com";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="border-b border-navy-100 bg-white py-3 dark:border-navy-800 dark:bg-navy-950">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex max-w-8xl flex-wrap items-center gap-1.5 px-5 text-xs font-medium text-navy-500 dark:text-navy-400 sm:px-8 lg:px-12">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? (
              <span className="text-navy-800 dark:text-navy-200">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-gold-800 dark:hover:text-gold-400">
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
