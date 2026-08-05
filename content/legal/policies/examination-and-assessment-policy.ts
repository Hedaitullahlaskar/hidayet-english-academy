import type { PolicyDocument } from "@/content/legal/types";

export const examinationAndAssessmentPolicy: PolicyDocument = {
  slug: "examination-and-assessment-policy",
  title: "Examination & Assessment Policy",
  shortDescription: "How quizzes, weekly tests, and mock exams work, and how they're scored.",
  category: "Academic",
  lastUpdated: "2026-08-01",
  icon: "📝",
  blocks: [
    {
      type: "paragraph",
      text: "HEA uses regular, low-stakes assessment — lesson quizzes, weekly tests, and full-length mock exams — to help both you and your teacher see real progress, not to catch you out. This Policy explains how they work.",
    },
    { type: "heading", text: "1. Types of Assessment" },
    {
      type: "list",
      items: [
        "Lesson quizzes: short checks embedded in individual lessons, untimed, meant as a quick self-check.",
        "Weekly tests: slightly more formal, timed assessments covering recent material.",
        "Mock exams: full-length, timed, sometimes divided into sections, designed to simulate real exam conditions.",
      ],
    },
    { type: "heading", text: "2. Timing" },
    {
      type: "paragraph",
      text: "Weekly tests and mock exams run on a real countdown timer shown on screen throughout. If time runs out, your test is automatically submitted with whatever answers you've entered — so it's worth attempting every question rather than leaving blanks for later.",
    },
    { type: "heading", text: "3. Question Order" },
    {
      type: "paragraph",
      text: "Where a test has randomized question order enabled, each attempt (yours and every other student's) presents questions in a genuinely different sequence, generated fresh each time you start.",
    },
    { type: "heading", text: "4. Multiple Attempts" },
    {
      type: "callout",
      text: "Where a test allows multiple attempts, your best score is what's reflected in your progress dashboard — but every attempt is recorded and visible to your teacher, so use extra attempts to genuinely improve, not to guess your way to a good score.",
    },
    { type: "heading", text: "5. Pass Marks" },
    {
      type: "paragraph",
      text: "Each test has a pass percentage set by your teacher. Falling short of it isn't a punishment — it's information showing exactly where to focus, and (where multiple attempts are allowed) an invitation to try again after review.",
    },
    { type: "heading", text: "6. Auto-Grading" },
    {
      type: "paragraph",
      text: "Multiple-choice and short-answer questions are graded automatically and instantly the moment you submit. Where a question requires longer written judgment, your teacher grades it manually and you'll see the result and feedback in your dashboard once complete.",
    },
    { type: "heading", text: "7. Academic Honesty During Assessment" },
    {
      type: "paragraph",
      text: "Tests and exams should reflect your own knowledge, without outside help from another person, a search engine, or the AI Study Assistant. See our Student Code of Conduct for the full standard.",
    },
    { type: "heading", text: "8. Reviewing Results" },
    {
      type: "paragraph",
      text: "Your full test and quiz history, including every attempt's score, is visible in your dashboard under Tests & Mock Exams, so you can genuinely track improvement over time rather than seeing only your latest result.",
    },
    { type: "heading", text: "9. Technical Issues During a Test" },
    {
      type: "paragraph",
      text: "If your connection drops mid-test, contact your teacher as soon as possible through the Doubts feature — genuine technical issues are handled fairly and are not treated as a failed attempt where reasonably verifiable.",
    },
    { type: "heading", text: "10. How Assessment Feeds Your Certificate" },
    {
      type: "paragraph",
      text: "Where a course's completion certificate depends on a passing assessment score, that requirement is stated clearly on the course page before you enroll. See our Certificate Policy for how issuance works.",
    },
    { type: "heading", text: "11. Feedback on Assessments" },
    {
      type: "paragraph",
      text: "Beyond a raw score, we believe assessment should teach — where a question type allows it, you'll see which specific answers were correct or incorrect, not just a final percentage. For manually-graded written responses, your teacher's feedback is meant to explain the 'why' behind a mark, not just the mark itself.",
    },
    { type: "heading", text: "12. Difficulty Levels" },
    {
      type: "paragraph",
      text: "Questions in our bank are tagged by difficulty (easy, medium, hard) so teachers can build tests that genuinely match a class's level, or stretch a student who's ready for more challenge. A hard question appearing on your test isn't a trick — it's there because your teacher believes you're ready to be tested on it.",
    },
    { type: "heading", text: "13. Section-Wise Exams" },
    {
      type: "paragraph",
      text: "For full-length mock exams, questions may be organized into clearly labeled sections (for example, grammar, vocabulary, and reading comprehension) so you can track your performance area by area, not just see one combined score at the end.",
    },
    { type: "heading", text: "14. Retaking After Review" },
    {
      type: "paragraph",
      text: "Where multiple attempts are allowed, we genuinely encourage using the time between attempts to review what you missed with your teacher or the AI Study Assistant's Grammar Helper, rather than immediately retaking the test hoping for a better guess.",
    },
    { type: "heading", text: "15. Assessment Accessibility" },
    {
      type: "paragraph",
      text: "If a specific disability or learning difference means standard test timing or format doesn't fairly reflect your knowledge, contact your teacher or hidayetenglishacademy@gmail.com — we're glad to discuss a reasonable accommodation on a case-by-case basis.",
    },
    { type: "heading", text: "16. Consistency Across Attempts" },
    {
      type: "paragraph",
      text: "Even when questions are shuffled, every attempt of the same test draws from the same underlying question pool and total marks, so your score remains meaningfully comparable between attempts — shuffling changes the order you see them in, not the substance of what's being tested.",
    },
  ],
};
