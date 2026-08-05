import type {
  Course,
  Program,
  LearningStage,
  TeachingPillar,
  FaqItem,
  Testimonial,
  NavLink,
} from "@/types";

export const site = {
  name: "Hidayet English Academy",
  shortName: "HEA",
  tagline: {
    en: "Learn English, Build Your Future",
    bn: "ইংরেজি শিখুন, গড়ুন আপনার ভবিষ্যৎ",
  },
  subTagline: "English Learning for Bengali Speakers Worldwide",
  footerTagline: "Learn Today, Lead Tomorrow",
  phone: "6290056461",
  phoneDisplay: "+91 62900 56461",
  whatsappNumber: "916290056461",
  email: "hidayetenglishacademy@gmail.com",
  social: {
    facebook: "https://facebook.com/hidayetenglishacademy",
    youtube: "https://youtube.com/@hidayetenglishacademy",
    instagram: "https://instagram.com/hidayetenglishacademy",
  },
  founder: {
    name: "Hidayet Sir",
    roles: [
      "Owner & Founder, Hidayet English Academy",
      "Spoken English Teacher",
      "Communication Trainer",
      "Career Guider",
    ],
    experience: "10 Years of Experience",
  },
};

export const globalRegions = [
  "India",
  "Bangladesh",
  "Middle East",
  "Europe",
  "North America",
  "Southeast Asia",
  "Australia",
];

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Our Method", href: "/method" },
  { label: "Founder", href: "/#founder" },
  { label: "FAQ", href: "/#faq" },
];

export const heroTrustPoints = [
  "Live & Interactive Classes",
  "Flexible Across Time Zones",
  "Bilingual: Bengali + English",
];

export const trustStats = [
  { value: "10+", suffix: "Years", label: "Teaching Experience" },
  { value: "7", suffix: "", label: "Flagship Programs" },
  { value: "2", suffix: "Languages", label: "Bilingual Teaching" },
  { value: "Live", suffix: "", label: "Interactive Classes" },
];

// The academy's own documented pedagogy — used verbatim as the homepage's
// signature "Learning Loop" element.
export const learningLoop: LearningStage[] = [
  {
    id: "listen",
    step: "01",
    title: "Listen",
    description: "Train the ear first — real spoken English, not just textbook audio.",
  },
  {
    id: "understand",
    step: "02",
    title: "Understand",
    description: "Meaning before memorization — grammar explained in Bengali when needed.",
  },
  {
    id: "speak",
    step: "03",
    title: "Speak",
    description: "Daily speaking practice from lesson one — mistakes are part of learning.",
  },
  {
    id: "read",
    step: "04",
    title: "Read",
    description: "Build vocabulary and comprehension through guided reading.",
  },
  {
    id: "write",
    step: "05",
    title: "Write",
    description: "Structured writing practice aligned with board exam patterns.",
  },
  {
    id: "think",
    step: "06",
    title: "Think in English",
    description: "The real goal — fluency that doesn't need translation in your head.",
  },
];

// The seven flagship programs — Madhyamik stays visually distinguished
// (gold border, "100% Free" badge) to preserve the trust it's already built,
// while sitting as one program among equals rather than owning the page.
export const programs: Program[] = [
  {
    id: "madhyamik",
    icon: "🎓",
    name: { en: "Madhyamik Free Program", bn: "মাধ্যমিক ফ্রি প্রোগ্রাম" },
    tagline: "Board-exam English mastery for Class 10 students",
    duration: "Aligned to board schedule",
    badge: "100% Free",
    highlights: [
      "Complete grammar syllabus, A to Z",
      "Board-pattern seen & unseen practice",
      "Live doubt-solving & exam strategy",
    ],
    featured: true,
  },
  {
    id: "spoken-english",
    icon: "🗣️",
    name: { en: "Spoken English Program", bn: "স্পোকেন ইংলিশ প্রোগ্রাম" },
    tagline: "From first sentence to fluent conversation",
    duration: "Basic (6mo) → Intermediate (1yr) → Advanced (2yr)",
    badge: "Most Popular",
    highlights: [
      "Daily speaking practice from day one",
      "Confidence-first, mistake-friendly teaching",
      "Three levels, one continuous journey",
    ],
  },
  {
    id: "grammar",
    icon: "📖",
    name: { en: "Grammar Mastery", bn: "গ্রামার মাস্টারি" },
    tagline: "Structured, rule-by-rule grammar — explained bilingually",
    duration: "Self-paced + live sessions",
    highlights: [
      "Bengali explanations for every rule",
      "Real-life example sentences",
      "Common-mistake correction drills",
    ],
  },
  {
    id: "vocabulary",
    icon: "🔤",
    name: { en: "Vocabulary Building", bn: "ভোকাবুলারি বিল্ডিং" },
    tagline: "Build your word power, one theme at a time",
    duration: "Self-paced + weekly practice sets",
    highlights: [
      "Categorized, themed word lists",
      "Example sentences you'll actually use",
      "Daily practice to make words stick",
    ],
  },
  {
    id: "interview-english",
    icon: "💼",
    name: { en: "Interview English", bn: "ইন্টারভিউ ইংলিশ" },
    tagline: "Speak with confidence in any interview, anywhere",
    duration: "Short-course intensive",
    highlights: [
      "Common interview questions & answers",
      "Professional phrasing & tone",
      "Live mock interview practice",
    ],
  },
  {
    id: "hotel-english",
    icon: "🏨",
    name: { en: "Hotel & Hospitality English", bn: "হোটেল ইংলিশ" },
    tagline: "Workplace English for hospitality & service careers",
    duration: "Short-course intensive",
    highlights: [
      "Guest conversation scenarios",
      "Phone & email etiquette",
      "Industry-specific vocabulary",
    ],
  },
  {
    id: "career-english",
    icon: "💻",
    name: { en: "Career English", bn: "ক্যারিয়ার ইংলিশ" },
    tagline: "Professional English for the modern workplace",
    duration: "Short-course intensive",
    highlights: [
      "Email & report writing",
      "Meeting & presentation English",
      "Everyday workplace conversation",
    ],
  },
];

export const courses: Course[] = [
  {
    id: "madhyamik-free",
    name: { en: "Madhyamik Free English Program", bn: "মাধ্যমিক ফ্রি ইংলিশ প্রোগ্রাম" },
    duration: "Aligned to Class 10 board schedule",
    level: "Board Exam",
    description:
      "A complete, 100% free English program built specifically for Madhyamik (Class 10) students — grammar, writing, and exam strategy in one place.",
    highlights: [
      "English Grammar (A to Z)",
      "Seen & Unseen Passage practice",
      "Board exam tips & strategy",
      "Doubt solving & live guidance",
    ],
    price: "Free",
    featured: true,
  },
  {
    id: "basic",
    name: { en: "Basic Course", bn: "বেসিক কোর্স" },
    duration: "6 Months",
    level: "Beginner",
    description: "For absolute beginners. Build your English foundation step by step.",
    highlights: ["Foundational grammar", "Everyday vocabulary", "Confidence-first speaking"],
    price: "Contact for fees",
  },
  {
    id: "intermediate",
    name: { en: "Intermediate Course", bn: "ইন্টারমিডিয়েট কোর্স" },
    duration: "1 Year",
    level: "Intermediate",
    description: "Improve fluency, grammar, and vocabulary — speak with real confidence.",
    highlights: ["Conversational fluency", "Grammar in depth", "Listening & pronunciation"],
    price: "Contact for fees",
  },
  {
    id: "advanced",
    name: { en: "Advanced Course", bn: "অ্যাডভান্সড কোর্স" },
    duration: "2 Years",
    level: "Advanced",
    description: "Master English completely. Speak fluently, think in English.",
    highlights: ["Advanced communication", "Personality development", "Career-ready English"],
    price: "Contact for fees",
  },
];

export const whatYouGet = [
  "Grammar from Basic to Advanced",
  "Vocabulary Building",
  "Speaking Practice",
  "Listening & Pronunciation",
  "Daily Practice & Live Sessions",
  "Doubt Solving & Feedback",
  "Personality Development",
];

// The academy's own "5 Modern International Child Learning Techniques"
export const teachingPillars: TeachingPillar[] = [
  {
    id: "mindset",
    number: "01",
    title: "Build the Right Mindset",
    points: ["Growth mindset", "Emotional safety", "Intrinsic motivation", "Praise effort, not talent"],
    footerTag: "Confident mind, strong future",
  },
  {
    id: "engaging",
    number: "02",
    title: "Engaging Learning Experiences",
    points: ["Stories & games", "Project-based learning", "Multi-sensory learning", "Active participation"],
    footerTag: "Learn with joy, remember for life",
  },
  {
    id: "natural-order",
    number: "03",
    title: "Natural Language Learning Order",
    points: ["Listen → Understand → Speak → Read → Write", "Grammar comes later", "80% exposure, 20% grammar"],
    footerTag: "Think in English, grow every day",
  },
  {
    id: "daily-practice",
    number: "04",
    title: "Daily Practice & Communication",
    points: ["Daily speaking practice", "Real-life conversations", "Think-pair-share", "Mistakes are part of learning"],
    footerTag: "Speak today, succeed tomorrow",
  },
  {
    id: "21st-century",
    number: "05",
    title: "21st Century Child Skills",
    points: ["Critical thinking", "Communication & collaboration", "Global awareness", "Creativity & confidence"],
    footerTag: "Skills for life, success forever",
  },
];

export const trustBadges = ["Safe", "Trusted", "Helpful"];

// No real testimonials were provided in the brand materials. Rather than
// invent fake student names/quotes, this stays empty until real success
// stories are supplied — the Testimonials component renders an honest
// "coming soon" state instead of fabricated social proof.
export const testimonials: Testimonial[] = [];

// Used to build a Google Maps *search* link (not a fabricated pin/address —
// no physical address was provided in the brand materials).
export const mapsSearchQuery = "Hidayet English Academy";

export const offerHighlights = [
  "Expert Teachers",
  "Complete Syllabus Coverage",
  "Regular Test & Evaluation",
  "Personal Attention",
  "Board Exam Focused Preparation",
];

export const faqs: FaqItem[] = [
  {
    question: "Do you teach students outside India and Bangladesh?",
    answer:
      "Yes. HEA teaches Bengali-speaking learners everywhere online — including the Middle East, Europe, North America, Southeast Asia, and Australia. All you need is an internet connection; class timings are arranged to work across time zones.",
  },
  {
    question: "Is the Madhyamik English Program really 100% free?",
    answer:
      "Yes. The complete English program for Class 10 (Madhyamik) students is 100% free, with no admission fee and no hidden charges.",
  },
  {
    question: "What is the medium of instruction?",
    answer:
      "Classes are taught bilingually — grammar rules and difficult concepts are explained in Bengali, with practice conducted in English so you build real speaking confidence.",
  },
  {
    question: "How long are the Basic, Intermediate, and Advanced courses?",
    answer:
      "Basic is 6 months, Intermediate is 1 year, and Advanced is 2 years — each building on the last, from foundational grammar to complete fluency.",
  },
  {
    question: "Are classes live or recorded?",
    answer:
      "Classes are live and interactive, with regular practice sessions, doubt-solving, and personal feedback from your teacher.",
  },
  {
    question: "How do I join the WhatsApp community?",
    answer:
      "Scan the QR code on our promotional materials or tap \"Join WhatsApp Group\" on this site to connect directly with the academy for updates and support.",
  },
  {
    question: "How do I enroll?",
    answer:
      "Tap \"Join Free Class,\" fill in your details, or simply message us on WhatsApp — our team will guide you through enrollment.",
  },
];
