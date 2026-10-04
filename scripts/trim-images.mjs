/**
 * Trims the empty white border from every product photo used on the homepage, so products
 * look the same size next to each other. Runs before `next build` (and on demand: `npm run images`).
 * Output: public/products/<key>.webp (white background kept; the card blends it away with
 * mix-blend-mode: multiply) and src/data/trimmed.json ({ [sourceUrl]: { src, width, height } }).
 * Cached: a photo is only downloaded and trimmed once; delete public/products to redo everything.
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "products");
const manifestPath = path.join(root, "src", "data", "trimmed.json");
const base = "https://cdn.shopify.com/s/files/1/0752/7546/8972/";

// Product photos only (collection tiles and banners are not trimmed). Products now come live from
// Shopify, so there is nothing to pre-trim unless a file lists photo URLs as f("file.jpg?v=1").
const sources = [{ file: path.join(root, "src", "data", "home.ts"), pattern: /\bf\("([^"]+)"\)/g }];
const urls = new Set();
for (const { file, pattern } of sources) {
  const text = await fs.readFile(file, "utf8").catch(() => "");
  for (const m of text.matchAll(pattern)) urls.add(base + "files/" + m[1]);
}

await fs.mkdir(outDir, { recursive: true });
let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch {}

const key = (url) => crypto.createHash("sha1").update(url.split("?")[0]).digest("hex").slice(0, 12);
let done = 0,
  skipped = 0,
  failed = 0;

for (const url of urls) {
  const k = key(url);
  const out = path.join(outDir, `${k}.webp`);
  if (manifest[url] && (await fs.stat(out).catch(() => null))) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url.includes("?") ? `${url}&width=1200` : `${url}?width=1200`);
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
    // Add a 3% breathing margin so nothing touches the box edge, then cap the long side at 1000px.
    const { width, height } = trimmed.info;
    const pad = Math.round(Math.max(width, height) * 0.03);
    const final = await sharp(trimmed.data)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#ffffff" })
      .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(out, final.data);
    manifest[url] = { src: `/products/${k}.webp`, width: final.info.width, height: final.info.height };
    done++;
  } catch (e) {
    failed++;
    console.warn("trim failed:", url.slice(0, 90), e.message);
  }
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 0));
console.log(`trim-images: ${done} trimmed, ${skipped} cached, ${failed} failed, ${Object.keys(manifest).length} in manifest`);
