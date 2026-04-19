# WhatsHappeningLKN — Product Requirements Document (v2)

**Status:** Draft, ready for build
**Owner:** Marc
**Last updated:** 2026-04-18
**Supersedes:** the original PRD provided by the creator (see `PRD-REVIEW.md` for the delta and rationale)

---

## 1. What this is

A calm, video-first, editorial-feeling web guide to Lake Norman, NC for people who just moved here or are seriously considering moving here. It feels like a trusted local friend sharing what they love about the area — not a real-estate funnel.

The site is maintained by a single creator (referred to here as "the Host") who films YouTube videos and wants a beautiful home on the web for those videos plus a small set of curated guide pages.

## 2. Why it exists (success metrics, ranked)

1. **Organic search traffic.** Rank on "moving to Lake Norman," "best neighborhoods Lake Norman," "things to do Lake Norman," and similar long-tail queries. Target: 1,000 organic sessions/month by month 6; 5,000/month by month 12.
2. **Audience loyalty.** Get visitors to watch a second video. Target: videos-per-session > 1.4 by month 3.
3. **Low maintenance tax on the Host.** Adding a new video should take < 3 minutes, no code review required, no waiting on Marc.

Secondary (not MVP gating): newsletter growth, contact-form inbound, affiliate/partnership surface area.

## 3. Who it's for

| Audience | What they want | What we give them |
|---|---|---|
| Recent movers (0–12 months in) | "Did I pick the right neighborhood? Where do locals actually go?" | Neighborhood profiles, dining guide, events |
| Relocation researchers | "Is this the right area for my family? What's daily life like?" | Lifestyle videos, schools/commute notes, honest pros/cons |
| Visitors considering a move | "Is the vibe real or hype?" | Vlogs showing real shoreline/park/town-center footage |

We are **not** targeting locals of 10+ years, tourists on a weekend trip, or home buyers looking for active listings. Those audiences would pull the content in the wrong direction.

## 4. Brand & voice

**Voice:** Warm, local, specific. "The coffee at [place] is where we end up on Saturday mornings" beats "Great cafes in Cornelius." Avoid realtor-speak ("highly sought-after community"), chamber-of-commerce gloss, and listicle energy.

**Visual direction:** Editorial-magazine meets lakeside calm. Lots of whitespace, high-quality still imagery, serif display type + clean sans-serif body, very restrained motion. See `DESIGN-SYSTEM.md` for tokens.

**What we avoid:** video auto-play on mobile, gated content, pop-ups, real-estate-adjacent claims that could require NC licensure.

## 5. Core pages (MVP)

In priority order. P1 = ships in Phase 1; P2 = ships in Phase 2 only if justified.

### P1 — Homepage (`/`)
- Still-image hero with a subtle Ken Burns or parallax. Overlay headline + subhead + one primary CTA ("Watch the latest video").
- "Latest videos" section: 6 most recent in a uniform 16:9 grid, each a link to its own video page (no modals).
- Four quick-nav cards: Neighborhoods, Where to Eat, Events, Why Move Here.
- A short "What newcomers say" block — static quotes for MVP, no submission form.
- Footer: nav, social links, newsletter placeholder (live embed or "coming soon").

### P1 — Video index (`/videos`)
- Uniform 16:9 grid (not masonry).
- Filters: Category, Location tag. Sort: Newest / Most watched.
- Each card: thumbnail from YouTube (`img.youtube.com/vi/{id}/maxresdefault.jpg` fallback `hqdefault.jpg`), title, one-line description, category pill.

### P1 — Video detail (`/videos/[slug]`)
- Lazy-loaded YouTube iframe (no autoplay).
- Title, publish date, location tag(s), 150–300 word handwritten intro (SEO-critical).
- Transcript section (collapsed by default, expandable). Sourced from YouTube auto-captions where available.
- Related videos (same category or tag).
- "Explore this neighborhood" link when tagged to a town.

### P1 — Neighborhoods index (`/neighborhoods`) + detail (`/neighborhoods/[slug]`)
- Index: 5 cards (Cornelius, Davidson, Huntersville, Mooresville, Denver) each with a hero image and a one-line pitch.
- Detail page: hero image, overview, "who it's for" paragraph, bullet list of pros, a short honest "what to know" note, embedded related videos, key spots list (parks, marinas, town centers), Google Maps embed.

### P1 — Where to Eat (`/eat`)
- One page, filterable by town and vibe (waterfront, family, casual, date-night).
- Card-per-spot: photo, name, neighborhood, one-line why-you'd-go, cuisine pill, optional embedded video clip.
- 12–25 spots at launch. Curated, not comprehensive.

### P1 — Events (`/events`)
- Upcoming list, next 8–12 curated events, each an MDX file.
- Each event: date, location, one-paragraph description, link out to the official source, related video if any.
- **No scraping for MVP.** Instead: a "See the full calendar at Visit Lake Norman →" link.

### P1 — Why Lake Norman (`/why`)
- Single long-form editorial page, not a listicle. Sections: Water, Charlotte access, outdoor life, pace. Illustrated with stills + embedded videos.

### P1 — About (`/about`)
- Host's story, why the site exists, honest limits of what we cover.

### P1 — Contact (`/contact`)
- Simple form (name / email / message) to Resend (or email forwarder). Social links. Footer disclaimer: we are not licensed real estate professionals.

### P2 — Admin dashboard
Explicitly deferred. See `TRD.md` for the P1 content workflow (git-based) that replaces it.

### P2 — Events automation
Deferred until (a) Visit Lake Norman sanctions a data source or (b) manual curation proves genuinely painful.

## 6. Non-functional requirements

- **Performance:** Lighthouse Performance ≥ 90 on mobile for Home, Video index, Video detail. LCP ≤ 2.5s on 4G mobile. No layout shift on hero or video cards.
- **Accessibility:** WCAG 2.1 AA. Keyboard-navigable filters, focus states on every interactive element, alt text on every image, captions/transcripts on every video page.
- **SEO:** Per-page metadata, Open Graph with real imagery, sitemap.xml, robots.txt, structured data (`Article` for video pages, `Place` for neighborhoods, `Restaurant` for eat entries, `Event` for events).
- **Responsive:** Mobile-first. All hero images art-directed with mobile/desktop variants.
- **Analytics:** Vercel Analytics from day 1. Google Search Console verified at launch.
- **Security:** Contact form rate-limited, inputs validated (Zod), no user-generated content stored.
- **Content rights:** Only imagery the Host owns or has licensed (Unsplash/Pexels with source file notes). Documented in `docs/CONTENT-SCHEMA.md`.

## 7. Content plan at launch

| Content type | Minimum at launch | Who produces |
|---|---|---|
| Videos | 8 (at least 1 per category) | Host |
| Neighborhoods | All 5 | Host + Marc |
| Eat | 12 | Host |
| Events | 8 upcoming | Host |
| Why-LKN long-form | 1 | Host |
| About page | 1 | Host |

Below these minimums, the site feels empty. The build can finish before content reaches these numbers, but public launch should not.

## 8. Explicit non-goals (MVP)

- No user accounts, comments, or forum.
- No property listings or IDX integration.
- No real-time event feed.
- No multi-author workflow.
- No ecommerce.
- No newsletter-driven paywalls.

## 9. Open questions

Tracked in `PRD-REVIEW.md § Open Questions`. These must be resolved before Phase 2 but can be parked during Phase 1.
