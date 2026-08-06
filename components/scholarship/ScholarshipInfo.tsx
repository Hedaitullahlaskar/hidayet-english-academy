import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon } from "@/components/ui/icons";

const eligibility = [
  "Genuine financial hardship that would otherwise prevent enrollment",
  "A real commitment to attending classes and completing coursework",
  "Any HEA program — no course is excluded from consideration",
  "Open to students of any age, background, or location",
];

const process = [
  { title: "Apply", body: "Tell us a little about your situation and the course you'd like to join." },
  { title: "Share Documents", body: "Send any supporting documents directly in the same WhatsApp conversation — no separate upload system to fight with." },
  { title: "Honest Review", body: "Our team reviews every application personally. We don't use a formula — we read what you actually wrote." },
  { title: "We Get Back to You", body: "Whatever the outcome, you'll hear from us directly, not silence." },
];

export function ScholarshipInfo() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge tone="gold">HEA Merit Scholarship</Badge>
          <h1 className="mt-6 text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
            &ldquo;No Deserving Student Should Stop Learning Because of Financial Problems.&rdquo;
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-navy-300">
            This isn&apos;t a marketing line. It&apos;s the reason the Madhyamik
            program is free, and it&apos;s why this scholarship exists for
            every other course we teach.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-xl font-semibold text-white">Who Can Apply</h2>
            <ul className="mt-5 space-y-3">
              {eligibility.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-200">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-display text-xl font-semibold text-white">How It Works</h2>
            <ol className="mt-5 space-y-4">
              {process.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/50 bg-navy-800 font-display text-sm font-semibold text-gold-300">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-navy-300">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
