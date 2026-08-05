import type { PolicyDocument } from "@/content/legal/types";

export const acceptableUsePolicy: PolicyDocument = {
  slug: "acceptable-use-policy",
  title: "Acceptable Use Policy",
  shortDescription: "The technical and behavioral rules for using the HEA platform responsibly.",
  category: "Conduct",
  lastUpdated: "2026-08-01",
  icon: "✅",
  blocks: [
    {
      type: "paragraph",
      text: "This Acceptable Use Policy sets out the technical and behavioral rules for using the HEA Platform. It complements our Student and Teacher Codes of Conduct and Community Guidelines, focusing specifically on system use rather than classroom behavior.",
    },
    { type: "heading", text: "1. Acceptable Use" },
    {
      type: "paragraph",
      text: "The Platform is for enrolling in and taking courses, practicing with the AI Assistant, attending live classes, submitting homework, and everything else it's designed to do. Use it for that, in good faith.",
    },
    { type: "heading", text: "2. Prohibited Technical Activity" },
    {
      type: "list",
      items: [
        "Attempting to access another user's account or data without authorization.",
        "Probing, scanning, or testing the Platform's security without our explicit written permission.",
        "Attempting to bypass rate limits, payment requirements, or access controls.",
        "Uploading malware, viruses, or any code intended to disrupt the Platform.",
        "Using automated bots or scripts to interact with the Platform outside of normal, individual human use.",
        "Scraping or bulk-downloading course content or user data.",
      ],
    },
    {
      type: "callout",
      text: "If you discover a genuine security vulnerability, please report it responsibly to hidayetenglishacademy@gmail.com rather than exploiting or publicly disclosing it — we take security reports seriously and will work with you in good faith.",
    },
    { type: "heading", text: "3. Account Use" },
    {
      type: "paragraph",
      text: "One account per person, used only by that person. Creating multiple accounts to evade a suspension, or to abuse referral or scholarship offers, is a violation of this Policy.",
    },
    { type: "heading", text: "4. Content Restrictions" },
    {
      type: "paragraph",
      text: "Do not upload, submit, or transmit through the Platform any content that is illegal, infringing, defamatory, sexually explicit, discriminatory, or that facilitates harm to any person, including yourself. This applies to homework submissions, chat messages, AI Assistant conversations, and profile information alike.",
    },
    { type: "heading", text: "5. Payment System Integrity" },
    {
      type: "paragraph",
      text: "Attempting to manipulate pricing, exploit a coupon system beyond its intended use, or interfere with the payment or webhook systems in any way is treated as a serious violation and may result in immediate account termination and, where appropriate, legal action.",
    },
    { type: "heading", text: "6. Fair Use of Shared Resources" },
    {
      type: "paragraph",
      text: "Features like the AI Assistant and live-class capacity are shared resources. Rate limits exist to keep them fair and available for everyone — attempting to circumvent them affects other students, not just you.",
    },
    { type: "heading", text: "7. Consequences" },
    {
      type: "paragraph",
      text: "Violations of this Policy may result in a warning, temporary suspension, or permanent termination of your account, depending on severity, following the same review process described in our Contact & Grievance Redressal Policy where a formal review applies.",
    },
    { type: "heading", text: "8. Reporting Misuse" },
    {
      type: "paragraph",
      text: "If you notice something on the Platform that looks like misuse — a suspicious account, abusive content, or a technical exploit — please report it to hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "9. API & Automated Access" },
    {
      type: "paragraph",
      text: "HEA does not currently offer a public API for third-party integration. Any automated interaction with our systems beyond normal browser use — including scripted logins, automated form submissions, or bulk data requests — requires our prior written permission and is otherwise treated as a violation of this Policy.",
    },
    { type: "heading", text: "10. Use of the AI Assistant Within This Policy" },
    {
      type: "paragraph",
      text: "The rate limits and content boundaries on the AI Study Assistant, described fully in our separate AI Usage Policy, are part of this Acceptable Use Policy too — attempting to circumvent AI rate limits or to use the Assistant to generate content that violates this Policy is treated the same as any other prohibited technical activity.",
    },
    { type: "heading", text: "11. Device & Browser Requirements" },
    {
      type: "paragraph",
      text: "The Platform is built to work on modern, up-to-date browsers. Deliberately using outdated or modified browser environments to bypass security features (for example, disabling the protections that keep your session secure) falls outside acceptable use and may compromise your own account security as much as the Platform's.",
    },
    { type: "heading", text: "12. Enforcement Discretion" },
    {
      type: "paragraph",
      text: "We aim to apply this Policy proportionately — a first-time, low-impact issue is usually met with a clear warning and explanation, not an immediate suspension. Deliberate, repeated, or high-impact violations are treated more seriously, consistent with how we handle conduct issues under our other policies.",
    },
    { type: "heading", text: "13. Testing Environments" },
    {
      type: "paragraph",
      text: "If you're a developer or technically curious student who wants to explore how the Platform works, please do so respectfully and without impacting other users — and reach out first if you're unsure whether something you want to try falls within acceptable use.",
    },
    { type: "heading", text: "14. Relationship to Other Policies" },
    {
      type: "paragraph",
      text: "This Policy focuses on technical and system-level use; behavior within live classes and community spaces is governed more specifically by our Live Class Rules, Community Guidelines, and Codes of Conduct — read together, these describe the complete standard for using HEA appropriately.",
    },
  ],
};
