import type { MetadataRoute } from "next";
import {
  getAllEatSpots,
  getAllNeighborhoods,
  getAllVideos,
  getUpcomingEvents,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

// TRD §6 — sitemap enumerates every static route + every collection slug.
// lastmod prefers frontmatter updatedAt, falls back to publishedAt/date.

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const url = (p: string) => new URL(p, base).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: url("/videos"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/neighborhoods"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/eat"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/events"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/why"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const videoEntries = getAllVideos().map((v) => ({
    url: url(`/videos/${v.slug}`),
    lastModified: v.updatedAt ?? v.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const neighborhoodEntries = getAllNeighborhoods().map((n) => ({
    url: url(`/neighborhoods/${n.slug}`),
    lastModified: n.updatedAt ?? now.toISOString().slice(0, 10),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const eatEntries = getAllEatSpots().map((e) => ({
    url: url(`/eat#${e.slug}`),
    lastModified: e.updatedAt ?? now.toISOString().slice(0, 10),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Events are listed on /events but each has a canonical sourceUrl (external),
  // so they don't get individual internal URLs in Phase 1.
  void getUpcomingEvents;

  return [...staticRoutes, ...videoEntries, ...neighborhoodEntries, ...eatEntries];
}
