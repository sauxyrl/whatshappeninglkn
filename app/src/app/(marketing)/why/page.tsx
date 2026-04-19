// WhyLakeNormanPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (drop-cap first paragraph, serif body, section dividers)
// DESIGN-SYSTEM.md §3 (serif body at 1.0625rem / 1.75 line-height), §4 (max-w-prose for long-form).
//
// Placeholder editorial — Host rewrites each section in first person before launch.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Lake Norman",
  description:
    "A long read on what people mean when they say 'the lake' — water, Charlotte access, outdoor life, and pace.",
};

export default function WhyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">
        A longer read
      </p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight text-ink md:text-6xl">
        Why Lake Norman
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Placeholder editorial — the Host rewrites each section in first person
        before launch. What follows is a structural sketch.
      </p>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Water</h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft first-letter:float-left first-letter:mr-2 first-letter:pt-2 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-lkn-deep">
          Most people who move to Lake Norman have a specific relationship to
          the water in mind before they even sign the paperwork. For some it&rsquo;s
          a boat. For others it&rsquo;s a dock at sunset, or a morning run along the
          shoreline, or a kid learning to sail at the community center. The
          lake itself is 32,000 acres of human-made reservoir with 520 miles
          of shoreline, but those are trivia. What matters is what the water
          does to a weekend: it organizes one.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          Real version of this section talks about specific launches, the
          difference between the east shore and the west, and the honest
          economics of owning a boat versus renting one twice a summer.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">
          Charlotte access
        </h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          The second reason most families land here is the commute. Uptown
          Charlotte is reachable in 20–40 minutes depending on town, time, and
          whether I-77 is behaving. For remote workers that matters less;
          for hybrid workers it matters enormously.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          Real version names specific toll-lane strategies, the train that
          will eventually matter, and the honest number: what a three-day-a-
          week commute costs in real hours.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">
          Outdoor life
        </h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          Beyond the lake, the year is built around outdoor time. Spring is
          the longest season here in a meaningful way; summer is hot but
          lake-adjacent; fall is underrated; winter is mostly mild with
          occasional real cold. Real version has specific trail
          recommendations and a calendar of what&rsquo;s in bloom.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Pace</h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          People moving from bigger markets often describe the pace as a
          decompression. That&rsquo;s partially true and partially a function of
          which town you pick. Real version distinguishes between the
          genuinely slower towns and the ones that have more Charlotte energy
          than newcomers expect.
        </p>
      </section>
    </article>
  );
}
