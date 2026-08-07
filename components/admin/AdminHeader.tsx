"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar } from "@/components/dashboard/Avatar";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  adminName: string;
  avatarUrl?: string | null;
  onMenuToggle?: () => void;
}

export function AdminHeader({ adminName, avatarUrl, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100/80 bg-white/90 px-5 py-3 backdrop-blur-md dark:border-navy-800/80 dark:bg-navy-950/90">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="flex h-9 w-9 items-center justify-center rounded-full text-navy-800 dark:text-white lg:hidden" aria-label="Toggle menu">
          <Menu className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden="true" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/images/hea-logo.png" alt="HEA" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="hidden font-display text-sm font-semibold text-navy-900 dark:text-white sm:block">Super Admin</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/admin/settings" className="flex items-center gap-2" aria-label="Profile & Settings">
          <Avatar name={adminName} avatarUrl={avatarUrl} size={36} />
          <span className="hidden text-sm font-medium text-navy-700 dark:text-navy-200 sm:block">{adminName}</span>
        </Link>
        <button onClick={handleLogout} className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 hover:border-error hover:text-error dark:border-navy-600 dark:text-navy-200">
          Log Out
        </button>
      </div>
    </header>
  );
}
