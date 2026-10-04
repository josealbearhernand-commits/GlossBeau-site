/**
 * Trims the empty white border from EVERY product's featured photo, so products look the same size next
 * to each other on every card (homepage, collections, brands, search, related). Runs before `next build`
 * and on demand (`npm run images`).
 *
 * Source list: every product's featuredImage from the Storefront API (needs SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN from .env.local or the environment). Without a token the script keeps the
 * existing manifest and exits 0, so a build never fails because of it.
 *
 * Output: public/products/<key>.webp (white background kept; the card blends it away with
 * mix-blend-mode: multiply) and src/data/trimmed.json ({ [sourceUrl]: { src, width, height } }).
 * Cached: a photo is only downloaded and trimmed once (key = URL without the ?v= query), so a new build only
 * processes new or re-uploaded photos. Delete public/products to redo everything.
 *
 * Each source is requested through Shopify's CDN at width=1200; the trimmed result is capped at 800px on its
 * long side and never enlarged, so a small source stays small and the card shows it centred, not stretched.
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "products");
const manifestPath = path.join(root, "src", "data", "trimmed.json");
const CONCURRENCY = 8;

/* ── env (.env.local is not loaded by plain node) ── */
async function loadEnv() {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) return;
  try {
    const text = await fs.readFile(path.join(root, ".env.local"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}
await loadEnv();
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";

/* ── every featured photo URL in the store ── */
async function featuredUrls() {
  if (!domain || !token) {
    console.warn("trim-images: no Shopify token, keeping the existing manifest.");
    return [];
  }
  const urls = [];
  let cursor = null;
  for (let i = 0; i < 20; i++) {
    const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
      body: JSON.stringify({
        query: `query($c: String) { products(first: 250, after: $c) { nodes { featuredImage { url } } pageInfo { hasNextPage endCursor } } }`,
        variables: { c: cursor },
      }),
    });
    if (!res.ok) throw new Error(`Shopify ${res.status}`);
    const { data, errors } = await res.json();
    if (errors) throw new Error(errors.map((e) => e.message).join("; "));
    for (const p of data.products.nodes) if (p.featuredImage?.url) urls.push(p.featuredImage.url);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return urls;
}

await fs.mkdir(outDir, { recursive: true });
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch {}

const key = (url) => crypto.createHash("sha1").update(url.split("?")[0]).digest("hex").slice(0, 12);
const cdn = (url, width) => (url.includes("?") ? `${url}&width=${width}` : `${url}?width=${width}`);

let urls;
try {
  urls = await featuredUrls();
} catch (e) {
  console.warn("trim-images: could not list products, keeping the existing manifest:", e.message);
  urls = [];
}

let done = 0,
  skipped = 0,
  failed = 0;

async function trimOne(url) {
  const k = key(url);
  const out = path.join(outDir, `${k}.webp`);
  // Cached by file: a re-uploaded photo with a new ?v= but the same path reuses the trimmed file.
  const existing = Object.entries(manifest).find(([u]) => key(u) === k)?.[1];
  if (existing && (await fs.stat(out).catch(() => null))) {
    manifest[url] = existing;
    skipped++;
    return;
  }
  try {
    const res = await fetch(cdn(url, 1200));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    // Flatten transparency onto white, then trim near-white borders (the threshold tolerates jpeg noise).
    const flat = await sharp(input).flatten({ background: "#ffffff" }).png().toBuffer();
    let trimmed;
    try {
      trimmed = await sharp(flat).trim({ background: "#ffffff", threshold: 24 }).toBuffer({ resolveWithObject: true });
    } catch {
      trimmed = await sharp(flat).toBuffer({ resolveWithObject: true });
    }
    // Add a 3% breathing margin so nothing touches the box edge, then cap the long side at 800px (never enlarge).
    const { width, height } = trimmed.info;
    const pad = Math.round(Math.max(width, height) * 0.03);
    const final = await sharp(trimmed.data)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" })
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(out, final.data);
    manifest[url] = { src: `/products/${k}.webp`, width: final.info.width, height: final.info.height };
    done++;
  } catch (e) {
    failed++;
    console.warn("trim failed:", url.slice(0, 90), e.message);
  }
}

// Small worker pool: CONCURRENCY downloads at a time.
const queue = [...new Set(urls)];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await trimOne(queue.shift());
  }),
);

// Drop manifest entries whose file is gone (a deleted public/products starts clean).
for (const [u, v] of Object.entries(manifest)) {
  if (!(await fs.stat(path.join(root, "public", v.src)).catch(() => null))) delete manifest[u];
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 0));
console.log(`trim-images: ${done} trimmed, ${skipped} cached, ${failed} failed, ${Object.keys(manifest).length} in manifest`);
