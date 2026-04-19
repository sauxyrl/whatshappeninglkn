"use client";
// Hero
// ui-ux-pro-max: landing.csv "Video-First Hero" (modified to still image per TRD §8 + PRD §5 — no autoplay video)
// ui-ux-pro-max: landing.csv "Hero-Centric Design" (hero is 60-80% above fold; one primary CTA)
// ui-ux-pro-max: ux-guidelines.csv "Motion Sensitivity" (Severity High — parallax respects prefers-reduced-motion)
// ui-ux-pro-max: ux-guidelines.csv "Reduced Motion" (Severity High — matchMedia gate on mount)
// DESIGN-SYSTEM.md §1 (Editorial Grid/Magazine + Video-First Hero), §3 (display type), §5 (parallax range 0→-30px, desktop only)
//
// Parallax uses a native passive scroll listener instead of Framer Motion —
// keeps the homepage client bundle minimal for mobile TBT. The effect is
// gated on matchMedia for both prefers-reduced-motion and min-width: 768px.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface HeroImage {
  mobile: string;
  desktop: string;
  alt: string;
}

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: HeroImage | null;
}

export function Hero({
  eyebrow,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  image,
}: HeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMQ = window.matchMedia("(min-width: 768px)");
    const el = bgRef.current;
    if (!el) return;

    let rafId = 0;
    let active = desktopMQ.matches && !motionMQ.matches;

    const update = () => {
      const y = Math.min(window.scrollY, 600);
      el.style.transform = `translate3d(0, ${Math.round((y / 600) * -30)}px, 0)`;
      rafId = 0;
    };
    const onScroll = () => {
      if (!active) return;
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    const onChange = () => {
      active = desktopMQ.matches && !motionMQ.matches;
      if (!active) el.style.transform = "";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    motionMQ.addEventListener("change", onChange);
    desktopMQ.addEventListener("change", onChange);
    if (active) update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      motionMQ.removeEventListener("change", onChange);
      desktopMQ.removeEventListener("change", onChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-paper"
    >
      <div ref={bgRef} aria-hidden="true" className="absolute inset-0 -z-10 will-change-transform">
        {image ? (
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
