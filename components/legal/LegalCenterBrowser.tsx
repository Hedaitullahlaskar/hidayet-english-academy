"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PolicyDocument } from "@/content/legal/types";
import { policyCategories } from "@/content/legal";

export function LegalCenterBrowser({ policies }: { policies: PolicyDocument[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      const matchesQuery =
        query.trim().length === 0 ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [policies, query, activeCategory]);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 bg-white/95 px-4 py-4 backdrop-blur dark:bg-navy-950/95 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0 dark:sm:bg-transparent">
        <label htmlFor="legal-search" className="sr-only">Search policies</label>
        <input
          id="legal-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search policies — e.g. 'refund', 'AI', 'certificate'…"
          className="w-full rounded-full border border-navy-200 bg-white px-5 py-3 text-navy-900 outline-none focus:border-gold-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === null
                ? "border-gold-500 bg-gold-600 text-navy-900"
                : "border-navy-200 text-navy-600 dark:border-navy-600 dark:text-navy-300"
            }`}
          >
            All
          </button>
          {policyCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "border-gold-500 bg-gold-600 text-navy-900"
                  : "border-navy-200 text-navy-600 dark:border-navy-600 dark:text-navy-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-navy-500 dark:text-navy-400" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "policy" : "policies"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-navy-600 dark:text-navy-300">No policies match &quot;{query}&quot;. Try a different search term.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/legal/${p.slug}`}
              className="rounded-lg border border-navy-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">{p.icon}</span>
                <div>
                  <p className="font-display font-semibold text-navy-900 dark:text-white">{p.title}</p>
                  <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{p.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
