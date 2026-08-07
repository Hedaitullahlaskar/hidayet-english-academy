"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Users,
  UserCog,
  Inbox,
  KeyRound,
  BookOpen,
  PenSquare,
  Video,
  GraduationCap,
  CreditCard,
  Award,
  BarChart3,
  Megaphone,
  ScrollText,
  Plug,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups: { label: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Global Dashboard", icon: Globe }],
  },
  {
    label: "People",
    items: [
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/admin/teachers", label: "Teachers", icon: UserCog },
      { href: "/admin/user-requests", label: "User Requests", icon: Inbox },
      { href: "/admin/roles", label: "Roles & Permissions", icon: KeyRound },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/admin/cms", label: "Website CMS", icon: PenSquare },
      { href: "/admin/live-classes", label: "Live Classes", icon: Video },
      { href: "/admin/certificates", label: "Certificates", icon: GraduationCap },
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/scholarships", label: "Scholarships", icon: Award },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
      { href: "/admin/notifications", label: "Notification Center", icon: Megaphone },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/integrations", label: "Integrations & API Keys", icon: Plug },
      { href: "/admin/system", label: "Security & Backup", icon: ShieldCheck },
      { href: "/admin/settings", label: "Platform Settings", icon: Settings },
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
          </div>
        </div>
      ))}
    </nav>
  );
}
