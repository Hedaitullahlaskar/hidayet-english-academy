import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import type { CourseDetail } from "@/types";

export function CourseDetailHero({ course }: { course: CourseDetail }) {
  const facts = [
    { label: "Level", value: course.level },
    { label: "Duration", value: course.duration },
    { label: "Format", value: course.format },
    { label: "Language", value: course.language },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-20">
      <div className="bg-grid-navy pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl" aria-hidden="true">
            {course.icon}
          </span>
          {course.comingSoon && <Badge tone="gold">Coming Soon</Badge>}
          {course.free && <Badge tone="success">100% Free</Badge>}
          {course.featured && !course.comingSoon && <Badge tone="gold">Flagship Course</Badge>}
        </div>

        <h1 className="mt-5 max-w-3xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
          {course.name}
        </h1>
        <p lang="bn" className="mt-2 text-lg font-medium text-navy-300">
          {course.nameBn}
        </p>
        <p className="mt-4 max-w-2xl text-balance leading-relaxed text-navy-200 sm:text-lg">
          {course.tagline}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-lg border border-white/10 bg-navy-800/60 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gold-400">{f.label}</p>
              <p className="mt-1 text-sm font-semibold text-white">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          {!course.comingSoon && (
            <Button href="/#enroll" size="lg">
              {course.free ? "Enroll Free →" : "Join a Free Demo →"}
            </Button>
          )}
          <Button
            href={whatsappLink(
              course.comingSoon
                ? whatsappMessages.courseInterest(course.name)
                : whatsappMessages.enrollInquiry(course.name)
            )}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-navy-900"
          >
            {course.comingSoon ? "Ask to Be Notified" : "WhatsApp Inquiry"}
          </Button>
          {!course.free && !course.comingSoon && (
            <Button
              href={whatsappLink(whatsappMessages.courseInterest(course.name))}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
