// EventsIndexPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (typographic event list with month/day gutter)
// DESIGN-SYSTEM.md §1; TRD §6 (Event JSON-LD per item, page-level @graph).

import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { JsonLd } from "@/components/json-ld";
import { getUpcomingEvents } from "@/lib/content";
import { eventJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Curated Lake Norman events — markets, festivals, family days, live music. No scraping, no endless calendar.",
};

export const revalidate = 300; // TRD §3 — 5-minute ISR for the one route where it matters.

export default function EventsIndexPage() {
  const events = getUpcomingEvents();
  const graph = {
    "@context": "https://schema.org",
    "@graph": events.map(eventJsonLd),
  };

  return (
    <>
      {events.length > 0 && <JsonLd data={graph} />}
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
        <p className="text-xs uppercase tracking-widest text-muted-ink">
          Upcoming in Lake Norman
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
          Events
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink-soft">
          Eight-to-twelve upcoming things worth driving to. Each one links to
          its canonical source — you&rsquo;ll get more detail there than a
          scrape would give you.
        </p>

        {events.length === 0 ? (
          <div className="mt-12 rounded-md border border-rule bg-paper-alt p-8">
            <p className="font-serif text-xl text-ink">
              The calendar is quiet right now.
            </p>
            <p className="mt-2 max-w-prose text-sm text-ink-soft">
              For a comprehensive view, see{" "}
              <Link
                href="https://visitlakenorman.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lkn-deep underline-offset-4 hover:underline"
              >
                Visit Lake Norman
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-10">
            {events.map((ev) => (
              <EventCard key={ev.slug} event={ev} />
            ))}
            <p className="mt-10 text-sm text-muted-ink">
              More at{" "}
              <Link
                href="https://visitlakenorman.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lkn-deep underline-offset-4 hover:underline"
              >
                Visit Lake Norman
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </>
  );
}
