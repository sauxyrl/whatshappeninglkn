# PRD Review — WhatsHappeningLKN

Reviewer: Claude (architect role)
Date: 2026-04-18
Reviewing: `docs/PRD.md` (v2) against the original PRD provided by the creator

---

## 1. Verdict

The revised PRD is **ready to build against** for Phase 1. It cuts roughly 70% of the original technical surface area while preserving 100% of the user-facing experience. The cuts are concentrated on infrastructure that would not have earned its keep at the site's actual scale (~50 videos, 5 neighborhoods, one editor).

## 2. Deltas from the original PRD

| Area | Original PRD | Revised PRD | Reason |
|---|---|---|---|
| Data layer | Postgres + Drizzle or Prisma | MDX files in repo | Dataset size does not justify a DB; MDX keeps build simple and deploys atomic |
| Auth | Clerk (paid, multi-user SaaS) | None in Phase 1 (git-based editing) | Single-admin workflow doesn't need auth; Clerk adds recurring cost and a dependency |
| CMS | Optional Sanity in addition to DB | Deferred to Phase 1.5 if git editing annoys the Host | Avoids two content surfaces in one product |
| Events | RSS scrape from VisitLakeNorman.org via cron | Curated MDX + link-out to VisitLakeNorman | Unverified source, brittle, potential ToS/legal risk |
| Video thumbnails | YouTube Data API v3 with quota mgmt | YouTube oEmbed (no key, no quota) for titles; direct CDN URL for thumbnails | Free, no quota, simpler |
| Hero | "Slow video background" | Still image with subtle motion, respects `prefers-reduced-motion` | Video bg conflicts with Lighthouse ≥90 goal |
| Video grid | Masonry | Uniform 16:9 grid | YouTube thumbs are 16:9; masonry is unnecessary complexity |
| Video pages | Modal OR dedicated page | Dedicated page only (one canonical URL) | SEO clarity; video pages need real text content to rank |
| Transcripts | "Transcript snippet" mentioned once | First-class: every video page has transcript + 150–300 word human intro | SEO lever for the #1 success metric |
| Admin dashboard | Full dashboard with forms, Clerk-protected | Deferred to Phase 2 | Git-based content editing makes the dashboard unnecessary at current scale |
| Analytics | Phase 2 | Phase 1 (Vercel Analytics + Search Console) | Can't measure the top success metric without them |
| Scope additions | — | Explicit disclaimer re: real-estate licensure, content-rights documentation | NC licensing edges; image rights legal hygiene |

## 3. Assumptions this PRD makes

These are load-bearing. If any turn out wrong, revisit the affected section.

1. **The Host will commit content in git** (via GitHub's mobile UI or a simple repo workflow Marc sets up). If she outright refuses, we skip to the Sanity option in Phase 1.5 rather than building a custom dashboard.
2. **YouTube remains the video host.** All thumbnails, embeds, and captions flow from YouTube URLs. If the Host later moves to Vimeo or a self-host, the content schema needs a `provider` field (easy migration).
3. **VisitLakeNorman.org does not sanction data access.** If they publish an official feed/API, events automation becomes worth doing in Phase 2.
4. **Launch content volume** per `PRD § 7` will be produced by the Host. The build completes independently, but public launch waits on minimums.
5. **Image rights** for any non-original photography will be Unsplash/Pexels license or explicitly purchased. Host confirms per image.
6. **NC real-estate licensure** is a risk, not a blocker — content stays lifestyle-voiced, footer carries a disclaimer. We are not linking to MLS, not giving pricing advice, not recommending specific properties.

## 4. Risks, ranked

### High
- **Empty-site-at-launch risk.** Design can be gorgeous; if there are 3 videos and 0 restaurants, bounce rate will be brutal. Mitigation: public-launch gate in `PRD § 7`.
- **SEO reality vs. aspiration.** "Moving to Lake Norman" is competitive. Real-estate sites outrank lifestyle content. Mitigation: focus on long-tail queries and rely on video + transcript + handwritten intro to be the on-page signal. Expect 6–12 months to see meaningful traffic.

### Medium
- **Image pipeline discipline.** Art-directed responsive hero images are easy to ship badly (huge files, layout shift). Mitigation: `next/image` with explicit `sizes`, documented in TRD.
- **Content-editing UX.** MDX-in-git is fine for Marc, maybe awkward for the Host. Mitigation: single-file-per-video template, GitHub mobile commits, fallback to Sanity if friction is real.
- **Accessibility regression.** Serif display type + fullbleed imagery can hurt contrast. Mitigation: DESIGN-SYSTEM.md enforces AA contrast tokens.

### Low
- **Analytics privacy.** Vercel Analytics is privacy-safe (no cookies) for EU/CCPA. No additional work needed.
- **Contact form abuse.** Rate limit + basic honeypot is enough at this traffic level.

## 5. Open questions (must answer before Phase 2; can park during Phase 1)

1. Who owns the social accounts and newsletter list (the Host personally, or a business entity)? Affects where we send form submissions and what privacy policy we publish.
2. Domain decision — `whatshappeninglkn.com`? Registered, DNS plan?
3. Newsletter provider — Beehiiv, ConvertKit, Substack, none? Needed by end of Phase 1 if we ship a live signup instead of the "coming soon" placeholder.
4. YouTube channel URL (needed for channel-level embed + cross-linking).
5. Is there a logo/wordmark, or do we typeset the name in the display font?
6. Any partnerships/advertisers already in motion? Affects whether we need a `/partners` surface in Phase 2.
7. Content cadence — does the Host publish weekly, biweekly, monthly? Drives sitemap refresh strategy and whether we add `<lastmod>` automation.

## 6. Recommendations accepted into the PRD

- Drop Postgres/Clerk from MVP. ✅
- Single canonical URL per video (no modal). ✅
- Transcripts as a first-class component, not a snippet. ✅
- Events as curated MDX in Phase 1, link-out to Visit LKN. ✅
- Analytics on day one. ✅
- Public-launch content minimums. ✅

## 7. Recommendations deferred (not rejected)

- **Dark mode.** Nice-to-have; adds token maintenance cost; revisit Phase 2.
- **PDF "Newcomer Checklist" lead magnet.** Good idea once newsletter provider is chosen.
- **Comments/community.** Requires moderation; only consider once organic traffic justifies it.
- **Dedicated /partners or /sponsors page.** Only if real partnerships emerge.

## 8. Approval

Before moving into `TRD.md`, Marc should sanity-check:

- [ ] Success metrics in `PRD § 2` match his expectations.
- [ ] Launch content minimums in `PRD § 7` are realistic for the Host's pace.
- [ ] Non-goals in `PRD § 8` don't accidentally exclude something he wanted.

If all three are yes, the TRD and Build Plan become the working contract for Claude Code.
