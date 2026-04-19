/**
 * JSON-LD schema.org builders.
 * Spec: docs/TRD.md §6 (structured data per page type).
 */

import type {
  EatSpot,
  EventItem,
  Neighborhood,
  Video,
} from "./content";
import { youtubeThumb } from "./youtube";
import { siteConfig } from "./site-config";

export interface WebSiteJsonLd {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: { "@type": "EntryPoint"; urlTemplate: string };
    "query-input": string;
  };
}

export function websiteJsonLd(): WebSiteJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/videos?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function videoObjectJsonLd(video: Video) {
  const thumb =
    video.thumbnailOverride ?? youtubeThumb(video.youtubeId, "maxres");
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: thumb,
    uploadDate: video.publishedAt,
    ...(video.durationSeconds
      ? { duration: `PT${video.durationSeconds}S` }
      : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
    contentUrl: video.youtubeUrl,
  } as const;
}

export function placeJsonLd(n: Neighborhood) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: n.name,
    description: n.tagline,
    image: `${siteConfig.url}${n.heroImage.desktop}`,
    containedInPlace: {
      "@type": "Place",
      name: "Lake Norman, North Carolina",
    },
    url: `${siteConfig.url}/neighborhoods/${n.slug}`,
  } as const;
}

export function restaurantJsonLd(e: EatSpot) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: e.name,
    description: e.shortPitch,
    image: `${siteConfig.url}${e.photo}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: e.address,
      addressLocality: e.town,
      addressRegion: "NC",
      addressCountry: "US",
    },
    servesCuisine: e.cuisine,
    priceRange: e.priceRange,
    url: e.website ?? undefined,
    acceptsReservations: e.reservationsRecommended ? "True" : undefined,
  } as const;
}

export function eventJsonLd(ev: EventItem) {
  const startDateTime = ev.timeStart
    ? `${ev.date}T${ev.timeStart}:00-04:00`
    : ev.date;
  const endDateTime = ev.timeEnd
    ? `${ev.endDate ?? ev.date}T${ev.timeEnd}:00-04:00`
    : ev.endDate ?? undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    description: ev.description,
    startDate: startDateTime,
    ...(endDateTime ? { endDate: endDateTime } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ev.location,
      address: {
        "@type": "PostalAddress",
        streetAddress: ev.address,
        addressLocality: ev.town,
        addressRegion: "NC",
        addressCountry: "US",
      },
    },
    url: ev.sourceUrl,
  } as const;
}

export function videoArticleJsonLd(video: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: video.title,
    description: video.description,
    datePublished: video.publishedAt,
    ...(video.updatedAt ? { dateModified: video.updatedAt } : {}),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/videos/${video.slug}`,
    },
  } as const;
}

