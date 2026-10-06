import Link from "next/link";
import { money } from "@/data/home";
import type { ShopProduct } from "@/lib/shopify";
import { Icon } from "@/components/site/Icon";
import { ProductImage } from "@/components/product/ProductImage";

/**
 * Shop-style elevated card: 28px radius, dual soft shadow, 20px inner image radius, no border.
 * `as` sets the title's heading level: h2 under a page h1 (collection, brand, search), h3 under a section h2.
 */
export function ProductCard({ product, priority = false, as: Heading = "h2" }: { product: ShopProduct; priority?: boolean; as?: "h2" | "h3" }) {
  const sold = !product.availableForSale;
  const onSale = product.compareAtPrice != null && !sold;
  return (
    <Link
      href={`/products/${product.handle}`}
      className="card group flex h-full min-w-0 flex-col text-ink outline-offset-4 transition-shadow duration-300"
    >
      {/* The shared 4:5 photo box (ProductImage), white and square, edge to edge in the card */}
      <div className="frame gloss">
        <ProductImage
          product={product}
          sizes="(min-width: 1200px) 280px, (min-width: 768px) 33vw, 50vw"
          priority={priority}
          radius="rounded-none"
          className={sold ? "opacity-70" : ""}
        />
        {sold ? (
          <span className="badge badge-soldout absolute left-3 top-3">Sold out</span>
        ) : onSale ? (
          <span className="badge badge-sale absolute left-3 top-3">Sale</span>
        ) : null}
        <span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-accent text-on-accent opacity-0 shadow-[var(--shadow-accent)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
          <Icon name="plus" size={18} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-2">
        <p className="t-micro truncate text-muted">{product.vendor}</p>
        {/* Name always reserves two lines, so every card in a row is the same height and the prices line up */}
        <Heading className="t-ui-sm line-clamp-2 min-h-[2.4em] text-ink">{product.title}</Heading>
        <p className="tnum t-body-sm flex items-baseline gap-2 text-ink">
          <span>{money(product.price)}</span>
          {onSale && <s className="text-muted">{money(product.compareAtPrice!)}</s>}
        </p>
      </div>
    </Link>
  );
}
