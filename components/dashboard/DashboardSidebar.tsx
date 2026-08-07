"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  Target,
  CheckSquare,
  Sparkles,
  NotebookText,
  MessageCircle,
  Flame,
  GraduationCap,
  Download,
  BarChart3,
  Megaphone,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n/translations";

const navItems: { href: string; labelKey: TranslationKey; icon: LucideIcon; badgeKey?: TranslationKey }[] = [
  { href: "/dashboard", labelKey: "nav_overview", icon: Home },
  { href: "/dashboard/courses", labelKey: "nav_courses", icon: BookOpen },
  { href: "/dashboard/assignments", labelKey: "nav_assignments", icon: ClipboardList },
  { href: "/dashboard/practice", labelKey: "nav_practice", icon: Target },
  { href: "/dashboard/tests", labelKey: "nav_tests", icon: CheckSquare },
  { href: "/dashboard/ai-assistant", labelKey: "nav_ai", icon: Sparkles },
  { href: "/dashboard/notebook", labelKey: "nav_notebook", icon: NotebookText },
  { href: "/dashboard/doubts", labelKey: "nav_doubts", icon: MessageCircle },
  { href: "/dashboard/attendance", labelKey: "nav_attendance", icon: Flame },
  { href: "/dashboard/certificates", labelKey: "nav_certificates", icon: GraduationCap },
  { href: "/dashboard/downloads", labelKey: "nav_downloads", icon: Download },
  { href: "/dashboard/reports", labelKey: "nav_reports", icon: BarChart3 },
  { href: "/dashboard/announcements", labelKey: "nav_announcements", icon: Megaphone },
  { href: "/dashboard/settings", labelKey: "nav_settings", icon: Settings },
];

export function DashboardSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className={cn("space-y-0.5", className)} aria-label="Dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-200 ease-premium",
              isActive
                ? "bg-gold-500/10 text-navy-900 dark:bg-gold-400/10 dark:text-white"
                : "text-navy-600 hover:bg-navy-100/70 hover:text-navy-900 dark:text-navy-300 dark:hover:bg-white/5 dark:hover:text-white"
            )}
          >
            {isActive && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold-500" aria-hidden="true" />}
            <Icon
              className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-gold-600 dark:text-gold-400" : "text-navy-400 dark:text-navy-500")}
              strokeWidth={2}
              aria-hidden="true"
            />
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
