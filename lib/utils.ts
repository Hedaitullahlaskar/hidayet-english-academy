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

/**
 * Safe to embed via `dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}`
 * inside a `<script type="application/ld+json">` tag. Plain
 * `JSON.stringify()` doesn't escape `<`, so a value containing the literal
 * string `</script>` would prematurely close the tag and let arbitrary
 * HTML/script run — a real risk anywhere the JSON-LD includes user- or
 * admin-entered text (course names/descriptions, breadcrumb labels, etc.),
 * not just fully static content. `<` is valid inside a JSON string and
 * is never interpreted as the start of a tag by the HTML parser.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
