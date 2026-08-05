"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "up" (default) is a subtle 16px rise; "none" only fades opacity. */
  direction?: "up" | "none";
  /** Render as a <li> when used as a direct child of <ul>/<ol> — keeps list markup valid. */
  as?: "div" | "li";
}

/**
 * Fades/rises content into view once it enters the viewport.
 * Falls back to fully visible immediately if IntersectionObserver is
 * unavailable or the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = cn(
    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
    visible
      ? "opacity-100 translate-y-0"
      : direction === "up"
        ? "opacity-0 translate-y-4"
        : "opacity-0",
    className
  );
  const style = { transitionDelay: visible ? `${delay}ms` : "0ms" };

  if (as === "li") {
    return (
      <li ref={ref} className={classes} style={style}>
        {children}
      </li>
    );
  }

  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  );
}
