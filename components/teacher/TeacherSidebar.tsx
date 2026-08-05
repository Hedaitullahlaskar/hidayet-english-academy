"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/teach", label: "Home", icon: "🏠" },
  { href: "/teach/students", label: "Students", icon: "🧑‍🎓" },
  { href: "/teach/attendance", label: "Attendance", icon: "📅" },
  { href: "/teach/live-classes", label: "Live Classes", icon: "📹" },
  { href: "/teach/lessons/upload", label: "Upload Lessons", icon: "⬆️" },
  { href: "/teach/homework", label: "Homework", icon: "📝" },
  { href: "/teach/question-bank", label: "Question Bank", icon: "🗂️" },
  { href: "/teach/tests", label: "Tests & Quizzes", icon: "✅" },
  { href: "/teach/marks", label: "Marks Entry", icon: "🔢" },
  { href: "/teach/analytics", label: "Analytics", icon: "📊" },
  { href: "/teach/certificates", label: "Certificates", icon: "🎓" },
  { href: "/teach/notifications", label: "Notifications", icon: "📢" },
  { href: "/teach/doubts", label: "Doubts", icon: "💬" },
  { href: "/teach/settings", label: "Settings", icon: "⚙️" },
];

export function TeacherSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)} aria-label="Teacher dashboard">
      {navItems.map((item) => {
        const isActive = item.href === "/teach" ? pathname === item.href : pathname?.startsWith(item.href);
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
