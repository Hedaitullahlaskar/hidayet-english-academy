import type { PolicyBlock } from "@/content/legal/types";

export function PolicyRenderer({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <div className="prose-policy">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="mb-3 mt-10 font-display text-xl font-semibold text-navy-900 first:mt-0 dark:text-white sm:text-2xl"
              >
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="mb-4 leading-relaxed text-navy-700 dark:text-navy-200">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mb-4 list-disc space-y-2 pl-6 text-navy-700 dark:text-navy-200">
                {block.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <div
                key={i}
                role="note"
                className="mb-5 rounded-lg border border-gold-400 bg-paper-100 p-4 font-medium text-navy-800 dark:border-gold-600/40 dark:bg-navy-900 dark:text-gold-200"
              >
                <span aria-hidden="true">⚡ </span>
                {block.text}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
