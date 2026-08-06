"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n/translations";

const navItems: { href: string; labelKey: TranslationKey; icon: string; badgeKey?: TranslationKey }[] = [
  { href: "/dashboard", labelKey: "nav_overview", icon: "🏠" },
  { href: "/dashboard/courses", labelKey: "nav_courses", icon: "📚" },
  { href: "/dashboard/assignments", labelKey: "nav_assignments", icon: "📝" },
  { href: "/dashboard/practice", labelKey: "nav_practice", icon: "🎯" },
  { href: "/dashboard/tests", labelKey: "nav_tests", icon: "✅" },
  { href: "/dashboard/ai-assistant", labelKey: "nav_ai", icon: "🤖" },
  { href: "/dashboard/notebook", labelKey: "nav_notebook", icon: "📓" },
  { href: "/dashboard/doubts", labelKey: "nav_doubts", icon: "💬" },
  { href: "/dashboard/attendance", labelKey: "nav_attendance", icon: "🔥" },
  { href: "/dashboard/certificates", labelKey: "nav_certificates", icon: "🎓" },
  { href: "/dashboard/downloads", labelKey: "nav_downloads", icon: "⬇️" },
  { href: "/dashboard/reports", labelKey: "nav_reports", icon: "📊" },
  { href: "/dashboard/announcements", labelKey: "nav_announcements", icon: "📢" },
  { href: "/dashboard/settings", labelKey: "nav_settings", icon: "⚙️" },
];

export function DashboardSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className={cn("space-y-1", className)} aria-label="Dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-gold-600 text-navy-900"
                : "text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
            )}
          >
            <span aria-hidden="true">{item.icon}</span>
            {t(item.labelKey)}
            {item.badgeKey && (
              <span className="ml-auto rounded-full bg-navy-800 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-300">
                {t(item.badgeKey)}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
