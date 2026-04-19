/**
 * Content loader — WhatsHappeningLKN
 *
 * Globs MDX files in src/content/*, parses frontmatter with gray-matter,
 * validates with Zod, caches per-request via React cache(), and exposes
 * typed collections.
 *
 * Spec: docs/CONTENT-SCHEMA.md (authoritative), docs/TRD.md §4.
 *
 * A malformed frontmatter fails the build (schema.parse throws).
 */

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

// Enums mirror CONTENT-SCHEMA.md §2
export const CategoryEnum = z.enum([
  "neighborhoods",
  "dining",
  "events",
  "lifestyle",
  "activities",
]);
export type Category = z.infer<typeof CategoryEnum>;

export const TownEnum = z.enum([
  "Cornelius",
  "Davidson",
  "Huntersville",
  "Mooresville",
  "Denver",
  "Other",
]);
export type Town = z.infer<typeof TownEnum>;

export const VibeEnum = z.enum([
  "waterfront",
  "family",
  "casual",
  "date-night",
  "quick-bite",
  "special-occasion",
]);
export type Vibe = z.infer<typeof VibeEnum>;

export const EventCategoryEnum = z.enum([
  "Festival",
  "Market",
  "Outdoor",
  "Family",
  "Music",
  "Food",
  "Other",
]);
export type EventCategory = z.infer<typeof EventCategoryEnum>;

export const PriceRangeEnum = z.enum(["$", "$$", "$$$", "$$$$"]);

// ISO date: YYYY-MM-DD or full ISO-8601
const isoDate = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/,
    "Expected YYYY-MM-DD or full ISO date",
  );

const slugShape = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase-hyphenated");

// Videos — CONTENT-SCHEMA.md §3
export const VideoFrontmatterSchema = z.object({
  title: z.string().min(3),
  slug: slugShape,
  youtubeUrl: z.string().url(),
  youtubeId: z.string().min(8),
  description: z.string().min(10),
  category: CategoryEnum,
  locationTags: z.array(TownEnum).default([]),
  publishedAt: isoDate,
  updatedAt: isoDate.nullable().optional(),
  featured: z.boolean().default(false),
  thumbnailOverride: z.string().nullable().optional(),
  durationSeconds: z.number().int().positive().nullable().optional(),
  relatedVideoSlugs: z.array(z.string()).default([]),
  relatedNeighborhoodSlugs: z.array(z.string()).default([]),
  ogImage: z.string().nullable().optional(),
});
export type VideoFrontmatter = z.infer<typeof VideoFrontmatterSchema>;
export type Video = VideoFrontmatter & { body: string; filepath: string };

// Neighborhoods — CONTENT-SCHEMA.md §4
const HeroImage = z.object({
  mobile: z.string().startsWith("/"),
  desktop: z.string().startsWith("/"),
  alt: z.string().min(3),
});
const KeySpot = z.object({
  name: z.string(),
  kind: z.string(),
  why: z.string(),
});
export const NeighborhoodFrontmatterSchema = z.object({
  name: z.string(),
  slug: slugShape,
  tagline: z.string().min(5),
  heroImage: HeroImage,
  whoItsFor: z.array(z.string()).default([]),
  prosForNewcomers: z.array(z.string()).default([]),
  whatToKnow: z.array(z.string()).default([]),
  commuteToCharlotte: z.string().nullable().optional(),
  schools: z.string().nullable().optional(),
  keySpots: z.array(KeySpot).default([]),
  mapEmbedQuery: z.string().nullable().optional(),
  relatedVideoSlugs: z.array(z.string()).default([]),
  updatedAt: isoDate.nullable().optional(),
});
export type NeighborhoodFrontmatter = z.infer<
  typeof NeighborhoodFrontmatterSchema
>;
export type Neighborhood = NeighborhoodFrontmatter & {
  body: string;
  filepath: string;
};

// Eat spots — CONTENT-SCHEMA.md §5
export const EatSpotFrontmatterSchema = z.object({
  name: z.string(),
  slug: slugShape,
  town: TownEnum,
  vibes: z.array(VibeEnum).default([]),
  cuisine: z.string(),
  shortPitch: z.string().min(10),
  photo: z.string().startsWith("/"),
  photoAlt: z.string().min(3),
  address: z.string(),
  website: z.string().url().nullable().optional(),
  priceRange: PriceRangeEnum,
  reservationsRecommended: z.boolean().default(false),
  relatedVideoSlug: z.string().nullable().optional(),
  updatedAt: isoDate.nullable().optional(),
});
export type EatSpotFrontmatter = z.infer<typeof EatSpotFrontmatterSchema>;
export type EatSpot = EatSpotFrontmatter & { body: string; filepath: string };

// Events — CONTENT-SCHEMA.md §6
export const EventFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string().min(3),
  date: isoDate,
  endDate: isoDate.nullable().optional(),
  timeStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Expected HH:MM")
    .nullable()
    .optional(),
  timeEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Expected HH:MM")
    .nullable()
    .optional(),
  location: z.string(),
  address: z.string(),
  town: TownEnum,
  category: EventCategoryEnum,
  description: z.string().min(10),
  sourceUrl: z.string().url(),
  importedFrom: z.string().nullable().optional(),
  relatedVideoSlug: z.string().nullable().optional(),
});
export type EventFrontmatter = z.infer<typeof EventFrontmatterSchema>;
export type EventItem = EventFrontmatter & { body: string; filepath: string };

// ---------- Loaders ----------

function listMdxFiles(subdir: string): string[] {
  const dir = path.join(CONTENT_ROOT, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => path.join(dir, f))
    .sort();
}

function parseMdx(filepath: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const raw = fs.readFileSync(filepath, "utf8");
  const parsed = matter(raw);
  return { data: parsed.data as Record<string, unknown>, content: parsed.content };
}

function explainZodError(filepath: string, err: unknown): never {
  if (err instanceof z.ZodError) {
    const lines = err.issues.map(
      (i) => `  • ${i.path.join(".") || "<root>"}: ${i.message}`,
    );
    throw new Error(
      `[content] ${path.relative(process.cwd(), filepath)} failed validation:\n${lines.join("\n")}`,
    );
  }
  throw err;
}

export const getAllVideos = cache((): Video[] => {
  const items: Video[] = [];
  const seen = new Set<string>();
  for (const filepath of listMdxFiles("videos")) {
    const { data, content } = parseMdx(filepath);
    let fm: VideoFrontmatter;
    try {
      fm = VideoFrontmatterSchema.parse(data);
    } catch (e) {
      explainZodError(filepath, e);
    }
    const baseName = path.basename(filepath, ".mdx");
    if (fm.slug !== baseName) {
      throw new Error(
        `[content] ${filepath}: frontmatter slug "${fm.slug}" does not match filename "${baseName}"`,
      );
    }
    if (seen.has(fm.slug)) {
      throw new Error(`[content] Duplicate video slug: ${fm.slug}`);
    }
    seen.add(fm.slug);
    items.push({ ...fm, body: content, filepath });
  }
  items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return items;
});

export function getVideoBySlug(slug: string): Video | null {
  return getAllVideos().find((v) => v.slug === slug) ?? null;
}

export const getAllNeighborhoods = cache((): Neighborhood[] => {
  const items: Neighborhood[] = [];
  const seen = new Set<string>();
  for (const filepath of listMdxFiles("neighborhoods")) {
    const { data, content } = parseMdx(filepath);
    let fm: NeighborhoodFrontmatter;
    try {
      fm = NeighborhoodFrontmatterSchema.parse(data);
    } catch (e) {
      explainZodError(filepath, e);
    }
    const baseName = path.basename(filepath, ".mdx");
    if (fm.slug !== baseName) {
      throw new Error(
        `[content] ${filepath}: slug "${fm.slug}" != filename "${baseName}"`,
      );
    }
    if (seen.has(fm.slug)) {
      throw new Error(`[content] Duplicate neighborhood slug: ${fm.slug}`);
    }
    seen.add(fm.slug);
    items.push({ ...fm, body: content, filepath });
  }
  return items;
});

export function getNeighborhoodBySlug(slug: string): Neighborhood | null {
  return getAllNeighborhoods().find((n) => n.slug === slug) ?? null;
}

export const getAllEatSpots = cache((): EatSpot[] => {
  const items: EatSpot[] = [];
  const seen = new Set<string>();
  for (const filepath of listMdxFiles("eat")) {
    const { data, content } = parseMdx(filepath);
    let fm: EatSpotFrontmatter;
    try {
      fm = EatSpotFrontmatterSchema.parse(data);
    } catch (e) {
      explainZodError(filepath, e);
    }
    const baseName = path.basename(filepath, ".mdx");
    if (fm.slug !== baseName) {
      throw new Error(
        `[content] ${filepath}: slug "${fm.slug}" != filename "${baseName}"`,
      );
    }
    if (seen.has(fm.slug)) {
      throw new Error(`[content] Duplicate eat slug: ${fm.slug}`);
    }
    seen.add(fm.slug);
    items.push({ ...fm, body: content, filepath });
  }
  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
});

export function getEatSpotBySlug(slug: string): EatSpot | null {
  return getAllEatSpots().find((e) => e.slug === slug) ?? null;
}

export const getAllEvents = cache((): EventItem[] => {
  const items: EventItem[] = [];
  const seen = new Set<string>();
  for (const filepath of listMdxFiles("events")) {
    const { data, content } = parseMdx(filepath);
    let fm: EventFrontmatter;
    try {
      fm = EventFrontmatterSchema.parse(data);
    } catch (e) {
      explainZodError(filepath, e);
    }
    if (seen.has(fm.slug)) {
      throw new Error(`[content] Duplicate event slug: ${fm.slug}`);
    }
    seen.add(fm.slug);
    items.push({ ...fm, body: content, filepath });
  }
  items.sort((a, b) => (a.date < b.date ? -1 : 1));
  return items;
});

export function getUpcomingEvents(now: Date = new Date()): EventItem[] {
  const todayIso = now.toISOString().slice(0, 10);
  return getAllEvents().filter((e) => (e.endDate ?? e.date) >= todayIso);
}

// Transcript loader — reads src/content/videos/.transcripts/<slug>.txt.
// Returns null if missing or the captions-unavailable marker is present.
export function getTranscript(slug: string): string | null {
  const p = path.join(
    CONTENT_ROOT,
    "videos",
    ".transcripts",
    `${slug}.txt`,
  );
  if (!fs.existsSync(p)) return null;
  const text = fs.readFileSync(p, "utf8").trim();
  if (!text || text.startsWith("# no-captions-available")) return null;
  return text;
}

// Cross-reference integrity — invoked by scripts/verify-content.ts
export function verifyCrossReferences():
  | { ok: true }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const videoSlugs = new Set(getAllVideos().map((v) => v.slug));
  const neighborhoodSlugs = new Set(
    getAllNeighborhoods().map((n) => n.slug),
  );

  for (const v of getAllVideos()) {
    for (const s of v.relatedVideoSlugs) {
      if (!videoSlugs.has(s))
        errors.push(
          `Video "${v.slug}" relatedVideoSlugs points to missing video "${s}"`,
        );
    }
    for (const s of v.relatedNeighborhoodSlugs) {
      if (!neighborhoodSlugs.has(s))
        errors.push(
          `Video "${v.slug}" relatedNeighborhoodSlugs points to missing neighborhood "${s}"`,
        );
    }
  }
  for (const n of getAllNeighborhoods()) {
    for (const s of n.relatedVideoSlugs) {
      if (!videoSlugs.has(s))
        errors.push(
          `Neighborhood "${n.slug}" relatedVideoSlugs points to missing video "${s}"`,
        );
    }
  }
  for (const e of getAllEatSpots()) {
    if (e.relatedVideoSlug && !videoSlugs.has(e.relatedVideoSlug))
      errors.push(
        `EatSpot "${e.slug}" relatedVideoSlug points to missing video "${e.relatedVideoSlug}"`,
      );
  }
  for (const ev of getAllEvents()) {
    if (ev.relatedVideoSlug && !videoSlugs.has(ev.relatedVideoSlug))
      errors.push(
        `Event "${ev.slug}" relatedVideoSlug points to missing video "${ev.relatedVideoSlug}"`,
      );
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
