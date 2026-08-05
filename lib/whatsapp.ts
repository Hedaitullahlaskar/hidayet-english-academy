import { site } from "@/content/site-data";

/**
 * Builds a wa.me deep link with a pre-filled message.
 * Centralized so every CTA on the site formats WhatsApp links identically.
 */
export function whatsappLink(message: string, number: string = site.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: "Hello Hidayet English Academy, I want to know more about your courses.",
  joinCommunity: "Hello, I'd like to join the HEA WhatsApp group.",
  courseInterest: (courseName: string) =>
    `Hello, I'm interested in the "${courseName}" course. Could you share the fees and next batch timing?`,
  courseInterestWithCurrency: (courseName: string, currencyCode: string) =>
    `Hello, I'm interested in the "${courseName}" course. Could you share the fees (in ${currencyCode} if possible) and next batch timing?`,
  enrollInquiry: (courseName: string) =>
    `Hello Hidayet English Academy, I'd like to enroll in "${courseName}". Please guide me through the next steps.`,
  askTeacher: "Hello, I have a question about one of my lessons. Could a teacher help me?",
  scholarshipApplication: (name: string, courseInterest: string, reason: string) =>
    `Hello Hidayet English Academy, I'd like to apply for the HEA Merit Scholarship.\n\nName: ${name}\nCourse interested in: ${courseInterest}\nWhy I'm applying: ${reason}\n\n(I'll send my supporting documents in this chat.)`,
  freeClassBooked: (name: string, courseInterest: string, phone: string) =>
    `Hello Hidayet English Academy, I'd like to book a free class.\n\nName: ${name}\nInterested in: ${courseInterest}\nPhone: ${phone}`,
};
