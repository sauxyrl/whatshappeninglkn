// AboutPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (long-form, serif body)
// DESIGN-SYSTEM.md §1 + §3 — Host story placeholder.

import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who runs What's Happening LKN, why the site exists, and the honest limits of what we cover.",
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
          Placeholder — the Host rewrites this section in first person before
          launch.
        </p>
        <p>
          What&rsquo;s Happening LKN exists because most of what&rsquo;s written about
          moving to Lake Norman is either a Chamber of Commerce brochure or
          a realtor&rsquo;s blog post. Neither is wrong exactly — they&rsquo;re just not
          useful to somebody trying to figure out if their family would
          actually be happy living here.
        </p>
        <p>
          The videos come from one person who lives down the road. Each
          neighborhood page is written the way you&rsquo;d brief a close friend
          who&rsquo;s moving to town next month. The dining list is curated. The
          events list is short on purpose.
        </p>
        <p>
          <strong className="text-ink">What we don&rsquo;t do:</strong> we are not
          licensed real-estate professionals, this is not relocation advice,
          and no individual property is for sale on this site. If you want a
          realtor, we can point you to one — but that&rsquo;s not what we are.
        </p>
        <p>
          Got a tip, correction, or an honest disagreement with something we
          published?{" "}
          <Link
            href="/contact"
            className="text-lkn-deep underline-offset-4 hover:underline"
          >
            Send a note
          </Link>
          . We read every message.
        </p>
      </div>

      <p className="mt-12 text-sm text-muted-ink">
        {siteConfig.name} — Lake Norman, NC.
      </p>
    </article>
  );
}
