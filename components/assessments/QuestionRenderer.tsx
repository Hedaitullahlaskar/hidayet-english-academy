interface QuestionOption {
  label: string;
  text: string;
}

interface QuestionData {
  id: string;
  question_text: string;
  question_type: "mcq" | "fill_blank" | "short_answer";
  options: QuestionOption[] | null;
}

/**
 * Shared between components/lessons/LessonQuiz.tsx (simple, untimed
 * lesson checks) and components/assessments/TestTakingInterface.tsx
 * (timed, sectioned, multi-attempt standalone tests) — both need to
 * render "one question, one answer input" identically. Extracted here
 * rather than duplicated, per the instruction not to create duplicate code.
 */
export function QuestionRenderer({
  question,
  index,
  value,
  onChange,
  pointsLabel,
}: {
  question: QuestionData;
  index: number;
  value: string;
  onChange: (value: string) => void;
  pointsLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-navy-900 dark:text-white">
          {index + 1}. {question.question_text}
        </p>
        {pointsLabel && <span className="shrink-0 rounded-full border border-navy-200 px-2 py-0.5 text-xs font-semibold text-navy-500 dark:border-navy-600 dark:text-navy-400">{pointsLabel}</span>}
      </div>

      {question.question_type === "mcq" && question.options ? (
        <div className="mt-3 space-y-2">
          {question.options.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
              <input type="radio" name={question.id} value={opt.text} checked={value === opt.text} onChange={() => onChange(opt.text)} />
              {opt.label}. {opt.text}
            </label>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
          className="mt-3 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-gold-500 dark:border-navy-600 dark:bg-navy-900 dark:text-white"
        />
      )}
    </div>
  );
}
