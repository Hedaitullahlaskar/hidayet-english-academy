export const strugglePoints = [
  {
    title: "Grammar-Translation Overload",
    body: "Schools often teach English by translating word-for-word from Bengali — training a slow 'translate, then speak' habit instead of real fluency.",
  },
  {
    title: "Zero Speaking Practice",
    body: "In a classroom of forty students, most learners go years without ever really practicing a full sentence out loud.",
  },
  {
    title: "Fear of Mistakes in Front of Peers",
    body: "Social embarrassment shuts down the risk-taking that language learning actually requires.",
  },
  {
    title: "English-Only Grammar Explanations",
    body: "Explaining English grammar only in English, with no Bengali bridge, leaves foundational confusion uncorrected for years.",
  },
  {
    title: "One-Size-Fits-All Pacing",
    body: "A fixed syllabus pace doesn't wait for individual gaps to close — so small early confusions quietly compound into bigger ones.",
  },
];

export const psychologyPrinciples = [
  {
    icon: "🧩",
    title: "Comprehensible Input",
    body: "You learn fastest from language you can mostly understand — not language far above your current level. That's why we teach at your level first, then stretch it.",
  },
  {
    icon: "🛡️",
    title: "The Affective Filter",
    body: "Fear and embarrassment physically block learning. A relaxed, judgment-free classroom isn't a nice extra — it's necessary for your brain to actually absorb a new language.",
  },
  {
    icon: "🎤",
    title: "Output Practice",
    body: "Understanding English isn't the same as producing it. You have to actually speak and write to build the mental pathways that make fluency automatic.",
  },
  {
    icon: "🔁",
    title: "Spaced Repetition",
    body: "Vocabulary sticks through repeated exposure over increasing intervals — not by memorizing a list once and hoping it stays.",
  },
];

export const learningFramework = [
  {
    step: "01",
    title: "Listen",
    body: "Before producing a single word, you absorb real spoken English — at a pace you can actually follow. This builds the ear for rhythm and natural phrasing no grammar book can teach.",
  },
  {
    step: "02",
    title: "Understand",
    body: "We explain the 'why' behind every rule — in Bengali when it matters — so you build a real mental model of how English works, not just memorized fragments.",
  },
  {
    step: "03",
    title: "Speak",
    body: "From lesson one, you're speaking — not waiting until you feel 'ready.' Confidence is built through repetition in a room where mistakes are expected.",
  },
  {
    step: "04",
    title: "Read",
    body: "Guided reading builds vocabulary in context, not from isolated word lists — so words stick because you've seen them do real work in a real sentence.",
  },
  {
    step: "05",
    title: "Write",
    body: "Structured writing practice — aligned with real exam patterns and real-world needs like emails and applications — turns passive knowledge into active skill.",
  },
  {
    step: "06",
    title: "Think in English",
    body: "The real destination: the moment you stop mentally translating and simply know what to say. This is where fluency actually lives.",
  },
];

export interface SkillSystem {
  id: string;
  icon: string;
  title: string;
  summary: string;
  details: string[];
}

export const skillSystems: SkillSystem[] = [
  {
    id: "grammar",
    icon: "📖",
    title: "Grammar Mastery System",
    summary: "Structured, rule-by-rule grammar — explained bilingually, drilled through real examples.",
    details: [
      "Every rule explained in Bengali first, then anchored firmly in English",
      "Real-life example sentences, not textbook abstractions",
      "A running \"common mistakes\" log — the same errors Bengali speakers make, addressed directly",
      "Grammar taught in the order it's actually used in speech, not alphabetical textbook order",
    ],
  },
  {
    id: "vocabulary",
    icon: "🔤",
    title: "Vocabulary Building Method",
    summary: "Themed word lists and spaced repetition — words anchored in sentences you'll actually use.",
    details: [
      "Words grouped by real-life theme (interviews, travel, workplace, exams) — not by first letter",
      "Every word taught inside a full example sentence, never in isolation",
      "Planned spaced-repetition review, so words move from short-term to long-term memory",
      "Bilingual meaning and English usage shown side by side",
    ],
  },
  {
    id: "pronunciation",
    icon: "🎙️",
    title: "Pronunciation & Accent Training",
    summary: "Focused correction of the sound patterns Bengali speakers commonly find difficult.",
    details: [
      "Listen-and-repeat drills built around real Bengali-to-English sound gaps",
      "Correction focused on clarity, not accent elimination — you don't need to sound foreign to be understood",
      "Practice built into daily speaking sessions, not a separate isolated drill",
      "Feedback given constructively, never in a way that causes embarrassment",
    ],
  },
  {
    id: "speaking",
    icon: "🗣️",
    title: "Speaking Confidence Framework",
    summary: "Speaking starts on day one — because confidence is built through repetition, not readiness.",
    details: [
      "Daily speaking practice embedded into every lesson, not a once-a-week add-on",
      "A classroom culture where mistakes are treated as proof you're trying, not something to hide",
      "Real-life scenario practice — interviews, introductions, everyday conversation",
      "Gradual scaffolding, from single sentences to full conversations, at your pace",
    ],
  },
  {
    id: "listening",
    icon: "🎧",
    title: "Listening Improvement System",
    summary: "Trained ears understand faster than trained eyes — so listening comes first.",
    details: [
      "Exposure to natural speaking speed and rhythm, not artificially slow \"learner\" audio",
      "Listening tied directly to what you're currently learning, reinforcing rather than overwhelming",
      "Repeated listening at increasing difficulty, building real comprehension stamina",
      "Used as the foundation every other skill is built on",
    ],
  },
  {
    id: "reading-writing",
    icon: "✍️",
    title: "Reading & Writing Skills",
    summary: "Reading builds vocabulary in context; writing turns knowledge into something you can produce.",
    details: [
      "Seen and unseen passage practice, aligned to real board-exam patterns",
      "Writing practice for real-world needs too — emails, applications, workplace messages",
      "Reading material chosen for relevance — real syllabus, real topics, not filler content",
      "Feedback focused on clarity and structure, not just error-spotting",
    ],
  },
];

export interface SupportSystem {
  icon: string;
  title: string;
  body: string;
  status: "available" | "coming-soon";
}

// Honest status labeling — several of these are genuinely still in development
// as part of the platform build (see the Implementation Roadmap). Nothing
// here is described as live if it isn't.
export const supportSystems: SupportSystem[] = [
  {
    icon: "🤖",
    title: "AI Learning Assistant",
    body: "An AI-assisted English tutor is in active development — built to answer grammar questions and guide practice, scoped tightly to what we actually teach. We'd rather launch it right than launch it first.",
    status: "coming-soon",
  },
  {
    icon: "📹",
    title: "Live Interactive Classes",
    body: "Live classes are a core part of how we teach today — real-time interaction, live doubt-solving, and a teacher who knows your name. Our fully integrated in-platform classroom is being built now.",
    status: "available",
  },
  {
    icon: "📅",
    title: "Daily Practice System",
    body: "Practice isn't homework you do alone and hope is right — it's built into the daily rhythm of how we teach, reinforcing exactly what you just learned.",
    status: "available",
  },
  {
    icon: "📝",
    title: "Homework & Assignments",
    body: "Purposeful, checked assignments — not busywork. Every assignment ties directly back to what was taught in class.",
    status: "available",
  },
  {
    icon: "✅",
    title: "Weekly Tests",
    body: "Regular, low-pressure evaluation — so gaps get caught early, while they're still small, instead of surfacing for the first time in a final exam.",
    status: "available",
  },
  {
    icon: "📊",
    title: "Monthly Progress Reports",
    body: "We already give regular, honest feedback on where each student stands. A fully digital, automatically generated monthly report is part of the platform we're building now.",
    status: "coming-soon",
  },
  {
    icon: "🎓",
    title: "Certificates",
    body: "Verifiable, shareable completion certificates — with a public link so anyone can confirm they're real — are part of our platform build. We'd rather issue one that means something than rush one out.",
    status: "coming-soon",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Parent Progress Dashboard",
    body: "A dedicated dashboard where parents see attendance, test scores, and feedback in one place is on our roadmap. Until then, we keep parents informed directly, the way we always have.",
    status: "coming-soon",
  },
];

export const methodJourney = [
  { step: "01", title: "Enroll & Get Assessed", tie: "Placed honestly against our Learning Framework's starting point." },
  { step: "02", title: "Build the Foundation", tie: "Powered by the Grammar Mastery System and Vocabulary Building Method." },
  { step: "03", title: "Practice Out Loud, Daily", tie: "Driven by the Speaking Confidence Framework and Daily Practice System." },
  { step: "04", title: "Make Mistakes, On Purpose", tie: "Caught early by regular Weekly Tests — not punished, just noticed." },
  { step: "05", title: "Think in English", tie: "The payoff of the full Listen → Understand → Speak → Read → Write loop." },
  { step: "06", title: "Carry It Forward", tie: "Confident, supported by progress feedback and, soon, verified certificates." },
];

export const methodFaqs = [
  {
    question: "How is this different from the English classes at my school?",
    answer:
      "School English is often grammar-first and exam-only. Our method is speaking-first from day one, with grammar explained bilingually and tied directly to real use — not memorized for a test and forgotten after.",
  },
  {
    question: "Is grammar explained in Bengali or English?",
    answer:
      "Both. We explain the logic in Bengali so nothing gets lost in translation, then anchor it firmly in English so you build real fluency — not just a mental Bengali-to-English decoder.",
  },
  {
    question: "How much speaking practice will I actually get?",
    answer:
      "Speaking is built into every single class, not reserved for \"advanced\" students. You'll speak from your very first lesson.",
  },
  {
    question: "What if I'm a complete beginner?",
    answer:
      "The framework is designed to start wherever you are. Beginners follow the same Listen → Understand → Speak sequence, just at a pace built for a first-time learner.",
  },
  {
    question: "Is the AI tutor available right now?",
    answer:
      "Not yet — it's in active development as part of our learning platform. Everything else described on this page (live teaching, grammar, vocabulary, speaking practice, weekly tests) is available today.",
  },
  {
    question: "How will I know if my child is improving?",
    answer:
      "Through regular, honest feedback from our teachers today, and soon through a fully digital monthly progress report and parent dashboard as our platform rolls out.",
  },
];
