// NotFoundPage — branded 404 (Next.js App Router convention).
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (minimal, typographic)
// DESIGN-SYSTEM.md §3 — serif display, sans body, restrained CTA.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">
        404 — not found
      </p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight text-ink md:text-6xl">
        That page isn&rsquo;t on the lake.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        The link might have moved or the page you were looking for hasn&rsquo;t
        been written yet. Try one of these.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Start over
        </Link>
        <Link
          href="/videos"
          className="text-sm font-medium text-lkn-deep underline-offset-4 hover:underline"
        >
          Browse videos →
        </Link>
        <Link
          href="/neighborhoods"
          className="text-sm font-medium text-lkn-deep underline-offset-4 hover:underline"
        >
          Neighborhoods →
        </Link>
      </div>
    </section>
  );
}
