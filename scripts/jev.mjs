/**
 * TypeSafe "Jev" (System One) helper for build scripts and server-side code only. Never import this from
 * browser code: the key must stay on the server.
 *
 * Reads TYPESAFE_API_KEY from the environment or from .env.local. Usage:
 *
 *   import { jev, jevAvailable } from "./jev.mjs";
 *   const { answers } = await jev(state, { fits: { type: "noul", instructions: "..." } });
 *
 * `jev()` throws a clear error when the key is missing; call `jevAvailable()` first when a fallback exists.
 * Docs: https://docs.typesafe.ai/api.md (POST https://api.typesafe.ai/v1/systemone, model "jev-latest").
 */
import fs from "node:fs";
import path from "node:path";

const ENV_FILE = path.join(process.cwd(), ".env.local");

function readKey() {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY;
  try {
    const text = fs.readFileSync(ENV_FILE, "utf8");
    const m = text.match(/^\s*TYPESAFE_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  } catch {}
  return "";
}

export const MISSING_KEY_MESSAGE =
  "TYPESAFE_API_KEY is not set. Add a line `TYPESAFE_API_KEY=<your key>` to .env.local (line 3, after the two SHOPIFY_ lines).";

export function jevAvailable() {
  return Boolean(readKey());
}

/** One evaluation request. `questions` is a map of { type: "noul" | "choice" | "score", instructions, criteria }. */
export async function jev(state, questions, { model = "jev-latest", retries = 2 } = {}) {
  const key = readKey();
  if (!key) throw new Error(MISSING_KEY_MESSAGE);
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ state, model, questions }),
    });
    if (res.ok) return res.json();
    lastError = new Error(`TypeSafe ${res.status}: ${(await res.text()).slice(0, 200)}`);
    if (res.status < 500 && res.status !== 429) break;
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
  throw lastError;
}
