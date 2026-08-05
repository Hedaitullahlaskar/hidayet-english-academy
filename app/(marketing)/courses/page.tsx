import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { CourseFilterGrid } from "@/components/courses/CourseFilterGrid";
import { CourseComparison } from "@/components/courses/CourseComparison";
import { LearningRoadmap } from "@/components/courses/LearningRoadmap";
import { ScholarshipTeaser } from "@/components/courses/ScholarshipTeaser";
import { getAllCourses } from "@/lib/courses/repository";

export const metadata: Metadata = {
  title: "All Courses — Find Your Path",
  description:
    "Browse every Hidayet English Academy course — Spoken English, Grammar Mastery, Vocabulary, Interview English, Career English, and more. Filter by level, audience, and focus to find your path.",
  alternates: { canonical: "https://www.hidayetenglishacademy.com/courses" },
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <>
      <CoursesHero />

      <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
        <Container>
          <CourseFilterGrid courses={courses} />
        </Container>
      </section>

      <section className="bg-paper-100 py-20 dark:bg-navy-900 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Compare Courses"
            title="Not Sure Which One? Compare Side by Side"
          />
          <div className="mt-14">
            <CourseComparison courses={courses} />
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 dark:bg-navy-950 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Your Learning Roadmap"
            title="From Complete Beginner to Fluent English"
            description="Every course fits somewhere on this path. Tap any stage to see the course built for it."
          />
          <div className="mt-14">
            <LearningRoadmap />
          </div>
        </Container>
      </section>

      <section className="bg-paper-100 py-16 dark:bg-navy-900 sm:py-20">
        <Container>
          <ScholarshipTeaser />
        </Container>
      </section>
    </>
  );
}
