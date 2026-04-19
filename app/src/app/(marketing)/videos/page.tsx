// VideosIndexPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (uniform 16:9 grid, not masonry — per CLAUDE.md §4 non-negotiable)
// ui-ux-pro-max: ux-guidelines.csv "Truncation" (line-clamp-2 on descriptions — DESIGN-SYSTEM §6)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-video wrappers in VideoCard)
// DESIGN-SYSTEM.md §6 Filter UI — aria-pressed pills, native select for sort on mobile.

import type { Metadata } from "next";
import Link from "next/link";
import { VideoFilters } from "@/components/video-filters";
import { getAllVideos } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Every video on What's Happening LKN — moving to Lake Norman, neighborhoods, food, and life on the water.",
};

export const revalidate = 60;

export default function VideosIndexPage() {
  const videos = getAllVideos();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">
        All videos
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
        Videos
      </h1>
      <p className="mt-4 max-w-2xl text-base text-ink-soft">
        A growing index of lifestyle videos, neighborhood walkthroughs, and
        honest notes on life at the lake.
      </p>

      {videos.length === 0 ? (
        <div className="mt-12 rounded-md border border-rule bg-paper-alt p-8">
          <p className="font-serif text-xl text-ink">
            More videos coming soon.
          </p>
          <p className="mt-2 max-w-prose text-sm text-ink-soft">
            {siteConfig.youtubeChannelUrl ? (
              <>
                Subscribe on{" "}
                <Link
                  href={siteConfig.youtubeChannelUrl}
                  className="text-lkn-deep underline-offset-4 hover:underline"
                >
                  YouTube
                </Link>{" "}
                to be first to see them.
              </>
            ) : (
              <>Check back shortly.</>
            )}
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <VideoFilters videos={videos} />
        </div>
      )}
    </section>
  );
}
