# WhatsHappeningLKN

A calm, video-first editorial guide to moving to Lake Norman, NC.

This repo is a monorepo-ish layout: `docs/` is the spec, `ui-ux-pro-max-skill-main/` is the vendored design-intelligence skill, and `app/` is the Next.js project.

## Quick start

```bash
cd app
pnpm install
pnpm dev           # http://localhost:3000
```

## Common tasks

From `app/`:

```bash
pnpm dev                         # dev server (Turbopack)
pnpm build                       # prod build (runs prebuild transcripts + Zod validation)
pnpm start                       # serve the prod build locally
pnpm lint                        # eslint
pnpm typecheck                   # tsc --noEmit
pnpm verify:content              # Zod + cross-ref + image-manifest integrity
pnpm ingest-youtube <url>        # scaffold src/content/videos/<slug>.mdx from a YouTube URL
pnpm build-transcripts           # fetch + cache captions for every video (FORCE=1 to re-fetch)
```

Adding a new video, step-by-step:

```bash
cd app
pnpm ingest-youtube "https://www.youtube.com/watch?v=<id>"
# edit the generated src/content/videos/<slug>.mdx:
#   - description (≥10 chars)
#   - category and locationTags
#   - Intro section (150–300 words, first person)
pnpm build-transcripts    # captures captions into src/content/videos/.transcripts/
pnpm build                # confirm the new page compiles
git add src/content/videos/<slug>.mdx src/content/videos/.transcripts/<slug>.txt
git commit -m "Add video: <title>"
git push
```

Vercel redeploys automatically in ~60s.

## Repo layout

```
WhatsHappeningLKN/
├── CLAUDE.md                        # operating instructions for Claude Code
├── README.md                        # this file
├── docs/                            # product + tech + design spec (authoritative)
├── ui-ux-pro-max-skill-main/        # vendored design-intelligence skill
└── app/                             # Next.js project root
    ├── src/
    │   ├── app/                     # App Router routes
    │   ├── components/              # UI components (each cites ui-ux-pro-max)
    │   ├── content/                 # MDX source for videos/neighborhoods/eat/events
    │   ├── lib/                     # content.ts, youtube.ts, schema.ts, site-config.ts
    │   └── styles/tokens.css        # editorial tokens
    ├── public/images/               # imagery manifested in src/content/_image-manifest.json
    └── scripts/
        ├── ingest-youtube.ts
        ├── build-transcripts.ts
        ├── verify-content.ts
        └── generate-placeholder-images.ts
```

## Launch smoke test

Copy this into every launch-related PR description. Every box must be green before merging to `main`.

- [ ] `pnpm lint && pnpm typecheck && pnpm build` green on CI
- [ ] `pnpm verify:content` green (cross-refs + image manifest)
- [ ] Home → primary CTA opens the latest video page; embed plays on click
- [ ] `/videos` filters: each category pill shows the right cards; each town pill does too; sort selector reorders
- [ ] `/videos/<slug>`: embed, handwritten intro, transcript (either real captions or the placeholder), related videos
- [ ] `/neighborhoods/<slug>`: hero image, overview with drop-cap, Who-it's-for + What-to-know, key spots, Google Maps iframe loads, related videos
- [ ] `/eat`: town × vibe filter combinations all surface ≥1 card or a helpful empty state
- [ ] `/events`: only upcoming events visible; past events filtered out; each event links to its `sourceUrl` in a new tab
- [ ] `/contact`: valid form submits → success message inline; invalid form → errors announced via `role="alert"`
- [ ] `/not-found` (hit any wrong URL) renders the branded 404
- [ ] No console errors on any page
- [ ] Lighthouse mobile ≥ 90 on `/`, `/videos`, `/videos/<slug>`, `/neighborhoods/<slug>`, `/eat`
- [ ] OG image for a video page passes [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] JSON-LD passes [Google Rich Results test](https://search.google.com/test/rich-results) for one page per type: VideoObject+Article, Place, Restaurant, Event
- [ ] Analytics + Speed Insights reporting in the Vercel dashboard for 24h
- [ ] Google Search Console: sitemap submitted, ownership verified
- [ ] Custom domain attached; HTTPS; `trailingSlash: false`

## Env vars (Vercel only — never commit secrets)

See `app/.env.example` for the canonical list. Production requires:

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute origin — drives canonicals, OG URLs, sitemap. |
| `RESEND_API_KEY` | Resend API key for contact form dispatch. Absent → contact route returns 202 "pending configuration". |
| `CONTACT_TO_EMAIL` | Destination address for contact-form submissions. |
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL` | Optional; unlocks the subscribe link on `/videos` empty state and footer. |
| `NEXT_PUBLIC_NEWSLETTER_STATE` | `coming-soon` (default) or `live`. Flip to `live` when a provider is wired (Phase 1.5). |
| `REVALIDATE_SECRET` | Optional. Enables `POST /api/revalidate?secret=...&path=...` for on-demand ISR busting. |

## Phases

Build is structured per `docs/BUILD-PLAN.md`. Phases 1–4 ship the Phase-1 MVP of the PRD. Phase 5 is ongoing iteration. See `docs/BUILD-PLAN.md` for DoDs and phase-2+ triggers.

## License

All rights reserved — Host photography and original editorial content are not licensed for reuse. Third-party imagery attribution lives in `app/src/content/_image-manifest.json`.
