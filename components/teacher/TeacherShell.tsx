"use client";

import { useState } from "react";
import { TeacherHeader } from "@/components/teacher/TeacherHeader";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { SidebarLegalLink } from "@/components/shared/SidebarLegalLink";
import { cn } from "@/lib/utils";

interface TeacherShellProps {
  teacherName: string;
  avatarUrl?: string | null;
  openDoubtsCount: number;
  children: React.ReactNode;
}

export function TeacherShell({ teacherName, avatarUrl, openDoubtsCount, children }: TeacherShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-navy-900">
      <TeacherHeader
        teacherName={teacherName}
        avatarUrl={avatarUrl}
        openDoubtsCount={openDoubtsCount}
        onMenuToggle={() => setMobileOpen((v) => !v)}
      />
      <div className="mx-auto flex max-w-8xl">
        <aside className="hidden w-64 shrink-0 border-r border-navy-100 p-4 dark:border-navy-800 lg:block">
          <TeacherSidebar />
          <SidebarLegalLink />
        </aside>

        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className={cn(
              "h-full w-64 bg-white p-4 shadow-elevated transition-transform dark:bg-navy-950",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <TeacherSidebar />
          <SidebarLegalLink />
          </aside>
        </div>

        <main id="main-content" className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
