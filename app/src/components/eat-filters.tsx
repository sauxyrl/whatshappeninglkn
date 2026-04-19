"use client";
// EatFilters
// ui-ux-pro-max: ux-guidelines.csv "ARIA Labels" (aria-pressed on toggle pills)
// DESIGN-SYSTEM.md §6 Filter UI — same pattern as VideoFilters (sage active, deep active for town).

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { EatSpot, Town, Vibe } from "@/lib/content";
import { EatCard } from "./eat-card";

const VIBE_LABEL: Record<Vibe, string> = {
  waterfront: "Waterfront",
  family: "Family",
  casual: "Casual",
  "date-night": "Date night",
  "quick-bite": "Quick bite",
  "special-occasion": "Special occasion",
};

export function EatFilters({ spots }: { spots: EatSpot[] }) {
  const [town, setTown] = useState<Town | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);

  const towns = useMemo(
    () => Array.from(new Set(spots.map((s) => s.town))).sort(),
    [spots],
  );
  const vibes = useMemo(
    () => Array.from(new Set(spots.flatMap((s) => s.vibes))).sort(),
    [spots],
  );

  const filtered = useMemo(() => {
    let list = spots;
    if (town) list = list.filter((s) => s.town === town);
    if (vibe) list = list.filter((s) => s.vibes.includes(vibe));
    return list;
  }, [spots, town, vibe]);

  const hasFilter = town !== null || vibe !== null;

  return (
    <>
      <div className="flex flex-col gap-4 border-y border-rule py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-ink">
            Town
          </span>
          {towns.map((t) => {
            const active = town === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => setTown(active ? null : t)}
                className={
                  active
                    ? "rounded-full bg-lkn-deep px-3 py-1 text-xs text-paper"
                    : "rounded-full border border-rule px-3 py-1 text-xs text-ink-soft transition-colors hover:border-lkn-deep hover:text-ink"
                }
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-ink">
            Vibe
          </span>
          {vibes.map((v) => {
            const active = vibe === v;
            return (
              <button
                key={v}
                type="button"
                aria-pressed={active}
                onClick={() => setVibe(active ? null : v)}
                className={
                  active
                    ? "rounded-full bg-lkn-sage px-3 py-1 text-xs text-paper"
                    : "rounded-full border border-rule px-3 py-1 text-xs text-ink-soft transition-colors hover:border-lkn-sage hover:text-ink"
                }
              >
                {VIBE_LABEL[v]}
              </button>
            );
          })}
          {hasFilter && (
            <button
              type="button"
              onClick={() => {
                setTown(null);
                setVibe(null);
              }}
              className="ml-2 inline-flex items-center gap-1 text-xs text-ink-soft hover:text-lkn-deep"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-ink">
        Showing <strong className="text-ink">{filtered.length}</strong> of{" "}
        {spots.length}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-md border border-rule bg-paper-alt p-8 text-center">
          <p className="font-serif text-xl text-ink">No matches.</p>
          <p className="mt-2 text-sm text-ink-soft">Try clearing a filter.</p>
        </div>
      ) : (
        <ul
          className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Filtered restaurants"
        >
          {filtered.map((s) => (
            <li key={s.slug}>
              <EatCard spot={s} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
