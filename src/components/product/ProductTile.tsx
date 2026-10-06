import Link from "next/link";
import { isNew, money, variantLine } from "@/data/home";
import type { ShopProduct } from "@/lib/shopify";
import { ProductImage } from "@/components/product/ProductImage";

/**
 * Peak Design product card, measured at 1440px: image box 4:5, 4px radius, no border or shadow;
 * then 16px padding, name 16px bold, vendor 14px muted, price 16px, and a 14px monospace
 * uppercase variant line ("IN 12 SHADES") only when there is more than one variant.
 * The photo box is the shared ProductImage, so every card on the site shows products at the same size.
 */
export function ProductTile({ product, priority = false, now }: { product: ShopProduct; priority?: boolean; now?: number }) {
  const line = variantLine(product);
  const fresh = isNew(product.createdAt, now);
  return (
    <Link href={`/products/${product.handle}`} className="tile group flex h-full min-w-0 flex-col text-ink">
      <ProductImage product={product} sizes="(min-width: 1024px) 300px, 70vw" priority={priority}>
        {fresh && <span className="pd-badge absolute left-3 top-3">New</span>}
      </ProductImage>
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <h3 className="line-clamp-2 min-h-[40px] text-[1rem] font-semibold leading-5">{product.title}</h3>
        <p className="mt-2 truncate text-[0.875rem] leading-[1.1rem] text-muted">{product.vendor}</p>
        <p className="tnum mt-3 text-[1rem] leading-4">{money(product.price)}</p>
        {line && <p className="mt-3 font-mono text-[0.875rem] uppercase leading-[0.875rem] tracking-[0.02em] text-muted">{line}</p>}
      </div>
    </Link>
  );
}
