import type { PolicyDocument } from "@/content/legal/types";

export const liveClassRules: PolicyDocument = {
  slug: "live-class-rules",
  title: "Live Class Rules",
  shortDescription: "Everything expected of you when you join a live Google Meet or Zoom class.",
  category: "Academic",
  lastUpdated: "2026-08-01",
  icon: "📹",
  blocks: [
    {
      type: "paragraph",
      text: "Live classes are where spoken-English practice really happens. These Rules apply whenever you join a class through Google Meet or Zoom, whether it's scheduled by your teacher or auto-generated through our platform's calendar integration.",
    },
    { type: "heading", text: "1. Before Class" },
    {
      type: "list",
      items: [
        "Join a few minutes early to test your camera, microphone, and internet connection.",
        "Use the 'Add to Calendar' option on your class page so you don't lose track of the time — it accounts for your saved timezone automatically.",
        "Find a quiet space where you can speak out loud comfortably; spoken practice is most of the value of a live class.",
      ],
    },
    { type: "heading", text: "2. During Class" },
    {
      type: "list",
      items: [
        "Keep your microphone muted unless you're speaking, to avoid background noise disrupting the class.",
        "Turn your camera on where your connection allows — it genuinely helps a teacher gauge whether an explanation is landing.",
        "Use the chat for typed questions if you don't want to interrupt verbally, but try speaking out loud when the teacher opens the floor — that's the whole point.",
        "Stay for the full session where possible; leaving early affects both your own learning and, in group classes, the flow for others.",
      ],
    },
    { type: "heading", text: "3. Recording" },
    {
      type: "paragraph",
      text: "Some classes are recorded so students can replay them later from their course page. Where a class is being recorded, this is disclosed. If a class is recorded, that recording is for enrolled students' personal study only — do not download, share, or repost it elsewhere.",
    },
    { type: "heading", text: "4. Respectful Participation" },
    {
      type: "callout",
      text: "Live classes include students at very different starting levels. A confident speaker should never dominate or mock a less confident classmate — everyone is here to practice, at their own pace.",
    },
    { type: "heading", text: "5. Technical Issues" },
    {
      type: "paragraph",
      text: "If your connection drops, rejoin using the same link as soon as possible. If a technical issue prevents you from joining at all, message your teacher through the Doubts feature — persistent access issues may be eligible for a rescheduled session at the teacher's discretion.",
    },
    { type: "heading", text: "6. Attendance Tracking" },
    {
      type: "paragraph",
      text: "Your teacher marks attendance for each live class, visible to you in your dashboard's attendance record. This is used to track your overall progress, not to penalize occasional absence.",
    },
    { type: "heading", text: "7. Cancellations & Rescheduling" },
    {
      type: "paragraph",
      text: "If HEA needs to cancel a scheduled class, we'll notify you as early as possible and reschedule it. If you personally need to miss a class, there's no need to notify us in advance — just catch up via the replay if one's available.",
    },
    { type: "heading", text: "8. Prohibited Behavior" },
    {
      type: "list",
      items: [
        "Sharing your join link with anyone not enrolled in the class.",
        "Recording the class yourself and distributing it outside the Platform.",
        "Disruptive, disrespectful, or inappropriate behavior of any kind toward the teacher or other students.",
        "Using the class time for anything other than the class itself (e.g., unrelated promotion in chat).",
      ],
    },
    { type: "heading", text: "9. Consequences" },
    {
      type: "paragraph",
      text: "A teacher may remove a disruptive participant from a live class. Repeated or serious violations are handled under our Student Code of Conduct and may affect your access to future live sessions.",
    },
    { type: "heading", text: "10. Group vs. One-on-One Classes" },
    {
      type: "paragraph",
      text: "Some courses run as group classes with multiple students learning together; others may be one-on-one. Group classes benefit especially from active participation — a quiet group class is a missed opportunity for everyone, not just you.",
    },
    { type: "heading", text: "11. Language Use in Class" },
    {
      type: "paragraph",
      text: "Classes are conducted primarily in English, with Bengali used deliberately to reinforce a grammar point or unblock understanding when needed — this mirrors HEA's core bilingual teaching approach. Don't hesitate to ask a question in Bengali if that's the only way to express it clearly; being understood matters more than which language you use to ask.",
    },
    { type: "heading", text: "12. Bringing Materials to Class" },
    {
      type: "paragraph",
      text: "Where your teacher asks you to have a notebook, a specific lesson open, or homework ready before a live class, having it prepared helps the whole session run smoothly and lets more time go toward actual speaking practice rather than logistics.",
    },
    { type: "heading", text: "13. Guests & Observers" },
    {
      type: "paragraph",
      text: "Live classes are for enrolled students. A parent is welcome to sit in on a younger student's class where that helps the student feel comfortable, but the session shouldn't be opened to unrelated observers or shared publicly.",
    },
    { type: "heading", text: "14. After the Class Ends" },
    {
      type: "paragraph",
      text: "Once a class ends, your attendance is marked, and, if the session was recorded, the replay typically becomes available on your course page shortly afterward. Any homework connected to that lesson will also appear on your dashboard if your teacher has assigned one.",
    },
  ],
};
