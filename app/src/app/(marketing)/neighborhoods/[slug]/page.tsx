// NeighborhoodDetailPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (full-bleed hero, serif drop-cap overview, asymmetric key-spots list)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/image for optimization" (priority on the LCP hero only)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect wrappers, explicit width/height)
// DESIGN-SYSTEM.md §1, §3 (serif body for long-form), §6 (map iframe wrapped in aspect container).
// TRD §6 — Place JSON-LD.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Check, ChevronLeft } from "lucide-react";
import { VideoCard } from "@/components/video-card";
import { JsonLd } from "@/components/json-ld";
import {
  getAllNeighborhoods,
  getAllVideos,
  getNeighborhoodBySlug,
} from "@/lib/content";
import { placeJsonLd } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNeighborhoods().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) return { title: "Neighborhood not found" };
  const canonical = `/neighborhoods/${n.slug}`;
  return {
    title: n.name,
    description: n.tagline,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${n.name} — Lake Norman, NC`,
      description: n.tagline,
      url: new URL(canonical, siteConfig.url).toString(),
      images: [
        {
          url: n.heroImage.desktop,
          alt: n.heroImage.alt,
          width: 2400,
          height: 1200,
        },
      ],
    },
  };
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-12 font-serif text-2xl tracking-tight text-ink first:mt-0" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft first:mt-0 first:first-letter:float-left first:first-letter:mr-2 first:first-letter:pt-2 first:first-letter:font-serif first:first-letter:text-6xl first:first-letter:font-semibold first:first-letter:leading-none first:first-letter:text-lkn-deep" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-5 list-disc space-y-2 pl-5 text-ink-soft" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="font-serif text-base leading-relaxed" {...props} />
  ),
};

export default async function NeighborhoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) notFound();

  const videos = getAllVideos().filter((v) =>
    n.relatedVideoSlugs.includes(v.slug),
  );

  return (
    <>
      <JsonLd data={placeJsonLd(n)} />

      <div className="relative isolate overflow-hidden">
        <div className="relative aspect-[4/5] w-full sm:aspect-[5/2]">
          <Image
            src={n.heroImage.desktop}
            alt={n.heroImage.alt}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-16 lg:px-24">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link
              href="/neighborhoods"
              className="inline-flex items-center gap-1 text-muted-ink transition-colors hover:text-lkn-deep"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              All neighborhoods
            </Link>
          </nav>
          <p className="mt-6 text-xs uppercase tracking-widest text-lkn-sage">
            Lake Norman, NC
          </p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight text-ink md:text-6xl">
            {n.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{n.tagline}</p>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-6 pb-20 md:px-12 md:pb-24 lg:px-24">
        <div className="max-w-prose">
          <MDXRemote source={n.body} components={mdxComponents} />
        </div>

        <section aria-labelledby="who-its-for" className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2
              id="who-its-for"
              className="font-serif text-2xl tracking-tight text-ink"
            >
              Who it&rsquo;s for
            </h2>
            <ul className="mt-4 space-y-1 text-base text-ink-soft">
              {n.whoItsFor.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl tracking-tight text-ink">
              What to know
            </h2>
            <ul className="mt-4 space-y-2 text-base text-ink-soft">
              {n.whatToKnow.map((x) => (
                <li key={x}>— {x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="pros" className="mt-16">
          <h2 id="pros" className="font-serif text-2xl tracking-tight text-ink">
            Why newcomers like it
          </h2>
          <ul className="mt-4 space-y-3 text-base text-ink-soft">
            {n.prosForNewcomers.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check
                  className="mt-1 h-4 w-4 flex-shrink-0 text-lkn-deep"
                  aria-hidden="true"
                  strokeWidth={2.5}
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {(n.commuteToCharlotte || n.schools) && (
          <section className="mt-16 grid gap-12 md:grid-cols-2">
            {n.commuteToCharlotte && (
              <div>
                <h2 className="font-serif text-xl tracking-tight text-ink">
                  Commute to Charlotte
                </h2>
                <p className="mt-3 text-base text-ink-soft">
                  {n.commuteToCharlotte}
                </p>
              </div>
            )}
            {n.schools && (
              <div>
                <h2 className="font-serif text-xl tracking-tight text-ink">
                  Schools
                </h2>
                <p className="mt-3 text-base text-ink-soft">{n.schools}</p>
              </div>
            )}
          </section>
        )}

        {n.keySpots.length > 0 && (
          <section aria-labelledby="key-spots" className="mt-16">
            <h2
              id="key-spots"
              className="font-serif text-2xl tracking-tight text-ink"
            >
              Key spots
            </h2>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {n.keySpots.map((spot) => (
                <li key={spot.name} className="grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8">
                  <div>
                    <p className="font-serif text-lg text-ink">{spot.name}</p>
                    <p className="mt-1 text-sm text-ink-soft">{spot.why}</p>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-ink md:whitespace-nowrap">
                    {spot.kind}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {n.mapEmbedQuery && (
          <section aria-labelledby="map" className="mt-16">
            <h2 id="map" className="font-serif text-2xl tracking-tight text-ink">
              On the map
            </h2>
            <div className="mt-6 aspect-[4/3] w-full overflow-hidden rounded-md border border-rule bg-paper-alt sm:aspect-[16/9]">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(n.mapEmbedQuery)}&z=13&output=embed`}
                title={`Map of ${n.name}, NC`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </section>
        )}
      </article>

      {videos.length > 0 && (
        <section
          aria-labelledby="related-videos"
          className="border-t border-rule bg-paper-alt"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20 lg:px-24">
            <p className="text-xs uppercase tracking-widest text-muted-ink">
              From the Host
            </p>
            <h2
              id="related-videos"
              className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl"
            >
              Videos filmed in {n.name}
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <li key={v.slug}>
                  <VideoCard video={v} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
