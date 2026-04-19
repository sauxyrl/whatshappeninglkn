// WhyLakeNormanPage
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (drop-cap first paragraph, serif body, section dividers)
// DESIGN-SYSTEM.md §3 (serif body at 1.0625rem / 1.75 line-height), §4 (max-w-prose for long-form).

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Lake Norman",
  description:
    "Water, Charlotte access, outdoor life, and pace — what people actually mean when they say 'the lake.'",
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
        Four honest reasons people move here, and the trade-offs worth knowing
        before you do.
      </p>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Water</h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft first-letter:float-left first-letter:mr-2 first-letter:pt-2 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-none first-letter:text-lkn-deep">
          Lake Norman is a Duke Energy reservoir impounded in 1963 to cool the
          McGuire nuclear station. That utility-origin story is important
          context for how the lake works now: it&rsquo;s 32,000 acres across four
          counties, 520 miles of shoreline, and thousands of private docks sit
          beside public parks, state forest, and the Duke-owned edges that
          nobody builds on. The water isn&rsquo;t a lake in the New England sense,
          where one town owns its edge. It&rsquo;s a distributed asset. That
          distribution is what shapes everything else about moving here.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          The practical version of that for a newcomer is: you don&rsquo;t have to
          own waterfront to live a lake life. Jetton Park in Cornelius,
          Ramsey Creek Park in Cornelius, Robbins Park, Blythe Landing in
          Huntersville, Lake Norman State Park at the northern end — there&rsquo;s
          a public launch and a public beach within ten minutes of almost any
          address in the five lake towns. What you&rsquo;re deciding when you move
          here isn&rsquo;t &ldquo;do I buy on the water.&rdquo; It&rsquo;s &ldquo;which ten-minute
          access am I choosing.&rdquo;
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          East shore or west shore is the next question. The east (Cornelius,
          Huntersville, Davidson, Mooresville) gets the morning light and the
          sunrise paddles; the west (Denver) catches the sunset and quieter
          evening boat traffic. If you&rsquo;re only going to visit the lake once
          before committing, come at both ends of the day.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">
          Charlotte access
        </h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          The commute math is the thing most movers get wrong, in both
          directions. Cornelius and Huntersville are 20–30 minutes off-peak
          from uptown Charlotte via I-77 — closer than a lot of southeast-
          Charlotte neighborhoods, actually, once rush hour clears. Mooresville
          is another 15 minutes further. Davidson sits between them. Denver,
          on the west shore, is a different commute — Highway 16 or the I-485
          south loop — and both are slower than they look on a map.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          The I-77 toll lanes are the variable. Express lane pricing is
          demand-responsive, and at peak it can exceed ten dollars each way
          from Cornelius to uptown. For a three-day-a-week hybrid commuter,
          that&rsquo;s six to eight thousand dollars a year to avoid the regular-
          lanes creep. A lot of lake residents pay it; a lot don&rsquo;t; the
          honest answer depends on what your time costs you.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          If Charlotte presence is not part of your life — if you&rsquo;re fully
          remote — the commute math is moot and the town choice looks
          different. Denver gets a lot more attractive. Mooresville gets a
          lot more attractive. Davidson and Cornelius still win on weeknight
          walkability, but the tradeoff that used to anchor them (commute
          efficiency) isn&rsquo;t pulling as hard.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">
          Outdoor life
        </h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          Beyond the lake itself, the region&rsquo;s outdoor asset is real. Latta
          Nature Preserve in Huntersville is 1,400 acres on the Catawba with
          trails, horses, a raptor center, and a Federal-era plantation
          house — the best weekend hike inside any of the five towns. Lake
          Norman State Park at the northern tip is the quietest public
          launch on the whole lake. The U.S. National Whitewater Center and
          its trail system are a 30-minute drive south. The Blue Ridge
          Parkway is two hours west.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          What distinguishes LKN from a lot of Sunbelt suburbs is the length
          of the outdoor season. Spring is legitimately long — April and May
          are the best months of the year, and a lot of movers from colder
          climates underestimate how much daylight they&rsquo;ll spend outside
          here. Summer is hot but lake-adjacent, which changes what hot
          means. Fall is underrated — the foliage runs later than people
          expect, and October on the water is one of the genuinely great
          experiences of living here. Winter is mild with the occasional
          real cold snap; boats come out of the water for maybe three months.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Pace</h2>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          People relocating from bigger markets — New York, D.C., northern
          Virginia, Chicago, the Bay — describe the transition in similar
          terms. It&rsquo;s not quieter exactly. Lake Norman has its own traffic
          problems, its own Friday-night Birkdale crush, its own Saturday-
          market parking scramble. What&rsquo;s different is that most of the
          friction is optional. The calendar is fuller than newcomers
          expect (Cain Center, Davidson College programming, the Duke
          Family Performance Hall season, the summer concert series at
          Ramsey Creek) but nothing is mandatory. You can live a very
          engaged life here; you can live a very quiet one; both are
          recognized and neither is frowned on.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          The town you pick shapes this more than anything else. Davidson
          has more weekday energy than its 14,000 residents should be able
          to sustain — college town effect. Cornelius has more Friday-night
          than Saturday-morning. Huntersville&rsquo;s rhythm is more family-
          structured. Mooresville is a full-sized town with a full-sized
          town&rsquo;s rhythm. Denver, especially the older parts of Denver, is
          closer to rural than any of the others.
        </p>
        <p className="mt-5 font-serif text-[1.0625rem] leading-[1.75] text-ink-soft">
          None of these pitches is the whole story, and anyone telling you
          their town is unambiguously the right answer is selling something.
          The honest move is to visit each one on a weekday and on a
          weekend morning, walk the downtown even if you&rsquo;re a driver, and
          trust the answer your body gives you by the end of the second
          day. That answer will be more reliable than any list.
        </p>
      </section>
    </article>
  );
}
