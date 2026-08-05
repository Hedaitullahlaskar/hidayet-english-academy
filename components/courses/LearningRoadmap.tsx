import Link from "next/link";

const roadmapSteps = [
  { label: "Beginner", slug: "spoken-english-for-beginners" },
  { label: "Grammar", slug: "complete-english-grammar-mastery" },
  { label: "Vocabulary", slug: "vocabulary-builder" },
  { label: "Pronunciation", slug: "pronunciation-accent-training" },
  { label: "Speaking", slug: "spoken-english-master-course" },
  { label: "Conversation", slug: "advanced-spoken-english" },
  { label: "Interview English", slug: "interview-english" },
  { label: "Professional English", slug: "corporate-english" },
  { label: "Fluent English", slug: "advanced-spoken-english" },
];

export function LearningRoadmap() {
  return (
    <div className="mx-auto flex max-w-xs flex-col items-center">
      {roadmapSteps.map((step, i) => (
        <div key={step.label + i} className="flex flex-col items-center">
          <Link
            href={`/courses/${step.slug}`}
            className="w-full rounded-lg border border-gold-400 bg-navy-800 px-6 py-3 text-center font-display font-semibold text-white shadow-gold transition-transform hover:-translate-y-0.5"
          >
            {step.label}
          </Link>
          {i < roadmapSteps.length - 1 && (
            <span className="my-1.5 text-xl text-gold-500" aria-hidden="true">
              ↓
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
