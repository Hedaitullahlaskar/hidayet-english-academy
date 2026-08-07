import { Zap } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { LevelInfo } from "@/lib/dashboard/achievements-logic";

export function XpLevelCard({ level }: { level: LevelInfo }) {
  return (
    <div className="flex items-center gap-5 rounded-lg border border-gold-400 bg-navy-800 p-6 shadow-elevated">
      <ProgressRing percent={level.progressPercent} size={84} strokeWidth={7} tone="gold" onDark sublabel={`LVL ${level.level}`} />
      <div>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gold-400">
          <Zap className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> Level {level.level}
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-white">{level.xp.toLocaleString()} XP</p>
        <p className="mt-1 text-sm text-navy-300">
          {level.xpForNextLevel !== null
            ? `${(level.xpForNextLevel - level.xpIntoLevel).toLocaleString()} XP to Level ${level.level + 1}`
            : "Maximum level reached"}
        </p>
      </div>
    </div>
  );
}
