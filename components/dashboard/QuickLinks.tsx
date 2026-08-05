"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface QuickLinksProps {
  nextClassUrl?: string | null;
}

export function QuickLinks({ nextClassUrl }: QuickLinksProps) {
  const { t } = useLanguage();

  const items = [
    {
      icon: "📹",
      label: t("joinLiveClass"),
      href: nextClassUrl ?? undefined,
      disabledLabel: t("noClassToJoin"),
      external: true,
    },
    {
      icon: "📥",
      label: t("downloadNotes"),
      href: "/dashboard/courses",
      external: false,
    },
    {
      icon: "🙋",
      label: t("askTeacher"),
      href: whatsappLink(whatsappMessages.askTeacher),
      external: true,
    },
    {
      icon: "💬",
      label: t("whatsappSupport"),
      href: whatsappLink(whatsappMessages.general),
      external: true,
    },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-navy-500 dark:text-navy-400">
        {t("quickLinks")}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => {
          const isDisabled = !item.href;
          const content = (
            <>
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="mt-2 text-center text-xs font-semibold leading-tight text-navy-800 dark:text-navy-100">
                {isDisabled ? item.disabledLabel : item.label}
              </span>
            </>
          );

          const classes = cn(
            "flex flex-col items-center rounded-lg border p-4 transition-all duration-200",
            isDisabled
              ? "cursor-not-allowed border-navy-100 bg-navy-50 opacity-60 dark:border-navy-700 dark:bg-navy-800"
              : "border-navy-100 bg-white hover:-translate-y-0.5 hover:shadow-elevated dark:border-navy-700 dark:bg-navy-800"
          );

          if (isDisabled) {
            return (
              <div key={item.label} className={classes} aria-disabled="true">
                {content}
              </div>
            );
          }

          if (item.external) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={classes}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href!} className={classes}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
