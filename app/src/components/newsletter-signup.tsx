// NewsletterSignup
// ui-ux-pro-max: landing.csv "Newsletter / Content First" (minimal, single-field, paper-like bg)
// ui-ux-pro-max: ux-guidelines.csv "Sticky Navigation" n/a — this lives in the footer
// DESIGN-SYSTEM.md §6 — renders "coming-soon" static state when NEXT_PUBLIC_NEWSLETTER_STATE != "live"
// Never renders a form that doesn't go anywhere.

import { siteConfig } from "@/lib/site-config";

export function NewsletterSignup() {
  if (siteConfig.newsletterState !== "live") {
    return (
      <div className="rounded-md border border-rule bg-paper px-5 py-6">
        <p className="font-serif text-lg text-ink">Newsletter — coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          A short note when new videos and neighborhood write-ups land. We&rsquo;ll
          announce when the list opens for signups.
        </p>
      </div>
    );
  }
  // Live state wired up in Phase 1.5 once a provider is chosen.
  return null;
}
