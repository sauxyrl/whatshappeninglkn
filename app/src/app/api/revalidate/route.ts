/**
 * POST /api/revalidate?secret=<REVALIDATE_SECRET>&path=<path>
 *
 * On-demand revalidation webhook. Spec: TRD §3 + §15.
 * Host (or a GitHub webhook) can hit this to bust the ISR cache immediately
 * for a specific path — useful when the default 60s revalidate is too slow.
 *
 * If REVALIDATE_SECRET is unset, the route returns 503 so nothing happens
 * accidentally in an unconfigured environment.
 */

import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const configured = process.env.REVALIDATE_SECRET;
  if (!configured) {
    return NextResponse.json(
      { error: "Revalidation not configured" },
      { status: 503 },
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  if (secret !== configured) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ ok: true, revalidated: path });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
