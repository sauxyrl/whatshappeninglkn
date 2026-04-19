"use client";
// LocalVideo
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-ratio wrapper, no CLS on mount)
// ui-ux-pro-max: ux-guidelines.csv "Auto-Play Video" Severity Medium — click-to-play, never autoplay (TRD §8, CLAUDE.md §4)
// ui-ux-pro-max: ux-guidelines.csv "Motion Sensitivity" Severity High — prefers-reduced-motion shows poster only, play button disabled
// DESIGN-SYSTEM.md §5 motion rules + poster-first pattern; TRD §10 perf budget (poster is the only fetch until user clicks)

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface LocalVideoProps {
  sources: { mobile?: string; desktop: string };
  poster: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio value. Default "21/10" matches the hero-sunset crop. */
  aspectRatio?: string;
  /** Media query at which to switch to the mobile source. */
  mobileMedia?: string;
}

export function LocalVideo({
  sources,
  poster,
  alt,
  caption,
  aspectRatio = "21 / 10",
  mobileMedia = "(max-width: 767px)",
}: LocalVideoProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const play = () => {
    setPlaying(true);
    // Video mounts after state flip; kick play on the next frame.
    requestAnimationFrame(() => {
      void videoRef.current?.play();
    });
  };

  return (
    <figure className="not-prose">
      <div
        className="relative w-full overflow-hidden rounded-md border border-rule bg-paper-alt"
        style={{ aspectRatio }}
      >
        {!playing && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={play}
              disabled={reduceMotion}
              aria-label={`Play video: ${alt}`}
              className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-default disabled:hover:bg-ink/0"
            >
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-transform duration-200 group-hover:scale-105"
              >
                <Play className="h-6 w-6 translate-x-[2px]" fill="currentColor" />
              </span>
            </button>
            {reduceMotion && (
              <p className="absolute bottom-3 right-3 rounded bg-ink/70 px-2 py-1 text-xs text-paper">
                Motion disabled — playback paused.
              </p>
            )}
          </>
        )}
        {playing && (
          <video
            ref={videoRef}
            poster={poster}
            controls
            preload="metadata"
            playsInline
            muted
            loop
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={alt}
          >
            {sources.mobile && (
              <source
                src={sources.mobile}
                media={mobileMedia}
                type="video/mp4"
              />
            )}
            <source src={sources.desktop} type="video/mp4" />
            Your browser doesn&rsquo;t support inline video.
          </video>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-muted-ink">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
