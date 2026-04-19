/**
 * YouTube helpers.
 * Spec: docs/TRD.md §5.
 *
 * - Thumbnails derived from video ID via img.youtube.com (no API key).
 * - oEmbed fetch is build-time-only; never call at request time.
 */

export function parseYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const embed = u.pathname.match(/^\/(?:embed|shorts|v)\/([^/?]+)/);
      if (embed) return embed[1];
    }
    return null;
  } catch {
    return null;
  }
}

export function requireYouTubeId(url: string): string {
  const id = parseYouTubeId(url);
  if (!id) throw new Error(`Could not parse YouTube ID from URL: ${url}`);
  return id;
}

export type ThumbQuality = "maxres" | "hq" | "mq" | "sd" | "default";

const THUMB_KEY: Record<ThumbQuality, string> = {
  maxres: "maxresdefault",
  hq: "hqdefault",
  mq: "mqdefault",
  sd: "sddefault",
  default: "default",
};

export function youtubeThumb(
  id: string,
  quality: ThumbQuality = "maxres",
): string {
  return `https://img.youtube.com/vi/${id}/${THUMB_KEY[quality]}.jpg`;
}

export function youtubeEmbedUrl(
  id: string,
  opts: { noCookie?: boolean } = {},
): string {
  const host = opts.noCookie ? "www.youtube-nocookie.com" : "www.youtube.com";
  return `https://${host}/embed/${id}`;
}

// Build-time only.
export interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  html: string;
  provider_name: string;
}

export async function fetchOEmbed(url: string): Promise<OEmbedResponse> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    url,
  )}&format=json`;
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error(
      `oEmbed request failed for ${url}: ${res.status} ${res.statusText}`,
    );
  }
  return (await res.json()) as OEmbedResponse;
}
