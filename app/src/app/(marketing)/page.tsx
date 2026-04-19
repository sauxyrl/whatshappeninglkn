// HomePage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (magazine layout, 3-col video grid)
// ui-ux-pro-max: landing.csv "Video-First Hero" (modified per TRD §8)
// DESIGN-SYSTEM.md §1, §4 (grid), §6 (VideoCard)
//
// Testimonials are placeholder strings — replace with real newcomer quotes before launch.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { HeroScrollVideo } from "@/components/hero-scroll-video";
import { VideoCard } from "@/components/video-card";
import { JsonLd } from "@/components/json-ld";
import { websiteJsonLd } from "@/lib/schema";
import { getAllVideos } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "What's Happening LKN — A quiet guide to moving to Lake Norman",
  },
  description:
    "A calm, video-first guide to moving to Lake Norman, NC. Neighborhoods, restaurants, and a real read on daily life from a local creator.",
};

export const revalidate = 60; // TRD §3

const QUICK_NAV: Array<{
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/neighborhoods",
    label: "Neighborhoods",
    description: "Cornelius, Davidson, Huntersville, Mooresville, Denver — told honestly.",
    icon: Building2,
  },
  {
    href: "/eat",
    label: "Where to Eat",
    description: "The places locals actually order from, by town and by vibe.",
    icon: UtensilsCrossed,
  },
  {
    href: "/events",
    label: "Events",
    description: "A short list of what&rsquo;s worth driving to this week.",
    icon: CalendarDays,
  },
  {
    href: "/why",
    label: "Why Lake Norman",
    description: "A longer read on what people mean when they say &ldquo;the lake.&rdquo;",
    icon: Waves,
  },
];

export default function HomePage() {
  const videos = getAllVideos();
  const latest = videos.slice(0, 6);
  const firstVideo = videos[0];
  const primaryCta = firstVideo
    ? { label: "Watch the latest video", href: `/videos/${firstVideo.slug}` }
    : { label: "Browse videos", href: "/videos" };

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <HeroScrollVideo
        eyebrow="A guide, not a listicle"
        headline="A quiet guide to Lake Norman."
        subhead="Video-first notes on moving here — by someone who lives down the road."
        primaryCta={primaryCta}
        secondaryCta={{ label: "Why Lake Norman →", href: "/why" }}
        video={{
          src: "/media/hero-sunset.mp4",
          poster: "/media/hero-sunset-poster.jpg",
          alt: "Aerial view of a lake at sunset — wooded shorelines and boats on the water.",
        }}
      />

      {/* Latest videos */}
      <section
        aria-labelledby="latest-videos"
        className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-24 lg:px-24"
      >
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-ink">
              Watch
            </p>
            <h2
              id="latest-videos"
              className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl"
            >
              Latest videos
            </h2>
          </div>
          {videos.length > 0 && (
            <Link
              href="/videos"
              className="whitespace-nowrap text-sm font-medium text-lkn-deep underline-offset-4 hover:underline"
            >
              All videos →
            </Link>
          )}
        </div>
        {latest.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((v, i) => (
              <li key={v.slug}>
                <VideoCard video={v} priority={i === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 max-w-xl text-base text-ink-soft">
            More videos coming soon —{" "}
            <Link
              href="/videos"
              className="text-lkn-deep underline-offset-4 hover:underline"
            >
              check the index
            </Link>
            .
          </p>
        )}
      </section>

      {/* Quick-nav cards */}
      <section
        aria-labelledby="quick-nav"
        className="border-t border-rule bg-paper-alt"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-24 lg:px-24">
          <p className="text-xs uppercase tracking-widest text-muted-ink">
            Start somewhere
          </p>
          <h2
            id="quick-nav"
            className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl"
          >
            What are you looking for?
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUICK_NAV.map(({ href, label, description, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-4 rounded-md border border-rule bg-paper p-6 transition-colors hover:border-lkn-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-paper-alt text-lkn-sage transition-colors group-hover:bg-lkn-sage group-hover:text-paper">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-serif text-xl text-ink transition-colors group-hover:text-lkn-deep">
                      {label}
                    </span>
                    <span
                      className="mt-1 block text-sm text-ink-soft"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What newcomers say — honest block. Real quotes replace this as the Host collects them. */}
      <section
        aria-labelledby="testimonials"
        className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-24 lg:px-24"
      >
        <p className="text-xs uppercase tracking-widest text-muted-ink">
          What newcomers say
        </p>
        <h2
          id="testimonials"
          className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl"
        >
          We&rsquo;re listening.
        </h2>
        <div className="mt-10 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <p className="font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
            This site is new. Real reader quotes go here once people write
            in — we won&rsquo;t invent them, and we won&rsquo;t run a &ldquo;500 happy
            movers&rdquo; badge we can&rsquo;t back up. If the videos or neighborhood
            pages saved you a bad afternoon, or confirmed a move you were
            already making, we&rsquo;d love to hear it.
          </p>
          <p className="font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
            And if something on this site is wrong, out of date, or mislabeled
            — especially an address, a neighborhood fact, or an event that
            moved — please tell us. Corrections are the fastest way this
            gets better.{" "}
            <Link
              href="/contact"
              className="whitespace-nowrap font-medium text-lkn-deep underline-offset-4 hover:underline"
            >
              Send a note →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
