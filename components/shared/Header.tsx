"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/dashboard/Avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { navLinks, site } from "@/content/site-data";
import { createClient } from "@/lib/supabase/client";
import { dashboardPathFor, type UserRole } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import { PhoneIcon } from "@/components/ui/icons";

interface SessionInfo {
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [activeHash, setActiveHash] = useState<string>("");
  const [session, setSession] = useState<SessionInfo | null | undefined>(undefined); // undefined = still checking

  // Session-aware nav: a logged-in visitor browsing the marketing site
  // (someone who signed in, then clicked the logo to come back here)
  // should see a quick way back to their dashboard and to log out,
  // rather than being pushed toward "Join Free Class" / "Log In" as if
  // they were a stranger. This was the actual missing link in the
  // Homepage → Login → Dashboard → Logout → Homepage loop — the header
  // had no login link and no awareness of an existing session at all.
  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!active) return;
        if (!user) {
          setSession(null);
          return;
        }
        const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", user.id).single();
        if (!active) return;
        setSession(
          profile
            ? { fullName: profile.full_name, avatarUrl: profile.avatar_url, role: profile.role as UserRole }
            : null
        );
      } catch {
        if (active) setSession(null);
      }
    }

    loadSession();

    try {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => loadSession());

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch {
      active = false;
      return undefined;
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Lightweight scroll-spy: highlights the nav link for whichever section
  // is currently most visible, so people always know where they are on the page.
  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => (l.href.includes("#") ? l.href.split("#")[1] : null))
      .filter((id): id is string => Boolean(id));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm transition-shadow duration-300 dark:bg-navy-950/95",
        scrolled && "shadow-card"
      )}
    >
      <Container className="flex h-[4.5rem] items-center justify-between py-3">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${site.name} home`}
        >
          <Image
            src="/images/hea-logo.png"
            alt="Hidayet English Academy logo — gold laurel crest on navy"
            width={48}
            height={48}
            className="h-11 w-11 rounded-full transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12"
            priority
          />
          <span className="hidden font-display text-lg font-semibold leading-tight text-navy-900 dark:text-white sm:block">
            Hidayet English
            <span className="block text-sm font-sans font-medium text-navy-500 dark:text-navy-400">
              Academy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = activeHash !== "" && link.href.endsWith(activeHash);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative text-sm font-semibold transition-colors",
                  isActive
                    ? "text-gold-800 dark:text-gold-400"
                    : "text-navy-700 hover:text-gold-800 dark:text-navy-200 dark:hover:text-gold-400"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-gold-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${site.phone}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-gold-800 dark:text-navy-300 dark:hover:text-gold-400"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phoneDisplay}
          </a>
          <ThemeToggle />
          <button
            onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
            className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-bold text-navy-700 transition-colors hover:border-gold-500 hover:text-gold-800 dark:border-navy-600 dark:text-navy-200 dark:hover:text-gold-400"
            aria-label="Switch language"
          >
            {lang === "en" ? "বাংলা" : "English"}
          </button>
          {session ? (
            <Link href={dashboardPathFor(session.role)} className="flex items-center gap-2" aria-label="Go to your dashboard">
              <Avatar name={session.fullName} avatarUrl={session.avatarUrl} size={32} />
              <span className="text-sm font-semibold text-navy-800 dark:text-navy-100">Dashboard</span>
            </Link>
          ) : session === null || session === undefined ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-navy-700 hover:text-gold-800 dark:text-navy-200 dark:hover:text-gold-400">Student Login</Link>
              <Link href="/teach/login" className="text-sm font-semibold text-navy-700 hover:text-gold-800 dark:text-navy-200 dark:hover:text-gold-400">Teacher Login</Link>
              <Link href="/admin/login" className="text-sm font-semibold text-navy-700 hover:text-gold-800 dark:text-navy-200 dark:hover:text-gold-400">Admin Login</Link>
            </div>
          ) : null}
          <Button href="/#enroll" size="sm">
            Join Free Class
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy-800 dark:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[72px] z-30 origin-top bg-white shadow-elevated transition-all duration-300 dark:bg-navy-950 lg:hidden",
          menuOpen
            ? "pointer-events-auto max-h-[80vh] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${site.phone}`}
            className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
          >
            <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
          </a>
          {session ? (
            <Link
              href={dashboardPathFor(session.role)}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
            >
              <Avatar name={session.fullName} avatarUrl={session.avatarUrl} size={28} />
              Go to Dashboard
            </Link>
          ) : session === null || session === undefined ? (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
              >
                Student Login
              </Link>
              <Link
                href="/teach/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
              >
                Teacher Login
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
              >
                Admin Login
              </Link>
            </>
          ) : null}
          <div className="mt-2 flex items-center gap-3 px-3">
            <button
              onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
              className="rounded-full border border-navy-200 px-4 py-2 text-sm font-bold text-navy-700 dark:border-navy-600 dark:text-navy-200"
            >
              {lang === "en" ? "বাংলা" : "English"}
            </button>
          </div>
          <Button href="/#enroll" size="lg" className="mx-3 mt-3" onClick={() => setMenuOpen(false)}>
            Join Free Class
          </Button>
        </Container>
      </div>
    </header>
  );
}
