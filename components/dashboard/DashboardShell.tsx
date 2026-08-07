"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarLegalLink } from "@/components/shared/SidebarLegalLink";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  studentName: string;
  avatarUrl?: string | null;
  notifications: {
    id: string;
    title: string;
    body: string | null;
    link: string | null;
    read: boolean;
    created_at: string;
  }[];
  children: React.ReactNode;
}

export function DashboardShell({ studentName, avatarUrl, notifications, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-paper-50 dark:bg-navy-900">
        <DashboardHeader
          studentName={studentName}
          avatarUrl={avatarUrl}
          notifications={notifications}
          onMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <div className="mx-auto flex max-w-8xl">
          <aside
            className="hidden w-64 shrink-0 overflow-y-auto border-r border-navy-100 bg-white/60 p-4 dark:border-navy-800 dark:bg-navy-950/40 lg:block"
            style={{ maxHeight: "calc(100vh - 60px)", position: "sticky", top: "60px" }}
          >
            <DashboardSidebar />
            <SidebarLegalLink />
          </aside>

          {/* Mobile drawer */}
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-premium lg:hidden",
              mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className={cn(
                "h-full w-64 bg-white p-4 shadow-elevated transition-transform duration-300 ease-premium dark:bg-navy-950",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardSidebar />
            <SidebarLegalLink />
            </aside>
          </div>

          <main id="main-content" className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  );
}
