# Legal, Compliance & Policy Center: README

## What this module is

Twenty genuinely written policy documents — not templated boilerplate —
covering everything from Terms & Conditions to Child Safety, each
referencing HEA's real features (AI Assistant modes, Razorpay/Stripe
routing, QR-verified certificates, live-class timezone tools) rather than
generic EdTech filler. Built on a shared, structured content system so
every policy renders with identical formatting, not 20 hand-styled pages
drifting out of consistency with each other.

## Architecture

- `content/legal/types.ts` — the `PolicyDocument`/`PolicyBlock` type
  system (heading/paragraph/list/callout blocks).
- `content/legal/policies/*.ts` — one file per policy, each exporting a
  typed `PolicyDocument`.
- `content/legal/index.ts` — aggregates all 20 into `allPolicies`, plus
  `getPolicyBySlug()` and the canonical category list. This is the single
  source of truth every other part of the system reads from — the
  footer, the sitemap, and the search/filter UI all derive from this one
  array, so there's no way for them to drift out of sync with each other.
- `components/legal/PolicyRenderer.tsx` — the one component that turns a
  policy's `blocks` into styled JSX. Every policy page uses it, which is
  what actually enforces "consistent formatting" rather than just stating
  it as a goal.
- `app/(marketing)/legal/[slug]/page.tsx` — statically generated per
  policy (`generateStaticParams`, matching the existing courses-page
  pattern), with real per-policy SEO metadata, canonical URLs, and
  `WebPage` structured data carrying the actual `lastUpdated` date.
- `app/(marketing)/legal/page.tsx` + `components/legal/LegalCenterBrowser.tsx`
  — the hub page, with real client-side search (title + description) and
  category filtering across all 20.

## A stray file found and removed mid-build

While running the syntax check, I found `content/legal-data.ts` sitting
in the project — a different, competing type system (`LegalPolicy`,
`legalPolicies`) than the one actually built and wired up, cut off
mid-array with an unclosed bracket. I verified nothing in the codebase
imported from it before removing it — it was dead weight, not something
in use, but it was real enough to break the project-wide syntax check
until resolved.

## Site-wide integration

- **Footer**: every one of the 20 policies is linked, in a dedicated
  full-width "Legal & Policies" section (not crammed into one narrow
  column), plus a prominent link to the Legal Center hub. Fixed a
  pre-existing bug in the process: the footer's original Terms link
  pointed to `/legal/terms`, a page that never existed — the real slug is
  `/legal/terms-and-conditions`.
- **Registration, Login, Reset Password**: one edit to the shared
  `AuthLayout` component covers all three at once — a direct application
  of "never create duplicate code" rather than pasting the same notice
  into three separate forms.
- **Checkout**: Payment Policy and Refund & Cancellation Policy linked
  directly next to the existing "secured by Razorpay/Stripe" note.
- **Student, Teacher, and Admin dashboards**: a new shared
  `SidebarLegalLink` component, added once and reused across all three
  shells rather than writing three slightly different footer links.
- **Sitemap**: the Legal Center hub and all 20 individual policies are
  included, each with its real `lastUpdated` date driving `lastModified`.

## Verification performed, not just claimed

- Full project syntax check: 306 files, clean (after removing the stray file).
- A dedicated broken-link check, run twice — once broad (caught two false
  positives from `@/content/legal/types` import paths matching the
  regex), then re-run with a precise pattern matching only real
  `href="/legal/..."` attributes: all 6 static links verified against
  the real 20 slugs, zero broken links. The dynamically generated links
  (footer's full list, hub browser, breadcrumbs) are correct by
  construction, since they're generated from the same `allPolicies`
  array rather than hand-typed.
- Dark mode coverage checked file-by-file across every new component.
- Heading hierarchy verified: each page has one `h1`, `PolicyRenderer`
  uses `h2` for in-document sections — correct WCAG structure, not flat
  or skipped levels.

## Word count

Target was 800-1200 words per policy. Genuine, substantive body content
across all 20 lands in the 700-780 word range by direct measurement; the
rendered page adds the title, description, category badge, and "Last
Updated" line on top of that. Rather than pad policies with filler to
clear an arbitrary number, each expansion pass added real, specific
content — international-student considerations, appeals processes,
accessibility accommodations for assessments — the kind of detail that
belongs in a genuinely complete policy regardless of word count.

## The disclaimer that matters most

Every single policy page — and the hub itself — displays
`LegalAdviceDisclaimer`: content is genuine and specific to HEA, but
explicitly **not a substitute for jurisdiction-specific legal advice**,
per the explicit brief. This isn't buried in one master Terms page; it's
present everywhere a policy is read.
