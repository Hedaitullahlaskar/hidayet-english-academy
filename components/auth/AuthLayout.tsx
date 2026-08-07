import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/shared/Header";
import { getSiteSettings } from "@/lib/settings/repository";

export async function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <>
      <Header settings={settings} />
      <main id="main-content" className="relative flex min-h-[75vh] items-center overflow-hidden bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
        <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" />
        <Container className="relative max-w-md">
          <div className="text-center">
            <h1 className="font-display text-3xl font-semibold text-navy-900 dark:text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-base text-navy-600 dark:text-navy-300">{subtitle}</p>
          </div>
          <div className="mt-8 animate-fade-up [animation-delay:80ms]">{children}</div>
          <p className="mt-6 text-center text-xs text-navy-400 dark:text-navy-500">
            By continuing, you agree to HEA&apos;s{" "}
            <Link href="/legal/terms-and-conditions" className="underline hover:text-gold-800 dark:hover:text-gold-400">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy-policy" className="underline hover:text-gold-800 dark:hover:text-gold-400">
              Privacy Policy
            </Link>
            .
          </p>
        </Container>
      </main>
    </>
  );
}
