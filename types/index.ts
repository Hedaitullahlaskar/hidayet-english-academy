export interface Bilingual {
  en: string;
  bn: string;
}

export interface Course {
  id: string;
  name: Bilingual;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Board Exam";
  description: string;
  highlights: string[];
  price: "Free" | string;
  featured?: boolean;
}

export interface Program {
  id: string;
  icon: string;
  name: Bilingual;
  tagline: string;
  duration: string;
  badge?: string;
  highlights: string[];
  featured?: boolean;
}

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type CourseAudience = "Children" | "Students" | "College" | "Professionals" | "Job Seekers";
export type CourseCategory = "Grammar" | "Speaking" | "Vocabulary" | "Interview" | "School" | "Career";
export type CourseFormat = "Live" | "Recorded" | "Hybrid";

export interface CourseDetail {
  slug: string;
  name: string;
  nameBn: string;
  tagline: string;
  icon: string;
  level: CourseLevel;
  audience: CourseAudience[];
  category: CourseCategory[];
  duration: string;
  format: CourseFormat;
  language: string;
  schedule: string;
  overview: string;
  whoShouldJoin: string[];
  eligibility: string;
  syllabus: string[];
  outcomes: string[];
  weeklyPractice: string;
  assignments: string;
  mockTests: string;
  certificateStatus: "available" | "coming-soon";
  comingSoon?: boolean;
  featured?: boolean;
  free?: boolean;
}

export interface LearningStage {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface TeachingPillar {
  id: string;
  number: string;
  title: string;
  points: string[];
  footerTag: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  studentName: string;
  courseName: string;
  quote: string;
  photoUrl?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export interface NavLink {
  label: string;
  href: string;
}
