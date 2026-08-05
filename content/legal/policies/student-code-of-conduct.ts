import type { PolicyDocument } from "@/content/legal/types";

export const studentCodeOfConduct: PolicyDocument = {
  slug: "student-code-of-conduct",
  title: "Student Code of Conduct",
  shortDescription: "The standard of behavior we expect from every student, in class and in the app.",
  category: "Conduct",
  lastUpdated: "2026-08-01",
  icon: "🎓",
  blocks: [
    {
      type: "paragraph",
      text: "HEA works because our classroom — live and online — is a place where students feel safe to make mistakes while learning a new language. This Code of Conduct sets out what we expect from every student, whether you're in a live class, using the AI Assistant, or posting a doubt for your teacher.",
    },
    { type: "heading", text: "1. Respect" },
    {
      type: "list",
      items: [
        "Treat teachers and fellow students with courtesy, regardless of their level of English, background, or where they're joining from.",
        "Language mistakes are the entire point of a spoken-English class — never mock a classmate's pronunciation, grammar, or accent.",
        "Disagreements are fine; disrespect, insults, and harassment are not.",
      ],
    },
    { type: "heading", text: "2. Live Class Etiquette" },
    {
      type: "paragraph",
      text: "Join on time, keep your microphone muted when not speaking, and use the waiting room and chat respectfully. Full detail on live-class-specific expectations is in our separate Live Class Rules.",
    },
    { type: "heading", text: "3. Academic Honesty" },
    {
      type: "callout",
      text: "Quizzes, tests, and homework should reflect your own understanding. Using the AI Assistant, a friend, or another source to complete a graded assessment for you undermines the point of the exercise — and your own progress.",
    },
    {
      type: "paragraph",
      text: "Using the AI Assistant to learn — asking it to explain a rule, check your writing, or practice a conversation — is exactly what it's for. Using it to generate answers for a quiz or test you're being scored on is not.",
    },
    { type: "heading", text: "4. Homework & Submissions" },
    {
      type: "paragraph",
      text: "Submit your own work. Submitting someone else's writing or file as your own homework is treated the same as any other form of academic dishonesty and may result in the submission being disqualified.",
    },
    { type: "heading", text: "5. Appropriate Use of Communication Tools" },
    {
      type: "paragraph",
      text: "The Doubts feature, live-class chat, and any messaging tools are for course-related questions and communication. They are not for spam, unrelated advertising, or contacting teachers or students about anything outside your course.",
    },
    { type: "heading", text: "6. Content You Share" },
    {
      type: "paragraph",
      text: "Anything you submit — homework files, written answers, chat messages — must be your own and must not contain content that is abusive, discriminatory, sexually explicit, or otherwise inappropriate for an educational setting with students of all ages.",
    },
    { type: "heading", text: "7. Attendance" },
    {
      type: "paragraph",
      text: "We don't expect perfect attendance — life happens — but consistent, unexplained absence from live classes affects both your own progress and, in group classes, the experience of your classmates. If you're going to miss a class, that's completely fine; there's no need to notify us in advance.",
    },
    { type: "heading", text: "8. Consequences" },
    {
      type: "paragraph",
      text: "Most conduct concerns are resolved through a conversation with your teacher. Where a serious violation occurs — harassment, repeated academic dishonesty, or content that endangers other students — HEA may issue a warning, temporarily suspend, or, in serious cases, permanently remove access to the Platform, following our Contact & Grievance Redressal process where a formal review is appropriate.",
    },
    { type: "heading", text: "9. Reporting a Concern" },
    {
      type: "paragraph",
      text: "If another student's or a teacher's behavior concerns you, please tell us. Reports are taken seriously and handled discreetly through our grievance process.",
    },
    { type: "heading", text: "10. This Code Alongside Our Other Policies" },
    {
      type: "paragraph",
      text: "This Code works alongside our Community Guidelines, Acceptable Use Policy, and, for younger students, our Child Safety Policy.",
    },
    { type: "heading", text: "11. Respecting Your Own Learning Process" },
    {
      type: "paragraph",
      text: "Part of conduct is how you treat yourself, too — comparing your Week 2 English to a classmate's Year 2 English isn't fair to you. Progress at HEA is measured against your own starting point, not against everyone else in the room, and we'd rather you show up imperfectly than not show up at all.",
    },
    { type: "heading", text: "12. Sharing Feedback About Teachers or Courses" },
    {
      type: "paragraph",
      text: "Honest feedback about a teacher's pace, a confusing lesson, or a course that isn't working for you is genuinely welcome — through your teacher directly, or through our Contact & Grievance Redressal process for anything more sensitive. This kind of feedback is never held against you.",
    },
    { type: "heading", text: "13. Multiple Accounts & Fair Access" },
    {
      type: "paragraph",
      text: "Creating a second account to access a free trial twice, or to get around a suspension, is a conduct violation as well as a breach of our Acceptable Use Policy — it takes a spot or a scholarship slot away from another student who needs it.",
    },
    { type: "heading", text: "14. Group Class Dynamics" },
    {
      type: "paragraph",
      text: "In a group live class, being mindful of shared speaking time matters — everyone benefits when the class balances more confident speakers with quieter students who may need a bit more encouragement to jump in.",
    },
    { type: "heading", text: "15. A Living Standard" },
    {
      type: "paragraph",
      text: "This Code reflects the kind of classroom we're building together, and it will be refined as HEA grows. The underlying expectation stays constant: come ready to learn, and treat everyone else here with the same patience you'd want extended to you.",
    },
  ],
};
