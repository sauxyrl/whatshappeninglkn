// Transcript
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (serif body, readable max-w-prose)
// ui-ux-pro-max: ux-guidelines.csv "Motion Sensitivity" (no slide animations — native <details> works fine)
// DESIGN-SYSTEM.md §6 Transcript — <details> element, serif body, selectable.

import { ChevronDown } from "lucide-react";

export function Transcript({ text }: { text: string | null }) {
  if (!text) {
    return (
      <section aria-labelledby="transcript-heading" className="mt-12">
        <h2
          id="transcript-heading"
          className="font-serif text-2xl tracking-tight text-ink"
        >
          Transcript
        </h2>
        <p className="mt-3 text-sm text-muted-ink">
          Transcript coming soon — captions weren&rsquo;t available when this
          page was built.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="transcript-heading" className="mt-12">
      <details className="group border-t border-rule pt-8 md:open:pt-8">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-background">
          <h2
            id="transcript-heading"
            className="font-serif text-2xl tracking-tight text-ink"
          >
            Transcript
          </h2>
          <span className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors group-hover:text-lkn-deep">
            <span className="hidden sm:inline">Read the transcript</span>
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <div className="mt-6 max-w-prose font-serif text-base leading-relaxed text-ink-soft">
          {text.split(/\n{2,}/).map((para, i) => (
            <p key={i} className="mt-4 first:mt-0">
              {para}
            </p>
          ))}
        </div>
      </details>
    </section>
  );
}
