"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      aria-label="Switch dashboard language"
      className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-gold-500 hover:text-gold-800 dark:border-navy-600 dark:text-navy-200 dark:hover:text-gold-400"
    >
      {language === "en" ? "বাংলা" : "English"}
    </button>
  );
}
