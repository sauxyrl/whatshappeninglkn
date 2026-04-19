/**
 * One-shot: generate gradient PNG placeholders for neighborhood heroes and
 * eat-spot photos, so Phase 3 can ship visual scaffolding without stock
 * photos or Host-licensed imagery yet.
 *
 * Every generated file lands in public/images/ and gets a manifest entry in
 * src/content/_image-manifest.json marking it as "placeholder".
 *
 * Host replaces individual files (same path) and updates the manifest entry
 * to source/photographer/license. No schema or component changes needed.
 *
 *   pnpm tsx scripts/generate-placeholder-images.ts
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Neighborhood = {
  slug: string;
  name: string;
  from: string;
  to: string;
};

type EatSpot = {
  slug: string;
  name: string;
  from: string;
  to: string;
};

const NEIGHBORHOODS: Neighborhood[] = [
  { slug: "cornelius", name: "Cornelius", from: "#0A3D62", to: "#4F7A5C" },
  { slug: "davidson", name: "Davidson", from: "#4F7A5C", to: "#1F4A2A" },
  { slug: "huntersville", name: "Huntersville", from: "#1E90FF", to: "#0A3D62" },
  { slug: "mooresville", name: "Mooresville", from: "#0A3D62", to: "#1F4A2A" },
  { slug: "denver", name: "Denver", from: "#4F7A5C", to: "#0A3D62" },
];

const EAT_SPOTS: EatSpot[] = [
  { slug: "kindred-davidson", name: "Kindred", from: "#0A3D62", to: "#4F7A5C" },
  { slug: "north-harbor-club", name: "North Harbor Club", from: "#1E90FF", to: "#0A3D62" },
  { slug: "port-city-club", name: "Port City Club", from: "#0A3D62", to: "#1F4A2A" },
  { slug: "dressler-restaurant", name: "Dressler's", from: "#4F7A5C", to: "#0A3D62" },
  { slug: "big-view-diner", name: "Big View Diner", from: "#1F4A2A", to: "#4F7A5C" },
  { slug: "epic-chophouse", name: "Epic Chophouse", from: "#0A3D62", to: "#1E90FF" },
];

function gradientSvg(label: string, w: number, h: number, from: string, to: string) {
  const labelSize = Math.round(w * 0.08);
  const subSize = Math.round(w * 0.02);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <defs>
         <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stop-color="${from}"/>
           <stop offset="100%" stop-color="${to}"/>
         </linearGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
       <text x="50%" y="48%" text-anchor="middle" font-family="Georgia, serif" font-size="${labelSize}" fill="#FDFBF7" opacity="0.9" font-weight="600">${label}</text>
       <text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="${subSize}" fill="#FDFBF7" opacity="0.55" letter-spacing="2">PLACEHOLDER · REPLACE WITH REAL PHOTO</text>
     </svg>`,
  );
}

async function makePng(buf: Buffer, outPath: string) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(buf).png({ quality: 80, compressionLevel: 9 }).toFile(outPath);
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  ${path.relative(process.cwd(), outPath)} (${kb} KB)`);
}

type ManifestEntry = {
  source: "placeholder";
  photographer: string;
  license: string;
  note: string;
};

async function main() {
  const publicRoot = path.join(process.cwd(), "public");
  const manifestPath = path.join(
    process.cwd(),
    "src",
    "content",
    "_image-manifest.json",
  );
  const manifest: Record<string, ManifestEntry> = {};

  console.log("[placeholders] neighborhoods (mobile 800×1200 + desktop 2400×1200):");
  for (const n of NEIGHBORHOODS) {
    for (const [suffix, w, h] of [
      ["mobile", 600, 900],
      ["desktop", 1200, 600],
    ] as const) {
      const rel = path.posix.join(
        "images",
        "neighborhoods",
        `${n.slug}-${suffix}.png`,
      );
      await makePng(
        gradientSvg(n.name, w, h, n.from, n.to),
        path.join(publicRoot, rel),
      );
      manifest[rel] = {
        source: "placeholder",
        photographer: "generated",
        license: "n/a — placeholder, replace before launch",
        note: `Neighborhood hero: ${n.name}, ${suffix}. Swap for art-directed Host photography.`,
      };
    }
  }

  console.log("[placeholders] eat spots (1200×900):");
  for (const e of EAT_SPOTS) {
    const rel = path.posix.join("images", "eat", `${e.slug}.png`);
    await makePng(
      gradientSvg(e.name, 900, 675, e.from, e.to),
      path.join(publicRoot, rel),
    );
    manifest[rel] = {
      source: "placeholder",
      photographer: "generated",
      license: "n/a — placeholder, replace before launch",
      note: `Eat card photo: ${e.name}. Swap for licensed photo or Host photography.`,
    };
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `[placeholders] wrote ${Object.keys(manifest).length} manifest entries to ${path.relative(process.cwd(), manifestPath)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
