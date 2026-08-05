/**
 * Pure, stateless — no database access, so this doesn't belong in
 * lib/assessments/repository.ts once that file becomes a Server Actions
 * module (which requires every export to be an async function). Fisher-Yates,
 * called client-side so each test attempt genuinely gets its own order.
 */
export function shuffleQuestions<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Non-null assertions are safe here, not a shortcut: i is always a
    // valid index by loop construction (arr.length - 1 down to 1), and
    // j = floor(random * (i + 1)) is always in [0, i] — itself always a
    // valid index. noUncheckedIndexedAccess can't prove that invariant
    // on its own; the Fisher-Yates algorithm guarantees it.
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}
