"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar } from "@/components/dashboard/Avatar";
import { createClient } from "@/lib/supabase/client";

interface TeacherHeaderProps {
  teacherName: string;
  avatarUrl?: string | null;
  openDoubtsCount: number;
  onMenuToggle?: () => void;
}

export function TeacherHeader({ teacherName, avatarUrl, openDoubtsCount, onMenuToggle }: TeacherHeaderProps) {
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
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-800 dark:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden="true" />
        </button>
        <Link href="/teach" className="flex items-center gap-2">
          <Image src="/images/hea-logo.png" alt="HEA" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="hidden font-display text-sm font-semibold text-navy-900 dark:text-white sm:block">
            Teacher Dashboard
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Link
          href="/teach/doubts"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
          aria-label={`Open doubts${openDoubtsCount > 0 ? ` (${openDoubtsCount})` : ""}`}
        >
          <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          {openDoubtsCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
              {openDoubtsCount > 9 ? "9+" : openDoubtsCount}
            </span>
          )}
        </Link>

        <Link href="/teach/settings" className="flex items-center gap-2" aria-label="Profile & Settings">
          <Avatar name={teacherName} avatarUrl={avatarUrl} size={36} />
          <span className="hidden text-sm font-medium text-navy-700 dark:text-navy-200 sm:block">{teacherName}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 hover:border-error hover:text-error dark:border-navy-600 dark:text-navy-200"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
