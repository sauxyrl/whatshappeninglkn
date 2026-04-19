// NeighborhoodCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (large imagery, serif title, asymmetric card)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-[4/5]/[3/2] wrapper)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/image for optimization" (single Image + sizes hints — next/image handles responsive variants)
// DESIGN-SYSTEM.md §1, §6 — single <Link>, single <Image> avoids double-fetch on viewport-based art direction.

import Image from "next/image";
import Link from "next/link";
import type { Neighborhood } from "@/lib/content";

export function NeighborhoodCard({
  neighborhood,
  priority = false,
}: {
  neighborhood: Neighborhood;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/neighborhoods/${neighborhood.slug}`}
      className="group block overflow-hidden rounded-md border border-rule bg-paper transition-colors hover:border-lkn-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-alt sm:aspect-[3/2]">
        <Image
          src={neighborhood.heroImage.desktop}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent"
        />
      </div>
      <div className="p-6">
        <p className="text-[11px] uppercase tracking-widest text-lkn-sage">
          Lake Norman
        </p>
        <h3 className="mt-2 font-serif text-2xl tracking-tight text-ink transition-colors group-hover:text-lkn-deep">
          {neighborhood.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft line-clamp-3">
          {neighborhood.tagline}
        </p>
      </div>
    </Link>
  );
}
