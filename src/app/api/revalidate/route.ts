import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SHOPIFY_TAG } from "@/lib/shopify";

/**
 * Drops every cached Shopify response and re-renders every page, so the site shows what the store has now
 * (new collections, moved products) without waiting for the 5-minute revalidation.
 *
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>
 *
 * In production the secret is required (set REVALIDATE_SECRET in Netlify and call this from a Shopify
 * webhook or by hand). In development no secret is needed.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = new URL(req.url).searchParams.get("secret");
  if (process.env.NODE_ENV === "production" && (!secret || given !== secret)) {
    return NextResponse.json({ ok: false, error: "Missing or wrong secret" }, { status: 401 });
  }
  revalidateTag(SHOPIFY_TAG, "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: SHOPIFY_TAG, at: new Date().toISOString() });
}

export const dynamic = "force-dynamic";
