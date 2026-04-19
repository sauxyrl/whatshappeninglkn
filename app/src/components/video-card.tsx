// VideoCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (Performance Excellent, A11y WCAG AAA)
// ui-ux-pro-max: ux-guidelines.csv "Truncation" (line-clamp-2 for title + description)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-video wrapper)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/image for optimization" (lazy, responsive, WebP)
// DESIGN-SYSTEM.md §6 VideoCard — single <Link> wrapper, sage category pill, serif title.

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Video } from "@/lib/content";
import { youtubeThumb } from "@/lib/youtube";

export function VideoCard({
  video,
  priority = false,
}: {
  video: Video;
  priority?: boolean;
}) {
  const thumb = video.thumbnailOverride ?? youtubeThumb(video.youtubeId, "hq");
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-rule bg-paper-alt">
        <Image
          src={thumb}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md">
            <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" />
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-widest text-lkn-sage">
            {video.category}
            {video.locationTags.length > 0 && (
              <span className="text-muted-ink"> · {video.locationTags.join(", ")}</span>
            )}
          </p>
          <h3 className="mt-1 font-serif text-lg leading-snug tracking-tight text-ink transition-colors group-hover:text-lkn-deep line-clamp-2">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
