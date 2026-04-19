// VideoDetailPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (long-form serif body, pull-quote vibes)
// ui-ux-pro-max: ux-guidelines.csv "Auto-Play Video" (click-to-play — VideoEmbed enforces no autoplay)
// ui-ux-pro-max: stacks/nextjs.csv "Avoid layout shifts" (aspect-video embed + VideoCard thumbs)
// DESIGN-SYSTEM.md §6 VideoEmbed + Transcript; TRD §5 lazy iframe; TRD §6 JSON-LD VideoObject + Article.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft } from "lucide-react";
import { VideoEmbed } from "@/components/video-embed";
import { VideoCard } from "@/components/video-card";
import { Transcript } from "@/components/transcript";
import { JsonLd } from "@/components/json-ld";
import {
  getAllVideos,
  getTranscript,
  getVideoBySlug,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { youtubeThumb } from "@/lib/youtube";
import { videoArticleJsonLd, videoObjectJsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllVideos().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) return { title: "Video not found" };
  const canonical = `/videos/${video.slug}`;
  const ogImage =
    video.ogImage ?? youtubeThumb(video.youtubeId, "maxres");
  return {
    title: video.title,
    description: video.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: video.title,
      description: video.description,
      url: new URL(canonical, siteConfig.url).toString(),
      publishedTime: video.publishedAt,
      modifiedTime: video.updatedAt ?? video.publishedAt,
      images: [{ url: ogImage, width: 1280, height: 720, alt: video.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [ogImage],
    },
  };
}

// MDX body component overrides — editorial serif prose per DESIGN-SYSTEM §3.
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-12 font-serif text-2xl tracking-tight text-ink first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-8 font-serif text-xl tracking-tight text-ink"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft first:mt-0"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-5 list-disc space-y-2 pl-5 text-ink-soft" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-5 list-decimal space-y-2 pl-5 text-ink-soft" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="font-serif text-base leading-relaxed" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-8 border-l-2 border-lkn-sage pl-6 font-serif text-lg italic text-ink"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-lkn-deep underline-offset-4 hover:underline"
      {...props}
    />
  ),
};

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const transcript = getTranscript(video.slug);
  const related = getAllVideos()
    .filter((v) => video.relatedVideoSlugs.includes(v.slug))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={videoObjectJsonLd(video)} />
      <JsonLd data={videoArticleJsonLd(video)} />

      <article className="mx-auto max-w-4xl px-6 py-12 md:px-12 md:py-16 lg:px-24">
        <nav aria-label="Breadcrumb" className="text-sm">
          <Link
            href="/videos"
            className="inline-flex items-center gap-1 text-muted-ink transition-colors hover:text-lkn-deep"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            All videos
          </Link>
        </nav>

        <header className="mt-6">
          <p className="text-xs uppercase tracking-widest text-lkn-sage">
            {video.category}
            {video.locationTags.length > 0 && (
              <span className="text-muted-ink">
                {" · "}
                {video.locationTags.join(", ")}
              </span>
            )}
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink md:text-5xl">
            {video.title}
          </h1>
          <p className="mt-4 text-sm text-muted-ink">
            Published{" "}
            <time dateTime={video.publishedAt}>
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        </header>

        <div className="mt-8">
          <VideoEmbed youtubeId={video.youtubeId} title={video.title} />
        </div>

        <div className="mt-10 max-w-prose">
          <MDXRemote source={video.body} components={mdxComponents} />
        </div>

        <Transcript text={transcript} />

        {video.relatedNeighborhoodSlugs.length > 0 && (
          <p className="mt-12 border-t border-rule pt-8 text-sm text-ink-soft">
            Explore this neighborhood →{" "}
            {video.relatedNeighborhoodSlugs.map((s, i) => (
              <span key={s}>
                {i > 0 && ", "}
                <Link
                  href={`/neighborhoods/${s}`}
                  className="font-medium text-lkn-deep underline-offset-4 hover:underline"
                >
                  {s.replace(/-/g, " ")}
                </Link>
              </span>
            ))}
          </p>
        )}
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-videos"
          className="border-t border-rule bg-paper-alt"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20 lg:px-24">
            <p className="text-xs uppercase tracking-widest text-muted-ink">
              Keep watching
            </p>
            <h2
              id="related-videos"
              className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl"
            >
              Related videos
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
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
