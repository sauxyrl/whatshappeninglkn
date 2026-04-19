"use client";
// VideoFilters
// ui-ux-pro-max: ux-guidelines.csv "ARIA Labels" (Severity High — accessible names on every interactive)
// ui-ux-pro-max: ux-guidelines.csv "Sticky Navigation" n/a — filter bar sticks inline, not to viewport
// DESIGN-SYSTEM.md §6 Filter UI — buttons with aria-pressed, sage active state, native <select> for sort.

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Category, Town, Video } from "@/lib/content";
import { VideoCard } from "./video-card";

type Sort = "newest" | "oldest" | "featured";

const CATEGORY_LABEL: Record<Category, string> = {
  neighborhoods: "Neighborhoods",
  dining: "Food + drink",
  events: "Events",
  lifestyle: "Lifestyle",
  activities: "Activities",
};

export function VideoFilters({ videos }: { videos: Video[] }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [town, setTown] = useState<Town | null>(null);
  const [sort, setSort] = useState<Sort>("newest");

  const categories = useMemo(
    () => Array.from(new Set(videos.map((v) => v.category))).sort(),
    [videos],
  );
  const towns = useMemo(
    () =>
      Array.from(new Set(videos.flatMap((v) => v.locationTags))).sort(),
    [videos],
  );

  const filtered = useMemo(() => {
    let list = videos;
    if (category) list = list.filter((v) => v.category === category);
    if (town) list = list.filter((v) => v.locationTags.includes(town));
    if (sort === "oldest") {
      list = [...list].sort((a, b) => (a.publishedAt < b.publishedAt ? -1 : 1));
    } else if (sort === "featured") {
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    } else {
      list = [...list].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    }
    return list;
  }, [videos, category, town, sort]);

  const hasFilter = category !== null || town !== null;

  return (
    <>
      <div className="flex flex-col gap-6 border-y border-rule py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-ink">
              Category
            </span>
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(active ? null : c)}
                  className={
                    active
                      ? "rounded-full bg-lkn-sage px-3 py-1 text-xs text-paper transition-colors"
                      : "rounded-full border border-rule bg-transparent px-3 py-1 text-xs text-ink-soft transition-colors hover:border-lkn-sage hover:text-ink"
                  }
                >
                  {CATEGORY_LABEL[c]}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-ink">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-rule bg-paper px-2 py-1 text-sm normal-case tracking-normal text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="featured">Featured first</option>
            </select>
          </label>
        </div>
        {towns.length > 0 && (
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
                      ? "rounded-full bg-lkn-deep px-3 py-1 text-xs text-paper transition-colors"
                      : "rounded-full border border-rule bg-transparent px-3 py-1 text-xs text-ink-soft transition-colors hover:border-lkn-deep hover:text-ink"
                  }
                >
                  {t}
                </button>
              );
            })}
            {hasFilter && (
              <button
                type="button"
                onClick={() => {
                  setCategory(null);
                  setTown(null);
                }}
                className="ml-2 inline-flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-lkn-deep"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-ink">
        Showing <strong className="text-ink">{filtered.length}</strong> of{" "}
        {videos.length}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-md border border-rule bg-paper-alt p-8 text-center">
          <p className="font-serif text-xl text-ink">No videos match.</p>
          <p className="mt-2 text-sm text-ink-soft">
            Try clearing a filter.
          </p>
        </div>
      ) : (
        <ul
          className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Filtered videos"
        >
          {filtered.map((v) => (
            <li key={v.slug}>
              <VideoCard video={v} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
