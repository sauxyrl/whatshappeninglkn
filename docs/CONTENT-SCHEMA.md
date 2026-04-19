# Content Schema — WhatsHappeningLKN

Authoritative MDX frontmatter shapes and file layout. Every content file is validated at build time with Zod (see `src/lib/content.ts`). A malformed file fails the build.

Paired with: `TRD.md § 4`.

---

## 1. Directory layout

```
app/src/content/
├── videos/
│   ├── a-davidson-saturday.mdx
│   └── mooresville-boating-101.mdx
├── neighborhoods/
│   ├── cornelius.mdx
│   ├── davidson.mdx
│   ├── huntersville.mdx
│   ├── mooresville.mdx
│   └── denver.mdx
├── eat/
│   ├── kindred-restaurant.mdx
│   └── north-harbor-club.mdx
├── events/
│   └── 2026-05-03-davidson-farmers-market.mdx
└── _image-manifest.json     # image rights / source tracking
```

**Naming rules:**
- Filenames are the `slug`. Lowercase, hyphenated, no trailing extension in URLs.
- Event filenames start with `YYYY-MM-DD-` for natural sort (the frontmatter `date` is authoritative; the prefix is for humans).
- Slugs must be unique across a collection.

## 2. Shared types

```ts
// src/lib/content-types.ts
export type Category =
  | "neighborhoods"
  | "dining"
  | "events"
  | "lifestyle"
  | "activities";

export type Town =
  | "Cornelius"
  | "Davidson"
  | "Huntersville"
  | "Mooresville"
  | "Denver"
  | "Other";

export type Vibe =
  | "waterfront"
  | "family"
  | "casual"
  | "date-night"
  | "quick-bite"
  | "special-occasion";
```

## 3. Video

Path: `src/content/videos/<slug>.mdx`

```yaml
---
title: "A Saturday Morning in Davidson"
slug: a-davidson-saturday                 # must match filename (enforced)
youtubeUrl: "https://www.youtube.com/watch?v=abc123XYZ"
youtubeId: "abc123XYZ"                    # derived; include for determinism
description: "Coffee at Summit, the farmers market, and a walk by the lake."
category: "lifestyle"                     # Category enum
locationTags: ["Davidson"]                # Town[]
publishedAt: "2026-04-10"                 # ISO date
updatedAt: "2026-04-18"                   # optional; drives sitemap lastmod
featured: false
thumbnailOverride: null                   # optional; if null use maxresdefault
durationSeconds: 612                      # optional; adds to VideoObject JSON-LD
relatedVideoSlugs: ["mooresville-boating-101"]
relatedNeighborhoodSlugs: ["davidson"]
ogImage: "/og/videos/a-davidson-saturday.jpg"   # optional; falls back to YouTube thumb
---

## Intro (REQUIRED — 150–300 words)

Hand-written. This is the primary SEO surface for this page. Speak in first person.
Do NOT summarize the video literally — give context the viewer needs BEFORE watching.

## What you'll see

- 0:45 — Summit Coffee patio
- 3:20 — Davidson farmers market
- 7:10 — Lakefront walking path

## Transcript

> Auto-populated at build time from YouTube captions by `scripts/build-transcripts.ts`.
> If captions are unavailable, leave this section empty and the build will insert
> "Transcript coming soon." placeholder.
```

**Zod rules:**
- `slug` must match filename (minus `.mdx`).
- `youtubeUrl` must parse into a valid video ID; `youtubeId` must match the parsed ID.
- `category` must be one of `Category`.
- `locationTags` items must be in `Town`.
- `publishedAt` ≤ today.
- `relatedVideoSlugs` items must all exist.
- Intro section body must be ≥ 150 words (soft warning) and ≥ 50 words (hard error).

## 4. Neighborhood

Path: `src/content/neighborhoods/<slug>.mdx`

```yaml
---
name: "Davidson"
slug: davidson
tagline: "Walkable college-town charm with a quiet lake edge."
heroImage:
  mobile: "/images/neighborhoods/davidson-mobile.jpg"
  desktop: "/images/neighborhoods/davidson-desktop.jpg"
  alt: "Main Street in downtown Davidson at dusk, shop lights warm, sidewalk busy."
whoItsFor: ["young professionals", "academics", "families with older kids"]
prosForNewcomers:
  - "College-town walkability is rare in the Charlotte metro."
  - "Saturday farmers market is a built-in weekend ritual."
  - "Davidson College events are open to the public and excellent."
whatToKnow:
  - "Housing inventory is tight and older homes are charming but rarely renovated."
  - "Lake access from Davidson proper is more indirect than Cornelius."
commuteToCharlotte: "25–35 min via I-77 (heavy at rush hour)."
schools: "Public (CMS) + private + Davidson Day; strong across the board."
keySpots:
  - name: "Summit Coffee"
    kind: "Cafe"
    why: "The community's living room."
  - name: "Roosevelt Wilson Park"
    kind: "Park"
    why: "Creek trails + community events."
mapEmbedQuery: "Davidson, NC"
relatedVideoSlugs: ["a-davidson-saturday"]
updatedAt: "2026-04-18"
---

## Overview (REQUIRED — 200–400 words)

Hand-written. Speak as a neighbor, not a realtor.
```

## 5. Eat spot

Path: `src/content/eat/<slug>.mdx`

```yaml
---
name: "Kindred Restaurant"
slug: kindred-restaurant
town: "Davidson"                          # Town
vibes: ["date-night", "special-occasion"] # Vibe[]
cuisine: "New American"
shortPitch: "The restaurant locals point to when someone visits from Charlotte."
photo: "/images/eat/kindred.jpg"
photoAlt: "Warm interior of Kindred at dinner service, bread basket in focus."
address: "131 N Main St, Davidson, NC 28036"
website: "https://kindreddavidson.com"
priceRange: "$$$"                         # $, $$, $$$, $$$$
reservationsRecommended: true
relatedVideoSlug: null
updatedAt: "2026-04-18"
---

## Why newcomers love it (REQUIRED — 60–150 words)

A few specific sentences. Name a dish. Say when to go.
```

## 6. Event

Path: `src/content/events/YYYY-MM-DD-<slug>.mdx`

```yaml
---
title: "Davidson Saturday Farmers Market"
slug: davidson-farmers-market-2026-05-03  # unique
date: "2026-05-03"                        # ISO date (start)
endDate: null                             # optional for multi-day
timeStart: "09:00"                        # 24h local, optional
timeEnd: "12:00"                          # optional
location: "Davidson Town Green"
address: "216 S Main St, Davidson, NC 28036"
town: "Davidson"
category: "Market"                        # Festival | Market | Outdoor | Family | Music | Food | Other
description: "Local produce, coffee, live music, and kid-friendly energy."
sourceUrl: "https://townofdavidson.org/events"
importedFrom: null                        # string tag for later automation tracking
relatedVideoSlug: null
---
```

**Zod rules:**
- Events with `date < today` are filtered out of `/events` automatically.
- `category` enum; `town` in `Town`.
- `sourceUrl` required — every event links to its canonical source.

## 7. Image manifest

Path: `src/content/_image-manifest.json`

```json
{
  "images/neighborhoods/davidson-desktop.jpg": {
    "source": "original",
    "photographer": "The Host",
    "license": "all rights reserved",
    "captured": "2026-03-14"
  },
  "images/hero/home-desktop.jpg": {
    "source": "unsplash",
    "url": "https://unsplash.com/photos/XXXX",
    "photographer": "Jane Photographer",
    "license": "Unsplash License (free commercial)"
  }
}
```

Every image under `public/images/` must have a manifest entry, enforced by a build check. Missing entry fails the build.

## 8. Slug / cross-reference integrity

- All `relatedVideoSlugs`, `relatedNeighborhoodSlugs`, `relatedVideoSlug` values are verified at build time. A broken reference fails the build.
- Deletions: if you delete a video, a grep for its slug must return zero hits before the build passes. `pnpm verify:content` performs this check.

## 9. Ingestion helper

`scripts/ingest-youtube.ts` accepts a YouTube URL and creates a populated stub:

```
pnpm ingest-youtube https://www.youtube.com/watch?v=abc123XYZ
# → writes src/content/videos/<slug>.mdx with title/description/thumbnail prefilled via oEmbed
```

The Host (or Marc on her behalf) then edits the intro, assigns category/tags, commits.

## 10. Transcript pipeline

`scripts/build-transcripts.ts` runs at build time (or on demand):

1. For each video in `src/content/videos/`, fetch captions via `youtube-transcript` npm package using `youtubeId`.
2. Write `src/content/videos/.transcripts/<slug>.txt` (gitignored if file size becomes a concern; tracked otherwise).
3. At render time, the video page imports the transcript file. If absent → "Transcript coming soon."

This keeps transcripts deterministic, versioned with the MDX, and SEO-indexable.
