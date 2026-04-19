// EatCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (photo-led card, serif name, accent pill)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-[4/3] wrapper, explicit sizes)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/image for optimization"
// DESIGN-SYSTEM.md §1 — external website opens in a new tab with rel noopener noreferrer.

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { EatSpot } from "@/lib/content";

const VIBE_LABEL: Record<string, string> = {
  waterfront: "Waterfront",
  family: "Family",
  casual: "Casual",
  "date-night": "Date night",
  "quick-bite": "Quick bite",
  "special-occasion": "Special occasion",
};

export function EatCard({ spot }: { spot: EatSpot }) {
  const priceGlyph = spot.priceRange;
  const Wrapper = spot.website ? "a" : "div";
  const wrapperProps = spot.website
    ? {
        href: spot.website,
        target: "_blank",
        rel: "noopener noreferrer" as const,
      }
    : {};
  return (
    <article
      id={spot.slug}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-paper transition-colors hover:border-lkn-deep focus-within:border-lkn-deep"
    >
      <div className="relative aspect-[4/3] w-full bg-paper-alt">
        <Image
          src={spot.photo}
          alt={spot.photoAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] uppercase tracking-widest text-lkn-sage">
          {spot.town} · {spot.cuisine} · {priceGlyph}
        </p>
        <h3 className="mt-2 font-serif text-xl tracking-tight text-ink">
          <Wrapper
            {...wrapperProps}
            className="transition-colors hover:text-lkn-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {spot.name}
            {spot.website && (
              <ExternalLink
                className="ml-1 inline h-4 w-4 align-baseline text-muted-ink"
                aria-hidden="true"
              />
            )}
          </Wrapper>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
          {spot.shortPitch}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {spot.vibes.map((v) => (
            <span
              key={v}
              className="rounded-full border border-rule px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-ink-soft"
            >
              {VIBE_LABEL[v] ?? v}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
