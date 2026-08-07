import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// Note: no focus-visible:outline-none here — the global :focus-visible rule
// in globals.css provides the on-brand gold ring. A previous version of this
// component accidentally overrode it with a higher-specificity utility class,
// silently removing keyboard focus indication on every button on the site.
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-all duration-300 ease-premium rounded-full active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-600 text-navy-900 hover:-translate-y-0.5 hover:bg-gold-500 shadow-gold hover:shadow-lg",
  secondary:
    "bg-navy-800 text-white hover:-translate-y-0.5 hover:bg-navy-700 shadow-card hover:shadow-elevated dark:bg-navy-700 dark:hover:bg-navy-600",
  outline:
    "border-2 border-navy-800 text-navy-800 hover:-translate-y-0.5 hover:bg-navy-800 hover:text-white dark:border-navy-300 dark:text-navy-100 dark:hover:bg-navy-100 dark:hover:text-navy-900",
  ghost: "text-navy-800 hover:bg-navy-100/60 dark:text-navy-100 dark:hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-base sm:text-lg px-8 py-4",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = ButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const isProtocolLink = href.startsWith("tel:") || href.startsWith("mailto:");
    const isHttpExternal = href.startsWith("http");

    if (isHttpExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorProps}
        >
          {props.children}
        </a>
      );
    }

    if (isProtocolLink) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {props.children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {props.children}
    </button>
  );
}
