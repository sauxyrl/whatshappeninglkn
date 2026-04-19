export const siteConfig = {
  name: "What's Happening LKN",
  shortName: "WhatsHappeningLKN",
  description:
    "A calm, video-first guide to moving to Lake Norman, NC — neighborhoods, restaurants, and a real read on daily life from a local creator.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://whatshappeninglkn.com",
  newsletterState:
    (process.env.NEXT_PUBLIC_NEWSLETTER_STATE as
      | "live"
      | "coming-soon"
      | undefined) ?? "coming-soon",
  youtubeChannelUrl: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL ?? null,
  contactEmail: process.env.CONTACT_TO_EMAIL ?? "hello@whatshappeninglkn.com",
} as const;

export const mainNav = [
  { label: "Videos", href: "/videos" },
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Eat", href: "/eat" },
  { label: "Events", href: "/events" },
  { label: "Why LKN", href: "/why" },
  { label: "About", href: "/about" },
] as const;

export type NavItem = (typeof mainNav)[number];
