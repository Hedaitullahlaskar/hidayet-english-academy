import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const SITE_URL = "https://www.hidayetenglishacademy.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hidayet English Academy — Spoken English for Bengali Speakers",
    template: "%s | Hidayet English Academy",
  },
  description:
    "Learn English with confidence, wherever you live. Hidayet English Academy offers structured grammar, live spoken English classes, and seven flagship programs for Bengali-speaking learners in India, Bangladesh, the Middle East, Europe, North America, and beyond — including a 100% free program for Madhyamik (Class 10) students.",
  keywords: [
    "Hidayet English Academy",
    "English learning for Bengali speakers worldwide",
    "spoken English for Bengali speakers",
    "Madhyamik English suggestion",
    "learn English online Bengali",
    "English grammar course Bengali",
    "spoken English course West Bengal",
    "interview English course",
    "career English for Bengali speakers",
    "online English classes for Bengali diaspora",
  ],
  authors: [{ name: "Hidayet English Academy" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "bn_IN",
    url: SITE_URL,
    siteName: "Hidayet English Academy",
    title: "Hidayet English Academy — Learn English, Build Your Future",
    description:
      "Structured grammar, real spoken confidence, and seven flagship programs for Bengali-speaking learners worldwide — from Madhyamik board-exam prep to Career English.",
    images: [{ url: "/images/hea-logo.png", width: 320, height: 320, alt: "Hidayet English Academy" }],
  },
  twitter: {
    card: "summary",
    title: "Hidayet English Academy",
    description: "Learn English, Build Your Future — Spoken English for Bengali Speakers.",
  },
  icons: {
    icon: "/images/favicon-source.png",
  },
  alternates: {
    canonical: SITE_URL,
    // Note: a `bn` alternate will be added once /bn routes actually exist —
    // declaring it now would point crawlers at a 404.
  },
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Hidayet English Academy",
  alternateName: "HEA",
  url: SITE_URL,
  logo: `${SITE_URL}/images/hea-logo.png`,
  description:
    "Spoken English academy for Bengali-speaking students, offering structured grammar, live classes, and a free program for Madhyamik students.",
  telephone: "+91-6290056461",
  email: "hidayetenglishacademy@gmail.com",
  sameAs: [
    "https://facebook.com/hidayetenglishacademy",
    "https://youtube.com/@hidayetenglishacademy",
    "https://instagram.com/hidayetenglishacademy",
  ],
  founder: {
    "@type": "Person",
    name: "Hidayet Sir",
  },
  areaServed: [
    "India",
    "Bangladesh",
    "Middle East",
    "Europe",
    "North America",
    "Southeast Asia",
    "Australia",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/* Applies the saved theme before paint to prevent a light/dark flash */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('hea-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
