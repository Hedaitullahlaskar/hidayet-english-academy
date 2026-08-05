import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({
  name,
  avatarUrl,
  size = 36,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${name}'s profile picture`}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  // Honest fallback — initials on a brand-colored circle, not a fake photo.
  return (
    <div
      role="img"
      aria-label={`${name}'s profile picture`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-navy-800 font-display font-semibold text-gold-300",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name || "S")}
    </div>
  );
}
