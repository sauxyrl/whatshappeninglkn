// ContactPage
// ui-ux-pro-max: ux-guidelines.csv "Input Labels" (visible labels above each input)
// ui-ux-pro-max: ux-guidelines.csv "Error Messages" (role=alert for Zod errors)
// ui-ux-pro-max: ux-guidelines.csv "Input Types" (type=email on the email field)
// DESIGN-SYSTEM.md §6 — inline errors, no redirect on submit, success + error states in-place.

import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a note. Tips, questions, requests for neighborhood coverage. We read every message.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-xl px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <p className="text-xs uppercase tracking-widest text-muted-ink">
        Contact
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
        Send a note
      </h1>
      <p className="mt-4 text-base text-ink-soft">
        Tips on a missed restaurant, corrections to a neighborhood page, or
        genuine disagreement with something we published — all welcome. We
        read every message and usually reply within a week.
      </p>
      <ContactForm />
    </article>
  );
}
