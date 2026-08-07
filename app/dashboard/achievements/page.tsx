import Link from "next/link";
import { Flame, Trophy, Award, BookOpen } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { XpLevelCard } from "@/components/dashboard/XpLevelCard";
import { AchievementBadge } from "@/components/dashboard/AchievementBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { getMyActivityCounts, getMyActivityTimeline } from "@/lib/dashboard/achievements-repository";
import { computeBadges, computeXp, computeLevel } from "@/lib/dashboard/achievements-logic";

export const metadata = { robots: { index: false, follow: false } };

export default async function AchievementsPage() {
  const [counts, timeline] = await Promise.all([getMyActivityCounts(), getMyActivityTimeline(15)]);
  const badges = computeBadges(counts);
  const xp = computeXp(counts);
  const level = computeLevel(xp);
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900 dark:text-white">Achievements</h1>
      <p className="mt-1 text-navy-600 dark:text-navy-300">
        Your learning, made visible — every badge, level, and streak here is computed live from your real
        activity, never a stored number that can drift from what actually happened.
      </p>

      <div className="mt-6">
        <XpLevelCard level={level} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatWidget icon={<Flame className="h-5 w-5" strokeWidth={1.75} />} label="Current Streak" value={`${counts.currentStreak} days`} tone="gold" />
        <StatWidget icon={<Trophy className="h-5 w-5" strokeWidth={1.75} />} label="Longest Streak" value={`${counts.longestStreak} days`} />
        <StatWidget icon={<Award className="h-5 w-5" strokeWidth={1.75} />} label="Badges Earned" value={`${earnedCount} of ${badges.length}`} tone="gold" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-navy-900 dark:text-white">Badges</h2>
        <Link href="/dashboard/certificates" className="flex items-center gap-1 text-sm font-semibold text-gold-800 underline dark:text-gold-400">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> View Certificates
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map((badge) => (
          <AchievementBadge key={badge.id} badge={badge} />
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-navy-900 dark:text-white">Activity Timeline</h2>
      <div className="mt-4 max-w-2xl rounded-lg border border-navy-100 bg-white p-6 shadow-soft dark:border-navy-700 dark:bg-navy-800">
        <ActivityTimeline events={timeline} />
      </div>
    </div>
  );
}
