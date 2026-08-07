"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  CalendarCheck,
  Video,
  Upload,
  ClipboardList,
  FolderOpen,
  CheckSquare,
  ListChecks,
  BarChart3,
  GraduationCap,
  Megaphone,
  MessageCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/teach", label: "Home", icon: Home },
  { href: "/teach/students", label: "Students", icon: Users },
  { href: "/teach/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/teach/live-classes", label: "Live Classes", icon: Video },
  { href: "/teach/lessons/upload", label: "Upload Lessons", icon: Upload },
  { href: "/teach/homework", label: "Homework", icon: ClipboardList },
  { href: "/teach/question-bank", label: "Question Bank", icon: FolderOpen },
  { href: "/teach/tests", label: "Tests & Quizzes", icon: CheckSquare },
  { href: "/teach/marks", label: "Marks Entry", icon: ListChecks },
  { href: "/teach/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/teach/certificates", label: "Certificates", icon: GraduationCap },
  { href: "/teach/notifications", label: "Notifications", icon: Megaphone },
  { href: "/teach/doubts", label: "Doubts", icon: MessageCircle },
  { href: "/teach/settings", label: "Settings", icon: Settings },
];

export function TeacherSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-0.5", className)} aria-label="Teacher dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/teach" ? pathname === item.href : pathname?.startsWith(item.href);
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
