"use client";
// Hero
// ui-ux-pro-max: landing.csv "Video-First Hero" — muted autoplay loop allowed when playsInline + poster fallback
// ui-ux-pro-max: landing.csv "Hero-Centric Design" (60-80% above fold, single primary CTA)
// ui-ux-pro-max: ux-guidelines.csv "Motion Sensitivity" Severity High — parallax + video gated on prefers-reduced-motion
// ui-ux-pro-max: ux-guidelines.csv "Reduced Motion" Severity High — matchMedia on mount
// ui-ux-pro-max: ux-guidelines.csv "Auto-Play Video" Severity Medium — muted + playsInline + loop; mobile gets poster only
// DESIGN-SYSTEM.md §1 Editorial Grid/Magazine, §3 display type, §5 motion (no parallax on mobile/reduced-motion)
// CLAUDE.md §4 hero-video rule — autoplay permitted when muted+looping+playsInline with poster fallback on mobile + reduced-motion.
//
// Desktop + full-motion: muted looping video as background
// Mobile OR reduced-motion: static poster image only
// No video: falls back to image prop if given, otherwise CSS gradient
// Parallax (-30px over 600px scroll) layers on top via passive scroll listener.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface HeroImage {
  mobile: string;
  desktop: string;
  alt: string;
}

export interface HeroVideo {
  desktop: string;
  poster: string;
  alt: string;
}

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: HeroImage | null;
  video?: HeroVideo | null;
}

export function Hero({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  image,
  video,
}: HeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  // Drives whether the video autoplays (desktop + full motion) vs poster only.
  const [videoActive, setVideoActive] = useState(false);

  useEffect(() => {
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMQ = window.matchMedia("(min-width: 768px)");
    const el = bgRef.current;

    let rafId = 0;
    let parallaxOn = desktopMQ.matches && !motionMQ.matches;

    const update = () => {
      if (!el) return;
      const y = Math.min(window.scrollY, 600);
      el.style.transform = `translate3d(0, ${Math.round((y / 600) * -30)}px, 0)`;
      rafId = 0;
    };
    const onScroll = () => {
      if (!parallaxOn) return;
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    const syncMedia = () => {
      parallaxOn = desktopMQ.matches && !motionMQ.matches;
      setVideoActive(parallaxOn);
      if (!parallaxOn && el) el.style.transform = "";
    };

    syncMedia();
    window.addEventListener("scroll", onScroll, { passive: true });
    motionMQ.addEventListener("change", syncMedia);
    desktopMQ.addEventListener("change", syncMedia);
    if (parallaxOn) update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      motionMQ.removeEventListener("change", syncMedia);
      desktopMQ.removeEventListener("change", syncMedia);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-paper"
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10 will-change-transform"
      >
        {video ? (
          <>
            {videoActive ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={video.poster}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={video.desktop} type="video/mp4" />
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={video.poster}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-paper/10" />
          </>
        ) : image ? (
          <>
            <Image
              src={image.mobile}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover md:hidden"
            />
            <Image
              src={image.desktop}
              alt=""
              fill
              priority
              sizes="100vw"
              className="hidden object-cover md:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/80 to-paper/20" />
          </>
        ) : (
          <div className="hero-gradient absolute inset-0" />
        )}
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 py-24 md:min-h-[80vh] md:px-12 md:py-32 lg:px-24 lg:py-40">
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
    </section>
  );
}
