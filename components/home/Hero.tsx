import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FounderPortrait } from "@/components/ui/FounderPortrait";
import { CheckIcon } from "@/components/ui/icons";
import { learningLoop, site, heroTrustPoints } from "@/content/site-data";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-navy-900 pb-20 pt-14 sm:pb-28 sm:pt-20"
    >
      {/* Ambient grid + glow — quiet texture, not decoration for its own sake */}
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-gold-600/20 blur-3xl" />

      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: message */}
        <div className="text-center lg:text-left">
          <Badge tone="gold" className="animate-fade-up">
            {site.founder.experience} · Bengali Speakers Worldwide
          </Badge>

          <h1 className="mt-6 animate-fade-up text-balance font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            Learn English,
            <br />
            <span className="text-gold-400">Build Your Future.</span>
          </h1>

          <p
            lang="bn"
            className="mt-4 animate-fade-up text-balance text-xl font-medium text-navy-200 [animation-delay:140ms] sm:text-2xl"
          >
            ইংরেজি শিখুন, গড়ুন আপনার উজ্জ্বল ভবিষ্যৎ
          </p>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-balance text-base leading-relaxed text-navy-300 [animation-delay:200ms] sm:text-lg lg:mx-0">
            Structured grammar, real spoken confidence, and practical English
            for real life — from Hidayet Sir, welcoming Bengali-speaking
            learners in India, Bangladesh, the Middle East, Europe, North
            America, and beyond for over a decade.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col items-center gap-4 [animation-delay:260ms] sm:flex-row sm:justify-center lg:justify-start">
            <Button href="/#enroll" size="lg">
              Join Free Class →
            </Button>
            <Button
              href={whatsappLink(whatsappMessages.general)}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-navy-900"
            >
              Chat on WhatsApp
            </Button>
          </div>

          <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-navy-300 [animation-delay:320ms] lg:justify-start">
            {heroTrustPoints.map((point) => (
              <span key={point} className="flex items-center gap-2">
                <CheckDot /> {point}
              </span>
            ))}
          </div>
        </div>

        {/* Right: signature Learning Loop + founder portrait */}
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center gap-8">
          {/* Radial diagram: shown from sm breakpoint up, where there's room
              for six labeled nodes without crowding the founder photo. */}
          <div className="relative hidden aspect-square w-full items-center justify-center sm:flex">
            <LearningLoopDial />
            <FounderPortrait size="sm" caption float priority />
          </div>

          {/* Mobile: founder photo alone, method compressed into a scrollable
              chip strip beneath it — avoids cramming six radial labels into
              a ~320px-wide screen. */}
          <div className="flex flex-col items-center gap-5 sm:hidden">
            <FounderPortrait size="sm" caption priority />
            <div className="flex w-full gap-2 overflow-x-auto pb-1" role="list" aria-label="Our teaching method, in order">
              {learningLoop.map((stage) => (
                <span
                  key={stage.id}
                  role="listitem"
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/40 bg-navy-800/80 px-3 py-1.5 text-xs font-semibold text-gold-300"
                >
                  <span className="text-gold-500">{stage.step}</span> {stage.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CheckDot() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
      <CheckIcon className="h-3 w-3" />
    </span>
  );
}

/** The academy's real six-stage method, arranged as a radial dial around the founder. */
function LearningLoopDial() {
  const radius = 44; // percent of container
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {learningLoop.map((stage, i) => {
        const angle = (i / learningLoop.length) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <div
            key={stage.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 animate-loop-pulse flex-col items-center [animation-delay:calc(var(--i)*0.3s)]"
            style={{ left: `${x}%`, top: `${y}%`, "--i": i } as CSSProperties}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/50 bg-navy-800/90 text-xs font-bold text-gold-300 shadow-card sm:h-12 sm:w-12">
              {stage.step}
            </span>
            <span className="mt-1.5 text-[11px] font-semibold text-navy-300 sm:text-xs">
              {stage.title}
            </span>
          </div>
        );
      })}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r={radius} stroke="#C9A227" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="2 3" />
      </svg>
    </div>
  );
}
