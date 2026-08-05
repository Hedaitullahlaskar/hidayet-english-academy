import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { whatYouGet } from "@/content/site-data";

const icons = ["📖", "🔤", "🗣️", "🎧", "📅", "❓", "🌟"];

export function WhatYouGet() {
  return (
    <section className="bg-navy-900 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What You Will Get"
          title="Every Lesson Builds Toward Fluency"
          tone="dark"
          description="A complete, structured curriculum — not scattered videos. Here's exactly what's included in every HEA course."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whatYouGet.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <Card
                tone="navy"
                hoverLift
                className="border-white/10 bg-navy-800/60 backdrop-blur-sm"
              >
                <span className="text-3xl" aria-hidden="true">{icons[i % icons.length]}</span>
                <p className="mt-4 font-display text-base font-semibold text-white">
                  {item}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
