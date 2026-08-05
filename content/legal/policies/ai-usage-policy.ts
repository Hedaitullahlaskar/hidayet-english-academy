import type { PolicyDocument } from "@/content/legal/types";

export const aiUsagePolicy: PolicyDocument = {
  slug: "ai-usage-policy",
  title: "AI Usage Policy",
  shortDescription: "How our AI Study Assistant works, its limits, and how your conversations are handled.",
  category: "Academic",
  lastUpdated: "2026-08-01",
  icon: "🤖",
  blocks: [
    {
      type: "paragraph",
      text: "The HEA AI Study Assistant is a genuine, useful tool for practicing grammar, vocabulary, conversation, writing, and reading — but it's still an AI system, and this Policy explains exactly what that means for how you should use it and what happens to your conversations with it.",
    },
    { type: "heading", text: "1. What the AI Assistant Is For" },
    {
      type: "list",
      items: [
        "Grammar Helper: explaining rules in simple English and Bengali.",
        "Vocabulary Builder: definitions, pronunciation guidance, and example sentences.",
        "Conversation Practice: a patient partner for spoken-style practice, with gentle corrections.",
        "Writing Correction: feedback on grammar and structure in your own writing.",
        "Reading Comprehension: generated passages and comprehension questions.",
        "Speaking Practice: text-based today, with real voice input planned for the future.",
      ],
    },
    { type: "heading", text: "2. It Is a Learning Aid, Not a Teacher" },
    {
      type: "callout",
      text: "The AI Assistant is built to be genuinely useful, and it can also be wrong. It doesn't replace your human teacher's judgment — treat its answers as a helpful starting point, and check anything important with your teacher.",
    },
    { type: "heading", text: "3. Appropriate Use" },
    {
      type: "paragraph",
      text: "Use the Assistant to learn — ask questions, request explanations, practice conversation, get writing feedback. It is not appropriate to use it to generate answers for a graded quiz, test, or homework assignment; see our Student Code of Conduct and Examination & Assessment Policy for why that undermines the point of assessment.",
    },
    { type: "heading", text: "4. How Your Messages Are Processed" },
    {
      type: "paragraph",
      text: "When you send a message, it's sent to Anthropic's API (the AI provider powering the Assistant) to generate a response, along with the recent history of that specific conversation thread so the Assistant has context. Your message and the Assistant's reply are then saved in our database, tied to your account, so your conversation history is available to you the next time you open that mode.",
    },
    { type: "heading", text: "5. What Isn't Shared" },
    {
      type: "paragraph",
      text: "We don't send your payment information, account password, or unrelated personal data to the AI provider — only the conversation content itself, needed to generate a relevant response.",
    },
    { type: "heading", text: "6. Rate Limits" },
    {
      type: "paragraph",
      text: "To keep the Assistant available and responsive for everyone, message sending is rate-limited. If you hit the limit, you'll see a clear message telling you how long to wait — this is a fair-use protection, not a punishment.",
    },
    { type: "heading", text: "7. Content Boundaries" },
    {
      type: "paragraph",
      text: "The Assistant is designed to stay focused on English learning and will redirect conversations that drift outside that purpose. It should never be used to generate content that violates our Acceptable Use Policy or Community Guidelines.",
    },
    { type: "heading", text: "8. Accuracy & Limitations" },
    {
      type: "paragraph",
      text: "Like any AI system, the Assistant can occasionally produce an incorrect explanation, an imperfect translation, or a response that doesn't quite fit context. If you notice something that seems wrong, mention it to your teacher — this also genuinely helps us improve the Assistant over time.",
    },
    { type: "heading", text: "9. Speaking Practice & Voice" },
    {
      type: "paragraph",
      text: "Speaking Practice mode is currently text-based — you type what you would say, and the Assistant coaches you on phrasing and fluency. Real voice input is planned; when it launches, this Policy will be updated to describe how voice data specifically is handled.",
    },
    { type: "heading", text: "10. Your Data Rights" },
    {
      type: "paragraph",
      text: "Your AI conversation history is your own data, viewable only by you (and, where relevant for teaching, in aggregate learning-progress form to your teacher — not the literal conversation text). It's covered by the same rights described in our Privacy Policy, including the ability to request deletion.",
    },
    { type: "heading", text: "11. Why We Built Six Separate Modes" },
    {
      type: "paragraph",
      text: "Rather than one generic chatbot, the Assistant is deliberately split into Grammar Helper, Vocabulary Builder, Conversation Practice, Writing Correction, Reading Comprehension, and Speaking Practice — each with its own system behavior tuned to that specific kind of learning, matching how a real HEA teacher would approach each skill differently rather than treating all English practice the same way.",
    },
    { type: "heading", text: "12. Bilingual by Design" },
    {
      type: "paragraph",
      text: "Consistent with HEA's overall teaching philosophy, the Assistant is designed to explain concepts in simple English first, then reinforce them in Bengali where that helps a concept truly land — particularly for grammar rules where Bengali sentence structure and English structure diverge in ways that are easy to explain directly in Bengali.",
    },
    { type: "heading", text: "13. When the Assistant Isn't Available" },
    {
      type: "paragraph",
      text: "If the AI Assistant is temporarily unavailable — for maintenance, or because the underlying service is experiencing an outage — the rest of the Platform continues to function normally. We'll display a clear message rather than a broken or hanging chat window.",
    },
    { type: "heading", text: "14. Feedback on the Assistant" },
    {
      type: "paragraph",
      text: "If a response from the Assistant felt unhelpful, confusing, or wrong, telling your teacher or writing to us directly genuinely helps — both to correct that specific concern for you, and to inform how we improve the Assistant's prompts and behavior over time.",
    },
  ],
};
