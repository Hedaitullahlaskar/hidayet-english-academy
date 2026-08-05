export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

// The eight currencies requested. Actual per-course pricing in each of these
// isn't set yet (no fee schedule has been supplied for any course beyond
// "free" for Madhyamik) — see Module 16 in the roadmap. This list exists so
// the currency selector and WhatsApp inquiry flow can honestly reflect a
// visitor's preferred currency today, ahead of real checkout.
export const currencies: CurrencyOption[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
];

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  IN: "INR",
  BD: "INR", // no BDT in the requested set yet; INR shown as the closer regional default
  GB: "GBP",
  AE: "AED",
  SA: "AED",
  QA: "AED",
  SG: "SGD",
  AU: "AUD",
  CA: "CAD",
  US: "USD",
};

/**
 * Client-side best guess only. True IP-based detection requires a deployed
 * server reading `x-vercel-ip-country` (see middleware.ts) — this
 * Intl-based fallback is what runs in a browser preview with no server geo
 * data available, and is intentionally conservative.
 */
export function guessCurrencyFromLocale(): string {
  if (typeof navigator === "undefined") return "USD";
  try {
    const locale = navigator.language || "en-US";
    const region = new Intl.Locale(locale).region;
    if (region && COUNTRY_TO_CURRENCY[region]) return COUNTRY_TO_CURRENCY[region];
  } catch {
    // Intl.Locale unsupported in this environment — fall through to default
  }
  return "USD";
}
