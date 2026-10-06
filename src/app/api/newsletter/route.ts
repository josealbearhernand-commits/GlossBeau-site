import { NextResponse } from "next/server";
import { adminConfigured, subscribeToNewsletter } from "@/lib/shopify-admin";

/**
 * POST /api/newsletter  { email, company }   (company = honeypot, must stay empty)
 *
 * Protections: honeypot (bots get a fake success and nothing is saved), e-mail format and length check,
 * and a per-visitor rate limit (5 tries per 10 minutes per IP). The limit lives in this function's memory,
 * so it resets when Netlify starts a fresh instance: enough to stop a stuck button or a casual flood, not a
 * determined attacker. Shopify's own errors are logged on the server and never sent to the visitor.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRIES = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_TRIES;
}

// Practical format check: one @, no spaces, a dot in the domain, sane lengths (RFC 5321: 254 total, 64 local).
const EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

const reply = (status: number, message: string) => NextResponse.json({ ok: status < 300, message }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return reply(429, "Too many tries. Please wait a few minutes and try again.");

  let body: { email?: unknown; company?: unknown };
  try {
    body = await req.json();
  } catch {
    return reply(400, "Please enter a valid e-mail address.");
  }

  // Honeypot filled: pretend it worked, save nothing
  if (typeof body.company === "string" && body.company.trim() !== "") return reply(200, "You're on the list.");

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL.test(email)) return reply(400, "Please enter a valid e-mail address.");

  if (!adminConfigured()) {
    console.error("[newsletter] SHOPIFY_ADMIN_CLIENT_ID / SHOPIFY_ADMIN_CLIENT_SECRET not set");
    return reply(503, "Sign-ups are paused for a moment. Please try again later.");
  }

  try {
    await subscribeToNewsletter(email);
    return reply(200, "You're on the list.");
  } catch (err) {
    console.error("[newsletter]", err);
    return reply(502, "We couldn't sign you up just now. Please try again in a moment.");
  }
}
