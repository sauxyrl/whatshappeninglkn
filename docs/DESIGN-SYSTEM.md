# Design System — WhatsHappeningLKN

Authoritative visual spec for the MVP. Every choice below has been cross-checked against the ui-ux-pro-max skill (see citations). Any deviation must cite a new ui-ux-pro-max query result.

Paired with: `TRD.md § 16`, `PRD.md § 4`.

---

## 1. Baseline selections (from ui-ux-pro-max)

These are the defaults Claude Code must honor unless a specific case calls for something else.

| Area | Selection | ui-ux-pro-max source |
|---|---|---|
| Overall style | **Editorial Grid / Magazine** with restrained motion | `styles.csv → Editorial Grid / Magazine` (Performance ⚡ Excellent, A11y WCAG AAA) |
| Landing pattern | **Video-First Hero** (still image + subtle motion, NOT autoplay video) | `landing.csv → Video-First Hero`, modified per `TRD § 8` to use still imagery |
| Typography | **Magazine Style** — Libre Bodoni (display) + Public Sans (UI/body) | `typography.csv → Magazine Style` |
| Grid | 12-col, 8px base unit (Swiss Modernism 2.0 discipline) | `styles.csv → Swiss Modernism 2.0` |
| Video sustainability | Click-to-play, `preload="none"`, `playsInline muted` | `ux-guidelines.csv → Auto-Play Video (Severity: Medium)` |
| Content truncation | `line-clamp-2` with expand pattern for descriptions | `ux-guidelines.csv → Truncation` |
| Next.js hero image | `priority` on homepage hero only | `stacks/nextjs.csv → Use priority for LCP images` |
| Next.js CLS | `aspect-video` containers on all thumbnails and embeds | `stacks/nextjs.csv → Avoid layout shifts` |
| OG images | Per-route `opengraph-image.tsx` where feasible | `stacks/nextjs.csv → Include OpenGraph images` |

## 2. Color tokens

Palette keeps the Host's lake-blue + sage-green brief but hardens to AA contrast. Values live in `src/styles/tokens.css` as CSS variables and are echoed into Tailwind config.

```css
:root {
  /* Brand */
  --lkn-deep:      #0A3D62;   /* Deep Lake — headings, primary actions */
  --lkn-accent:    #1E90FF;   /* Dodger Blue accent — links, active state */
  --lkn-sage:      #3F6248;   /* Muted sage — secondary accents, tags (AA on paper AND paper-alt) */
  --lkn-forest:    #1F4A2A;   /* Forest — rare, high-emphasis dark */

  /* Neutrals (warm, paper-leaning per editorial-magazine style) */
  --paper:         #FDFBF7;   /* Warm off-white page background */
  --paper-alt:     #F5F2EC;   /* Card backgrounds, alternating sections */
  --ink:           #1A1A1A;   /* Body text */
  --ink-soft:      #3B3B3B;   /* Secondary text */
  --muted:         #6B6B6B;   /* Captions, metadata */
  --rule:          #E4DED3;   /* Hairline dividers */

  /* Semantic */
  --focus:         #1E90FF;   /* Ring color — 2px offset */
  --error:         #B42318;
  --success:       #1F4A2A;
}

/* Contrast verification (WCAG AA, text on background) */
/* #1A1A1A on #FDFBF7 → 15.9:1  ✓ AAA */
/* #0A3D62 on #FDFBF7 → 11.1:1  ✓ AAA */
/* #3F6248 on #FDFBF7 →  6.6:1  ✓ AA  */
/* #3F6248 on #F5F2EC →  6.2:1  ✓ AA  (paper-alt bg, e.g., cards inside alt sections) */
/* #1E90FF on #FDFBF7 →  3.8:1  ⚠ AA large-text only — use for ≥18px or bold ≥14px */
```

**Rules:**
- Body text is always `--ink` on `--paper` or `--paper-alt`. Never `--lkn-accent` at body size.
- `--lkn-accent` is reserved for interactive affordances (link underline, hover, focus ring) and is only AA for large text — enforce size constraint.
- `--lkn-sage` is for pills/tags and subdued decorative marks.
- Destructive state uses `--error`; success uses `--success`. Do not repurpose brand greens for success in forms — they're too muted for confirmation UX.

## 3. Typography

Per `typography.csv → Magazine Style`.

```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');
```

```ts
// tailwind.config.ts fontFamily
{
  serif: ['Libre Bodoni', 'Georgia', 'serif'],        // display / headings
  sans:  ['Public Sans', 'system-ui', 'sans-serif'],  // UI / body
}
```

**Scale (mobile → desktop via `clamp`):**

| Token | Mobile → Desktop | Usage |
|---|---|---|
| `text-display` | `clamp(2.5rem, 6vw, 4.5rem)` | Hero headline (serif, 600 weight, tracking-tight) |
| `text-h1` | `clamp(2rem, 4vw, 3rem)` | Page titles |
| `text-h2` | `clamp(1.5rem, 2.8vw, 2rem)` | Section headers |
| `text-h3` | `clamp(1.25rem, 2vw, 1.5rem)` | Card titles |
| `text-body` | `1rem` (line-height 1.65) | Body |
| `text-small` | `0.875rem` | Captions, meta |
| `text-eyebrow` | `0.75rem` uppercase tracking-widest | Category labels |

**Rules:**
- Headings = serif. Body + UI = sans.
- Long-form MDX content (video intros, neighborhood overviews, why-LKN page) uses **serif body** at 1.0625rem line-height 1.75 for editorial feel. Everything else uses sans.
- No italicized serif bodies longer than a pull quote.

## 4. Spacing & grid

- Base unit: **8px** (`--space-1 = 0.5rem`, scale in multiples).
- Page gutter: 24px mobile, 48px ≥ md, 96px ≥ xl.
- Section rhythm: vertical padding `py-16 md:py-24 lg:py-32`.
- Max content width: `max-w-6xl` for standard sections; `max-w-prose` for long-form text.
- Grid for video index: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `gap-6 md:gap-8`.

## 5. Motion

Per `TRD § 8`. Global rules restated here for convenience:

- Durations: `--duration-fast: 150ms`, `--duration-med: 300ms`, `--duration-slow: 600ms`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (gentle ease-out) for reveals; `ease-in-out` for hover states.
- Hero: parallax `y` range `0 → -30px` over first 600px of scroll, desktop only, disabled under `prefers-reduced-motion`.
- Cards: `hover:-translate-y-0.5 hover:shadow-md` with `transition-[transform,box-shadow] duration-200`.
- Page transitions: simple fade-in on mount (200ms). No route-level animations.
- **Forbidden:** carousel auto-advance, scroll-jacking, parallax on mobile, auto-play video, loading spinners for content that can be skeleton'd.

## 6. Component conventions

All built on shadcn/ui primitives where available. Each component file begins with a top-of-file comment that cites the ui-ux-pro-max query that informed it. Example:

```tsx
// VideoCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine"
// ui-ux-pro-max: ux-guidelines.csv "Truncation" (line-clamp-2 description)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-video container)
```

### VideoCard

- `aspect-video` container wraps `next/image` thumbnail with explicit width/height.
- Thumbnail URL: `https://img.youtube.com/vi/{id}/maxresdefault.jpg` with `onError` fallback to `hqdefault.jpg`.
- Overlay play icon (lucide `Play`) appears on hover desktop, always visible on mobile.
- Title: `text-h3` serif, 2-line clamp.
- Description: `text-small` sans, 2-line clamp.
- Category: eyebrow-style pill, sage background, ink foreground.
- Entire card is a single `<Link>` — no nested interactive elements.

### VideoEmbed

- Wrap in `aspect-video` div; iframe `loading="lazy"` with `title` attr.
- **No autoplay.** `src` omits `autoplay` param; playsInline muted only applies if the user clicks play and we swap in a native `<video>` (not needed for YouTube embeds).

### Filter UI (video index, eat index)

- Filter pills: buttons, not divs. `aria-pressed` toggles.
- Active pill: `bg-lkn-sage text-paper`; inactive: `bg-transparent border-rule text-ink-soft`.
- Sort: native `<select>` for mobile, custom shadcn `<Select>` for desktop (same accessible API).
- Filtering happens client-side on a pre-serialized JSON of all items (no network on filter).

### Transcript

- Collapsible `<details>` element with a styled `<summary>`.
- Collapsed by default on mobile; expanded by default on desktop (editorial "readable" feel, per Editorial Grid style). Controlled by the `open` attribute via a media query boot check.
- Text block is serif, `max-w-prose`, selectable.

### Newsletter signup (placeholder-safe)

- Renders two states depending on `NEXT_PUBLIC_NEWSLETTER_STATE`: `coming-soon` (static, no form) or `live` (provider embed or API call).
- Never render a form that doesn't go anywhere. The coming-soon state says exactly that.

## 7. Iconography

- `lucide-react` only. One icon set, no mixing.
- Icons always paired with a label unless the control is literally "play" on a video thumbnail.
- Stroke width: `2`. Size: inherit from text-size context.

## 8. Imagery direction

- Lake Norman specific. No stock photos of generic "lakes" or "families moving" — kills trust.
- Prefer: golden-hour shoreline, main-street storefronts with real signage, community gatherings, parks with actual visitors.
- Avoid: drone shots without a human anchor, empty restaurant interiors, overly color-graded travel-influencer looks.
- Every image gets alt text that names the *place*, not the *scene type*. "Main Street Davidson at dusk" beats "A charming downtown street."

## 9. Accessibility defaults baked into the system

- All text meets AA at the configured pairings.
- Focus ring: `outline-none ring-2 ring-focus ring-offset-2 ring-offset-paper` applied globally to `:focus-visible`.
- Skip link in `layout.tsx` jumps to `#main`.
- Decorative imagery gets `alt=""` and `aria-hidden="true"` on the wrapper.
- All interactive cards have a real `<a>` or `<button>`; no click-on-div.

## 10. When to re-query ui-ux-pro-max

Whenever adding a new page type, a new component that doesn't exist here, or a new visual pattern (e.g., testimonial carousel, data viz, pricing table), run:

```bash
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|ux|landing> -n 3
python3 ui-ux-pro-max-skill-main/src/ui-ux-pro-max/scripts/search.py "<query>" --stack nextjs -n 3
```

Record the chosen result in the component's header comment per `§ 6`. This keeps the design system live and auditable rather than drifting.
