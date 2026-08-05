import type { PolicyDocument } from "@/content/legal/types";

export const teacherCodeOfConduct: PolicyDocument = {
  slug: "teacher-code-of-conduct",
  title: "Teacher Code of Conduct",
  shortDescription: "The professional standard every HEA teacher agrees to uphold.",
  category: "Conduct",
  lastUpdated: "2026-08-01",
  icon: "🧑‍🏫",
  blocks: [
    {
      type: "paragraph",
      text: "Teachers are the heart of HEA. This Code of Conduct sets the professional standard every teacher agrees to when their application is approved and they're given access to the Teacher Dashboard.",
    },
    { type: "heading", text: "1. Professionalism" },
    {
      type: "list",
      items: [
        "Conduct live classes and all student interactions with the same professionalism expected in any classroom.",
        "Start and end classes on time, and communicate promptly if you need to reschedule.",
        "Represent HEA's teaching philosophy — bilingual, patient, practical over academic — consistently, not just when observed.",
      ],
    },
    { type: "heading", text: "2. Student Safety First" },
    {
      type: "callout",
      text: "Teachers must never contact a student outside HEA's own platform (personal phone, personal social media, personal email) unless the student is an adult and has explicitly initiated that contact. All communication with minors must stay within HEA's monitored channels.",
    },
    {
      type: "paragraph",
      text: "This rule exists to protect both students and teachers. It is one of the few points in this Code treated as a strict, zero-tolerance requirement — see our Child Safety Policy for the full standard.",
    },
    { type: "heading", text: "3. Fair & Honest Grading" },
    {
      type: "paragraph",
      text: "Grade homework and tests honestly and consistently, based on the actual work submitted. Feedback should be specific and constructive — identifying what to improve, not just a number.",
    },
    { type: "heading", text: "4. Respect & Non-Discrimination" },
    {
      type: "paragraph",
      text: "Treat every student equally, regardless of their starting English level, background, region, or how quickly they're progressing. A student struggling with a concept deserves more patience, not less respect.",
    },
    { type: "heading", text: "5. Content Ownership & Reuse" },
    {
      type: "paragraph",
      text: "Lesson videos, materials, and test questions you create for HEA become part of the HEA course library, used to teach current and future students. You retain the right to be credited as the creator; see our Intellectual Property & Copyright Policy for the full framework.",
    },
    { type: "heading", text: "6. Confidentiality" },
    {
      type: "paragraph",
      text: "Student data you can see through the Teacher Dashboard — progress, submissions, contact details visible for your own courses — is provided so you can teach effectively. It is confidential and must not be shared outside HEA's systems or used for any purpose beyond teaching that student.",
    },
    { type: "heading", text: "7. Live Class Standards" },
    {
      type: "paragraph",
      text: "Keep your camera on where reasonably possible, use appropriate professional background and attire, and moderate class chat to keep it on-topic and respectful. Full detail is in our Live Class Rules.",
    },
    { type: "heading", text: "8. Use of the AI Assistant" },
    {
      type: "paragraph",
      text: "Teachers are welcome to use the AI Study Assistant as a resource for planning explanations or generating practice material ideas, subject to the same AI Usage Policy that applies to students — treating its output as a starting point, not a final authority.",
    },
    { type: "heading", text: "9. Reporting Concerns" },
    {
      type: "paragraph",
      text: "If you observe a safety concern involving a student, or receive a report from a student about another teacher or student, escalate it to HEA administration immediately through the Doubts/support channel rather than handling it informally.",
    },
    { type: "heading", text: "10. Consequences of Violations" },
    {
      type: "paragraph",
      text: "Violations of this Code — particularly anything touching student safety — are treated with the seriousness they warrant, up to immediate suspension of teaching access pending review, and permanent removal for serious or repeated breaches.",
    },
    { type: "heading", text: "11. Continuing Professional Growth" },
    {
      type: "paragraph",
      text: "Great teaching is a practice, not a fixed skill. We encourage teachers to keep refining their explanations, their pacing, and their feedback style — and we take teacher feedback about the platform itself seriously, since the people delivering lessons every day often see friction students don't think to report.",
    },
    { type: "heading", text: "12. Punctuality & Reliability" },
    {
      type: "paragraph",
      text: "Students plan their day around a scheduled class, sometimes around unreliable electricity or shared family devices. A teacher who is reliably present and on time respects that planning; unexplained absences or late starts affect real people's limited windows to practice.",
    },
    { type: "heading", text: "13. Handling Difficult Moments" },
    {
      type: "paragraph",
      text: "Not every class goes smoothly — a disruptive student, a technical failure, a question you don't know the answer to. Handle these calmly and honestly. It's always better to say 'let me check and get back to you' than to guess and risk teaching something incorrect.",
    },
    { type: "heading", text: "14. Compensation & Administrative Matters" },
    {
      type: "paragraph",
      text: "Matters relating to teacher compensation, scheduling arrangements, and administrative onboarding are handled separately through your individual agreement with HEA and are outside the scope of this public-facing Code of Conduct, which focuses on the standard of conduct expected toward students.",
    },
    { type: "heading", text: "15. Modeling the Standard" },
    {
      type: "paragraph",
      text: "Students, especially younger ones, take cues from how a teacher treats them and their classmates. A teacher who models patience, respect, and genuine curiosity is teaching those values alongside the English lesson itself.",
    },
    { type: "heading", text: "16. Supporting Struggling Students" },
    {
      type: "paragraph",
      text: "Where a student is genuinely falling behind, we ask teachers to flag it early — through a note to HEA administration or a direct, kind conversation with the student — rather than letting silent disengagement continue unaddressed until it's harder to recover from.",
    },
  ],
};
