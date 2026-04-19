"use client";
// SiteHeader
// ui-ux-pro-max: stacks/nextjs.csv "Use next/link for navigation" (Severity: High — client-side routing + prefetch)
// ui-ux-pro-max: ux-guidelines.csv "Sticky Navigation" (opted NOT sticky in Phase 1 — editorial feel + avoid padding compensation)
// ui-ux-pro-max: styles.csv "Editorial Grid / Magazine" (logo wordmark in serif display)
// DESIGN-SYSTEM.md §1, §6

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-12 lg:px-24">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-ink transition-colors hover:text-lkn-deep"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-lkn-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Sheet>
          <SheetTrigger
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-paper-alt md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-paper">
            <SheetHeader>
              <SheetTitle className="font-serif text-lg">
                {siteConfig.name}
              </SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Mobile navigation"
              className="mt-6 px-6 pb-6"
            >
              <ul className="flex flex-col gap-4">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block text-base text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="block text-base text-ink"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
