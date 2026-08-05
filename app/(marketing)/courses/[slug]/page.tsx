import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CourseDetailHero } from "@/components/courses/detail/CourseDetailHero";
import { CourseDetailOverview } from "@/components/courses/detail/CourseDetailOverview";
import { CourseDetailCurriculum } from "@/components/courses/detail/CourseDetailCurriculum";
import { CourseDetailSampleLesson } from "@/components/courses/detail/CourseDetailSampleLesson";
import { CourseDetailFAQ } from "@/components/courses/detail/CourseDetailFAQ";
import { CourseDetailCTA } from "@/components/courses/detail/CourseDetailCTA";
import { getAllCourseSlugs, getCourseBySlug } from "@/lib/courses/repository";

const SITE_URL = "https://www.hidayetenglishacademy.com";

interface PageProps {
  params: { slug: string };
}

// Pre-renders a static page for every course in the repository at build
// time. Adding course #21 later means adding one entry to the data source
// this repository reads from — this file never changes.
export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return {};

  return {
    title: `${course.name} — ${course.tagline}`,
    description: course.overview,
    alternates: { canonical: `${SITE_URL}/courses/${course.slug}` },
    openGraph: {
      title: `${course.name} | Hidayet English Academy`,
      description: course.overview,
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is "${course.name}" taught live or recorded?`,
        acceptedAnswer: { "@type": "Answer", text: `This course is ${course.format.toLowerCase()}.` },
      },
    ],
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.overview,
    provider: {
      "@type": "EducationalOrganization",
      name: "Hidayet English Academy",
      sameAs: SITE_URL,
    },
    ...(course.free
      ? {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            category: "Free",
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course.name, href: `/courses/${course.slug}` },
        ]}
      />
      <CourseDetailHero course={course} />
      <CourseDetailOverview course={course} />
      <CourseDetailCurriculum course={course} />
      <CourseDetailSampleLesson />
      <CourseDetailFAQ course={course} />
      <CourseDetailCTA course={course} />
    </>
  );
}
