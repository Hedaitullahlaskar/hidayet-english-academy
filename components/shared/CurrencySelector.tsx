"use client";

import { useEffect, useState } from "react";
import { currencies, guessCurrencyFromLocale } from "@/lib/currency";

interface CurrencySelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CurrencySelector({ value, onChange, className = "" }: CurrencySelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Preferred currency"
      className={`rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-700 dark:border-navy-600 dark:bg-navy-800 dark:text-navy-200 ${className}`}
    >
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}

/**
 * Convenience hook: initializes from a `hea-country`-derived cookie if
 * middleware.ts has set one (real deployment), otherwise falls back to a
 * client-side locale guess, then persists the visitor's manual choice.
 */
export function useCurrency() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("hea-currency") : null;
    if (saved) {
      setCurrency(saved);
      return;
    }
    setCurrency(guessCurrencyFromLocale());
  }, []);

  function update(code: string) {
    setCurrency(code);
    try {
      localStorage.setItem("hea-currency", code);
    } catch {
      // localStorage unavailable — selection just won't persist across visits
    }
  }

  return { currency, setCurrency: update };
}
