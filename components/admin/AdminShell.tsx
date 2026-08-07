"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarLegalLink } from "@/components/shared/SidebarLegalLink";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  adminName: string;
  avatarUrl?: string | null;
  children: React.ReactNode;
}

export function AdminShell({ adminName, avatarUrl, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-navy-900">
      <AdminHeader adminName={adminName} avatarUrl={avatarUrl} onMenuToggle={() => setMobileOpen((v) => !v)} />
      <div className="mx-auto flex max-w-8xl">
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-navy-100 bg-white/60 p-4 dark:border-navy-800 dark:bg-navy-950/40 lg:block" style={{ maxHeight: "calc(100vh - 60px)", position: "sticky", top: "60px" }}>
          <AdminSidebar />
          <SidebarLegalLink />
        </aside>
        <div
          className={cn("fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-premium lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className={cn("h-full w-72 overflow-y-auto bg-white p-4 shadow-elevated transition-transform duration-300 ease-premium dark:bg-navy-950", mobileOpen ? "translate-x-0" : "-translate-x-full")}
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar />
          <SidebarLegalLink />
          </aside>
        </div>
        <main id="main-content" className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
