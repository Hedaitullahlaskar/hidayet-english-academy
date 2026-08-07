import { Sprout, BookOpen, Flame, Target, Star, Award, Crown, GraduationCap, Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Badge, BadgeIcon } from "@/lib/dashboard/achievements-logic";

const ICONS: Record<BadgeIcon, LucideIcon> = {
  sprout: Sprout,
  book: BookOpen,
  flame: Flame,
  target: Target,
  star: Star,
  award: Award,
  crown: Crown,
  "graduation-cap": GraduationCap,
};

export function AchievementBadge({ badge }: { badge: Badge }) {
  const Icon = ICONS[badge.icon];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all duration-300 ease-premium",
        badge.earned
          ? "border-gold-300 bg-white shadow-card hover:-translate-y-0.5 hover:shadow-elevated dark:border-gold-500/40 dark:bg-navy-800"
          : "border-dashed border-navy-200 bg-paper-100 opacity-60 dark:border-navy-700 dark:bg-navy-900"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          badge.earned ? "bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400" : "bg-navy-100 text-navy-400 dark:bg-navy-800 dark:text-navy-600"
        )}
      >
        {badge.earned ? <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" /> : <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
      </span>
      <p className="text-xs font-bold text-navy-900 dark:text-white">{badge.label}</p>
      <p className="text-[11px] leading-snug text-navy-500 dark:text-navy-400">{badge.description}</p>
    </div>
  );
}
