import type { PolicyDocument } from "@/content/legal/types";
import { termsAndConditions } from "@/content/legal/policies/terms-and-conditions";
import { privacyPolicy } from "@/content/legal/policies/privacy-policy";
import { refundAndCancellationPolicy } from "@/content/legal/policies/refund-and-cancellation-policy";
import { paymentPolicy } from "@/content/legal/policies/payment-policy";
import { cookiePolicy } from "@/content/legal/policies/cookie-policy";
import { disclaimer } from "@/content/legal/policies/disclaimer";
import { studentCodeOfConduct } from "@/content/legal/policies/student-code-of-conduct";
import { teacherCodeOfConduct } from "@/content/legal/policies/teacher-code-of-conduct";
import { communityGuidelines } from "@/content/legal/policies/community-guidelines";
import { liveClassRules } from "@/content/legal/policies/live-class-rules";
import { examinationAndAssessmentPolicy } from "@/content/legal/policies/examination-and-assessment-policy";
import { certificatePolicy } from "@/content/legal/policies/certificate-policy";
import { scholarshipPolicy } from "@/content/legal/policies/scholarship-policy";
import { aiUsagePolicy } from "@/content/legal/policies/ai-usage-policy";
import { intellectualPropertyAndCopyrightPolicy } from "@/content/legal/policies/intellectual-property-and-copyright-policy";
import { antiPiracyPolicy } from "@/content/legal/policies/anti-piracy-policy";
import { dataProtectionPolicy } from "@/content/legal/policies/data-protection-policy";
import { acceptableUsePolicy } from "@/content/legal/policies/acceptable-use-policy";
import { childSafetyPolicy } from "@/content/legal/policies/child-safety-policy";
import { contactAndGrievanceRedressalPolicy } from "@/content/legal/policies/contact-and-grievance-redressal-policy";

// Order here is the canonical, intentional reading order used by the
// Legal Center hub and the footer — most universally relevant first.
export const allPolicies: PolicyDocument[] = [
  termsAndConditions,
  privacyPolicy,
  refundAndCancellationPolicy,
  paymentPolicy,
  cookiePolicy,
  disclaimer,
  studentCodeOfConduct,
  teacherCodeOfConduct,
  communityGuidelines,
  liveClassRules,
  examinationAndAssessmentPolicy,
  certificatePolicy,
  scholarshipPolicy,
  aiUsagePolicy,
  intellectualPropertyAndCopyrightPolicy,
  antiPiracyPolicy,
  dataProtectionPolicy,
  acceptableUsePolicy,
  childSafetyPolicy,
  contactAndGrievanceRedressalPolicy,
];

export function getPolicyBySlug(slug: string): PolicyDocument | undefined {
  return allPolicies.find((p) => p.slug === slug);
}

export const policyCategories = ["Legal", "Academic", "Conduct", "Payments", "Safety & Privacy"] as const;
