import Link from "next/link";
import { Compass, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page Not Found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper-50 px-5 py-24 dark:bg-navy-950">
      <div className="pointer-events-none absolute inset-0 bg-mesh-gold dark:bg-mesh-navy" aria-hidden="true" />
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" aria-hidden="true" />

      <div className="relative mx-auto max-w-xl text-center">
        <p className="font-display text-gradient-gold text-[clamp(5rem,12vw,9rem)] font-semibold leading-none">404</p>

        <h1 className="mt-4 font-display text-3xl font-semibold text-navy-900 dark:text-white">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-base text-navy-600 dark:text-navy-300">
          The page you&apos;re looking for doesn&apos;t exist, may have moved, or the link may be out of date.
          Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg">
            <Home className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Back to Homepage
          </Button>
          <Button href="/courses" variant="outline" size="lg">
            <Compass className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Browse Courses
          </Button>
        </div>

        <div className="mx-auto mt-10 max-w-sm rounded-lg border border-navy-100/60 bg-white/60 p-4 shadow-soft backdrop-blur-sm dark:border-navy-700 dark:bg-navy-900/60">
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Still stuck?{" "}
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1 font-semibold text-gold-800 underline underline-offset-2 dark:text-gold-400"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
