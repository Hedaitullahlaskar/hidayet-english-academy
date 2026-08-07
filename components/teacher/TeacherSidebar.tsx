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
    <nav className={cn("space-y-1", className)} aria-label="Teacher dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/teach" ? pathname === item.href : pathname?.startsWith(item.href);
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
