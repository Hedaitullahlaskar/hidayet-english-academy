# Website CMS — Phase 1: Core Content

## What this phase actually is

The full request behind this was a complete enterprise CMS — page builder,
media library, student/teacher ERP, exam engine, blog, email/WhatsApp
marketing centers, analytics, granular RBAC, and more. That's realistically
15-20 independent major subsystems. Building all of it at once, before the
site has any real students or usage, would mean guessing at requirements
instead of learning them — and several pieces (bulk WhatsApp, real traffic
analytics) can't be genuinely functional without external approvals or
real traffic that doesn't exist yet.

Phase 1 is the highest-value, honestly-completable slice: **the parts of
the public marketing site an admin actually needs to change without
opening a code editor.** Every later phase (Student/Teacher management
depth, Payments, Certificates, the rest) builds on this one at a time,
each genuinely finished before the next starts.

## What's now database-backed instead of hardcoded

| Content | Table | Previously |
|---|---|---|
| Academy name, logo, contact info, social links | `site_settings` (singleton row) | `content/site-data.ts`'s `site` object |
| Homepage hero headline/subtitle/body/CTA | `cms_content` (section='homepage') | Hardcoded JSX in `Hero.tsx` |
| FAQ | `faqs` | `content/site-data.ts`'s `faqs` array (removed) |
| Photo gallery | `gallery_images` | `content/about-data.ts`'s `galleryItems` |

`cms_content` already existed (Module 7) for exactly this purpose — it was
built, RLS-protected, and never actually wired to a real page. The hero
section is its first real use; more homepage sections can reuse it later
without a schema change, just new `content_key` rows.

## The honest-fallback pattern, applied here too

Every public read (`lib/settings/repository.ts`) falls back to the exact
copy that shipped before this table existed if the database is
unreachable or a field hasn't been set yet — never a blank header, never
placeholder text. `site_settings` is also pre-seeded with today's real
values as part of the migration, so there's no transitional "empty" state
at all for the fields that already had real content.

## Editing it

`/admin/cms` (Website CMS) now has five sections: Site Settings, Homepage
Hero, FAQ, Gallery, Testimonials, Site Banners (the last two already
existed). Every save calls a server action and the page immediately
reflects it — no deploy, no code change.

## Media: what's built vs. what's deferred

A working **upload-and-use** control exists (`ImageUploadField`,
`site-content` storage bucket, public read / staff write) — used for the
logo and gallery photos. This is not the full "professional media
library" from the original brief (folders, search, compression,
alt-text-as-a-first-class-field-everywhere, restore/versioning) — that's
real, separate scope for a later phase. What's here today is honest and
fully functional for what it is: upload an image, get a URL, use it.

## Deliberately not touched in this phase

- **About page** (Mission/Vision/Founder message) and the **20 legal
  policy documents** — both are real, carefully-written, compliance-
  relevant content. A generic rich-text/block CMS editor for either is a
  substantial UI effort on its own and carries real correctness risk for
  legal text specifically; better as a focused later phase than a rushed
  part of this one.
- **Brand colors** — the request asked for configurable "Brand Colours,"
  but this app's whole design system (Tailwind's `navy-*`/`gold-*` scales)
  is compiled at build time, not runtime-themeable. Adding a
  non-functional color field to `site_settings` that doesn't actually
  change anything would be exactly the kind of placeholder the brief
  explicitly said not to build. Real runtime theming means threading CSS
  custom properties through the whole design system — a legitimate,
  separate architectural project, not a field on a settings form.
- **Favicon** — Next.js's static `icons` metadata convention doesn't
  easily support a runtime-dynamic value without restructuring how
  `app/layout.tsx` generates metadata. Small, deferred, not forgotten.
- **Homepage section visibility toggles** — the homepage has 15 sections;
  toggling them on/off is straightforward to add once there's a real
  reason to (i.e., an admin actually wants to hide one), rather than
  building UI for a need that doesn't exist yet.

## Schema

See the "WEBSITE CMS, PHASE 1" section of `supabase/schema.sql`:
`site_settings`, `faqs`, `gallery_images`, and the `site-content` storage
bucket. Re-running `schema.sql` is safe (every statement is
idempotent) — this is how the tables actually get created in your
Supabase project.
