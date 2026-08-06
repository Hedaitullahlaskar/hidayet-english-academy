# Module 4 — Courses Ecosystem: Documentation

## Follow-up: the migration this module always pointed toward, done

Everything below this section is the original Module 4 writeup, kept as
the historical record of what was built and why — including the note that
`content/courses-data.ts` was deliberately temporary. That file is now
deleted. `admin_courses` (see `supabase/schema.sql`) is the real,
database-backed single source of truth, exactly as this doc always said
the eventual swap would look:

- **`lib/courses/repository.ts`'s function bodies changed to query
  Supabase — nothing else did.** Every page/component listed below still
  calls `getAllCourses()`, `getCourseBySlug()`, `getAllCourseSlugs()`,
  `getFeaturedCourses()`, `getFilteredCourses()` exactly as before. That
  was the whole point of the repository seam, and it held.
- **All 20 courses migrated with zero data loss** — see the `insert into
  admin_courses ... on conflict (slug) do update` block in `schema.sql`,
  generated directly from the old static array.
- **Admin can now create, edit, publish, archive, and delete courses**
  through `/admin/courses` and `/admin/courses/[id]/edit` — this actually
  changes what's live on `/courses` immediately, closing the gap
  `ADMIN_MODULE_README.md` had flagged ("admin CRUD exists, public site
  doesn't read it").
- **Teachers manage only their courses they're assigned to** — a new
  `teacher_course_assignments` table + `can_manage_course()` SQL function
  replace the old "any teacher can touch any course" policy across
  lessons, assignments, submissions, tests, test_questions, live_classes,
  attendance, certificates, the question bank, and doubts. See the
  "COURSE CATALOG MIGRATION" section of `schema.sql` for the full
  reasoning, including the backfill that assigns every existing teacher to
  every existing course so nobody already teaching a course loses access
  the moment this migration runs.
- **The public catalog is still public, deliberately.** "Students only see
  courses they're enrolled in" applies to a course's actual lesson
  content (already enrollment-gated), not the `/courses` catalog listing
  — a course-selling business has to let non-enrolled visitors browse and
  buy. Only `status = 'published'` courses are ever visible to anonymous
  visitors; draft and archived courses are admin/assigned-teacher-only.
- **Payments are real now too** (see `PAYMENTS_MODULE_README.md`) — the
  "architecture-only, not live" section below predates that module and is
  now historical, not current state.

## What "not hardcoded" means today, honestly

There is no live database yet (Module 0 in the Implementation Roadmap hasn't
been built). What's built instead is the **correct architectural seam** so
that adding a real database later doesn't require rewriting any page:

```
content/courses-data.ts        ← the only file with actual course content
lib/courses/repository.ts      ← every page reads through these functions
app/courses/page.tsx            ← calls getAllCourses()
app/courses/[slug]/page.tsx      ← calls getCourseBySlug(slug), generateStaticParams()
```

**To add, edit, or remove a course today:** edit `content/courses-data.ts`.
No other file changes. The dynamic route (`[slug]/page.tsx`) automatically
generates a full page for whatever's in that array.

**Once Module 0 (Supabase) and Module 12 (Admin Dashboard) are built:** only
`lib/courses/repository.ts`'s function bodies change, from reading the local
array to querying Supabase. Every page, component, and route stays exactly
as it is. That's the entire point of the repository pattern — it's not a
placeholder, it's the real, correct way to build this so today's static
version and tomorrow's database-backed version are the same codebase.

## Payment — what's real today vs. what's architecture-only

- **Real today:** a currency selector (`components/shared/CurrencySelector.tsx`)
  that tags WhatsApp inquiries with the visitor's preferred currency, so a
  conversation about fees starts in the right currency. A client-side
  locale-based guess (`lib/currency.ts`) suggests a starting currency.
- **Architecture-only, not live:** `lib/payments/types.ts` defines the
  `PaymentProvider` interface every gateway (Razorpay, SSLCommerz, Stripe)
  will implement per the roadmap's Module 16. No provider is implemented. No
  charge can be processed. `selectProviderForCurrency()` throws on purpose
  until that module is built.
- **Country auto-detection:** `middleware.ts` reads the real
  `x-vercel-ip-country` header and sets a cookie — this only has real data
  once deployed to Vercel. In local dev or an offline HTML preview, there's
  no server to supply that header, so the client-side locale guess is what
  runs instead.
- **No course has real prices in any currency.** Every course, including
  this one, still routes to a WhatsApp fee inquiry — exactly like the
  homepage's course cards did before this module. No number was invented.

## Content honesty notes

- **IELTS / PTE / OET** are marked `comingSoon: true` and rendered with a
  "Coming Soon" badge and "to be announced" fields — matching how you
  described them in the brief.
- **Certificates** are marked `coming-soon` for every course (matching the
  Method page's existing honest framing) — verification infrastructure
  isn't built yet.
- **Only Madhyamik English is marked `free: true`.** Every other course's
  "Enroll Now" routes to a WhatsApp fee inquiry rather than a fabricated
  price.
- **Course FAQs are template-based, not per-course-researched** — they're
  genuinely accurate for any course (format, level-fit, certificate status,
  switching programs) but aren't unique deep-dives per course, since I don't
  have course-specific edge cases to draw from yet.
- **No student counts, completion rates, or placement statistics appear
  anywhere in this module.**

## What's in the HTML preview vs. what's only in the Next.js code

Statically pre-rendering 20 nearly-identical HTML preview files would add
size without adding verification value. The preview package includes:

- `hea-courses-preview.html` — the full listing page: filters, the
  comparison tool, the learning roadmap, and the scholarship teaser, all
  interactive.
- `hea-course-detail-preview.html` — **one** fully worked example (Spoken
  English Master Course) showing every required section of the template.
- `hea-scholarship-preview.html` — the scholarship page.

The real Next.js project generates all 20 course pages from the same
template — verifiable by reading `content/courses-data.ts` (20 entries) and
`app/courses/[slug]/page.tsx`'s `generateStaticParams()`.

## SEO delivered per course page

- Unique `<title>` and meta description (from `generateMetadata`)
- Canonical URL
- Open Graph title/description
- `Course` schema (JSON-LD), with `Offer` schema for the one free course
- `FAQPage` schema
- `BreadcrumbList` schema, rendered visually and in JSON-LD
- Included in `sitemap.ts` automatically (reads the same repository)
