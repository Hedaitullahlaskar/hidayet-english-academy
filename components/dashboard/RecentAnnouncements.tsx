"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  published_at: string;
}

export function RecentAnnouncements({ announcements }: { announcements: AnnouncementItem[] }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg border border-navy-100 bg-white p-5 shadow-card dark:border-navy-700 dark:bg-navy-800">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-navy-900 dark:text-white">{t("recentAnnouncements")}</p>
        <Link href="/dashboard/announcements" className="text-xs font-semibold text-gold-800 dark:text-gold-400">
          {t("viewAllAnnouncements")}
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="mt-4 text-sm text-navy-500 dark:text-navy-400">{t("noAnnouncementsYet")}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {announcements.slice(0, 3).map((a) => (
            <li key={a.id} className="border-t border-navy-50 pt-3 first:border-t-0 first:pt-0 dark:border-navy-700">
              <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{a.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-navy-500 dark:text-navy-400">{a.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
