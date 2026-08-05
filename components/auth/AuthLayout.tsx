import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="flex min-h-[70vh] items-center bg-paper-100 py-16 dark:bg-navy-900">
      <Container className="max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/hea-logo.png"
              alt="Hidayet English Academy logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-semibold text-navy-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-navy-600 dark:text-navy-300">{subtitle}</p>
        </div>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-xs text-navy-400 dark:text-navy-500">
          By continuing, you agree to HEA's{" "}
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
  );
}
