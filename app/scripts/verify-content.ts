/**
 * pnpm verify:content
 *
 * Runs the integrity checks that aren't caught by Zod frontmatter validation:
 *   1. Slug cross-references (relatedVideoSlugs, relatedNeighborhoodSlugs, relatedVideoSlug)
 *   2. Image manifest coverage — every /images/* reference in content has a manifest entry
 *
 * Spec: docs/CONTENT-SCHEMA.md §7, §8.
 */

import fs from "node:fs";
import path from "node:path";
import {
  getAllEatSpots,
  getAllEvents,
  getAllNeighborhoods,
  getAllVideos,
  verifyCrossReferences,
} from "../src/lib/content";

function collectImageReferences(): Set<string> {
  const refs = new Set<string>();
  const push = (ref: unknown) => {
    if (typeof ref === "string" && ref.startsWith("/images/")) {
      refs.add(ref.slice(1)); // strip leading /
    }
  };

  for (const n of getAllNeighborhoods()) {
    push(n.heroImage.mobile);
    push(n.heroImage.desktop);
  }
  for (const e of getAllEatSpots()) {
    push(e.photo);
  }
  for (const v of getAllVideos()) {
    if (v.ogImage) push(v.ogImage);
  }
  // Events have no inline images in Phase 1.
  void getAllEvents();

  return refs;
}

function readManifest(): Record<string, unknown> {
  const manifestPath = path.join(
    process.cwd(),
    "src",
    "content",
    "_image-manifest.json",
  );
  if (!fs.existsSync(manifestPath)) return {};
  const raw = fs.readFileSync(manifestPath, "utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

function main() {
  const errors: string[] = [];

  // 1. Cross-references
  const cross = verifyCrossReferences();
  if (!cross.ok) errors.push(...cross.errors);

  // 2. Image manifest
  const manifest = readManifest();
  const manifestKeys = new Set(Object.keys(manifest));
  for (const ref of collectImageReferences()) {
    if (!manifestKeys.has(ref)) {
      errors.push(
        `Image "${ref}" referenced by content but missing from src/content/_image-manifest.json`,
      );
    }
  }

  if (errors.length > 0) {
    console.error("[verify:content] FAILED:");
    for (const e of errors) console.error("  • " + e);
    process.exit(1);
  }
  console.log(
    `[verify:content] OK — ${getAllVideos().length} videos, ${getAllNeighborhoods().length} neighborhoods, ${getAllEatSpots().length} eat spots, ${getAllEvents().length} events.`,
  );
}

main();
