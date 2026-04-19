# Build Plan — WhatsHappeningLKN

Execution-ready plan for Claude Code. Each phase has a goal, a task list, a Definition of Done (DoD), and verification steps. Do not start a phase until the previous phase's DoD is green.

Paired with: `PRD.md`, `TRD.md`, `CONTENT-SCHEMA.md`, `DESIGN-SYSTEM.md`.

---

## Phase 0 — Decisions & prerequisites (human, not Claude Code)

Marc must confirm before coding starts:
- [ ] Domain registered (e.g., `whatshappeninglkn.com`)
- [ ] GitHub repo created, Marc + optional collaborator access
- [ ] Vercel account linked to the repo
- [ ] Resend account (free tier is fine) → API key
- [ ] YouTube channel URL known
- [ ] Host has 8+ videos either published or scheduled for launch

If any of these are missing, the site can still be built, but launch is gated on them.

## Phase 1 — Foundation

**Goal:** A running Next.js app at `app/` with design tokens, routing skeleton, and an MDX content pipeline. No real content yet.

### Tasks

1. **Scaffold the Next.js project** under `app/` (so docs + ui-ux-pro-max stay siblings).
   ```bash
   cd /path/to/WhatsHappeningLKN
   pnpm dlx create-next-app@latest app --ts --tailwind --app --src-dir --eslint --import-alias "@/*"
   ```
   Remove any boilerplate pages and default styling that conflict with `DESIGN-SYSTEM.md`.

2. **Install dependencies:**
   ```bash
   cd app
   pnpm add framer-motion lucide-react zod react-hook-form @hookform/resolvers
   pnpm add gray-matter remark remark-html next-mdx-remote
   pnpm add resend
   pnpm add youtube-transcript
   pnpm add @vercel/analytics @vercel/speed-insights
   pnpm add -D @types/node
   ```

3. **shadcn/ui init + minimum set:** `button`, `card`, `input`, `textarea`, `select`, `badge`, `dialog` (for future use), `separator`.

4. **Design tokens:** create `src/styles/tokens.css` per `DESIGN-SYSTEM.md § 2–4`. Import into `globals.css`. Extend `tailwind.config.ts` with the custom font families and color aliases (`paper`, `ink`, `lkn-deep`, `lkn-sage`, etc.).

5. **Global layout:**
   - `src/app/layout.tsx` sets default `<html lang="en">`, preloads fonts, wires Vercel Analytics + Speed Insights, renders `<SiteHeader/>` and `<SiteFooter/>`, includes a skip-link to `#main`.
   - `SiteHeader`: logo wordmark (serif), nav links (Videos / Neighborhoods / Eat / Events / Why / About), mobile hamburger via shadcn `Sheet` or plain CSS.
   - `SiteFooter`: nav repeat, social icon links, newsletter placeholder, disclaimer line.

6. **Content pipeline (`src/lib/content.ts`):**
   - Zod schemas for Video / Neighborhood / EatSpot / Event matching `CONTENT-SCHEMA.md`.
   - Loader functions glob `src/content/<collection>/*.mdx`, parse with `gray-matter`, validate with Zod, cache in module scope.
   - Export typed `getAllVideos`, `getVideoBySlug`, etc.
   - Fail the build on any Zod error.

7. **YouTube helpers (`src/lib/youtube.ts`):**
   - `parseYouTubeId(url)` → string
   - `youtubeThumb(id, quality = 'maxres')` → URL
   - `fetchOEmbed(url)` (only called from `scripts/ingest-youtube.ts`, never at request time)

8. **Ingest script (`scripts/ingest-youtube.ts`):** Given a URL, write a populated MDX stub to `src/content/videos/<slug>.mdx`. Slug generated from title.

9. **Transcript pipeline (`scripts/build-transcripts.ts`):** Called from `prebuild` npm hook. Writes `src/content/videos/.transcripts/<slug>.txt` per video. Missing captions → create empty file with a marker comment.

10. **Sitemap + robots:** `src/app/sitemap.ts` iterates all collections; `src/app/robots.ts` allows all, points to sitemap.

11. **Routing skeleton (empty pages that render a title + breadcrumb):** every route in `TRD § 2` returns at least a valid HTML document with metadata.

### DoD

- `pnpm build` succeeds with zero warnings.
- Visiting `/`, `/videos`, `/neighborhoods`, `/eat`, `/events`, `/why`, `/about`, `/contact` returns 200 with a page title.
- Adding a sample MDX file to `src/content/videos/` surfaces it on `/videos` via `getAllVideos()` (end-to-end content pipeline proven).
- Lighthouse Performance ≥ 95 on empty pages (no content to pull down yet).

### Verification

```bash
cd app
pnpm lint && pnpm typecheck && pnpm build
pnpm start &  # or preview deploy
npx @lhci/cli autorun --collect.url=http://localhost:3000
```

## Phase 2 — Homepage + Videos surface

**Goal:** The two routes that carry the product: `/` and `/videos`, `/videos/[slug]`.

### Tasks

1. **Hero (`src/components/hero.tsx`):**
   - Per `DESIGN-SYSTEM.md § 1` (Video-First Hero modified to still image).
   - Art-directed hero image (mobile/desktop) in `public/images/hero/`.
   - Framer Motion parallax on scroll, disabled under `prefers-reduced-motion` and on mobile.
   - Overlay content: serif headline, sans subhead, single CTA button ("Watch the latest video").
   - ui-ux-pro-max query citation in file header.

2. **Homepage (`src/app/(marketing)/page.tsx`):**
   - Hero, "Latest videos" grid (6 most recent from `getAllVideos()`), four quick-nav cards, testimonial block (static strings for MVP), newsletter placeholder.
   - Uses RSC. Zero client JS except Framer Motion hero and newsletter signup component.

3. **Video card (`src/components/video-card.tsx`):** per `DESIGN-SYSTEM.md § 6`.

4. **Video index (`/videos`):**
   - Full grid, category + town filters (client component), sort selector.
   - Client-side filter reads a build-time JSON dump of `Video[]`. No extra network.
   - Empty state: "More videos coming soon — [subscribe on YouTube →]".

5. **Video detail (`/videos/[slug]`):**
   - `generateStaticParams` from all slugs.
   - Layout: breadcrumb → title → meta row (date, town, category) → lazy YouTube embed → handwritten intro (MDX body) → transcript (`<Transcript/>` component) → related videos → "Explore this neighborhood" link (if tagged).
   - `generateMetadata` sets OG image to video's thumbnail (or overridden `ogImage`).
   - JSON-LD `VideoObject` + `Article` per `TRD § 6`.

6. **Run the required ui-ux-pro-max queries** before writing each component and cite results in file headers (see `TRD § 16`).

### DoD

- With 2–3 sample MDX videos, `/` shows them, `/videos` filters work, `/videos/<slug>` renders correctly with a clickable embed and a transcript (even if placeholder).
- Lighthouse Performance ≥ 90 mobile on `/` and `/videos/<slug>`.
- No CLS on homepage hero or video grid load.
- OG image for a video page passes validation at `https://www.opengraph.xyz/`.

### Verification

Manual a11y sweep: tab-through navigation, screen-reader landmark check, focus-visible rings on all interactive elements. Fix any miss before proceeding.

## Phase 3 — Neighborhoods + Eat + Events + Editorial pages

**Goal:** All remaining Phase-1 routes.

### Tasks

1. **Neighborhoods index + detail:**
   - Index: 5 cards, each with hero image and tagline.
   - Detail: overview MDX body, who-it's-for, pros, what-to-know, commute/schools, key-spots list, embedded related videos, Google Maps iframe.
   - JSON-LD `Place`.

2. **Eat page (`/eat`):**
   - Single page, filters (town + vibe), 12–25 cards.
   - Each card links to the spot's external website (opens new tab with `rel="noopener"`).
   - JSON-LD: emit one `Restaurant` entity per card.

3. **Events page (`/events`):**
   - Upcoming list (8–12), sorted by date ascending.
   - Past events filtered out automatically.
   - Empty-state link to Visit Lake Norman.
   - JSON-LD `Event` per item.

4. **Why Lake Norman (`/why`):**
   - Long-form editorial. Sections: Water / Charlotte access / Outdoor life / Pace.
   - Serif body (per `DESIGN-SYSTEM.md § 3`), drop-cap on first paragraph (Editorial Grid style).
   - Inline stills + optional embedded videos.

5. **About (`/about`):**
   - Host story in MDX, one photo, social links.

6. **Contact (`/contact`):**
   - Name / email / message form, React Hook Form + Zod.
   - POST to `/api/contact` → Resend → `CONTACT_TO_EMAIL`.
   - Honeypot + in-memory per-IP rate limit.
   - Success and error states inline (no redirect).

### DoD

- All P1 routes from `PRD § 5` are present and populated with real launch content (minimums per `PRD § 7`).
- `pnpm verify:content` passes (slug integrity, image manifest, transcripts present or explicitly absent).
- Lighthouse ≥ 90 on one page per route type.

## Phase 4 — Launch hardening

**Goal:** Production-ready. Everything the PRD says we need before opening the doors.

### Tasks

1. **Metadata audit:** every route has title, description, canonical, OG image, Twitter card. Run a crawl (e.g., `pnpm dlx pa11y-ci` or a simple script) to verify.

2. **Structured data:** validate all JSON-LD via `https://search.google.com/test/rich-results` for at least one page per type.

3. **Accessibility audit:** `axe-core` on every route; fix any AA violations.

4. **Performance pass:** verify all budgets in `TRD § 10`. Run `next build --profile` and investigate any page with >200 KB of JS.

5. **Security headers:** add the CSP from `TRD § 11` via `next.config.ts` `headers()`.

6. **Analytics:** verify Vercel Analytics + Speed Insights show events in production. Add Google Search Console verification (`/public/google*.html` or HTML tag).

7. **Domain:** attach custom domain in Vercel; confirm HTTPS, www redirect, and `trailingSlash: false`.

8. **Robots + sitemap sanity:** submit sitemap in Search Console.

9. **Copy + legal pass:** footer disclaimer re: real-estate licensure; privacy policy page if newsletter goes live; cookie notice only if we add non-privacy-safe analytics (we don't).

10. **Smoke test checklist** (copy into the launch PR description):
    - [ ] Home → click CTA → video page loads, embed plays
    - [ ] Videos page filters work for each category and each town
    - [ ] Neighborhood page Google Maps embed loads
    - [ ] Eat page filter combinations all surface ≥1 card or a helpful empty state
    - [ ] Contact form sends; rate limit triggers on rapid repeats
    - [ ] 404 page is branded
    - [ ] No console errors on any page
    - [ ] Lighthouse mobile ≥90 on `/`, `/videos`, `/videos/<slug>`, `/neighborhoods/<slug>`, `/eat`

### DoD

- Production URL is live at the custom domain.
- Search Console sitemap submitted.
- Analytics collecting for 24h with real traffic (even if only Marc/Host).
- Host can add a new video in < 3 minutes via git flow (timed and documented in `README.md`).

## Phase 5 — Post-launch iteration (ongoing)

Not a sprint — a rhythm.

- Weekly: review Vercel Analytics, identify any >500ms paths, tune.
- Monthly: Search Console query report → pick 3 queries ranking on page 2 → improve those pages' intros and internal links.
- When the Host publishes: verify `updatedAt` trickles to sitemap `lastmod` (automatic if pipeline is correct).

### Phase-2 triggers (do NOT build early)

Only begin any of these when the stated trigger fires:

- **Sanity CMS migration:** Host explicitly asks for a non-git editing flow after ≥2 weeks of trying git.
- **Admin dashboard with auth:** a second editor joins.
- **Events scraping/automation:** Visit Lake Norman publishes a sanctioned feed OR manual curation takes >30 min/week.
- **Postgres + Drizzle:** a feature lands that truly needs a query plane (search across all content, comment threads, user accounts).
- **Newsletter provider integration:** Host picks a provider and has >50 committed subscribers ready to import.

## Cross-phase rules (bind Claude Code)

1. **ui-ux-pro-max citations are required** on every new component and on every page file. See `TRD § 16` and `DESIGN-SYSTEM.md § 6`.
2. **No speculative infrastructure.** If a task can be done with MDX + a static build, do not add a DB, cache, or queue.
3. **Every PR runs:** `pnpm lint`, `pnpm typecheck`, `pnpm build`, and Lighthouse CI on changed routes.
4. **Image manifest updates** ship in the same commit as the image.
5. **Content changes never regress transcripts.** If a video file is edited, rerun transcripts.
6. **Reduced motion** is respected everywhere. Any animation not gated by `prefers-reduced-motion` fails review.
7. **Accessibility failures block merge.** Performance failures block merge. Everything else can be a follow-up issue.
