// NeighborhoodsIndexPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (asymmetric grid, large imagery)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/image for optimization"
// DESIGN-SYSTEM.md §1 + §6 — five cards in responsive grid, one <Link> per card.

import type { Metadata } from "next";
import { NeighborhoodCard } from "@/components/neighborhood-card";
import { getAllNeighborhoods } from "@/lib/content";

export const metadata: Metadata = {
  title: "Neighborhoods",
  description:
    "Honest, lived-in notes on the five Lake Norman towns — Cornelius, Davidson, Huntersville, Mooresville, and Denver.",
};

export default function NeighborhoodsIndexPage() {
  const neighborhoods = getAllNeighborhoods();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">
        Lake Norman towns
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
        Neighborhoods
      </h1>
      <p className="mt-4 max-w-2xl text-base text-ink-soft">
        Five towns share the lake. They are not interchangeable. Pick the one
        that matches your weekday rhythm first — the weekends take care of
        themselves.
      </p>
      <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {neighborhoods.map((n, i) => (
          <li key={n.slug}>
            <NeighborhoodCard neighborhood={n} priority={i === 0} />
          </li>
        ))}
      </ul>
    </section>
  );
}
