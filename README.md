# Hidayet English Academy — Platform (Phase 1)

Phase 1 deliverable: brand-locked design system + production homepage.

## Stack
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## What's in this phase

- `tailwind.config.ts` — the full HEA design token system (colors, type, radius, shadows, motion)
- `lib/fonts.ts` — Fraunces (display) + Plus Jakarta Sans (body) + Hind Siliguri (Bengali)
- `components/ui/` — reusable design-system primitives (Button, Card, Badge, Container, SectionHeading, CourseCard)
- `components/shared/` — site-wide chrome (Header, Footer, WhatsApp button, Announcement bar)
- `components/home/` — homepage-only sections
- `content/site-data.ts` — every real piece of HEA copy (courses, contact info, teaching method) in one editable place
- `public/images/` — brand assets sourced from your uploaded materials (logo, founder photo, campaign creatives)

## Next steps (Phase 2+)
See the Master Plan document for the full sitemap — `/courses`, `/dashboard`, `/teach`, `/admin`, auth, and Supabase integration come next.
