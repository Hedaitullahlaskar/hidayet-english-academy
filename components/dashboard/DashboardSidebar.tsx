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
    <nav className={cn("space-y-1", className)} aria-label="Dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-premium",
              isActive
                ? "bg-gold-600 text-navy-900"
                : "text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
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
