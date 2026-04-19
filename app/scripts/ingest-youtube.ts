/**
 * pnpm ingest-youtube <youtube-url>
 *
 * Scaffolds src/content/videos/<slug>.mdx with title, description, and
 * channel metadata pre-filled from oEmbed. Run once per new video; then
 * edit the TODO sections and commit.
 *
 * Spec: docs/CONTENT-SCHEMA.md §9, docs/TRD.md §13.
 */

import fs from "node:fs";
import path from "node:path";
import { fetchOEmbed, requireYouTubeId } from "../src/lib/youtube";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: pnpm ingest-youtube <youtube-url>");
    process.exit(2);
  }

  const id = requireYouTubeId(url);
  const embed = await fetchOEmbed(url);
  const slug = slugify(embed.title);
  if (!slug) {
    throw new Error(
      `Could not derive slug from video title "${embed.title}" — edit manually.`,
    );
  }

  const outPath = path.join(
    process.cwd(),
    "src",
    "content",
    "videos",
    `${slug}.mdx`,
  );
  if (fs.existsSync(outPath)) {
    console.error(`[ingest] File already exists: ${outPath}`);
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const escapedTitle = embed.title.replace(/"/g, '\\"');

  const mdx = `---
title: "${escapedTitle}"
slug: ${slug}
youtubeUrl: "${url}"
youtubeId: "${id}"
description: "TODO — one-sentence description (10+ characters)."
category: "lifestyle"
locationTags: []
publishedAt: "${today}"
featured: false
relatedVideoSlugs: []
relatedNeighborhoodSlugs: []
---

## Intro (REQUIRED — 150–300 words)

TODO: Hand-written first-person intro. This is the primary SEO surface for
this page. Speak to someone thinking about moving to Lake Norman. Do not
literally summarize the video — set the scene so the viewer has context
before they press play. Name a specific place. Mention the time of day or
season. Avoid realtor-speak.

## What you'll see

- 0:00 — TODO
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, mdx, "utf8");
  console.log(
    `[ingest] Wrote ${path.relative(process.cwd(), outPath)} (channel: ${embed.author_name})`,
  );
  console.log(
    "[ingest] Next: edit description + Intro + What-you-will-see, assign category/tags, run pnpm build-transcripts.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
