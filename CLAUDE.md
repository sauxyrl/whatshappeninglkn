# CLAUDE.md — WhatsHappeningLKN

You are Claude Code working on **WhatsHappeningLKN**, a video-first editorial web guide for Lake Norman, NC. Single-creator content, Next.js 15, MDX, Vercel.

Read this file first. Then read the docs it points to before writing any code.

---

## 1. Required reading order

Read these, in order, before every substantive task:

1. `docs/PRD.md` — what we're building and why (product scope, success metrics, non-goals).
2. `docs/TRD.md` — how we're building it (stack, repo layout, routing, SEO, perf budget). **Authoritative for tech decisions.**
3. `docs/CONTENT-SCHEMA.md` — MDX frontmatter and content rules.
4. `docs/DESIGN-SYSTEM.md` — tokens, typography, components, motion.
5. `docs/BUILD-PLAN.md` — phase-by-phase execution plan with DoDs. **Follow phases in order. Do not leap ahead.**
6. `docs/PRD-REVIEW.md` (context only) — why the stack is leaner than the original PRD. Read if you feel tempted to "add back" Postgres, Clerk, or Sanity.

Conflict resolution:
- Product scope → PRD.md wins.
- Technical decisions → TRD.md wins.
- Visual decisions → DESIGN-SYSTEM.md wins (and must cite ui-ux-pro-max).

## 2. ui-ux-pro-max is required, not optional

The `ui-ux-pro-max-skill-main/` folder at the workspace root is the design-intelligence source of truth. Use it.

**When to query:**
- Before designing any new page.
- Before creating any new component that isn't already spec'd in `DESIGN-SYSTEM.md § 6`.
- Before choosing a color, typography pair, motion pattern, or layout pattern not already baked into the design system.
- Before adopting a Next.js pattern you're unsure about.

**How to query:**

```bash
# From the workspace root (where this CLAUDE.md lives):
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|ux|landing|typography|color|chart|product> -n 3

# For Next.js specific patterns:
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs -n 3
```

**How to record:** every new component file starts with a comment block citing the query and chosen result:

```tsx
// VideoCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine"
// ui-ux-pro-max: ux-guidelines.csv "Truncation" (line-clamp-2 description)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-video wrapper)
```

Deviating from `DESIGN-SYSTEM.md` baselines requires a fresh ui-ux-pro-max result as justification, recorded the same way.

## 3. Working directory

```
WhatsHappeningLKN/                  # workspace root (where this file lives)
├── CLAUDE.md                        # ← you are here
├── docs/                            # required reading (see § 1)
├── ui-ux-pro-max-skill-main/        # design intelligence — do not edit or delete
└── app/                             # Next.js project root (scaffolded in Phase 1)
```

When inside `app/`, pretend it's a normal Next.js repo. The docs and the skill live outside it on purpose.

## 4. Non-negotiable rules

Restated from TRD + BUILD-PLAN for visibility — violate any of these and revert your change.

1. **No Postgres, Clerk, or Sanity in Phase 1.** Content is MDX in `app/src/content/`. Re-read `docs/PRD-REVIEW.md § 2` if you disagree.
2. **No video autoplay.** Hero is a still image with optional subtle parallax, disabled under `prefers-reduced-motion` and on mobile.
3. **No masonry video grid.** Uniform 16:9 grid. YouTube thumbnails are 16:9; masonry adds complexity without benefit.
4. **One canonical URL per video.** `/videos/[slug]`. No modals.
5. **Every video page has a hand-written 150–300 word intro + transcript.** This is the primary SEO lever. Missing intro fails the content check.
6. **Every component cites ui-ux-pro-max** in its file header (see § 2).
7. **Accessibility failures block merge.** AA contrast, keyboard nav, focus rings, alt text, labeled inputs.
8. **Performance failures block merge.** Budgets in `docs/TRD.md § 10`.
9. **`priority` prop on exactly ONE image per route** (usually the LCP hero), not on every `next/image`.
10. **`aspect-video` container** wraps every YouTube thumbnail and embed to prevent CLS.
11. **`prefers-reduced-motion`** respected on every animation. Framer Motion `useReducedMotion()` is the standard.
12. **No secrets in the repo.** Env vars via Vercel only. `.env.example` lists the keys.
13. **Content integrity is build-time enforced.** Broken slug references, missing image manifest entries, malformed frontmatter all fail `pnpm build`.

## 5. Workflow

- Always start by running `TaskList` or TodoWrite to track the phase's work.
- Work phase-by-phase from `docs/BUILD-PLAN.md`. Do not jump ahead.
- Before writing a component, query ui-ux-pro-max and cite.
- Before closing a phase, run its DoD checklist and post results.
- Keep PRs small. One phase may be 3–6 PRs.

## 6. Common commands

From inside `app/`:

```bash
pnpm dev                 # local dev server
pnpm build               # production build (runs prebuild transcripts + content validation)
pnpm lint                # eslint
pnpm typecheck           # tsc --noEmit
pnpm verify:content      # Zod content validation + slug integrity + image manifest
pnpm ingest-youtube <url>  # scaffold a video MDX stub from a YouTube URL
pnpm build-transcripts   # re-fetch YouTube captions for all videos
```

From the workspace root:

```bash
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> -n 3
```

## 7. If you're stuck

- Spec ambiguity → propose two options in the PR description; default to the simpler one.
- ui-ux-pro-max returns nothing useful → widen the query to category keywords (e.g., "editorial magazine" → "magazine long-form content").
- Perf budget miss → open a PR comment with the Lighthouse report and fix before merge; do not merge over a red budget.
- New feature requested that isn't in the PRD → do not build it. Open an issue pointing to `docs/PRD.md § 8 Non-goals` and `docs/BUILD-PLAN.md § Phase 5 triggers`.

## 8. Tone for commits, PRs, copy

- Commits: imperative, specific ("Add VideoCard with aspect-video wrapper"), never "Update files".
- PR descriptions: what + why + DoD checklist from the relevant phase.
- Site copy: first-person, warm, specific. Not realtor-speak. Not listicle energy. See `docs/PRD.md § 4`.

---

Start by reading the docs in order. Then open `docs/BUILD-PLAN.md` and pick up Phase 1.
