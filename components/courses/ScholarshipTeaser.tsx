import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ScholarshipTeaser() {
  return (
    <div className="rounded-xl border border-gold-400 bg-navy-800 p-8 text-center shadow-elevated sm:p-10">
      <span className="text-3xl" aria-hidden="true">
        🎓
      </span>
      <h3 className="mt-4 font-display text-2xl font-semibold text-white">HEA Merit Scholarship</h3>
      <p className="mx-auto mt-3 max-w-xl text-navy-200">
        &ldquo;No deserving student should stop learning because of financial
        problems.&rdquo; If a course fee is the only thing standing between
        you and fluency, we want to hear from you.
      </p>
      <Button href="/scholarship" size="md" className="mt-6">
        Learn About the Scholarship →
      </Button>
      <p className="mt-3 text-xs text-navy-300">
        <Link href="/scholarship#apply" className="underline">
          Or apply directly →
        </Link>
      </p>
    </div>
  );
}
