"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Global Dashboard", icon: "🌐" }],
  },
  {
    label: "People",
    items: [
      { href: "/admin/students", label: "Students", icon: "🧑‍🎓" },
      { href: "/admin/teachers", label: "Teachers", icon: "👨‍🏫" },
      { href: "/admin/user-requests", label: "User Requests", icon: "📥" },
      { href: "/admin/roles", label: "Roles & Permissions", icon: "🔑" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/courses", label: "Courses", icon: "📚" },
      { href: "/admin/cms", label: "Website CMS", icon: "🖥️" },
      { href: "/admin/live-classes", label: "Live Classes", icon: "📹" },
      { href: "/admin/certificates", label: "Certificates", icon: "🎓" },
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/admin/payments", label: "Payments", icon: "💳" },
      { href: "/admin/scholarships", label: "Scholarships", icon: "🎗️" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/reports", label: "Reports & Analytics", icon: "📊" },
      { href: "/admin/notifications", label: "Notification Center", icon: "📢" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: "📜" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/integrations", label: "Integrations & API Keys", icon: "🔌" },
      { href: "/admin/system", label: "Security & Backup", icon: "🛡️" },
      { href: "/admin/settings", label: "Platform Settings", icon: "⚙️" },
    ],
  },
];

export function AdminSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-5", className)} aria-label="Admin dashboard">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-4 text-[10px] font-bold uppercase tracking-wide text-navy-400 dark:text-navy-500">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
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
          </div>
        </div>
      ))}
    </nav>
  );
}
