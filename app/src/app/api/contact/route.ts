/**
 * POST /api/contact
 *
 * Phase 1 stub — validates input with Zod; when RESEND_API_KEY and
 * CONTACT_TO_EMAIL are both set, delivery gets wired in Phase 3 (BUILD-PLAN).
 * Includes a honeypot field for basic bot mitigation.
 *
 * Spec: docs/TRD.md §11, docs/PRD.md §5 (Contact).
 */

import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be 10+ characters").max(5000),
  // Honeypot — bots fill anything they see, humans never touch this.
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  // Silently swallow honeypot hits — don't tip off bots.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    console.info(
      "[contact] Submission received but Resend is not configured",
    );
    return NextResponse.json(
      {
        ok: true,
        note: "Message accepted. Email dispatch pending key configuration.",
      },
      { status: 202 },
    );
  }

  // Wired in Phase 3.
  return NextResponse.json({ ok: true }, { status: 200 });
}
