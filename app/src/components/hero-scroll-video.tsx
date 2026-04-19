"use client";
// HeroScrollVideo
// ui-ux-pro-max: landing.csv "Hero-Centric Design" (60-80% above fold + single primary CTA)
// ui-ux-pro-max: ux-guidelines.csv "Motion Sensitivity" Severity High — scroll-driven video is still motion;
//                reduced-motion users get poster only + normal (non-sticky) layout.
// ui-ux-pro-max: ux-guidelines.csv "Reduced Motion" Severity High — matchMedia gate on mount.
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" — the sticky inner is h-screen, no CLS.
// DESIGN-SYSTEM.md §5 motion; CLAUDE.md §4 #2 hero video rule (muted+playsInline, poster fallback on mobile + reduced-motion).
//
// Mechanics:
//   - Section height = scrollRunway * 100vh. Default 1.5 → 50vh of scrub runway after the
//     first full screen of sticky.
//   - Desktop + full motion: <video muted playsInline preload="auto">. currentTime is driven
//     by scroll position within the section via a passive rAF-throttled scroll listener.
//   - Mobile OR prefers-reduced-motion: static <img> poster. No scrub, no preload of video.
//   - Paper-gradient overlay keeps display copy readable over any frame.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface HeroScrollVideoProps {
  video: {
    src: string;
    poster: string;
    alt: string;
  };
  eyebrow?: string;
  headline: string;
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Section height as a multiple of viewport height. Default 1.5 → 150vh. */
  scrollRunway?: number;
}

export function HeroScrollVideo({
  video,
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  scrollRunway = 1.5,
}: HeroScrollVideoProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrubEnabled, setScrubEnabled] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    const sync = () => setScrubEnabled(desktop.matches && !motion.matches);
    sync();
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!scrubEnabled) return;
    const videoEl = videoRef.current;
    const sectionEl = sectionRef.current;
    if (!videoEl || !sectionEl) return;

    let rafId = 0;
    let lastProgress = -1;
    let duration = 5; // fallback before metadata loads

    const onMetadata = () => {
      if (videoEl.duration && Number.isFinite(videoEl.duration)) {
        duration = videoEl.duration;
      }
    };
    videoEl.addEventListener("loadedmetadata", onMetadata);
    if (videoEl.readyState >= 1) onMetadata();

    const apply = () => {
      rafId = 0;
      const rect = sectionEl.getBoundingClientRect();
      const runway = Math.max(rect.height - window.innerHeight, 1);
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / runway));
      if (Math.abs(progress - lastProgress) > 0.001) {
        lastProgress = progress;
        try {
          videoEl.currentTime = progress * duration;
        } catch {
          // some browsers throw if set before metadata — ignore
        }
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      videoEl.removeEventListener("loadedmetadata", onMetadata);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrubEnabled]);

  const sectionStyle = scrubEnabled
    ? { height: `${scrollRunway * 100}vh` }
    : undefined;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative"
      style={sectionStyle}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
        {scrubEnabled ? (
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={video.poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-paper via-paper/65 to-paper/10"
        />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-40">
          {eyebrow && (
            <p className="text-xs uppercase tracking-widest text-muted-ink">
              {eyebrow}
            </p>
          )}
          <h1
            id="hero-heading"
            className="mt-4 max-w-4xl font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-ink"
          >
            {headline}
          </h1>
          {subhead && (
            <p className="mt-6 max-w-xl text-lg text-ink-soft md:text-xl">
              {subhead}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="text-sm font-medium text-lkn-deep underline-offset-4 hover:underline"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
