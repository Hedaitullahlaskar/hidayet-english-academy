"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hea-theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing) — theme just won't persist
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition-colors hover:border-gold-500 hover:text-gold-700 dark:border-navy-600 dark:text-navy-200 dark:hover:border-gold-400 dark:hover:text-gold-400 ${className}`}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
