"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar } from "@/components/dashboard/Avatar";
import { LanguageSwitch } from "@/components/dashboard/LanguageSwitch";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

interface DashboardHeaderProps {
  studentName: string;
  avatarUrl?: string | null;
  notifications: NotificationItem[];
  onMenuToggle?: () => void;
}

export function DashboardHeader({ studentName, avatarUrl, notifications, onMenuToggle }: DashboardHeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100 bg-white px-5 py-3 dark:border-navy-800 dark:bg-navy-950">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-800 dark:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/images/hea-logo.png" alt="HEA" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="hidden font-display text-sm font-semibold text-navy-900 dark:text-white sm:block">
            {t("dashboard")}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
            aria-label={`${t("notifications")}${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            aria-expanded={open}
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-navy-100 bg-white shadow-elevated dark:border-navy-700 dark:bg-navy-900">
              <div className="border-b border-navy-100 px-4 py-3 dark:border-navy-800">
                <p className="font-display text-sm font-semibold text-navy-900 dark:text-white">{t("notifications")}</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-navy-500 dark:text-navy-400">
                    {t("noNotifications")}
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "border-b border-navy-50 px-4 py-3 dark:border-navy-800",
                        !n.read && "bg-gold-50 dark:bg-navy-800"
                      )}
                    >
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-xs text-navy-600 dark:text-navy-300">{n.body}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link href="/dashboard/settings" className="flex items-center gap-2" aria-label="Profile & Settings">
          <Avatar name={studentName} avatarUrl={avatarUrl} size={36} />
          <span className="hidden text-sm font-medium text-navy-700 dark:text-navy-200 sm:block">{studentName}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 hover:border-error hover:text-error dark:border-navy-600 dark:text-navy-200"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
