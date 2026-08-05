import Image from "next/image";
import { site } from "@/content/site-data";
import { FOUNDER_BLUR } from "@/lib/blur-placeholders";
import { cn } from "@/lib/utils";

interface FounderPortraitProps {
  size?: "sm" | "lg";
  caption?: boolean;
  float?: boolean;
  /** Set true when this instance is the largest above-the-fold image on the
   * page (e.g. a page hero) so Next.js preloads it instead of lazy-loading —
   * lazy-loading a hero image hurts LCP. */
  priority?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-64 w-52 sm:h-80 sm:w-64",
  lg: "w-full max-w-xs",
};

export function FounderPortrait({
  size = "sm",
  caption = false,
  float = false,
  priority = false,
  className,
}: FounderPortraitProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border-4 border-gold-500 shadow-elevated",
        sizes[size],
        float && "animate-gentle-float",
        className
      )}
    >
      <Image
        src="/images/founder-hidayet-sir.jpg"
        alt={`${site.founder.name}, founder and spoken English teacher at ${site.name}`}
        fill={size === "sm"}
        width={size === "lg" ? 640 : undefined}
        height={size === "lg" ? 944 : undefined}
        placeholder="blur"
        blurDataURL={FOUNDER_BLUR}
        priority={priority}
        sizes={size === "sm" ? "(max-width: 640px) 208px, 256px" : "(max-width: 640px) 90vw, 320px"}
        className={cn("object-cover object-top", size === "sm" ? "h-full w-full" : "h-auto w-full")}
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent px-4 py-3">
          <p className="font-display text-sm font-semibold text-white">{site.founder.name}</p>
          <p className="text-xs text-gold-300">Founder &amp; Spoken English Teacher</p>
        </div>
      )}
    </div>
  );
}
