// AboutPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (long-form, serif body)
// DESIGN-SYSTEM.md §1 + §3 — honest site description; no fabricated Host bio.

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "What this site is, what it isn't, and why it exists. An honest editorial guide to moving to Lake Norman, NC.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">About</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight text-ink md:text-6xl">
        About this site
      </h1>

      <div className="mt-10 max-w-prose space-y-6 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
        <p>
          {siteConfig.name} is an editorial guide to Lake Norman, NC for
          people who just moved here, are seriously considering it, or want
          a second opinion before signing on a specific town. It exists
          because most writing about the area is either real-estate
          marketing or Chamber-of-Commerce boosterism, and neither of those
          is useful when the question is actually &ldquo;will my family be
          happy here.&rdquo;
        </p>
        <p>
          The site is maintained by a single creator — a video-first,
          long-form host — who lives in the five-town area and publishes
          one video at a time, with the neighborhood pages, eat list, and
          event calendar updated as the research catches up. Every video
          page has a hand-written intro that covers what&rsquo;s happening in
          the frame and why it matters. Every neighborhood page tries to
          tell you what the town is actually like on a Wednesday, not just
          on the prettiest Saturday morning.
        </p>
        <p>
          <strong className="text-ink">What this site isn&rsquo;t:</strong> we
          are not licensed real-estate professionals, nothing here is
          relocation or investment advice, no specific properties are for
          sale on this site, and no link to an MLS listing is ever coming.
          Editorial standards are honest-guide-to-a-place, not tour-with-an-
          agenda. If you need a realtor, we can point you to a handful of
          good ones — that&rsquo;s not this.
        </p>
        <p>
          <strong className="text-ink">What we&rsquo;re building toward:</strong>
          enough long-form neighborhood coverage that a newcomer can get a
          week&rsquo;s worth of reading in one sitting, enough video depth that
          you feel like you&rsquo;ve already visited before you visit, and a
          weekly cadence of new content so it rewards coming back.
        </p>
        <p>
          Got a tip, correction, or an honest disagreement with something
          we published?{" "}
          <Link
            href="/contact"
            className="text-lkn-deep underline-offset-4 hover:underline"
          >
            Send a note
          </Link>
          . We read every message. The best ones change what ends up on
          the site.
        </p>
      </div>

      <p className="mt-12 text-sm text-muted-ink">
        {siteConfig.name} — Lake Norman, NC.
      </p>
    </article>
  );
}
