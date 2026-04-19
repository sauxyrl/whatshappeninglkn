// EatIndexPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (photo-led cards on a 3-col grid)
// ui-ux-pro-max: ux-guidelines.csv "ARIA Labels" (aria-pressed on filter pills)
// DESIGN-SYSTEM.md §6, TRD §6 (Restaurant JSON-LD per item, emitted once at page level as a list).

import type { Metadata } from "next";
import { EatFilters } from "@/components/eat-filters";
import { JsonLd } from "@/components/json-ld";
import { getAllEatSpots } from "@/lib/content";
import { restaurantJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Where to Eat",
  description:
    "A curated, not-comprehensive list of Lake Norman restaurants — waterfront dining, date-night, family spots, and quick bites.",
};

export const revalidate = 60;

export default function EatIndexPage() {
  const spots = getAllEatSpots();
  // One @graph payload containing every restaurant entity (TRD §6).
  const graph = {
    "@context": "https://schema.org",
    "@graph": spots.map(restaurantJsonLd),
  };

  return (
    <>
      {spots.length > 0 && <JsonLd data={graph} />}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <p className="text-xs uppercase tracking-widest text-muted-ink">
          Food + drink
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
          Where to Eat
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-soft">
          Curated, not comprehensive. These are places the Host actually ends
          up at — not the top-of-Yelp round-up.
        </p>

        {spots.length === 0 ? (
          <div className="mt-12 rounded-md border border-rule bg-paper-alt p-8">
            <p className="font-serif text-xl text-ink">
              More spots coming soon.
            </p>
          </div>
        ) : (
          <div className="mt-10">
            <EatFilters spots={spots} />
          </div>
        )}
      </section>
    </>
  );
}
