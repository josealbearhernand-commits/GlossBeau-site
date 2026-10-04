import Image from "next/image";
import Link from "next/link";
import { isNew, money, variantLine } from "@/data/home";
import type { ShopProduct } from "@/lib/shopify";
import trimmed from "@/data/trimmed.json";

type Trimmed = Record<string, { src: string; width: number; height: number }>;
const manifest = trimmed as Trimmed;

/** Trimmed copy of a Shopify photo (scripts/trim-images.mjs), or the original if it has not been processed. */
export function trimmedImage(url: string) {
  return manifest[url] ?? { src: url, width: 1000, height: 1000 };
}

/**
 * Peak Design product card, measured at 1440px: image box 4:5, 4px radius, no border or shadow;
 * then 16px padding, name 16px bold, vendor 14px muted, price 16px, and a 14px monospace
 * uppercase variant line ("IN 12 SHADES") only when there is more than one variant.
 *
 * Same-size products: every photo is pre-trimmed of its white border, then sized to fill 80% of
 * the box height (tall bottles) or 80% of the width (wide jars and tools), whichever comes first.
 * `mix-blend-mode: multiply` makes the photo's white background disappear into the grey box.
 */
export function ProductTile({ product, priority = false, now }: { product: ShopProduct; priority?: boolean; now?: number }) {
  const img = trimmedImage(product.image);
  const line = variantLine(product);
  const fresh = isNew(product.createdAt, now);
  return (
    <Link href={`/products/${product.handle}`} className="group flex h-full min-w-0 flex-col text-ink">
      <div className="product-box relative aspect-[4/5] overflow-hidden rounded-[4px]">
        <div className="absolute inset-[10%]">
          <Image
            src={img.src}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 300px, 70vw"
            priority={priority}
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        {fresh && <span className="pd-badge absolute left-3 top-3">New</span>}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-2 min-h-[40px] text-[16px] font-semibold leading-5">{product.title}</h3>
        <p className="mt-2 text-[14px] leading-[14px] text-muted">{product.vendor}</p>
        <p className="tnum mt-3 text-[16px] leading-4">{money(product.price)}</p>
        {line && <p className="mt-3 font-mono text-[14px] uppercase leading-[14px] tracking-[0.02em] text-muted">{line}</p>}
      </div>
    </Link>
  );
}
