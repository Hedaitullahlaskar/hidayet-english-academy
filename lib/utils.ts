type ClassValue = string | number | null | undefined | false | ClassValue[];

function flatten(input: ClassValue[], out: string[]): void {
  for (const val of input) {
    if (!val && val !== 0) continue;
    if (Array.isArray(val)) {
      flatten(val, out);
    } else {
      out.push(String(val));
    }
  }
}

/** Lightweight className combiner (no external dependency needed). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  flatten(inputs, out);
  return out.join(" ");
}
