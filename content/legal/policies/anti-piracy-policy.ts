import type { PolicyDocument } from "@/content/legal/types";

export const antiPiracyPolicy: PolicyDocument = {
  slug: "anti-piracy-policy",
  title: "Anti-Piracy Policy",
  shortDescription: "Why unauthorized sharing of course content hurts everyone, and how we respond to it.",
  category: "Legal",
  lastUpdated: "2026-08-01",
  icon: "🚫",
  blocks: [
    {
      type: "paragraph",
      text: "Every course on HEA represents real work — teachers preparing lessons, recording explanations, writing test questions. This Policy explains why we take unauthorized sharing seriously, and what we do about it.",
    },
    { type: "heading", text: "1. What Counts as Piracy" },
    {
      type: "list",
      items: [
        "Downloading and redistributing lesson videos or PDFs outside HEA's own tools.",
        "Recording live classes and posting or sharing them publicly.",
        "Sharing your account login so someone who hasn't enrolled can access paid content.",
        "Uploading HEA course material to third-party sharing sites, torrents, or messaging groups.",
        "Reselling access to HEA content, in whole or in part.",
      ],
    },
    { type: "heading", text: "2. Why It Matters" },
    {
      type: "paragraph",
      text: "Piracy doesn't just affect HEA as a business — it undermines our ability to keep offering scholarship programs, invest in better lessons, and pay our teachers fairly for the work they put into every course. Every student who shares an account instead of enrolling is a spot that could have gone to someone genuinely committed, including a scholarship applicant.",
    },
    {
      type: "callout",
      text: "We would much rather help a student who genuinely can't afford a course — through our Scholarship Policy — than see that course pirated. If cost is the barrier, talk to us first.",
    },
    { type: "heading", text: "3. Technical Measures" },
    {
      type: "paragraph",
      text: "Course content is served from access-controlled storage rather than public URLs, and account activity that looks like credential sharing (the same account used from unusually many locations at once, for example) may be flagged for review.",
    },
    { type: "heading", text: "4. Consequences for Students" },
    {
      type: "list",
      items: [
        "First identified instance: a direct warning and explanation of this Policy.",
        "Continued or serious violations (e.g., reselling access): account suspension without refund.",
        "Large-scale redistribution: permanent account termination and, where appropriate, legal action.",
      ],
    },
    { type: "heading", text: "5. Consequences for Teachers" },
    {
      type: "paragraph",
      text: "Teachers who redistribute course material outside their authorized role, or who allow unauthorized access to paid content, are subject to the same consequences under our Teacher Code of Conduct, up to termination of their teaching relationship with HEA.",
    },
    { type: "heading", text: "6. If You Find Pirated HEA Content" },
    {
      type: "paragraph",
      text: "If you come across HEA course material being shared or sold outside our Platform, please tell us at hidayetenglishacademy@gmail.com with a link or description — this genuinely helps us protect the courses that fund our free and scholarship programs.",
    },
    { type: "heading", text: "7. Legal Basis" },
    {
      type: "paragraph",
      text: "This Policy is enforced under our Terms & Conditions and Intellectual Property & Copyright Policy, and, where necessary, under applicable copyright law in the relevant jurisdiction.",
    },
    { type: "heading", text: "8. Why We Design for Prevention, Not Just Punishment" },
    {
      type: "paragraph",
      text: "Our approach to piracy starts with making legitimate access genuinely attractive — real value at fair prices, a scholarship path for students who can't pay, and a free trial class so nobody has to guess whether a course is worth it before committing. Enforcement matters, but it's the backstop, not the first line of defense.",
    },
    { type: "heading", text: "9. Screen Recording & Screenshots" },
    {
      type: "paragraph",
      text: "Taking a screenshot of a lesson to ask a quick question in a study group chat is different, in both intent and impact, from systematically recording and redistributing entire courses. We evaluate reports with that distinction in mind — this Policy exists to stop organized redistribution of paid content, not to police every incidental screenshot a student takes while studying.",
    },
    { type: "heading", text: "10. Institutional & Group Licensing" },
    {
      type: "paragraph",
      text: "If you represent a school, tutoring center, or other organization that wants to give multiple students legitimate access to HEA courses, contact us directly — we're glad to discuss a proper group arrangement rather than have you work around individual-account limits informally, which would fall under this Policy.",
    },
    { type: "heading", text: "11. Appeals" },
    {
      type: "paragraph",
      text: "If your account was suspended under this Policy and you believe it was a mistake — a false positive from our access-pattern detection, for instance, rather than genuine sharing — contact us with an explanation. We review every appeal individually rather than treating an automated flag as a final judgment.",
    },
    { type: "heading", text: "12. Protecting Teachers' Livelihoods" },
    {
      type: "paragraph",
      text: "Beyond HEA as a business, piracy directly affects the teachers whose lessons are being redistributed without compensation. Respecting this Policy is, in a real sense, respecting the people who built the course you're learning from.",
    },
    { type: "heading", text: "13. Working With Platforms Hosting Pirated Content" },
    {
      type: "paragraph",
      text: "Where HEA content is found on a third-party site or messaging platform, we submit formal takedown requests to that platform under applicable copyright law, in addition to any action taken against the HEA account responsible.",
    },
  ],
};
