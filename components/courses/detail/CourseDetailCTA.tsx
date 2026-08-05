import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BuyNowButton } from "@/components/courses/detail/BuyNowButton";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import type { CourseDetail } from "@/types";

export function CourseDetailCTA({ course }: { course: CourseDetail }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 text-center sm:py-20">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-600/20 blur-3xl" />
      <Container className="relative">
        <h2 className="mx-auto max-w-xl text-balance font-display text-2xl font-semibold text-white sm:text-3xl">
          {course.comingSoon
            ? `Want to Be First to Know When ${course.name} Launches?`
            : `Ready to Start ${course.name}?`}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-balance text-navy-300">
          {course.comingSoon
            ? "Message us and we'll notify you the moment enrollment opens."
            : "Your first class is free — no commitment, just a real look at how we teach."}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!course.comingSoon && (
            <Button href="/#enroll" size="lg">
              {course.free ? "Enroll Free →" : "Join Free Demo →"}
            </Button>
          )}
          {!course.comingSoon && !course.free && <BuyNowButton courseSlug={course.slug} />}
          <Button
            href={whatsappLink(whatsappMessages.enrollInquiry(course.name))}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-navy-900"
          >
            WhatsApp Inquiry
          </Button>
        </div>
      </Container>
    </section>
  );
}
