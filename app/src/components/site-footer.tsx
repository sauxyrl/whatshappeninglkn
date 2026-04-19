// SiteFooter
// ui-ux-pro-max: landing.csv "Newsletter / Content First" (minimal, paper-like, accent-for-CTA)
// ui-ux-pro-max: stacks/nextjs.csv "Use next/link for navigation"
// DESIGN-SYSTEM.md §1, §4 (section rhythm py-16 md:py-24), §6 (newsletter signup placeholder)

import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site-config";
import { NewsletterSignup } from "./newsletter-signup";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-rule bg-paper-alt">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:px-12 md:py-20 lg:px-24">
        <div className="space-y-4">
          <p className="font-serif text-2xl tracking-tight text-ink">
            {siteConfig.name}
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            A video-first guide to Lake Norman, NC for people who just moved
            here or are thinking about it.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-lkn-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-lkn-deep"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <NewsletterSignup />
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-ink md:flex-row md:items-center md:justify-between md:px-12 lg:px-24">
          <p>
            © {year} {siteConfig.name}. Lake Norman, NC.
          </p>
          <p>
            Editorial only. Not licensed real-estate professionals, not
            investment or relocation advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
