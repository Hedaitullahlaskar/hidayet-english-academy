import type { Metadata } from "next";
import { ScholarshipInfo } from "@/components/scholarship/ScholarshipInfo";
import { ScholarshipApplyForm } from "@/components/scholarship/ScholarshipApplyForm";

export const metadata: Metadata = {
  title: "HEA Merit Scholarship — Apply Now",
  description:
    "No deserving student should stop learning because of financial problems. Apply for the Hidayet English Academy Merit Scholarship — open to any course, any age, any background.",
  alternates: { canonical: "https://www.hidayetenglishacademy.com/scholarship" },
};

export default function ScholarshipPage() {
  return (
    <>
      <ScholarshipInfo />
      <ScholarshipApplyForm />
    </>
  );
}
