# WhatsHappeningLKN — Technical Requirements Document

**Status:** Authoritative for Phase 1 build
**Last updated:** 2026-04-18
**Paired with:** `PRD.md`, `CONTENT-SCHEMA.md`, `DESIGN-SYSTEM.md`, `BUILD-PLAN.md`

Claude Code: this document is the single source of truth on *how* to build. Conflicts with other docs resolve in favor of this one for technical questions; conflicts on product scope resolve in favor of `PRD.md`.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | ISR + native MDX + `next/image` + Vercel fit |
| Language | **TypeScript (strict)** | Frontmatter typing, component safety |
| Styling | **Tailwind CSS v4** + **shadcn/ui** | Design system velocity; ui-ux-pro-max output maps directly |
| Content | **MDX in repo** via `content-collections` or `next-mdx-remote` | No DB, typed frontmatter, git as CMS |
| Schema validation | **Zod** | Frontmatter parsing + form validation |
| Forms | **React Hook Form + Zod resolver** | Contact form only |
| Motion | **Framer Motion** | Hero parallax, card hovers, reduced-motion aware |
| Icons | **lucide-react** | Consistent with shadcn |
| Email | **Resend** | Single transactional need (contact form) |
| Analytics | **Vercel Analytics** + **Vercel Speed Insights** | Zero-config, privacy-safe |
| Search indexing | **Google Search Console** + **Bing Webmaster** | Required for the #1 success metric |
| Hosting | **Vercel** | ISR, image optimization, preview deployments |
| Version control | **GitHub** | Content editing UX, preview deploys per PR |

**Deliberately not in Phase 1:** Postgres, Clerk, Sanity, Prisma/Drizzle, any cron jobs, any scraping, any server-side DB queries. If a requirement appears to need one of these, re-read the PRD before adding it.

## 2. Repository layout

```
WhatsHappeningLKN/
├── CLAUDE.md                          # Claude Code entry point (at workspace root)
├── docs/
│   ├── PRD.md
│   ├── PRD-REVIEW.md
│   ├── TRD.md                         # this file
│   ├── CONTENT-SCHEMA.md
│   ├── DESIGN-SYSTEM.md
│   └── BUILD-PLAN.md
├── ui-ux-pro-max-skill-main/          # vendored design intelligence (do NOT delete)
└── app/                               # Next.js project root — created in Phase 1 Step 1
    ├── src/
    │   ├── app/
    │   │   ├── (marketing)/
    │   │   │   ├── page.tsx                     # /
    │   │   │   ├── about/page.tsx
    │   │   │   ├── why/page.tsx
    │   │   │   ├── contact/page.tsx
    │   │   │   ├── videos/
    │   │   │   │   ├── page.tsx                 # /videos (index)
    │   │   │   │   └── [slug]/page.tsx          # /videos/:slug
    │   │   │   ├── neighborhoods/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── [slug]/page.tsx
    │   │   │   ├── eat/page.tsx
    │   │   │   └── events/page.tsx
    │   │   ├── api/
    │   │   │   └── contact/route.ts             # POST → Resend
    │   │   ├── sitemap.ts
    │   │   ├── robots.ts
    │   │   ├── opengraph-image.tsx              # default OG
    │   │   ├── layout.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ui/                              # shadcn primitives
    │   │   ├── video-card.tsx
    │   │   ├── video-embed.tsx                  # lazy YouTube iframe
    │   │   ├── video-filters.tsx                # client component
    │   │   ├── neighborhood-card.tsx
    │   │   ├── eat-card.tsx
    │   │   ├── event-card.tsx
    │   │   ├── hero.tsx
    │   │   ├── site-header.tsx
    │   │   ├── site-footer.tsx
    │   │   ├── transcript.tsx                   # collapsible
    │   │   └── newsletter-signup.tsx            # placeholder or provider embed
    │   ├── content/                             # MDX content — see CONTENT-SCHEMA.md
    │   │   ├── videos/
    │   │   ├── neighborhoods/
    │   │   ├── eat/
    │   │   └── events/
    │   ├── lib/
    │   │   ├── content.ts                       # load + parse MDX collections
    │   │   ├── youtube.ts                       # id parsing, thumbnail URL, oEmbed fetch
    │   │   ├── transcript.ts                    # captions fetch + cache
    │   │   ├── seo.ts                           # Metadata/OG helpers
    │   │   └── schema.ts                        # JSON-LD builders
    │   └── styles/
    │       └── tokens.css                       # CSS variables (design tokens)
    ├── public/
    │   ├── images/
    │   │   ├── hero/                            # art-directed heroes (mobile/desktop)
    │   │   ├── neighborhoods/
    │   │   └── eat/
    │   └── og/                                  # per-page OG images
    ├── scripts/
    │   └── ingest-youtube.ts                    # CLI: paste URL → generate MDX stub
    ├── .env.example
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

Decision: use an `app/` subfolder so the monorepo-style root keeps docs, the ui-ux-pro-max skill, and the Next.js project side-by-side without polluting the Next.js root.

## 3. Routing & rendering strategy

| Route | Render mode | Revalidate | Notes |
|---|---|---|---|
| `/` | Static (ISG) | 60s | Pulls latest 6 video entries at build; ISR refreshes hourly |
| `/videos` | Static + client filters | build-time | Full list in JSON, filtering client-side |
| `/videos/[slug]` | Static (generateStaticParams) | on-demand (webhook) or 60s | One URL per video |
| `/neighborhoods`, `/neighborhoods/[slug]` | Static | on-demand | Rarely changes |
| `/eat` | Static | 60s | |
| `/events` | Static | **5 min** | Only route that benefits from shorter revalidate |
| `/about`, `/why`, `/contact` | Static | on-demand | |
| `/api/contact` | Edge runtime | n/a | Rate limited |
| `/sitemap.xml`, `/robots.txt` | Generated | build-time | |

No middleware unless contact-form rate limiting forces it (Upstash Redis is fine if so).

## 4. Data layer (content pipeline)

See `CONTENT-SCHEMA.md` for exact frontmatter shapes. Implementation rules:

1. **Source of truth is MDX files in `src/content/*`.** No runtime database.
2. **A single `lib/content.ts` module** exposes typed collections:
   - `getAllVideos(): Video[]`
   - `getVideoBySlug(slug): Video | null`
   - `getAllNeighborhoods(): Neighborhood[]`
   - `getAllEatSpots(): EatSpot[]`
   - `getUpcomingEvents(now: Date): Event[]` (filters past events)
3. **All Zod-parsed at build time.** A malformed frontmatter fails the build, not runtime.
4. **Cross-references by slug, not by ID.** `relatedVideos: ["a-davidson-saturday", "mooresville-boating"]`.
5. **No client-side content fetching.** All MDX is inlined into the static HTML or RSC payload.

## 5. YouTube integration

- **Thumbnails:** derive from video ID. Try `maxresdefault.jpg` first, fall back to `hqdefault.jpg`. No API key needed.
- **Titles/descriptions:** optional auto-fill via `https://www.youtube.com/oembed?url=...&format=json` (no key, no quota) when running `scripts/ingest-youtube.ts`. Final text is edited and committed as MDX — no runtime oEmbed calls.
- **Embeds:** `<iframe>` with `loading="lazy"`, `allow="autoplay; encrypted-media"` but **no `autoplay` param**, `title` set for a11y. Wrap in `aspect-video` container to prevent CLS.
- **Transcripts:** generated at build time by `lib/transcript.ts` using the `youtube-transcript` npm package. Cache into MDX frontmatter or a sibling `.transcript.txt` file per video so builds are deterministic. If captions are unavailable, fall back to "Transcript coming soon."

## 6. SEO requirements (load-bearing for success metric #1)

Every page must set:

- `title`, `description`, `canonical` via Next.js `generateMetadata`.
- Open Graph: `og:title`, `og:description`, `og:image` (per-page where available, else default), `og:type`.
- Twitter: `summary_large_image`.

Structured data (`application/ld+json`), minimum per page type:

- `/` — `WebSite` with `SearchAction`.
- `/videos/[slug]` — `VideoObject` pointing to the YouTube URL, plus `Article` for the on-page intro/transcript.
- `/neighborhoods/[slug]` — `Place` with `geo`, `containedInPlace` = Lake Norman.
- `/eat` entries — `Restaurant` embedded per item.
- `/events` entries — `Event` with `startDate`, `location`.

Generate `sitemap.xml` from all collection slugs. Include `lastmod` from frontmatter `updatedAt` (falls back to `publishedAt`). Verify ownership in Google Search Console at launch.

## 7. Image pipeline

- `next/image` everywhere. `priority` **only** on the homepage hero — nowhere else (per ui-ux-pro-max nextjs guidance).
- Hero images are art-directed per breakpoint: store `hero-mobile.jpg` and `hero-desktop.jpg`, use `<picture>` or Next.js `sizes` hints.
- All images have `alt` text in MDX frontmatter. Missing alt fails Zod validation.
- Source images: original Host photography where possible. Unsplash/Pexels fallbacks must record `src`, `photographer`, `license` in `src/content/_image-manifest.json`.
- Max original dimensions: 3000px on the long edge. Next.js optimizes down.

## 8. Motion & interaction

- Framer Motion for: hero parallax (desktop only), video card hover lift, filter pill transitions, page fade-in.
- **Global rule:** every animation respects `prefers-reduced-motion: reduce` and falls back to no motion. Implement via a `useReducedMotion()` wrapper.
- No parallax on mobile. No auto-playing video anywhere. No scroll-hijacking.

## 9. Accessibility

- WCAG 2.1 AA enforced in PR review.
- Color tokens in `DESIGN-SYSTEM.md` are pre-checked for AA contrast on both light backgrounds.
- All interactive elements: visible focus ring (`ring-2 ring-offset-2`).
- Video embeds: descriptive `title` attribute, visible transcript link above the fold on video pages.
- Forms: labeled inputs, inline Zod errors, announced via `aria-live="polite"`.
- Keyboard: filters are buttons (not divs), modals (if any slip in) are dialog-role with focus trap.

## 10. Performance budget

| Metric | Budget | Enforcement |
|---|---|---|
| LCP (mobile) | ≤ 2.5s | `priority` hero, preloaded font subset, no blocking JS |
| CLS | < 0.05 | Explicit `aspect-video` on YT embeds and cards; image width/height |
| INP | < 200ms | Client filters do index math, not re-render the whole grid |
| Initial JS | ≤ 160 KB gzipped | Prefer RSC; audit with `next build --profile` |
| Homepage weight | ≤ 1.2 MB over the wire | Compressed hero + no video autoplay |

If any budget is exceeded at the end of a phase, the phase is not complete.

## 11. Security

- Contact form: Zod validate → Resend. Honeypot field. Rate limit via in-memory per-IP for MVP; upgrade to Upstash if abused.
- No authenticated routes in Phase 1 (no admin surface exists).
- Secrets only in Vercel env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `NEWSLETTER_API_KEY`. Nothing in the repo.
- CSP header: `default-src 'self'; img-src 'self' img.youtube.com i.ytimg.com; frame-src www.youtube.com youtube.com www.google.com; script-src 'self' va.vercel-scripts.com`. Refine via Next.js headers config.

## 12. Environment variables

```
# .env.example
NEXT_PUBLIC_SITE_URL=https://whatshappeninglkn.com
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@whatshappeninglkn.com
REVALIDATE_SECRET=                      # for on-demand revalidation webhook
# Phase 1.5+ (optional)
NEWSLETTER_PROVIDER=                    # beehiiv | convertkit | none
NEWSLETTER_API_KEY=
```

## 13. Content workflow (replaces "admin dashboard" from original PRD)

Phase 1 workflow for the Host to publish a new video:

1. Upload the video to YouTube and copy the URL.
2. On phone or laptop, open the repo on GitHub → `src/content/videos/` → "Add file" → paste from a template (see `CONTENT-SCHEMA.md`) → commit to `main` or a PR branch.
3. Vercel auto-deploys in ~60 seconds.
4. Optionally, Marc can run `pnpm ingest-youtube <url>` locally to generate a populated MDX file for her.

If the Host says after 2 weeks of use "this is too annoying": move neighborhood and dining content to Sanity (Phase 1.5). Keep videos in MDX regardless — they're too tightly coupled to git-tracked transcripts to benefit from a CMS.

## 14. Testing & verification

- **Typecheck + lint** on every PR (`tsc --noEmit`, `eslint`).
- **Build must pass** (`next build`). A broken MDX frontmatter fails here.
- **Lighthouse CI** on the homepage and one video page per PR. Fail if Performance < 90 on mobile.
- **No unit tests required** for Phase 1 content-only site; add Playwright smoke tests if/when forms or admin arrive.

## 15. Deployment

- Vercel production = `main` branch.
- Vercel preview = every PR.
- Domain attached in Vercel dashboard once registered.
- On-demand revalidation webhook at `/api/revalidate` (Phase 1.5 — only if we discover the 60s ISR window is too slow for the Host's taste).

## 16. Required use of ui-ux-pro-max

Before implementing any visual decision (hero layout, card component, color choice, typography pair, chart, motion pattern), Claude Code MUST query the ui-ux-pro-max skill for concrete guidance and record the query + selected result in the component's top-of-file comment. See `DESIGN-SYSTEM.md § 1` for the baseline selections already made.

Minimum queries to run before starting each page:

```
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<page intent>" --domain landing -n 3
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<page intent>" --domain ux -n 5
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<component intent>" --stack nextjs -n 3
```

Any deviation from the baseline in `DESIGN-SYSTEM.md` must cite an ui-ux-pro-max result as justification.
