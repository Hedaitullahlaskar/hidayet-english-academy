"use client";

/**
 * Speaking Practice input — text-based today, per the explicit brief
 * ("prepare for future voice integration," not "build voice now"). The
 * mic button is real UI, genuinely disabled, not a fake control that
 * silently does nothing when clicked.
 *
 * Where real voice input would plug in later: swap the disabled button's
 * onClick for the Web Speech API's SpeechRecognition (browser-native,
 * no extra dependency) to transcribe into the same text input below —
 * or, for higher accuracy, record audio and POST it to a new
 * /api/ai/transcribe route that calls a speech-to-text API server-side.
 * Either approach hands the same plain-text string to the existing
 * /api/ai/chat flow, so nothing else in this file needs to change.
 */
export function SpeakingPracticeMicButton() {
  return (
    <button
      type="button"
      disabled
      title="Voice input is planned but not built yet — type your answer for now."
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy-200 text-navy-300 dark:border-navy-600 dark:text-navy-600"
      aria-label="Voice input (coming soon)"
    >
      🎤
    </button>
  );
}
