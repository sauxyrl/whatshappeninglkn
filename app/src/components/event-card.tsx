// EventCard
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (typographic, low-visual card)
// ui-ux-pro-max: ux-guidelines.csv (External Link — rel noopener noreferrer for target=_blank)
// DESIGN-SYSTEM.md §1 — compact text-first card, external link to canonical source per PRD §5.

import { ExternalLink } from "lucide-react";
import type { EventItem } from "@/lib/content";

export function EventCard({ event }: { event: EventItem }) {
  const startDate = new Date(`${event.date}T00:00:00`);
  const month = startDate
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = startDate.getDate();
  const weekday = startDate.toLocaleDateString("en-US", { weekday: "long" });

  const timeRange =
    event.timeStart && event.timeEnd
      ? `${formatTime(event.timeStart)}–${formatTime(event.timeEnd)}`
      : event.timeStart
        ? `From ${formatTime(event.timeStart)}`
        : "All day";

  return (
    <article className="flex flex-col gap-4 border-b border-rule py-6 sm:flex-row sm:items-start sm:gap-8">
      <div className="flex flex-row items-baseline gap-3 sm:w-24 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
        <p className="text-xs uppercase tracking-widest text-lkn-sage">
          {month}
        </p>
        <p className="font-serif text-3xl tracking-tight text-ink">{day}</p>
        <p className="text-xs text-muted-ink">{weekday}</p>
      </div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-widest text-muted-ink">
          {event.category} · {event.town}
        </p>
        <h3 className="mt-1 font-serif text-xl tracking-tight text-ink">
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-lkn-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {event.title}
            <ExternalLink
              className="ml-1 inline h-4 w-4 align-baseline text-muted-ink"
              aria-hidden="true"
            />
          </a>
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {timeRange} · {event.location}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{event.description}</p>
      </div>
    </article>
  );
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${displayH} ${period}` : `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}
