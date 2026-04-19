/**
 * pnpm build-transcripts
 *
 * Fetches YouTube captions for every video in src/content/videos/ and writes
 * them to src/content/videos/.transcripts/<slug>.txt. Idempotent — skips
 * any slug that already has a transcript file unless FORCE=1.
 *
 * Runs automatically as the "prebuild" npm hook (see package.json).
 *
 * Spec: docs/CONTENT-SCHEMA.md §10, docs/TRD.md §5.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { YoutubeTranscript } from "youtube-transcript";

async function main() {
  const videosDir = path.join(process.cwd(), "src", "content", "videos");
  const outDir = path.join(videosDir, ".transcripts");

  if (!fs.existsSync(videosDir)) {
    console.log("[transcripts] No src/content/videos/ directory yet — skipping.");
    return;
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(videosDir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  if (files.length === 0) {
    console.log("[transcripts] No video MDX files found — skipping.");
    return;
  }

  const force = process.env.FORCE === "1";
  let fetched = 0;
  let skipped = 0;
  let missing = 0;

  for (const file of files) {
    const filepath = path.join(videosDir, file);
    const raw = fs.readFileSync(filepath, "utf8");
    const fm = matter(raw).data as { slug?: string; youtubeId?: string };
    if (!fm.slug || !fm.youtubeId) {
      console.warn(`[transcripts] ${file}: missing slug or youtubeId — skipping.`);
      continue;
    }
    const outPath = path.join(outDir, `${fm.slug}.txt`);
    if (fs.existsSync(outPath) && !force) {
      skipped++;
      continue;
    }

    try {
      const segments = await YoutubeTranscript.fetchTranscript(fm.youtubeId);
      const text = segments
        .map((s) => s.text.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" ");
      fs.writeFileSync(outPath, text, "utf8");
      console.log(`[transcripts] ${fm.slug}: ${text.length} chars`);
      fetched++;
    } catch (err) {
      fs.writeFileSync(outPath, "# no-captions-available", "utf8");
      missing++;
      console.warn(
        `[transcripts] ${fm.slug}: no captions (${(err as Error).message.slice(0, 120)})`,
      );
    }
  }

  console.log(
    `[transcripts] done — fetched: ${fetched}, skipped(cached): ${skipped}, missing: ${missing}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
