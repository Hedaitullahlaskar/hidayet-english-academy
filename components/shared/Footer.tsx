import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { navLinks, site } from "@/content/site-data";
import { allPolicies } from "@/content/legal";

const socialIcons: Record<string, JSX.Element> = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.86 0 3.22 0 3.6-.07 4.86-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.9.07-3.2 0-3.6 0-4.86-.07-3.26-.15-4.77-1.7-4.92-4.92C2.2 15.6 2.2 15.22 2.2 12c0-3.2 0-3.6.07-4.86.15-3.23 1.66-4.77 4.92-4.92C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5 0-4.75.07-2.27.1-3.33 1.18-3.44 3.44C3.75 8.75 3.75 9.11 3.75 12c0 2.9 0 3.25.06 4.5.11 2.26 1.17 3.34 3.44 3.44 1.25.06 1.6.07 4.75.07s3.5 0 4.75-.07c2.26-.1 3.34-1.17 3.44-3.44.06-1.25.07-1.6.07-4.5 0-2.89 0-3.25-.07-4.5-.1-2.25-1.17-3.33-3.44-3.44C15.5 4 15.14 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-2a1.08 1.08 0 1 1 0 2.15 1.08 1.08 0 0 1 0-2.15Z" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/hea-logo.png"
              alt="Hidayet English Academy logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full"
            />
            <span className="font-display text-lg font-semibold text-white">
              {site.name}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {site.subTagline}. Guiding Bengali-speaking students toward English
            fluency and a brighter future.
          </p>
          <p className="mt-4 font-display italic text-gold-400">
            &ldquo;{site.footerTagline}&rdquo;
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-gold-400">
                📞 {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-gold-400">
                ✉️ {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Follow Us
          </h3>
          <div className="flex gap-3">
            {Object.entries(site.social).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`HEA on ${key}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-600 hover:text-navy-900"
              >
                {socialIcons[key]}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-10">
        <Container>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-white">
            Legal &amp; Policies
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-navy-300 sm:grid-cols-3 lg:grid-cols-4">
            {allPolicies.map((p) => (
              <Link key={p.slug} href={`/legal/${p.slug}`} className="hover:text-gold-400">
                {p.title}
              </Link>
            ))}
          </div>
          <Link
            href="/legal"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 hover:text-gold-300"
          >
            View the full Legal Center →
          </Link>
        </Container>
      </div>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Hidayet English Academy. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/legal/privacy-policy" className="hover:text-gold-400">
              Privacy Policy
            </Link>
            <Link href="/legal/terms-and-conditions" className="hover:text-gold-400">
              Terms
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
